import { mapMutations, mapActions, mapState } from 'vuex'
import { genericGetRequestToApi, genericDeleteRequestToApi, genericPutRequestToApi } from '../../utils/genericRequests'
import { RetrieveProfileUrl } from '../../utils/agentUrls'
import { RetrieveProfileById, UpdateDeleteFavoriteUrl } from '../../utils/clientUrls'
import { getFavoriteObjectFromPropertyId } from '../../utils/propertyUtils'

export default {
  computed: {
    ...mapState('client', ['clientData'])
  },

  methods: {
    ...mapActions('client',
      ['clientHomeDetailsAction', 'removeFromFavoritesAction', 'fetchClientMessagesAction']),
    ...mapActions('common', ['getRouteData']),

    ...mapMutations('client', {
      setClientData: 'SET_CLIENT_DATA',
      setPreferenceList: 'SET_PREFERENCE_LIST',
      setAssociatedAgent: 'SET_ASSOCIATED_AGENT',
      updateClientFavorites: 'UPDATE_CLIENT_FAVORITES'
    }),

    getClientData(retrieveProperties = false) {
      genericGetRequestToApi(RetrieveProfileUrl()).then(response => {
        if (response.status === 200) {
          this.setClientData(response.data)
          this.setPreferenceList()
          this.getRouteData({ data: response.data, type: 'client' })
          this.fetchClientMessagesAction()
          if (retrieveProperties) {
            this.clientHomeDetailsAction(response.data)
          }
          if (response.data.current_agentid) {
            genericGetRequestToApi(RetrieveProfileById(response.data.current_agentid)).then(res => {
              this.setAssociatedAgent(res.data)
            })
          }
        } else if (response.status === 401) {
          this.$router.push({ name: 'login' })
        }
      })
    },

    removeFromFavorites({ propertyId, isTourRequested }) {
      if (isTourRequested === false) {
        const homeObject = getFavoriteObjectFromPropertyId(this.clientData.homes, propertyId)
        genericDeleteRequestToApi(UpdateDeleteFavoriteUrl(this.clientData._id, homeObject._id)).then(res => {
          if (res.status === 200) {
            this.getClientData()
            // this.removeFromFavoritesAction(homeObject.propertyId)
          }
        })
      }
    },

    requestTourForProperty(propertyObject) {
      genericPutRequestToApi(UpdateDeleteFavoriteUrl(this.clientData._id, propertyObject._id), null, {
        params: {
          requestTour: true
        }
      }).then(response => {
        if (response.status === 200) {
          const clientHomes = this.clientData.homes.map(home => {
            return home._id === propertyObject._id ? Object.assign(propertyObject, { requestTour: true }) : home
          })
          this.updateClientFavorites({
            updatedFavorites: this.clientFavorites,
            updatedHomes: clientHomes
          })
        }
      })
    }
  }
}
