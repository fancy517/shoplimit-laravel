<template>
  <v-card class="route-details-modal">
    <v-icon class="route-details-close" @click.stop="$emit('close-modal')">
      close
    </v-icon>
    <div class="client-name">
      client: {{ routeDetails.clientName }}
    </div>
    <div class="route-name">
      ROUTE:
      <span>{{ routeDetails.name }}</span>
    </div>
    <div :class="['route-state', routeDetails.state]">
      {{ routeDetails.state }}
    </div>
    <v-card id="routeDetailsHome" elevation="0" min-height="500px">
      <v-layout v-if="houseNames.length === routeDetails.routeStops.length" wrap>
        <v-flex xs12 md6 class="route-homes">
          <div class="route-info">
            <span>START LOCATION: {{ startLocation }}</span>
            <span>DATE: {{ routeDetails.startTime | dateFormat }}</span>
            <span>START TIME: {{ routeDetails.startTime | timeFormat }}</span>
          </div>
          <div class="route-homes">
            <updated-list-component
              :table-headers="routeTableHeaders"
              :table-data="generateTableItems(routeDetails.routeStops)"
            />
          </div>
          <div class="route-button-container">
            <v-btn
              v-for="element in generateRouteModalButtons()"
              :key="element.name"
              :outline="element.outline"
              :color="element.color"
              round
              dark
              class="route-button"
              :class="{'disabled-button': element.past && isPastRoute}"
              @click.stop="element.callback"
            >
              {{ element.name }}
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs12 md5 offset-md1>
          <div class="hidden-sm-and-down">
            <!-- <div v-if="coordinates.length > 0"> -->
            <map-component :lat-lgn-markers="coordinates" />
            <!-- </div> -->
            <!-- <div v-else class="progress-spinner">
              <v-progress-circular indeterminate color="grey darken-1" />
              <div class="py-3">
                Generating map...
              </div>
            </div>-->
          </div>
        </v-flex>
      </v-layout>
      <div v-else class="progress-spinner">
        <v-progress-circular indeterminate color="grey darken-1" />
        <div class="small py-3">
          Populating route details...
        </div>
      </div>
    </v-card>
    <v-dialog v-model="confirmationModal.status" :width="alert.width" :max-width="alert.maxWidth">
      <confirmation-modal
        :modal-options="confirmationModal"
        @on-negative-clicked="closeDeleteConfirmation"
        @on-positive-clicked="cancelRoute"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import moment from 'moment'
import UpdatedListComponent from '../uiUtils/UpdatedListComponent.vue'
import MapComponent from '../common/MapComponent.vue'
import ConfirmationModal from '../modals/ConfirmationModal.vue'
import {
  genericPutRequestToApi,
  genericDeleteRequestToApi
} from '../../utils/genericRequests'
import { propertyFullAddress } from '../../utils/propertyUtils'
import {
  ShareScheduledRouteUrl,
  UpdateDeleteRouteUrl,
  UpdateScheduleRouteUrl
} from '../../utils/clientUrls'
import { mapState } from 'vuex'
import { getPropertyById } from '../../services/propertiesService'
import colors from '../../scss/_colors.scss'

