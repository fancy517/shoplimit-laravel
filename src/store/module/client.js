import router from '../../router/index'
import { needWantDefaultList } from '../../components/client/account/feedbackNeedsWants'
import { feedbackNeededProperties, feedbackProvidedProperties } from '../../utils/propertyUtils'
import { genericGetRequestToApi } from '../../utils/genericRequests'
import { RetrieveProfileById } from '../../utils/clientUrls'
import { getPropertyById } from '../../services/propertiesService'
import { getAllMessages, markMessageAsRead } from '../../services/messagesService'

const state = {
  clientData: null,
  clientHomes: null,
  clientDialogs: [],
  clientMessages: [],
  associatedAgent: null,
  clientFavorites: [],
  preferenceSuggestions: []
}

const getters = {
  getInitialPrefSuggestions: state => {
    if (state.clientData && state.clientData.homePrefs) {
      return needWantDefaultList.filter(sourceItem => {
        let isPresent = false
        state.clientData.homePrefs.options.forEach(objectItem => {
          if (sourceItem.text === objectItem.text) {
            isPresent = true
          }
        })
        return !isPresent
      })
    }
    return needWantDefaultList
  },

  clientPreferences: state => preference => {
    if (state.clientData && state.clientData.homePrefs) {
      return state.clientData.homePrefs.options
        .filter(pref => pref.wantNeed === preference)
        .map(item => {
          return {
            match: false,
            name: item.text,
            wantNeed: preference
          }
        })
    }
    return []
  },

  clientHomePrefs: state => preference => {
    if (state.clientData && state.clientData.homePrefs) {
      return state.clientData.homePrefs.options.filter(pref => pref.wantNeed === preference)
    }
    return []
  },

  feedbackNeededHomes: state => {
    return feedbackNeededProperties(state.clientHomes)
  },

  feedbackProvidedHomes: state => {
    return feedbackProvidedProperties(state.clientHomes)
  },

  clientUnreadMessages: state => {
    if (state.clientData) {
      return state.clientMessages
        .filter(message => !message.read && message.from !== state.clientData._id)
    }
  }
}

const actions = {
  async getDialogsUsers({ commit }) {
    let dialogUsers = []
    state.clientMessages.forEach(message => {
      if (dialogUsers.indexOf(message.from) === -1 && message.from !== state.clientData._id) {
        dialogUsers.push(message.from)
      }
    })
    const userData = await Promise.all(dialogUsers.map((userId) =>
      genericGetRequestToApi(RetrieveProfileById(userId))
    ))
    dialogUsers = userData.map(sender => {
      const unreadMessages = state.clientMessages
        .filter(message => !message.read && message.from !== state.clientData._id)
        .filter(message => message.from === sender.data._id)
      return { ...sender.data, ...{ unreadMessages: unreadMessages }
      }
    })
    commit('SET_DIALOGS', dialogUsers)
  },
  /**
   * Action to clear login status of agent side
   */
  clientLogout({ commit }) {
    if (localStorage.getItem('x-authentication')) {
      localStorage.removeItem('x-authentication')
      localStorage.removeItem('profileStatus')
    }
    commit('common/SET_LOGIN_STATUS', {
      status: false,
      message: null,
      error: false
    })
    commit('common/SET_PROFILE_STATUS', null, { root: true })
    router.push({ name: 'login' })
  },

  /**
   * Retrieves the property details by sending the home id
   * in the request body
   *
   * @param {Object}  clientObject searched client
   */
  clientHomeDetailsAction({ commit }, { homes }) {
    commit('CLEAR_CLIENT_FAVORITES')
    let tempArray = []
    homes.forEach((home, index) => {
      // This condition will be removed after all the code is updated
      // based on the new API endpoints
      if (home.propertyId) {
        getPropertyById(home.propertyId).then(response => {
          if (response.data) {
            tempArray.push(response.data)
            // console.log(index, homes.length)
            if (index + 1 >= homes.length) {
              commit('SAVE_CLIENT_FAVORITES', tempArray)
            }
          }
        })
      }
    })
  },

  /**
   * Removes a client's favorite home from list of favorites
   * An action that is triggered by the client
   *
   * @param {String} selectedHomeId id of removed home object
   */
  removeFromFavoritesAction({ state, commit }, selectedHomeId) {
    const { clientFavorites, clientHomes } = state
    const updatedFavorites = clientFavorites.filter(home => home._id !== selectedHomeId)
    const updatedHomes = clientHomes.filter(home => home.propertyId !== selectedHomeId)

    commit('UPDATE_CLIENT_FAVORITES', { updatedFavorites, updatedHomes })
  },

  fetchClientMessagesAction({ commit, dispatch }) {
    getAllMessages().then(res => {
      commit('SET_CLIENT_MESSAGES', res.data)
      dispatch('getDialogsUsers')
    })
  },

  async markMessagesAsRead({ commit }, data) {
    await Promise.all(data.messages.map(message => markMessageAsRead(message._id)))
    commit('MARK_CLIENT_MESSAGE_AS_READ', data.user)
  }
}

const mutations = {
  SET_DIALOGS: (state, payload) => {
    state.clientDialogs = payload
  },

  SET_CLIENT_DATA: (state, payload) => {
    state.clientData = payload
    if (payload) {
      state.clientHomes = payload.homes
    }
  },

  SET_CLIENT_MESSAGES: (state, payload) => {
    state.clientMessages = payload
  },

  SET_ASSOCIATED_AGENT: (state, payload) => {
    state.associatedAgent = payload
  },

  CLEAR_CLIENT_FAVORITES: state => {
    if (state.clientFavorites) {
      state.clientFavorites = []
    }
  },

  SAVE_CLIENT_FAVORITES: (state, homeDetails) => {
    state.clientFavorites = homeDetails
  },

  UPDATE_CLIENT_FAVORITES: (state, { updatedFavorites, updatedHomes }) => {
    state.clientFavorites = updatedFavorites
    state.clientHomes = updatedHomes
  },

  SET_PREFERENCE_LIST: (state) => {
    state.preferenceSuggestions = state.clientData && state.clientData.homePrefs
      ? needWantDefaultList.filter(sourceItem => {
        let isPresent = false
        state.clientData.homePrefs.options.forEach(objectItem => {
          if (sourceItem.text === objectItem.text) {
            isPresent = true
          }
        })
        return !isPresent
      })
      : needWantDefaultList
  },

  UPDATE_PREFERENCE_LIST: (state, { value, step }) => {
    if (step === 'add') {
      const prefIndex = state.preferenceSuggestions.findIndex(pref => pref.text === value)
      state.preferenceSuggestions.splice(prefIndex, 1)
    } else if (step === 'remove') {
      state.preferenceSuggestions.push(value)
    }
  },

  MARK_CLIENT_MESSAGE_AS_READ: (state, selectedUser) => {
    state.clientDialogs = state.clientDialogs.map(user => {
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
