import {store} from "./dispatcherMiddleware";


/**
 * @param: mapActionToAC: Object<string: function or object>
 */
export default function createDispatcher(mapDispatchToAction) {
  const facade = {};

  for (const dispatch in mapDispatchToAction)
    if (mapDispatchToAction.hasOwnProperty(dispatch)) {
      const {type, creator} = mapDispatchToAction[dispatch];
      facade[dispatch] = wrapDispatch(type, creator);
    }

  return facade;
};

const wrapDispatch = (actionType, actionCreator) => {
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