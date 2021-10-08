import {context, store} from "./dispatcherMiddleware"
import {createReducer} from "./createReducer";
import {injectResult} from './enhancer/injectResult';
import Concurrency from './enhancer/Concurrency';


/**
 * @param: mapDispatchToAction: Object<string: function or object>
 */
export default function createFacade(key, mapDispatchToAction, enhancer) {
  const facade = createReducer(key, enhancer);
  facade.key = key;

  for (const dispatch in mapDispatchToAction)
    if (mapDispatchToAction.hasOwnProperty(dispatch)) {
      const {type, creator} = mapDispatchToAction[dispatch];
      facade[dispatch] = createDispatcher(type, creator);
    }

  return facade;
};

const createDispatcher = (actionType, actionCreator) => {
  const dispatcher = (...args) => {
    let payload = typeof actionCreator === 'function' ? actionCreator.apply(null, args) : actionCreator
    if (typeof payload === 'function')    // support for thunk
    {
      const effect = payload
      payload = args

      if (effect.constructor.name === 'AsyncFunction')
        // you can await on dispatch to get result
        return new Promise((resolve) => {
          resolve(effect({
            ...context,
            dispatch: store.dispatch,
            getState: store.getState
          }))
        })

      effect({
        ...context,
        dispatch: store.dispatch,
        getState: store.getState
      })
    }

    let action = injectResult({
      type: payload.type || actionType,
      ...payload
    });
    action = Concurrency.injectResult(action);
    store.dispatch(action);
    return action;
  };

  dispatcher.toString = () => actionType;
  dispatcher.type = actionType;

  return dispatcher;
};
