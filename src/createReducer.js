import dotProp from 'dot-prop-immutable';
import {context} from './dispatcherMiddleware';


export const reducers = {};

export const createReducer = (key, enhancer) => (initialState, mapDispatchToReducer) => {
  if (typeof mapDispatchToReducer === 'function')
    mapDispatchToReducer = mapDispatchToReducer(context);

  if (enhancer)
    ({initialState, mapDispatchToReducer} = enhancer.injectReducer(key, initialState, mapDispatchToReducer));

  const mapTypeToHandler = parseHandler(mapDispatchToReducer);

  const reducer = (state = initialState, {type, ...payload}) => {
    if (mapTypeToHandler.hasOwnProperty(type)) {
      const handler = mapTypeToHandler[type];
      if (typeof handler === 'function')
        return {
          ...state,
          ...handler(state, payload, withDotProp(state))
        };

      if (typeof handler === 'object')
        return {
          ...state,
          ...handler
        };
    }

    return state;
  };

  reducers[key] = reducer;

  return {
    [key]: reducer
  };
};

const parseHandler = mapDispatchToReducer => {
  const reducerHandler = {};

  for (const key in mapDispatchToReducer)
    if (mapDispatchToReducer.hasOwnProperty(key) && typeof key === 'string') {
      const actionTypes = key.split(',');
      actionTypes.forEach(type => {
        reducerHandler[type] = mapDispatchToReducer[key];
      });
    }

  return reducerHandler;
};

const withDotProp = state => ({
  get: (prop, defaultValue) => dotProp.get(state, prop, defaultValue),
  set: (prop, value) => dotProp.set(state, prop, value),
  merge: (prop, value) => dotProp.merge(state, prop, value),
  toggle: prop => dotProp.toggle(state, prop),
  remove: prop => dotProp.delete(state, prop),
});

export default function (initialState, mapDispatchToReducer) {
  if (typeof mapDispatchToReducer === 'function')
    mapDispatchToReducer = mapDispatchToReducer(context);

  const mapTypeToHandler = parseHandler(mapDispatchToReducer);

  const reducer = (state = initialState, {type, ...payload}) => {
    if (mapTypeToHandler.hasOwnProperty(type)) {
      const handler = mapTypeToHandler[type];
      if (typeof handler === 'function')
        return {
          ...state,
          ...handler(state, payload)
        };

      if (typeof handler === 'object')
        return {
          ...state,
          ...handler
        };
    }

    return state;
  };

  return reducer;
}
