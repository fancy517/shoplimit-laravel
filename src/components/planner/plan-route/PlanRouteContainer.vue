<template>
  <div style="text-align: left; background-color: #FFFFFF">
    <plan-route-header />
    <v-btn light flat color="black" @click.stop="backToPlanner">
      <v-icon medium>
        keyboard_backspace
      </v-icon>Back to Planner
    </v-btn>
    <div class="wrapper">
      <div class="calendar_wrap">
        <div class="calendar text-xs-center">
          CALENDAR
          <div class="calendar-avatars">
            <template v-for="avatar in calendarAvatars">
              <v-avatar
                :key="avatar.type"
                :color="avatar.color"
                :size="'8px'"
              />
              {{ avatar.type }}
            </template>
          </div>
          <calendar-new-component
            :calendar-object="calendarObject"
            @set-modal-values="setModalValues($event)"
            @on-calendar-clicked="displayRouteDetails($event)"
          />
        </div>
      </div>
      <div class="middle-blocks" :class="{'single': secondaryLayout}">
        <template v-if="!secondaryLayout">
          <div
            class="choose_time"
            :class="{'block-filled' : chosenTime && chosenDate, 'disabled' : isPastRoute}"
          >
            <div class="block-heading">
              CHOOSE DATE & TIME
            </div>
            <div class="two-entries">
              <div class="date">
                <date-picker :picker-date="dateFromRoute" @changeDate="dateUpdater" />
              </div>
              <div class="time">
                <time-picker-alt
                  class="time"
                  :min-time="getMinTime()"
                  :picker-time="timeFromRoute"
                  @changeTime="timeUpdater"
                />
              </div>
            </div>
          </div>
          <div
            class="choose_location"
            :class="{'block-filled' : startLocation && endLocation, 'disabled' : isPastRoute}"
          >
            <div class="block-heading">
              SET START & END LOCATION
            </div>
            <div class="start-end">
              <div class="start">
                <v-autocomplete
                  v-if="selectedHousesMutable && selectedHousesMutable.length > 0"
                  v-model="selectedLocation"
                  :items="selectedHousesMutable.map(house => getFullAddress(house))"
                  label="Start Location: *"
                />
              </div>
              <div class="end">
                <v-text-field v-model="endLocation" label="End Location: *" />
              </div>
            </div>
          </div>
        </template>
        <div
          class="calculate"
          :class="{'block-filled' : calculation, 'small-padding': secondaryLayout }"
        >
          <div v-if="selectedRouteLoading" class="mt-5">
            <v-progress-circular indeterminate color="grey darken-1" />
            <div class="small py-3">
              Populating route details...
            </div>
          </div>
          <template v-else>
            <route-basic-info
              v-if="secondaryLayout"
              :route-object="selectedRoute"
              :route-start="getFullAddress(selectedRoute.routeStops[0])"
            />
            <template v-else-if="isSavedRoute">
              <span
                class="route-name text-medium block-heading"
              >{{ selectedRoute.name.toUpperCase() }} -&nbsp;</span>
              <span
                :class="[selectedRoute.state, 'route-name']"
              >{{ selectedRoute.state.toUpperCase() }}</span>
            </template>
            <div v-else class="block-heading">
              CALCULATE ROUTE
            </div>
            <updated-list-component
              :table-headers="routeHeaders"
              :table-data="generateTableItems(itemsToGenerate())"
              style="margin-top: 20px"
              @clicked="openConfirmationModal"
            />
            <div class="calc-btns">
              <v-btn
                :hidden="showRequestBtn || (selectedRoute && selectedRoute.state !== 'saved')"
                class="routeBtn calcBtn"
                outline
                color="primary"
                flat
                :disabled="(startLocation !== null & startLocation !== '' && chosenTime !== '' && chosenDate !== '') ? false : true"
                :loading="isCalculating"
                @click.stop="calculate"
              >
                Calculate
                <template v-slot:loader>
                  <span class="calculation-spinner">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn
                v-show="isSavedRoute && !editMode"
                class="routeBtn calcBtn"
                outline
                color="red"
                flat
                @click.stop="cancelRoute"
              >
                Cancel
              </v-btn>
              <v-btn
                class="routeBtn"
                :class="isPendingRoute ? 'calcBtn' : 'clearBtn'"
                outline
                color="green"
                flat
                @click.stop="secondaryLayout ? newRoutePage() : clearHomes()"
              >
                Clear
              </v-btn>
              <template v-if="calculation === null">
                <div v-if="selectedRoute && !isPastRoute">
                  <v-btn
                    v-for="stateBtn in stateButton(selectedRoute.state)"
                    :key="stateBtn.text"
                    class="routeBtn specBtn"
                    :color="stateBtn.color"
                    round
                    dark
                    @click.stop="stateBtn.callback"
                  >
                    {{ stateBtn.text }}
                  </v-btn>
                </div>
              </template>
              <template v-else>
                <v-btn
                  class="routeBtn specBtn"
                  color="green"
                  round
                  dark
                  @click.stop="isSavedRoute ? updateRoute() : openSave = !openSave;"
                >
                  {{ isSavedRoute ? 'Update' : 'Save' }} Route
                </v-btn>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="rightside">
        <div class="addHome" :class="{'disabled' : secondaryLayout || isPastRoute}">
          ADD HOME TO ROUTE
          <v-btn-toggle
            v-model="addtype"
            v-custom-outside-click="closeDropdown"
            class="home-add-type"
          >
            <v-btn flat value="mls-number">
              MLS #
            </v-btn>
            <v-btn flat value="mls-address">
              MLS address
            </v-btn>
            <v-btn flat value="req-homes">
              Requested Homes
            </v-btn>
          </v-btn-toggle>
          <add-number
            v-if="addtype === 'mls-number'"
            :addresses="addressesToChildren"
            @sendHome="AddAddress"
          />
          <add-address
            v-if="addtype === 'mls-address' || addtype === 'req-homes'"
            :addresses="addressesToChildren"
            @sendHome="AddAddress"
            @pressedEnter="AddAddress"
          />
          <div v-if="addtype === 'req-homes'" class="selectHomeSquare">
            <v-toolbar id="addHomeToolbar" flat>
              <!-- <v-toolbar-title
                id="client-name"
              >
                {{ selectedClient.name | capitalize }}'s Request Homes
              </v-toolbar-title>
              <v-spacer />-->
              <v-toolbar-items class="mx-auto">
                <v-btn outline flat color="primary" @click.stop="addRequestedHomes">
                  Select
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <ul class="favoritesList">
              <li
                v-for="favorite in requestedTourToAdd"
                :key="favorite._id"
                @click.stop="favorite.checkbox = !favorite.checkbox"
              >
                {{ getHomeDetails(favorite, 'Address') }}
                <v-checkbox v-model="favorite.checkbox" class="checkboxFavorite" @click="[]" />
              </li>
            </ul>
          </div>
        </div>
        <div v-if="latLngMarkers && latLngMarkers.length > 0" class="map">
          <map-component :lat-lgn-markers="latLngMarkers" :returned-route="directionServiceRoute" />
        </div>
      </div>
      <v-dialog v-model="openSave" width="550px">
        <route-name-modal :initial-name="routeName" @route-name-entered="nameReceived" />
      </v-dialog>
    </div>
    <v-dialog v-model="confirmationModal.status" :width="alert.width" :max-width="alert.maxWidth">
      <confirmation-modal
        :modal-options="confirmationModal"
        @on-negative-clicked="onCancelDelete"
        @on-positive-clicked="onConfirmDelete"
      />
    </v-dialog>
    <full-screen-spinner v-if="waitForProgress" :spinner-text="spinnerText" />
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapMutations, mapActions } from 'vuex'
import PlanRouteHeader from './PlanRouteHeader.vue'
import CalendarNewComponent from '../../calendar/CalendarNewComponent'
import DatePicker from './components/DatePicker.vue'
import TimePickerAlt from './components/TimePickerAlt.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import {
  getPropertyKeyValue,
  propertyFullAddress,
  getFavoriteObjectFromPropertyId
} from '../../../utils/propertyUtils'
import MapComponent from '../../common/MapComponent.vue'
import AddAddress from './components/AddAddress.vue'
import AddNumber from './components/AddNumber.vue'
import { INITIAL_SEARCH_QUERY } from '../../common/searchPropertyConst.js'
import {
  genericPostRequestToApi,
  genericPutRequestToApi,
  genericDeleteRequestToApi
} from '../../../utils/genericRequests'
import { RetrieveSearchPropertyUrl } from '../../../utils/agentUrls'
import setRoute from './components/Directions.js'
import RouteNameModal from '../../modals/RouteNameModal.vue'
import ConfirmationModal from '../../modals/ConfirmationModal.vue'
import { isEmpty } from '../../../utils/generalUtils'
import {
  CreateRetrieveRouteUrl,
  UpdateScheduleRouteUrl,
  UpdateDeleteRouteUrl,
  ShareScheduledRouteUrl
} from '../../../utils/clientUrls'
import refreshContent from '../../mixins/refreshContent'
import FullScreenSpinner from '../../uiUtils/FullScreenSpinner.vue'
import RouteBasicInfo from './components/RouteBasicInfo.vue'
import colors from '../../../scss/_colors.scss'

