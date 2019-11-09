<template>
  <div v-if="sortedRouteData.length > 0" id="clientRouteDetails">
    <v-expansion-panel
      v-for="(route, index) in routeData"
      id="routeDetailsExpansion"
      :key="route.id"
      :class="{'expired' : isPastRoute(route)}"
    >
      <v-expansion-panel-content id="expansionContent">
        <v-icon slot="actions">
          keyboard_arrow_down
        </v-icon>
        <div slot="header" class="panel-header">
          <v-layout wrap align-center>
            <v-flex xs6 order-xs1 sm3 order-sm1 md2>
              {{ route.name }}
            </v-flex>
            <v-flex xs12 order-xs3 sm6 order-sm2 md4>
              {{ route.startTime | dateFormat }}
            </v-flex>
            <v-flex
              xs6
              order-xs2
              sm3
              order-sm3
              md2
              :class="[getRouteState(route), 'uppercase']"
            >
              {{ getRouteState(route) }}
            </v-flex>
            <v-flex id="panelButtonContainer" order-4 md4>
              <v-btn
                v-for="element in generateButtons(route)"
                :key="element.name"
                :hidden="isPastRoute(route)"
                :outline="element.outline"
                :color="element.color"
                small
                round
                dark
                @click.stop="element.callback"
              >
                {{ element.name }}
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
        <v-card>
          <v-layout wrap>
            <v-flex xs12 md8 class="p-3">
              <updated-list-component
                :table-headers="routeTableHeaders"
                :table-data="generateTableItems(route)"
              />
            </v-flex>
            <v-flex v-if="generateTableItems(route).length > 0" xs12 md4>
              <div class="hidden-sm-and-down client-route-details__map">
                <div v-if="coordinates[index].length > 0">
                  <map-component :lat-lgn-markers="coordinates[index]" :map-height="'300px'" />
                </div>
                <preloader v-else :loading-message="'Generating map...'" :error-message="'Either properties removed from favorites list or declined'" />
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="confirmationModal.status" :width="alert.width" :max-width="alert.maxWidth">
      <confirmation-modal
        :modal-options="confirmationModal"
        :modal-icon="'info'"
        @on-negative-clicked="closeShowingConfirmation"
        @on-positive-clicked="requestShowing(selectedRoute)"
      />
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getPropertyKeyValue } from '../../../utils/propertyUtils'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import Preloader from '../../uiUtils/Preloader.vue'
import ConfirmationModal from '../../modals/ConfirmationModal.vue'
import MapComponent from '../../common/MapComponent.vue'
import refreshContent from '../../mixins/refreshContent'
import routeDataContent from '../../mixins/routeDataContent'
import { sortObjectArrayByKey, isEmpty } from '../../../utils/generalUtils'
import { sendRouteSchedule } from '../../../services/messagesService'

