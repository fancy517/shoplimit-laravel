// Vuex store for client login side
import { mockRoutes } from './mockRoutes'
import { genericGetRequestToApi, genericPostRequestToApi } from '../../utils/genericRequests'
import { CreateRetrieveRouteUrl } from '../../utils/clientUrls'

const state = {
  clientRoutes: [],
  mockClientRoutes: mockRoutes
}

const getters = {
  getClientRoutes: state => state.clientRoutes,
  getMockClientRoutes: state => state.mockClientRoutes
}

const actions = {
  GET_ROUTE_DETAILS({ commit }, payload) {
    const { profileId } = payload

    genericGetRequestToApi(CreateRetrieveRouteUrl(profileId)).then(response => {
      if (response.data) {
        console.log(response.data)
        commit('SAVE_ROUTE_DETAILS', response.data)
      }
    })
  },

  SAVE_ROUTE({ commit }, payload) {
    const { profileId } = payload

    genericPostRequestToApi(CreateRetrieveRouteUrl(profileId), payload).then(response => {
      console.log(response)
      if (response.data) {
        console.log(response.data)

        // commit('SAVE_ROUTE_DETAILS', response.data)
      }
    })
  }

}

const mutations = {
  SAVE_ROUTE_DETAILS: (state, payload) => {
    state.clientRoutes = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
