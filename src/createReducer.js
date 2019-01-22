/**
 * Author: Quan Vo
 * Date: 1/8/19
 */

export const createReducer = key => (initialState, mapDispatchToReducer) => {
  const mapTypeToHandler = parseHandler(mapDispatchToReducer);

  return {
    [key]: (state = initialState, {type, ...payload}) => {
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
    }
  }
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