export let store;
export let context;

const createMiddleware = _context => {
  context = _context
  return _store => {
    store = _store;
    return next => action => {
      next(action);
    };
  };
}

const dispatcherMiddleware = createMiddleware()
dispatcherMiddleware.withContext = createMiddleware

export default dispatcherMiddleware;
