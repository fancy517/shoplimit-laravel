const state = {
  allRoutesShowing: true
}

const getters = {
  showMobileBackButton(state) {
    return !state.allRoutesShowing
  }
}

const actions = {
}

const mutations = {
  SET_ALL_ROUTES_SHOWING: (state, val) => {
    state.allRoutesShowing = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
