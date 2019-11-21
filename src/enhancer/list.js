/**
 * Author: Quan Vo
 * Date: 2019-09-27
 */

const listEnhancer = {
  injectAction: mapDispatchToAC => ({
    hideLoading: {loading: false},

    fetchMany: (refresh = false) => ({refresh}),
    saveMany: (list, refresh) => ({list, refresh}),

    fetchItem: id => ({id}),
    saveItem: detail => ({detail}),

    ...mapDispatchToAC
  }),

  injectReducer: (key, initialState, mapDispatchToReducer) => {
    initialState = {
      list: [],
      detail: null,
      loading: false,
      loaded: false,
      refreshing: false,
      ...initialState
    };

    mapDispatchToReducer = {
      [key + '/HIDE_LOADING']: (state, payload) => payload,

      [key + '/FETCH_MANY']: (state, {refresh}) => ({
        loading: true,
        loaded: false,
        refreshing: refresh
      }),

      [key + '/SAVE_MANY']: (state, {list, refresh}) => {
        if (!refresh)
          list = [...state.list, ...list];
        return {
          loaded: true,
          loading: false,
          refreshing: false,
          list
        };
      },

      ...mapDispatchToReducer
    };

    return {initialState, mapDispatchToReducer}
  }
};

export default listEnhancer
