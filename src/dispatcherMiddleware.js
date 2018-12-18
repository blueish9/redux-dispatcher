/**
 * Author: Quan Vo
 * Date: 8/3/18
 */

export let store;

const dispatcherMiddleware = _store => {
  store = _store;
  return next => action => {
    next(action);
  };
};

export default dispatcherMiddleware;