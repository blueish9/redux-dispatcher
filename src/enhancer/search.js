/**
 * Author: Quan Vo
 * Date: 2019-09-27
 */

const searchEnhancer = {
  injectAction: mapDispatchToAC => ({
    hideLoading: {loading: false},

    fetchMany: (keyword = "", refresh = false) => ({keyword, refresh}),
    saveMany: (list, refresh) => ({list, refresh}),

    fetchDetail: id => ({id}),
    saveDetail: detail => ({detail}),

    ...mapDispatchToAC
  }),

  injectReducer: (key, initialState, mapDispatchToReducer) => {
    initialState = {
      list: [],
      detail: null,
      keyword: "",
      loading: false,
      loaded: false,
      refreshing: false,
      ...initialState
    };

    mapDispatchToReducer = {
      [key + '/HIDE_LOADING']: (state, payload) => payload,

      [key + '/FETCH_MANY']: (state, {keyword, refresh}) => {
        return state.keyword !== keyword
            ? {
              loading: true,
              loaded: false,
              list: [],
              keyword
            }
            : {
              loading: true,
              loaded: false,
              refreshing: refresh
            };
      },

      [key + '/SAVE_MANY']: (state, {list, refresh}) => {
        if (!refresh)
          list = [
            ...state.list,
            ...list
          ];
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

export default searchEnhancer
