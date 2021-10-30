import synthesize from './synthesize';
import dispatcherMiddleware from './dispatcherMiddleware';
import createReducer, {reducers} from './createReducer';
import buildReducer from './buildReducer';
import Concurrency from './enhancer/Concurrency';

const waitResult = Concurrency.waitResult;

export {
  synthesize,
  dispatcherMiddleware,
  synthesize as createDispatcher,
  reducers,
  createReducer,
  buildReducer,
  waitResult
};
