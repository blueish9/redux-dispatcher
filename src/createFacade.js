import {store} from "./dispatcherMiddleware";
import {createReducer} from "./createReducer";


/**
 * @param: mapActionToAC: Object<string: function or object>
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
    const payload = typeof actionCreator === 'function' ? actionCreator.apply(null, args) : actionCreator;
    const action = {
      type: payload.type || actionType,
      ...payload
    };
    return store.dispatch(action);
  };

  dispatcher.toString = () => actionType;
  dispatcher.type = actionType;

  return dispatcher;
};