export default {
  filters: {
    dateFormat: value => {
      return moment(value).format('MM-DD-YY hh:mma')
    }
  },

  components: {
    UpdatedListComponent,
    Preloader,
    ConfirmationModal,
    MapComponent
  },

  mixins: [refreshContent, routeDataContent],

  data() {
    return {
      routeTableHeaders: [
        { text: 'Home Address', value: 'address', sortable: false },
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Status', value: 'status', sortable: false }
      ],
      confirmationModal: {
        status: false,
        message: null,
        positive: null,
        negative: null
      },
      selectedRoute: null,
      latLng: []
    }
  },

  computed: {
    ...mapState('agent', ['selectedClient']),
    ...mapState('client', ['clientFavorites']),
    ...mapState('common', ['routeData']),
    ...mapState('style', ['alert']),

    coordinates() {
      let routeCoordinates = {}
      if (this.sortedRouteData) {
        for (const [index, route] of this.sortedRouteData.entries()) {
          if (route.routeStops && route.routeStops.length > 0) {
            let coordinateArray = []
            for (const stop of route.routeStops) {
              if (stop.state !== 'decline') {
                const propertyDetail = this.clientFavorites.find(
                  home => stop.propertyId === home._id
                )
                if (propertyDetail) {
                  coordinateArray.push({
                    position: {
                      lat: propertyDetail.Latitude,
                      lng: propertyDetail.Longitude
                    }
                  })
                }
              }
            }
            routeCoordinates[index] = coordinateArray
          }
        }
      }
      return routeCoordinates
    },

    sortedRouteData() {
      if (this.routeData && this.routeData.length > 0) {
        return sortObjectArrayByKey(this.routeData, 'startTime', 'desc')
      }
      return []
    }
  },

  watch: {
    routeData: function(newValue, oldValue) {
      console.log(newValue, oldValue)
    }
  },

  created() {
    if (!isEmpty(this.selectedClient)) {
      this.getRouteData({ data: this.selectedClient, type: 'client' })
    }
  },

  methods: {
    ...mapActions('common', ['getRouteData']),
    ...mapMutations('home', {
      setActiveRoute: 'SET_ACTIVE_ROUTE'
    }),
    ...mapMutations('common', {
      setSelectedRoute: 'SET_SELECTED_ROUTE',
      setSelectedRouteLoading: 'SET_SELECTED_ROUTE_LOADING'
    }),

    generateTableItems(routeObject) {
      let response = []

      let fromArray = routeObject.routeStops
      fromArray.map(item => {
        let obj = {}
        obj[0] = {
          type: 'address',
          text: this.getHouseNameById(item.propertyId),
          data: item
        }
        obj[1] = {
          text: item.arrivalTime
            ? moment(item.arrivalTime).format('hh:mm a')
            : 'N/A'
        }
        obj[2] = { text: this.getStopState(item.state), class: item.state }
        if (
          routeObject.state === 'confirmed' ||
          routeObject.state === 'scheduled'
        ) {
          if (item.state !== 'decline') {
            response.push(obj)
          }
        } else {
          response.push(obj)
        }
      })

      return response
    },

    getRouteState(routeData) {
      return this.isPastRoute(routeData) ? 'expired' : routeData.state
    },

    getStopState(defaultState) {
      return defaultState === 'accept' ? 'accepted' : defaultState
    },

    isPastRoute(routeData) {
      return (
        routeData.startTime <
        moment(new Date())
          .utc()
          .format()
      )
    },

    generateButtons(routeData) {
      const { state } = routeData
      switch (state) {
        case 'saved':
          return [
            {
              name: 'revise route',
              outline: true,
              color: 'blue',
              callback: () => this.reviseSavedRoute(routeData)
            },
            {
              name: 'request showing',
              color: '#ff9800',
              callback: () => this.openShowingConfirmation(routeData)
            }
          ]
        case 'scheduled':
          return [
            {
              name: 'send reminder',
              color: 'green',
              callback: () => this.sendScheduleExtended(routeData)
            }
          ]
        case 'confirmed':
          return [
            {
              name: 'send schedule',
              color: 'purple',
              callback: () => this.sendScheduleExtended(routeData)
            }
          ]
        default:
          return []
      }
    },

    /**
     * Gets the details of a property from the property objects by searching based on it's id
     * @param {string} propertyId
     * @public
     */
    getHouseNameById(propertyId) {
      return getPropertyKeyValue(propertyId, this.clientFavorites, 'Address')
    },

    reviseSavedRoute(routeForRevision) {
      this.setSelectedRoute(routeForRevision)
      this.setSelectedRouteLoading(true)
      this.$router.push({ name: 'plan-route' })
      this.setActiveRoute('plan-route')
    },

    openShowingConfirmation(routeData) {
      this.selectedRoute = routeData
      Object.assign(this.confirmationModal, {
        status: true,
        message: `Make sure you have confirmed your entries for this route. Do you want to request showings for properties in this route?`,
        positive: 'Yes, send request',
        negative: 'No, not now'
      })
    },

    closeShowingConfirmation() {
      this.selectedRoute = null
      Object.assign(this.confirmationModal, {
        status: false,
        message: null
      })
    },

    sendScheduleExtended(data) {
      this.sendSchedule(data)
      const date = moment(data.startTime).format('MM-DD-YY')
      const subject = `Schedule for route: ${data.name}, ${date}.`
      let message = ''
      data.routeStops.forEach((route, index) => {
        const time = route.arrivalTime
          ? moment(route.arrivalTime).format('hh:mm a')
          : 'N/A'
        const address = this.getHouseNameById(route.propertyId)
        if (data.state === 'confirmed' || data.state === 'scheduled') {
          if (route.state !== 'decline') {
            message += `${index + 1} - ${address.trim()} - ${time} \n`
          }
        } else {
          message += `${index + 1} - ${address.trim()} - ${time} \n`
        }
      })
      return sendRouteSchedule({
        to: [data.clientId],
        message,
        subject
      })
    }
  }
}
</script>

<style lang="sass">
#routeDetailsExpansion
  border-radius: 1.5rem
  box-shadow: none !important
  #expansionContent
    border-radius: 1.5rem
    font-size: $hwayzFont1rem3
    margin-bottom: 1.5rem !important

.client-route-details__map
  min-height: 35rem
  width: 100%
  padding: 1rem

.panel-header
  align-items: center

.progress-spinner
  padding-top: 8rem
  text-align: center

#panelButtonContainer
  text-align: right
  .v-btn
    height: 28px
    font-size: $hwayzFont1rem
    margin: 0 2rem 0 0

#clientRouteDetails
  .v-expansion-panel__header
    border-radius: 1.5rem 1.5rem 0rem 0rem
    border: 0.2rem solid $hwayzBlue
  .v-expansion-panel__body
    border-radius: 0rem 0rem 1.5rem 1.5rem
    border: 0.2rem solid $hwayzBlue
    border-top: none
  .v-card
    border-radius: 0rem 0rem 1.5rem 1.5rem
  .expired
    .v-expansion-panel__header
      border: 0.2rem solid $color-grey
    .v-expansion-panel__body
      border: 0.2rem solid $color-grey

.disabled
  @extend %disable-selection
  pointer-events: none
  opacity: 0.3

</style>
