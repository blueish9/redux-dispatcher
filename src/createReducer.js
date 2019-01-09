/**
 * Author: Quan Vo
 * Date: 1/8/19
 */

export const createReducer = key => (initialState, reducer) => {
  const mapTypeToHandler = parseHandler(reducer);

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

const parseHandler = reducerHandler => {
  const reactor = {};

  for (const key in reducerHandler)
    if (reducerHandler.hasOwnProperty(key) && typeof key === 'string') {
      const actionTypes = key.split(',');
      actionTypes.forEach(type => {
        reactor[type] = reducerHandler[key];
      });
    }

  return reactor;
};