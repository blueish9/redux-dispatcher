import synthesize from './synthesize';
import dispatcherMiddleware from './dispatcherMiddleware';
import createReducer, {reducers} from './createReducer';
import buildReducer from './buildReducer';
import Concurrency from './enhancer/Concurrency';

const waitResult = Concurrency.waitResult;
const injectResult = Concurrency.injectResult;

export {
  dispatcherMiddleware,
  synthesize as createDispatcher,
  reducers,
  createReducer,
  buildReducer,
  waitResult,
  injectResult,
};