export default {
  components: {
    PlanRouteHeader,
    CalendarNewComponent,
    DatePicker,
    TimePickerAlt,
    UpdatedListComponent,
    MapComponent,
    AddAddress,
    AddNumber,
    RouteNameModal,
    ConfirmationModal,
    FullScreenSpinner,
    RouteBasicInfo
  },

  filters: {
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString().split(' ')
      let name = ''
      for (const val of value) {
        const add = val.charAt(0).toUpperCase() + val.slice(1)
        name = name + ' ' + add
      }
      return name
    }
  },

  mixins: [refreshContent],

  data() {
    return {
      searchQuery: { ...INITIAL_SEARCH_QUERY, maxArea: '', maxPrice: '' },
      routeHeaders: [
        {
          text: '',
          value: 'remove',
          sortable: false,
          width: '10%'
        },
        {
          text: 'Home Address',
          value: 'address',
          width: '70%',
          sortable: false
        },
        {
          text: 'ETA',
          value: 'eta',
          sortable: false,
          width: '30%',
          align: 'center'
        }
      ],
      calendarObject: {
        start: moment().format('YYYY-MM-DD'),
        type: 'day',
        now: null,
        display: 'agent',
        routeModal: false,
        class: 'plan-route'
      },
      addtype: 'mls-address',
      addressToAdd: '',
      latLngMarkers: [],
      directionServiceRoute: null,
      routeName: '',
      endLocation: '',
      chosenDate: moment().format('MM/DD/YYYY'),
      chosenTime: '',
      dateFromRoute: null,
      timeFromRoute: null,
      selectedHousesMutable: [],
      requestedTourToAdd: [],
      calculation: null,
      addressNumberFromChild: '',
      addressesToChildren: [],
      openSave: false,
      selectedForRemoval: null,
      confirmationModal: {
        status: false,
        message: null,
        positive: null,
        negative: null
      },
      editMode: false,
      waitForProgress: false,
      spinnerText: null,
      isCalculating: false,
      calendarAvatars: [
        { type: 'saved', color: colors.saved },
        { type: 'pending', color: colors.pending },
        { type: 'confirmed', color: colors.confirmed },
        { type: 'scheduled', color: colors.scheduled },
        { type: 'completed', color: colors.completed }
      ]
    }
  },

  computed: {
    ...mapState('client', ['clientFavorites', 'clientHomes']),
    ...mapState('agent', ['selectedClient', 'getSearchObject']),
    ...mapState('common', [
      'routeData',
      'selectedRoute',
      'selectedRouteLoading',
      'routeHomes',
      'startLocation'
    ]),
    ...mapState('style', ['alert']),

    isSavedRoute() {
      console.log(this.selectedRoute)
      return this.selectedRoute && this.selectedRoute.state === 'saved'
    },

    isPendingRoute() {
      return this.selectedRoute && this.selectedRoute.state === 'pending'
    },

    showRequestBtn() {
      return this.isSavedRoute && !this.editMode
    },

    selectedLocation: {
      set(location) {
        this.setStartLocation(location)
      },
      get() {
        return this.startLocation
      }
    },

    secondaryLayout() {
      return (
        (this.selectedRoute && this.selectedRoute.state !== 'saved') ||
        this.isPastRoute
      )
    },

    isPastRoute() {
      if (!isEmpty(this.selectedRoute)) {
        return (
          this.selectedRoute.startTime <
          moment(new Date())
            .utc()
            .format()
        )
      }
      return false
    }
  },

  watch: {
    startLocation(newValue, oldValue) {
      if (!isEmpty(oldValue) && !isEmpty(newValue) && newValue !== oldValue) {
        this.editMode = true
        // Case when a route entered into edit mode and dropdown changes order
        if (this.routeData) {
          let firstHome = null
          this.selectedHousesMutable = this.selectedHousesMutable.filter(
            house => {
              if (this.getFullAddress(house) !== newValue) {
                return true
              } else {
                firstHome = house
              }
            }
          )
          if (firstHome) this.selectedHousesMutable.unshift(firstHome)
        }
      }
    },

    selectedHousesMutable: function(newValue, oldValue) {
      this.calculation = null
    },

    clientFavorites(newValue, oldValue) {
      // console.log(newValue, oldValue)
      this.initPlanRouteData(newValue)
    }
  },

  created() {
    window.scrollTo(0, 0)
    if (this.clientFavorites) {
      this.initPlanRouteData(this.clientFavorites)
    }
  },

  methods: {
    ...mapActions('agent', ['setSearchedClient']),
    ...mapMutations('common', {
      setRouteData: 'SET_ROUTE_DATA',
      setSelectedRoute: 'SET_SELECTED_ROUTE',
      setSelectedRouteLoading: 'SET_SELECTED_ROUTE_LOADING',
      setStartLocation: 'SET_START_LOCATION'
    }),

    initPlanRouteData(data) {
      if (!isEmpty(data)) {
        // console.log('init called >>>', data, this.selectedRoute, this.routeHomes)
        let houses = []
        if (this.selectedRoute) {
          houses = this.setPresentRouteData(this.selectedRoute)
        } else if (!isEmpty(this.routeHomes)) {
          this.selectedHousesMutable = this.routeHomes
          for (const house of this.routeHomes) {
            houses.push(data.find(home => house.propertyId === home._id))
          }
        }
        this.setOtherRouteDetails(houses)
      }
    },

    backToPlanner() {
      this.setSelectedRoute(null)
      this.setStartLocation(null)
      this.setSelectedRouteLoading(false)
      this.$router.push({ name: 'planner' })
    },

    itemsToGenerate() {
      if (!isEmpty(this.selectedRoute) && !this.editMode) {
        return this.selectedRoute.routeStops.map(stop => {
          const clientFavProperty = this.clientFavorites.find(
            home => home._id === stop.propertyId
          )
          if (clientFavProperty) {
            return {
              Address: propertyFullAddress(clientFavProperty),
              eta: stop.arrivalTime,
              latitude: clientFavProperty.Latitude,
              longitude: clientFavProperty.Longitude,
              propertyId: stop.propertyId
            }
          }
          return null
        })
      } else {
        switch (this.calculation) {
          case null:
            return this.selectedHousesMutable.map(house => {
              const clientFavProperty = this.clientFavorites.find(
                home => home._id === house.propertyId
              )
              if (clientFavProperty) {
                return {
                  Address: propertyFullAddress(clientFavProperty),
                  eta: null,
                  latitude: clientFavProperty.Latitude,
                  longitude: clientFavProperty.Longitude,
                  propertyId: house.propertyId
                }
              }
            })
          case !null:
          default:
            return this.calculation
        }
      }
    },

    setPresentRouteData(routeData) {
      let calculatedArray = []
      let houses = []

      for (const stop of routeData.routeStops) {
        const propertyObject = this.clientFavorites.find(
          home => stop.propertyId === home._id
        )
        if (propertyObject) {
          houses.push(propertyObject)
          calculatedArray.push({
            Address: propertyFullAddress(propertyObject),
            eta: moment(stop.arrivalTime).format(),
            latitude: propertyObject.Latitude,
            longitude: propertyObject.Longitude,
            propertyId: stop.propertyId
          })
        }
      }

      // Setting values in plan route page when route object is send
      this.calculation = calculatedArray
      this.setStartLocation(propertyFullAddress(houses[0]))
      this.dateFromRoute = moment(routeData.startTime).format('YYYY-MM-DD')
      this.timeFromRoute = moment(routeData.startTime).format('HH:mm')

      this.chosenDate = moment(this.dateFromRoute, 'YYYY-MM-DD').format(
        'MM/DD/YYYY'
      )
      this.chosenTime = this.timeFromRoute
      this.routeName = routeData.name
      this.selectedHousesMutable = routeData.routeStops.map(stop =>
        getFavoriteObjectFromPropertyId(this.clientHomes, stop.propertyId)
      )
      if (!isEmpty(this.calculation)) {
        this.setSelectedRouteLoading(false)
      }
      return houses
    },

    setOtherRouteDetails(houses) {
      // console.log('testing houses >>>', houses, this.clientFavorites)
      this.requestedTourToAdd = []

      this.latLngMarkers = houses.map(house => {
        if (house) {
          return {
            position: {
              lat: house.Latitude,
              lng: house.Longitude
            }
          }
        }
      })

      let houseIds = houses.map(house => house._id)
      let newTourHomes = this.selectedClient.homes.filter(
        home => home.requestTour === true
      )

      newTourHomes = newTourHomes.filter(
        home => !houseIds.includes(home.propertyId)
      )

      for (const favorite of newTourHomes) {
        this.requestedTourToAdd.push({ ...favorite, checkbox: false })
      }
    },

    searchProperties() {
      const requestedQuery = {
        ...this.searchQuery,
        SqFt: `${this.searchQuery.LivingArea || '0'}-${this.searchQuery
          .maxArea || '10000'}`,
        Price: `${this.searchQuery.ListPrice || '0'}-${this.searchQuery
          .maxPrice || '10000000'}`
      }

      const searchElement = {
        index: {
          skip: 0,
          limit: 100
        },
        query: requestedQuery
      }

      genericPostRequestToApi(RetrieveSearchPropertyUrl(), searchElement).then(
        response => {
          if (response.status === 200) {
            let responseData = response.data
            for (const home of responseData) {
              this.addressesToChildren.push({ ...home })
            }
          } else {
            console.log('Error occured')
          }
        }
      )
    },

    stateButton(routeState) {
      switch (routeState) {
        case 'saved' :
          return [{
            text: 'Request Showing',
            color: colors.pending,
            callback: this.requestShowing
          }]
        case 'confirmed':
          return [{
            text: 'Send Schedule',
            color: colors.saved,
            callback: this.sendSchedule
          }]
        case 'scheduled':
          return [{
            text: 'Send Reminder',
            color: colors.scheduled,
            callback: this.sendSchedule
          }]
        default:
          return null
      }
    },

    generateTableItems(fromArray) {
      let response = []
      let alphabet = 'A'
      fromArray.map((item, index) => {
        if (item) {
          let obj = {}
          if (
            (!isEmpty(this.selectedRoute) && !this.isSavedRoute) ||
            this.isPastRoute
          ) {
            obj[0] = { text: '' }
          } else {
            obj[0] = {
              type: 'clickableIcon',
              text: 'close',
              btnClass: 'white--text grey',
              cellClass: 'pr-0',
              data: item
            }
          }
          obj[1] = {
            type: 'address',
            text: item.Address || this.getFullAddress(item),
            preText:
              !this.editMode && !isEmpty(this.selectedRoute)
                ? String.fromCharCode(alphabet.charCodeAt(0) + index)
                : '',
            preTextClass: 'hwayzBlue font-weight-medium title',
            data: item
          }
          const propertyETA = item.eta || item.arrivalTime
          obj[2] = {
            text: isEmpty(propertyETA)
              ? ''
              : moment(propertyETA).format('hh:mmA')
          }

          response.push(obj)
        }
      })

      return response
    },

    displayRouteDetails(routeData) {
      this.editMode = false
      if (!isEmpty(this.selectedRoute)) {
        if (this.selectedRoute._id !== routeData._id) {
          this.changeRouteDetails(routeData)
        }
      } else {
        this.changeRouteDetails(routeData)
      }
    },

    changeRouteDetails(data) {
      const newClient = this.agentData.clients.find(
        client => client._id === data.clientId
      )
      this.setSearchedClient(newClient)
      this.setSelectedRoute(data)
      this.setSelectedRouteLoading(true)
      this.setStartLocation(null)
      this.setPresentRouteData(data)
    },

    openConfirmationModal(houseData) {
      this.selectedForRemoval = getFavoriteObjectFromPropertyId(
        this.clientHomes,
        houseData.propertyId
      )
      Object.assign(this.confirmationModal, {
        status: true,
        message: `Do you really want to remove this property from adding to the route`,
        positive: 'Yes, remove it',
        negative: 'No, keep it'
      })
    },

    onConfirmDelete() {
      if (this.selectedForRemoval) {
        // console.log('called', this.selectedForRemoval)
        this.removePropertyFromBeingAdded()
      } else {
        this.deleteRoute()
      }
    },

    onCancelDelete() {
      this.confirmationModal = { status: false, message: null }
      this.selectedForRemoval = null
    },

    removePropertyFromBeingAdded() {
      this.editMode = true
      this.selectedHousesMutable = this.selectedHousesMutable.filter(
        house => house.propertyId !== this.selectedForRemoval.propertyId
      )
      this.requestedTourToAdd.push({
        ...this.selectedForRemoval,
        checkbox: false
      })
      this.onCancelDelete()
    },

    deleteRoute() {
      this.onCancelDelete()
      this.startProcess(`Route ${this.selectedRoute.name} is being removed`)
      genericDeleteRequestToApi(
        UpdateDeleteRouteUrl(this.selectedClient._id, this.selectedRoute._id)
      ).then(response => {
        if (response.status === 200) {
          this.refreshData()
        } else {
          this.handlingErrorFunction()
        }
      })
    },

    /**
     * Calculate the route for entered properties
     */
    async calculate() {
      this.isCalculating = true
      const jsDate = new Date(
        `${this.chosenDate.replace(/-/gi, '-')} ${this.chosenTime}`
      ) // only works for future dates
      const startTime = moment(jsDate)
        .utc()
        .format()

      let stops = []
      let filteredFavProperties = []
      // let originPropertyObject = null
      let filteredWaypoints = []

      this.selectedHousesMutable.map(house => {
        if (this.getFullAddress(house) !== this.startLocation) {
          filteredWaypoints.push(house)
        } else {
          // originPropertyObject = house
          filteredFavProperties.push(
            this.clientFavorites.find(home => home._id === house.propertyId)
          )
        }
      })

      if (filteredWaypoints.length > 0) {
        for (const house of filteredWaypoints) {
          filteredFavProperties.push(
            this.clientFavorites.find(home => home._id === house.propertyId)
          )
          const latLng =
            this.getHomeDetails(house, 'Latitude') +
            ', ' +
            this.getHomeDetails(house, 'Longitude')
          stops.push({
            // location: this.getFullAddress(house),
            location: latLng,
            stopover: true
          })
        }

        let destination = this.endLocation || stops[stops.length - 1].location
        // let destination = this.endLocation
        // stops.pop()

        const returnedRoute = await setRoute(
          this.startLocation,
          destination,
          stops
        )

        if (returnedRoute.status === 'OK') {
          let calculatedArray = []

          const route = returnedRoute.routes[0]
          this.directionServiceRoute = returnedRoute

          calculatedArray.push({
            // Address: cleanedUpRoute[0].start_address,
            Address: propertyFullAddress(filteredFavProperties[0]),
            eta: startTime,
            latitude: filteredFavProperties[0].Latitude,
            longitude: filteredFavProperties[0].Longitude,
            propertyId: filteredFavProperties[0]._id
          })

          let timeIterator = [startTime]

          for (const i of route.waypoint_order) {
            const lastTime = timeIterator[timeIterator.length - 1]

            const thisTime = moment(lastTime)
              .add(route.legs[i].duration.value + 1800, 'seconds')
              .utc()
              .format()

            timeIterator.push(thisTime)

            calculatedArray.push({
              Address: propertyFullAddress(filteredFavProperties[i + 1]),
              eta: this.roundOffMinutes(15, moment(thisTime)),
              latitude: filteredFavProperties[i + 1].Latitude,
              longitude: filteredFavProperties[i + 1].Longitude,
              propertyId: filteredFavProperties[i + 1]._id
            })
          }

          console.log(this.endLocation, returnedRoute)

          // let destinationFav = filteredFavProperties[filteredFavProperties.length - 1]
          // calculatedArray.push({
          //   // Address: cleanedUpRoute[0].start_address,
          //   Address: propertyFullAddress(destinationFav),
          //   eta: startTime,
          //   latitude: destinationFav.Latitude,
          //   longitude: destinationFav.Longitude,
          //   propertyId: destinationFav._id
          // })

          this.calculation = calculatedArray
          this.isCalculating = false
        } else if (returnedRoute.status === 'ZERO_RESULTS') {
          console.log(
            "Couldn't create a route from provided start and end location. Please try to enter a more specific end location."
          )
          this.isCalculating = false
        } else {
          console.log('Some error occurred while calculating route')
          this.isCalculating = false
        }
      } else {
        this.calculation = [
          {
            Address: propertyFullAddress(filteredFavProperties[0]),
            eta: startTime,
            latitude: filteredFavProperties[0].Latitude,
            longitude: filteredFavProperties[0].Longitude,
            propertyId: filteredFavProperties[0]._id
          }
        ]
        this.directionServiceRoute = null
        this.isCalculating = false
      }

      this.latLngMarkers = this.calculation.map(home => ({
        position: {
          lat: home.latitude,
          lng: home.longitude
        }
      }))
    },

    getHomeDetails(home, key) {
      return getPropertyKeyValue(home.propertyId, this.clientFavorites, key)
    },

    getFullAddress(home) {
      if (home) {
        const propertyObject = this.clientFavorites.find(
          property => property._id === home.propertyId
        )
        if (propertyObject) return propertyFullAddress(propertyObject)
      }
      return null
    },

    dateUpdater(dateFromChild) {
      if (!this.editMode && !isEmpty(this.selectedRoute)) {
        if (
          dateFromChild !==
          moment(this.selectedRoute.startTime).format('MM/DD/YYYY')
        ) {
          this.editMode = true
        }
      }
      this.chosenDate = dateFromChild
      Object.assign(this.calendarObject, {
        start: moment(dateFromChild, 'MM/DD/YYYY').format('YYYY-MM-DD')
      })
    },

    timeUpdater(timeFromChild) {
      if (!this.editMode && !isEmpty(this.selectedRoute)) {
        if (
          timeFromChild !== moment(this.selectedRoute.startTime).format('HH:mm')
        ) {
          this.editMode = true
        }
      }
      // console.log('timeFromChild >>>', timeFromChild)
      this.chosenTime = timeFromChild
    },

    AddAddress(addressNumberFromChild) {
      // Adds house by inputted address
      let selectedToAdd = addressNumberFromChild.val
      const includedAlready = this.selectedHousesMutable.filter(
        selected => selected.Address === selectedToAdd.Address
      )
      if (includedAlready.length === 0) {
        this.selectedHousesMutable.push(selectedToAdd)
      }
    },

    addRequestedHomes() {
      this.editMode = true
      this.addtype = null

      // Gets houses that were selected to add into route
      let selectedToAdd = this.requestedTourToAdd.filter(
        tour => tour.checkbox === true
      )

      // let duplicates = []

      // // Gets duplicates
      // for (const selected of selectedToAdd) {
      //   for (const alreadyThere of this.selectedHousesMutable) {
      //     if (alreadyThere.propertyId === selected.propertyId) {
      //       duplicates.push(selected)
      //     }
      //   }
      // }

      // // Takes duplicates out of houses to add into route
      // for (const duplicate of duplicates) {
      //   selectedToAdd = selectedToAdd.filter(
      //     selected => selected !== duplicate
      //   )
      // }

      // Now that duplicates were filteres, we add houses that were selected into the main route array
      for (const add of selectedToAdd) {
        this.selectedHousesMutable.push(add)
      }

      this.requestedTourToAdd = this.requestedTourToAdd.filter(
        tour => tour.checkbox === false
      )

      // Puts all checkbox back to false
      for (const requested of this.requestedTourToAdd) {
        requested.checkbox = false
      }
    },

    /**
     * Function to save a new route
     */
    saveRoute() {
      const postRequest = this.setPostRequestParams()
      this.startProcess('Saving your new route')

      genericPostRequestToApi(
        CreateRetrieveRouteUrl(this.selectedClient._id),
        postRequest,
        {
          params: {
            optimize: true
          }
        }
      ).then(response => {
        if (response.status === 201) {
          this.refreshData(response.data)
        } else if (response.status === 409) {
          this.handlingErrorFunction()
        } else {
          this.handlingErrorFunction()
        }
      })
    },

    updateRoute() {
      const postRequest = this.setPostRequestParams()
      this.startProcess('Updating your route')

      // Adding params to request object in alignment with PUT request
      const putRequest = Object.assign(
        {},
        {
          ...postRequest,
          _id: this.selectedRoute._id,
          state: this.selectedRoute.state
        }
      )

      genericPutRequestToApi(
        UpdateDeleteRouteUrl(this.selectedClient._id, this.selectedRoute._id),
        putRequest,
        { params: { optimize: true } }
      ).then(response => {
        if (response.status === 200) {
          this.refreshData(response.data)
        } else {
          this.handlingErrorFunction()
        }
      })
    },

    refreshData(data) {
      this.getAgentData()
      if (data) this.addClientInfoToRoute(data)
      else this.setSelectedRoute(null)
      this.setVariablesToDefault()
    },

    setVariablesToDefault() {
      this.setSelectedRouteLoading(false)
      this.editMode = false
      this.calculation = null
      this.waitForProgress = false
    },

    setPostRequestParams() {
      const jsDate = new Date(
        `${this.chosenDate.replace(/-/gi, '-')} ${this.chosenTime}`
      ) // only works for future dates
      const startTime = moment(jsDate)
        .utc()
        .format()

      const routeStops = []
      for (const calc of this.calculation) {
        // if (i !== 0 && i !== this.calculation.length - 1) {
        routeStops.push({
          propertyId: calc.propertyId,
          arrivalTime: calc.eta
        })
        // }
      }

      const lastCalc = this.calculation[this.calculation.length - 1]
      const endLocation = [lastCalc.latitude, lastCalc.longitude]

      return {
        name: this.routeName,
        startLocation: [
          this.calculation[0].latitude,
          this.calculation[0].longitude
        ],
        endLocation: endLocation,
        startTime: startTime,
        routeStops: routeStops
      }
    },

    nameReceived(name) {
      if (name) {
        this.routeName = name
        this.openSave = false
        if (this.selectedRoute) {
          this.updateRoute()
        } else {
          this.saveRoute()
        }
      }
    },

    getMinTime() {
      let momentObject = moment(this.chosenDate, 'MM/DD/YYYY')
      if (momentObject.isSame(moment(), 'day')) {
        return moment()
          .add(60, 'minutes')
          .format('HH:mm')
      }
      return '6:00'
    },

    showCalculateBtn() {
      return (
        isEmpty(this.selectedRoute) ||
        (!isEmpty(this.selectedRoute) && this.selectedRoute.state === 'saved')
      )
    },

    closeDropdown() {
      if (this.addtype === 'req-homes') {
        this.addtype = null
      }
    },

    clearHomes() {
      this.editMode = true
      this.selectedHousesMutable.map(house => {
        this.requestedTourToAdd.push({ ...house, checkbox: false })
      })
      this.selectedHousesMutable = []
      this.setStartLocation(null)
    },

    startProcess(msg) {
      this.setSelectedRouteLoading(true)
      this.waitForProgress = true
      this.spinnerText = msg
    },

    handlingErrorFunction() {
      this.waitForProgress = false
      this.spinnerText = null
      this.setSelectedRouteLoading(false)
    },

    newRoutePage() {
      this.clearHomes()
      this.setSelectedRoute(null)
      this.setVariablesToDefault()
    },

    requestShowing() {
      this.startProcess(
        'Sending requests to listing agents for confirmation of time slot'
      )

      genericPutRequestToApi(
        UpdateScheduleRouteUrl(
          this.selectedRoute.clientId,
          this.selectedRoute._id
        )
      ).then(response => {
        if (response.status === 200) {
          this.refreshData(response.data)
        } else if (response.status === 422) {
          this.handlingErrorFunction()
        }
      })
    },

    addClientInfoToRoute(routeDetails) {
      this.setSelectedRoute({
        ...routeDetails,
        clientName: this.selectedClient.name,
        clientId: this.selectedClient._id
      })
    },

    sendSchedule() {
      this.startProcess('Sending Confirmed schedule to the client')
      genericPutRequestToApi(
        ShareScheduledRouteUrl(
          this.selectedRoute.clientId,
          this.selectedRoute._id
        )
      ).then(response => {
        if (response.status === 200) {
          this.refreshData(response.data)
        }
      })
    },

    cancelRoute() {
      Object.assign(this.confirmationModal, {
        status: true,
        message: `Do you really want to delete this route? This process cannot be undone.`,
        positive: 'Delete route',
        negative: 'Cancel'
      })
    },

    // Since the backend is handling all of calculations so this might be temporary
    // Using it based on current requirements
    roundOffMinutes(interval, momentTime) {
      const roundedMinutes =
        Math.ceil(momentTime.minute() / interval) * interval
      let optimizedTime = momentTime
        .clone()
        .minute(roundedMinutes)
        .second(0)
        .utc()
        .format()
      return optimizedTime
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/scss/_animations.scss"

.wrapper
  padding: 2% 2%
  width: 100%
  display: grid
  grid-template-areas: "firstrow middlerow lastrow"
  grid-template-columns: 2fr 3fr 2fr
  grid-gap: 2%

.calendar_wrap
  grid-area: firstrow
  display: grid
  grid-template-areas: "calendar"
  grid-template-rows: 1fr

.calendar
  border: 1px solid $hwayzce
  grid-area: calendar
  padding: 5%

.typename
  grid-area: routename

.calendar-avatars
  font-size: 11px
  margin: 15px -10px
  .v-avatar
    // margin-right: 2px !important
    margin-left: 2px !important

.middle-blocks
  grid-area: middlerow
  display: grid
  height: 80vh
  grid-template-areas: "time" "location" "calculation"
  grid-template-columns: 1fr
  grid-template-rows: 1fr 1fr 4fr
  grid-row-gap: 3%
  &.single
    grid-template-areas: "calculation"
    grid-template-rows: 1fr
    height: 75vh

.choose_time, .choose_location, .calculate, .addHome, .type_name
  border: 1px solid $hwayzce
  text-align: center
  &.block-filled
    border: 1px solid $hwayzYellow

.block-heading
  position: relative
  margin-bottom: 8%
  &::after
    position: absolute
    content: ''
    left: 5%
    right: 5%
    bottom: -10px
    height: 1px
    background-color: $hwayzce

.calculate, .addHome, .type_name
  padding: 5%

.choose_time, .choose_location
  padding: calc(10% / 3) 5% 0

.calculate
  padding: 5% 0 2% 0
  &.small-padding
    padding: calc(10% / 3) 0 2% 0

.choose_time
  grid-area: time

.choose_location
  grid-area: location
  .v-text-field
    margin-top: 10px !important

  .start-end
    display: grid
    grid-template-areas: "start end"
    grid-template-columns: 1fr 1fr
    grid-column-gap: 5%
    align-items: center
    .start
      grid-area: start
    .end
      grid-area: end

.calculate
  grid-area: calculation

.two-entries
  display: grid
  grid-template-areas: "date time"
  grid-template-columns: 1fr 1fr
  grid-column-gap: 5%
  align-items: center
  margin-top: 10px

.date
  grid-area: date

.time
  grid-area: time

.rightside
  grid-area: lastrow
  display: grid
  grid-template-areas: "addHome" "map"
  grid-template-columns: 1fr
  grid-template-rows: 2fr 3fr
  grid-row-gap: 5%
  height: 85vh

.addHome
  grid-area: addHome
  position: relative

.home-add-type
  margin: 20px 0
  width: 100%
  justify-content: center
  background-color: $hwayzec !important

.home-add-type button
  color: #000 !important
  background-color: $hwayzec
  opacity: 1 !important

.map
  grid-area: map

.selectHomeSquare
  min-height: 400px
  width: 90%
  background-color: $hwayzec
  border-radius: 1%
  box-shadow: 2px 1px 20px $hwayzce
  position: absolute
  top: 50%
  z-index: 100

#addHomeToolbar
  padding: 2%

#addHomeToolbar button
  height: 40px

#client-name
  font-size: 14px
  width: 60%
  color: $hwayzBlack
  align-self: center !important

.favoritesList li
  padding: 5% !important
  margin: 2% !important
  text-align: left
  border-bottom: 1px solid $hwayzce
  cursor: pointer

.checkboxFavorite
  display: inline-flex !important
  float: right !important
  margin-top: 0 !important
  padding-top: 0 !important

.calc-btns
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  grid-template-areas: "clear calc save"
  margin: 2rem

.specBtn
  grid-area: save
  margin: 6px auto !important

.calcBtn
  grid-area: calc

.routeBtn
  padding: 0 10% !important
  font-size: 1.2rem
  width: 80%
  .v-btn__content
    text-transform: capitalize !important
    color: $hwayzWhite !important
    font-weight: 400 !important

.clearBtn
  grid-area: clear

.disabled
  @extend %disable-selection
  opacity: .7
  pointer-events: none

.calculation-spinner
  animation: loader 1s infinite
  display: flex

</style>
