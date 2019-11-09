import refreshContent from './refreshContent'
import { genericPutRequestToApi } from '../../utils/genericRequests'
import { ShareScheduledRouteUrl, UpdateScheduleRouteUrl } from '../../utils/clientUrls'
import { mapState } from 'vuex'
import { propertiesIdInRoute, clientRoutesByState } from '../../utils/propertyUtils'

export default {
  mixins: [refreshContent],

  computed: {
    ...mapState('agent', ['agentData'])
  },

  methods: {
    /**
     *
     * @param {Object} route
     * Sets the route state to pending and sends request to respective listing agents
     */
    requestShowing(route) {
      // const routeClient = this.agentData.clients.find(client => client._id === route.clientId)
      // this.removePendingHomesFromRoutes(routeClient, route)

      genericPutRequestToApi(UpdateScheduleRouteUrl(route.clientId, route._id)).then(response => {
        if (response.status === 200) {
          this.getAgentData()
        }
      })
    },

    removePendingHomesFromRoutes(clientData, routeData) {
      const propertyIds = propertiesIdInRoute(routeData)
      const clientSavedRoutes = clientRoutesByState(clientData, 'saved')
      console.log(propertyIds, clientData, clientSavedRoutes)
    },

    sendSchedule(route) {
      genericPutRequestToApi(ShareScheduledRouteUrl(route.clientId, route._id)).then(response => {
        if (response.status === 200) {
          this.getAgentData()
        }
      })
    }
  }
}
