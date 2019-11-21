/**
 * Author: Quan Vo
 * Date: 1/8/19
 */

export const reducers = {};

export const createReducer = (key, enhancer) => (initialState, mapDispatchToReducer) => {
  if (enhancer)
    ({initialState, mapDispatchToReducer} = enhancer.injectReducer(key, initialState, mapDispatchToReducer));

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
