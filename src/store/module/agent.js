import axios from 'axios'
import config from '../../config'
import router from '../../router/index'
import { genericPostRequestToApi, genericGetRequestToApi } from '../../utils/genericRequests'
// import { genericGetRequestToApi } from '../../utils/genericRequests'
import { RetrieveProfileById } from '../../utils/clientUrls'
import {
  RetrieveProfileUrl,
  RetrieveSearchPropertyUrl,
  AuthRegisterAgentUrl,
  AccountInviteUserUrl
} from '../../utils/agentUrls'
import common from './common'
import { getAllMessages, markMessageAsRead } from '../../services/messagesService'

const state = {
  agentData: null,
  activeAgentData: null,
  agentDialogs: [],
  agentCalendarEvents: {},
  agentMessages: [],
  selectedClient: null,
  searchObject: {
    loading: false,
    data: []
  },
  clientSavedHomes: []
}

const getters = {
  getActiveAgentData: state => state['activeAgentData'],
  getSearchObject: state => state['searchObject'],
  getAgentCalendarEvents: state => state['agentCalendarEvents'],
  getDialogsUsers: state => {
    const dialogUsers = []
    state.agentMessages.forEach(message => {
      if (!dialogUsers.includes(message.from)) {
        dialogUsers.push(message.from)
      }
      if (!dialogUsers.includes(message.to[0])) {
        dialogUsers.push(message.to[0])
      }
    })
    return dialogUsers.filter(id => id !== state.agentData._id)
  },
  agentUnreadMessages: state => {
    if (state.agentData) {
      return state.agentMessages
        .filter(message => !message.read && message.from !== state.agentData._id)
    }
  }
}