export default {
  components: { UpdatedListComponent, MapComponent, ConfirmationModal },

  filters: {
    dateFormat: value => {
      return moment(value).format('dddd MM.DD.YY')
    },

    timeFormat: value => {
      return moment(value).format('h:mm A')
    }
  },

  props: {
    routeDetails: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      routeTableHeaders: [
        { text: 'Home Address', value: 'address', sortable: false },
        { text: 'Time', value: 'time', sortable: false, align: 'center' }
      ],
      startLocation: '',
      houseNames: [],
      confirmationModal: {
        status: false,
        message: null,
        positive: null,
        negative: null
      }
    }
  },

  computed: {
    ...mapState('style', ['modal', 'alert']),

    isPastRoute() {
      if (this.routeDetails) {
        return (
          this.routeDetails.startTime <
          moment(new Date())
            .utc()
            .format()
        )
      }
      return false
    },

    coordinates() {
      return this.houseNames.map(house => ({
        position: { lat: house.Latitude, lng: house.Longitude }
      }))
    }
  },

  mounted() {
    /**
     * The route home details is similar to the ClientRouteDetails.vue file data.
     * So these two components will use a common route homes component
     */
    this.getHouseNames()
  },

  methods: {
    generateTableItems(fromArray) {
      let response = []

      fromArray.map((item, index) => {
        let obj = {}
        obj[0] = {
          class: 'textLeft',
          text: `${index + 1}. ${this.houseNames[index].Address}`,
          data: item
        }
        obj[1] = { text: moment(item.arrivalTime).format('hh:mm a') }
        response.push(obj)
      })

      return response
    },

    generateRouteModalButtons() {
      // TODO - define callbacks for buttons after other API logic is included for routes
      // TODO - change colors based on UI designs if required or used variable classes
      if (this.routeDetails) {
        const { state } = this.routeDetails
        switch (state) {
          case 'saved':
            return [
              {
                name: 'cancel route',
                outline: true,
                color: colors.secondary,
                callback: this.openDeleteConfirmation
              },
              {
                name: 'revise route',
                outline: true,
                color: colors.primary,
                past: true,
                callback: () => this.$emit('revise-route')
              },
              {
                name: 'request showing',
                color: colors.pending,
                past: true,
                callback: this.requestShowing
              }
            ]
          // case 'pending':
          //   return [
          //     { name: 'cancel route', outline: true, color: 'red', callback: () => { console.log('cancel-route clicked') } }
          //   ]
          case 'scheduled':
            return [
              {
                name: 'cancel route',
                outline: true,
                color: colors.secondary,
                callback: () => {
                  console.log('cancel-route clicked')
                }
              },
              {
                name: 'send reminder',
                color: 'green',
                past: true,
                callback: this.sendSchedule
              }
            ]
          case 'confirmed':
            return [
              {
                name: 'cancel route',
                outline: true,
                color: colors.secondary,
                callback: () => {
                  console.log('cancel-route clicked')
                }
              },
              {
                name: 'send schedule',
                color: 'purple',
                past: true,
                callback: this.sendSchedule
              }
            ]
          default:
            return []
        }
      }
      return []
    },

    /**
     * Gets the details of a property from the property objects by searching based on it's id
     * @param {string} propertyId
     * @public
     */
    getHouseNames() {
      // Will be using some better option here
      // This is only for test purpose
      this.routeDetails.routeStops.forEach((item, index) => {
        getPropertyById(item.propertyId).then(
          response => {
            if (response.data) {
              this.houseNames.splice(index, 0, response.data)
              if (index === 0) {
                this.startLocation = propertyFullAddress(response.data)
              }
            }
          }
        )
      })
      // return getPropertyKeyValue(propertyId, this.homesList, 'Address')
    },

    // Route details modal button functionalities
    openDeleteConfirmation() {
      Object.assign(this.confirmationModal, {
        status: true,
        message: `All data associated with this route will be lost. Are you sure you want to delete this route? `,
        positive: 'Yes, cancel route',
        negative: 'No, not yet'
      })
    },

    cancelRoute() {
      this.closeDeleteConfirmation()
      genericDeleteRequestToApi(
        UpdateDeleteRouteUrl(this.routeDetails.clientId, this.routeDetails._id)
      ).then(response => {
        if (response.status === 200) {
          this.$emit('refresh-data', {
            type: 'success',
            value: true,
            message: `Successfully deleted route ${this.routeDetails.name}`
          })
        }
      })
    },

    closeDeleteConfirmation() {
      Object.assign(this.confirmationModal, {
        status: false,
        message: null
      })
    },

    requestShowing() {
      genericPutRequestToApi(
        UpdateScheduleRouteUrl(
          this.routeDetails.clientId,
          this.routeDetails._id
        )
      ).then(response => {
        if (response.status === 200) {
          this.$emit('refresh-data', {
            type: 'success',
            value: true,
            message: `Successfully sent showing requests for route ${
              this.routeDetails.name
            }`
          })
        }
      })
    },

    sendSchedule() {
      genericPutRequestToApi(
        ShareScheduledRouteUrl(
          this.routeDetails.clientId,
          this.routeDetails._id
        )
      ).then(response => {
        if (response.status === 200) {
          this.$emit('refresh-data', {
            type: 'success',
            value: true,
            message: `Successfully sent route schedule to client ${
              this.routeDetails.clientName
            }`
          })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.route-details-modal
  padding: 4rem 3rem

.route-details-close
  @extend %modal__button-close, %disable-selection

.client-name
  text-transform: uppercase
  font-size: $hwayzFont1rem6
  font-weight: 600
  padding-bottom: 2rem

.route-name
  font-weight: 600
  span
    text-transform: capitalize
    font-size: 1.6rem

.route-state
  text-transform: uppercase
  font-weight: 600
  padding-top: 2rem
  font-size: $hwayzFont1rem4

#routeDetailsHome
  margin: 2rem 3rem
  padding: 0 4rem

.route-homes
  padding: 2rem 0

.route-info
  text-align: left
  display: flex
  flex-flow: column
  span
    margin-bottom: 1rem

.route-button-container
  margin: 2rem 0

.route-button
  height: 2.7rem
  font-size: 1rem
  margin-right: 2rem

.progress-spinner
  padding-top: 8rem
  text-align: center

.disabled-button
  @extend %disable-selection
  opacity: 0.5
  pointer-events: none

.saved
  color: $saved
.pending
  color: $hwayzYellow
.scheduled
  color: $hwayzGreen
.decline
  color: $decline
.confirmed
  color: $hwayzBlue
.completed
  color: $completed
</style>
