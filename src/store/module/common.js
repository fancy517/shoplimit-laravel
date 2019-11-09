import router from '../../router'
import { INITIAL_SEARCH_QUERY } from '../../components/common/searchPropertyConst'

const getDefaultCommonState = () => {
  return {
    authStatus: {
      isLoggedIn: false,
      loginError: null,
      errorAlert: false,
      loading: false
    },
    profileStatus: null,
    lastRequestedQuery: {
      status: false,
      query: Object.assign({}, INITIAL_SEARCH_QUERY)
    },
    searchInputValues: {},
    routeData: [],
    selectedRoute: null,
    selectedRouteLoading: false,
    routeHomes: [],
    startLocation: '',
    isMobile: window.innerWidth < 600
  }
}

const state = getDefaultCommonState()

const actions = {
  profileLogout({ commit }, redirect = true) {
    if (localStorage.getItem('x-authentication')) {
      localStorage.removeItem('x-authentication')
      localStorage.removeItem('profileStatus')
    }
    // These two will be common later
    commit('agent/SET_SELECTED_CLIENT', null, { root: true })
    commit('client/SET_CLIENT_DATA', null, { root: true })

    commit('SET_LOGIN_STATUS', {
      status: false,
      message: null,
      error: false
    })
    commit('SET_PROFILE_STATUS', null)
    commit('RESET_COMMON_STATE')
    if (redirect) {
      router.push({ name: 'login' })
    }
  },

  getRouteData({ commit }, { data, type }) {
    // console.log('route data called >>>', data, type)
    if (data) {
      let routeArray = []
      if (type === 'agent') {
        data.clients.map(client => {
          if (client.routes && client.routes.length > 0) {
            client.routes.forEach(route => routeArray.push({
              ...route,
              clientId: client._id,
              clientName: client.name
            }))
          }
        })
      } else if (type === 'client') {
        if (data.routes && data.routes.length > 0) {
          data.routes.forEach(route => routeArray.push({
            ...route,
            clientId: data._id,
            clientName: data.name
          }))
        }
      }
      commit('SET_ROUTE_DATA', routeArray)
    }
  }
}

const mutations = {
  SET_LOADING: state => {
    Object.assign(state.authStatus, {
      loading: true
    })
  },

  SET_LOGIN_STATUS: (state, payload) => {
    Object.assign(state.authStatus, {
      isLoggedIn: payload['status'],
      loginError: payload['message'],
      errorAlert: payload['error'],
      loading: false
    })
  },

  DEACTIVATE_ERROR_STATUS: state => {
    Object.assign(state.authStatus, {
      loginError: null,
      errorAlert: false
    })
  },

  SET_PROFILE_STATUS: (state, payload) => {
    state.profileStatus = payload
    localStorage.setItem('profileStatus', payload)
  },

  SET_REQUESTED_QUERY: (state, payload) => {
    Object.assign(state.lastRequestedQuery, {
      query: payload
    })
  },

  CLEAR_REQUESTED_QUERY: (state) => {
    state.lastRequestedQuery = {
      status: false,
      query: Object.assign({}, INITIAL_SEARCH_QUERY)
    }
  },

  SET_CONTINUE_QUERY: (state, payload) => {
    Object.assign(state.lastRequestedQuery, {
      status: payload
    })
  },

  SET_ROUTE_DATA: (state, payload) => {
    state.routeData = payload
  },

  SET_SELECTED_ROUTE: (state, payload) => {
    state.selectedRoute = payload
  },

  SET_SELECTED_ROUTE_LOADING: (state, payload) => {
    state.selectedRouteLoading = payload
  },

  SET_ROUTE_HOMES: (state, payload) => {
    state.routeHomes = payload
  },

  SET_START_LOCATION: (state, payload) => {
    state.startLocation = payload
  },

  SET_IS_MOBILE: (state, payload) => {
    state.isMobile = payload
  },

  RESET_COMMON_STATE: (state) => {
    Object.assign(state, getDefaultCommonState())
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