const actions = {
  async getDialogsUsers({ commit }) {
    let dialogUsers = []
    state.agentMessages.forEach(message => {
      if (!dialogUsers.includes(message.from)) {
        dialogUsers.push(message.from)
      }
      if (!dialogUsers.includes(message.to[0])) {
        dialogUsers.push(message.to[0])
      }
    })
    dialogUsers = dialogUsers.filter(id => id !== state.agentData._id)
    const userData = await Promise.all(dialogUsers.map((userId) =>
      genericGetRequestToApi(RetrieveProfileById(userId))
    ))
    dialogUsers = userData.map(sender => {
      const unreadMessages = state.agentMessages
        .filter(message => !message.read && message.from !== state.agentData._id)
        .filter(message => message.from === sender.data._id)
      return { ...sender.data, ...{ unreadMessages: unreadMessages }
      }
    })
    commit('SET_DIALOGS', dialogUsers)
  },
  /**
   * Handles the login authorization for agent's side
   * after validation the input credentials
   *
   * @param {Object} agent consists of agent login input value
   */
  profileLogin({ commit, state }, agent) {
    let messageDelivered = false
    commit('common/SET_LOADING', null, { root: true })
    axios
      .post(`${config.apiUrl}/v1/login`, agent)
      .then(response => {
        const responseData = response.data
        if (responseData['token']) {
          localStorage.setItem('x-authentication', JSON.stringify(responseData))

          // Get profile details after setting token
          genericGetRequestToApi(RetrieveProfileUrl()).then(response => {
            if (response.status === 200) {
              if (response.data.agentid) {
                commit('common/SET_PROFILE_STATUS', 'agent', { root: true })
                if (common.state.isMobile) {
                  router.push({ name: 'agent-search' })
                } else {
                  router.push({ name: 'Task-Manager / Task-View' })
                }
              } else {
                commit('common/SET_PROFILE_STATUS', 'client', { root: true })
                if (common.state.isMobile) {
                  router.push({ name: 'client-schedule' })
                } else {
                  router.push({ name: 'client-dashboard' })
                }
              }
            } else {
              console.log('profile Login error >>> Some error')
            }
            commit('common/SET_LOGIN_STATUS', { status: true, message: null, error: false }, { root: true })
            messageDelivered = true
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          commit(
            'common/SET_LOGIN_STATUS',
            {
              status: false,
              message: 'Either email or password is incorrect',
              error: true
            },
            { root: true }
          )
          messageDelivered = true
        } else {
          commit(
            'common/SET_LOGIN_STATUS',
            {
              status: false,
              message: 'Unable to process that request',
              error: true
            },
            { root: true }
          )
          messageDelivered = true
        }
        setTimeout(() => {
          commit('common/DEACTIVATE_ERROR_STATUS', null, { root: true })
        }, 5000)
      })
    setTimeout(() => {
      if (!messageDelivered) {
        commit(
          'common/SET_LOGIN_STATUS',
          { status: false, message: "Couldn't connect to the server at the moment", error: true },
          { root: true }
        )
      }
    }, 8000)
  },

  /**
   * Handles the registration and authorization of a new agent
   * after validating the input credentials from payload
   *
   * @param {Object} agent consists of agent's MLS and license number
   */
  agentRegister({ commit }, agent) {
    commit('common/SET_LOADING', null, { root: true })
    genericPostRequestToApi(AuthRegisterAgentUrl(), agent).then(response => {
      const responseData = response.data
      // This part will be completed later when more info regarding
      // the response from agent side
      console.log(responseData)
    })
  },

  /**
   * Handles the new user invitation by the agent
   * Sends and email to the mentioned user which after accepetance
   * adds that user to agent's associated buyer list
   *
   * @param {Object} buyerDetails consists of buyer's name, phone and email
   */
  agentInviteBuyer({ commit }, buyerDetails) {
    genericPostRequestToApi(AccountInviteUserUrl(), buyerDetails).then(response => {
      console.log(response)
    })
  },

  /**
   * Retrieves the property lists based on query string
   * Currently it will display all active properties by default
   *
   * @param {Object} searchObject request body payload which consists of
   *                          search index and query parameters
   */
  searchPropertiesList({ commit }, payload) {
    const { searchElement, refresh } = payload

    if (refresh) {
      commit('REFRESH_SEARCH_DATA')
    }

    commit('SET_SEARCH_LOADER', true)
    genericPostRequestToApi(RetrieveSearchPropertyUrl(), searchElement).then(response => {
      const responseData = response.data
      commit('SET_SEARCH_LOADER', false)
      if (response.status === 200) {
        commit('SET_SEARCH_DATA', responseData)
      } else if (response.status === 401) {
        router.push({ name: 'login' })
      }
    })
  },

  /**
   * Sets the selected client id depending on the entered search input by an agent
   *
   * @param {Object} state The current global state
   * @param {string} clientId it will consist of the selected client id
   */
  setSearchedClient({ dispatch, commit }, clientData) {
    commit('SET_SELECTED_CLIENT', clientData)
    commit('client/SET_CLIENT_DATA', clientData, { root: true })
    commit('common/SET_ROUTE_HOMES', null, { root: true })
    dispatch('common/getRouteData', ({ commit }, { data: clientData, type: 'client' }), { root: true })
    dispatch('client/clientHomeDetailsAction', ({ commit }, clientData), { root: true })
  },

  fetchAgentMessagesAction({ commit, dispatch }) {
    getAllMessages().then(res => {
      commit('SET_AGENT_MESSAGES', res.data)
      dispatch('getDialogsUsers')
    })
  },

  async markMessagesAsRead({ commit }, data) {
    await Promise.all(data.messages.map(message => markMessageAsRead(message._id)))
    commit('MARK_AGENT_MESSAGE_AS_READ', data.user)
  }
}

const mutations = {
  SET_AGENT_DATA: (state, payload) => {
    state.agentData = payload
    if (state.selectedClient) {
      let updatedClient = payload.clients.find(client => client._id === state.selectedClient._id)
      state.selectedClient = updatedClient
    }
  },

  SET_AGENT_MESSAGES: (state, payload) => {
    state.agentMessages = payload
  },

  SET_ACTIVE_AGENT_DATA: (state, payload) => {
    state.activeAgentData = payload
  },

  SET_SEARCH_LOADER: (state, payload) => {
    Object.assign(state.searchObject, {
      loading: payload
    })
  },

  SET_SEARCH_DATA: (state, payload) => {
    if (state.searchObject.data.length > 0) {
      state.searchObject.data.push(...payload)
    } else {
      Object.assign(state.searchObject, {
        data: payload
      })
    }
  },

  REFRESH_SEARCH_DATA: state => {
    Object.assign(state.searchObject, {
      data: []
    })
  },

  SET_SELECTED_CLIENT: (state, payload) => {
    state.selectedClient = payload
  },

  CLEAR_CLIENT_SAVED_HOMES: state => {
    if (state.clientSavedHomes) {
      state.clientSavedHomes = []
    }
  },

  SET_CLIENT_SAVED_HOMES: (state, homeDetails) => {
    state.clientSavedHomes.push(homeDetails)
  },

  // SET_AGENT_SAVED_HOMES: (state, homeDetails) => {
  //   state.activeAgentProperties.push(homeDetails)
  // },

  SET_AGENT_CALENDAR_EVENTS: (state, calendarEvents) => {
    state.agentCalendarEvents = Object.assign({}, calendarEvents)
  },

  SET_DIALOGS: (state, payload) => {
    state.agentDialogs = payload
  },

  MARK_AGENT_MESSAGE_AS_READ: (state, selectedUser) => {
    state.agentDialogs = state.agentDialogs.map(user => {
      if (user._id === selectedUser._id) {
        user.unreadMessages.forEach(message => {
          message.read = true
        })
        user.unreadMessages = []
      }
      return user
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
