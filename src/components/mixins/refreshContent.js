import { mapMutations, mapState, mapActions } from 'vuex'
import { genericGetRequestToApi, genericPostRequestToApi, genericPutRequestToApi } from '../../utils/genericRequests'
import { RetrieveProfileUrl } from '../../utils/agentUrls'
import { CreateFavoriteUrl, UpdateDeleteFavoriteUrl } from '../../utils/clientUrls'

export default {
  computed: {
    ...mapState('agent', ['selectedClient', 'agentData'])
  },

  methods: {
    ...mapActions('common', ['getRouteData']),
    ...mapActions('agent', ['fetchAgentMessagesAction']),
    ...mapMutations('agent', {
      setActiveAgentData: 'SET_ACTIVE_AGENT_DATA',
      setAgentData: 'SET_AGENT_DATA',
      setSelectedClient: 'SET_SELECTED_CLIENT'
    }),
    ...mapMutations('client', {
      setClientData: 'SET_CLIENT_DATA'
    }),

    getAgentData() {
      genericGetRequestToApi(RetrieveProfileUrl()).then(response => {
        if (response.status === 200) {
          this.fetchAgentMessagesAction()
          this.setAgentData(response.data)

          if (this.selectedClient && this.selectedClient._id) {
            this.setSelectedClient(this.selectedClient)
            this.setClientData(this.selectedClient)
          }

          if (!this.selectedClient && response.data.clients && response.data.clients.length > 0) {
            this.getRouteData({ data: response.data, type: 'agent' })
          }
        } else if (response.status === 401) {
          this.$router.push({ name: 'login' })
        }
      })
    },

    /**
     * Handles click on Save for a particular property
     * Assigns the property to the selected client by an agent
     *
     * @public
     * @params
     */
    assignPropertyToClient(propertyObject, selectedClient) {
      genericPostRequestToApi(
        CreateFavoriteUrl(selectedClient._id, propertyObject._id)
      ).then(response => {
        if (response.status === 201) {
          selectedClient.homes.push(response.data)
          this.getAgentData()
          // this.setPropertyToRequested(
          //   response.data,
          //   selectedClient,
          //   propertyObject
          // )
        } else if (response.status === 409) {
          console.log('already assigned')
          // This is a conflict situation, property is already there in client favorites
          // But it hasn't been requested yet to just set request to true

          // Get the favorite object id from client homes
          // const favObject = selectedClient.homes.find(
          //   property => property.propertyId === propertyObject._id
          // )
          // if (favObject) {
          //   this.setPropertyToRequested(
          //     favObject,
          //     selectedClient,
          //     propertyObject
          //   )
          // }
        }
      })
    },

    setPropertyToRequested(favObject, selectedClient, propertyObject) {
      genericPutRequestToApi(
        UpdateDeleteFavoriteUrl(selectedClient._id, favObject._id),
        null,
        {
          params: { requestTour: true }
        }
      ).then(res => {
        if (res.status === 200) {
          selectedClient.homes.push(res.data)
          this.getAgentData()
        }
      })
    }
  }
}
