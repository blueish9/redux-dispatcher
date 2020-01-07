/**
 * Author: Quan Vo
 * Date: 8/3/18
 */

export let store;
export let context;

const createMiddleware = _context => _store => {
  store = _store;
  context = _context
  return next => action => {
    next(action);
  };
};

const dispatcherMiddleware = createMiddleware()
dispatcherMiddleware.withContext = createMiddleware

export default dispatcherMiddleware;
