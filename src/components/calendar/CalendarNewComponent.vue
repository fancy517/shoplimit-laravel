<template>
  <div v-if="calendarObject">
    <alert-message
      :alert-message="alertObject.message"
      :alert-value="alertObject.value"
      :alert-type="alertObject.type"
    />
    <v-calendar
      ref="calendarComp"
      v-model="startDate"
      color="blue lighten-1"
      :type="calendarObject.type"
      :start="calendarObject.start"
      :now="calendarObject.now"
      :interval-style="intervalStyle"
      :show-interval-label="showIntervalLabel"
      interval-height="40"
      first-interval="6"
      interval-count="16"
      :class="calendarObject.class"
    >
      <template slot="day" slot-scope="{ date }">
        <template v-for="event in eventsMap[date]">
          <div
            :key="event.id"
            class="month-event-view"
            :class="[`b-${event.state}`]"
            :style="{height: '20px'}"
            @click="onCalendarEventClicked(event)"
          >
            <span>{{ event.clientName }}</span>
            - {{ event.name }}
          </div>
        </template>
      </template>

      <template slot="dayHeader" slot-scope="{ date }">
        <template v-for="event in eventsMap[date]">
          <div
            v-if="!event.time"
            :key="event.id"
            class="day-event-view"
            @click="onCalendarEventClicked(event)"
          >
            <span>{{ event.clientName }}</span>
            - {{ event.name }}
          </div>
        </template>
      </template>

      <!-- the timely events -->
      <template slot="dayBody" slot-scope="{ date, timeToY }">
        <template v-for="event in eventsMap[date]">
          <div
            v-if="event.time"
            :key="event.id"
            class="day-event-view"
            :class="[{'single' : calendarObject.type === 'day'}, `b-${event.state}`]"
            :style="{top: timeToY(event.time) + 'px', height: event.timeDiff * 2 / 3 + 'px'}"
            @click="onCalendarEventClicked(event)"
          >
            <div>
              {{ calendarObject.type === "day" ? 'Client:' : null }}
              <span>{{ event.clientName }}</span>
            </div>
            {{ event.name }}
          </div>
        </template>
      </template>
    </v-calendar>
    <v-dialog
      v-if="selectedRouteData"
      v-model="displayRouteDetails"
      :width="modal.xlarge_width"
      :max-width="modal.xlarge_maxWidth"
      persistent
    >
      <route-details-modal
        :route-details="selectedRouteData"
        @close-modal="closeModal()"
        @revise-route="reviseRoute"
        @refresh-data="refreshData"
      />
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions, mapMutations } from 'vuex'
import refreshContent from '../mixins/refreshContent'
import refreshClientData from '../mixins/refreshClientData'
import {
  groupArrayByKey,
  sortObjectArrayByKey
} from '../../utils/generalUtils'
import RouteDetailsModal from '../modals/RouteDetailsModal.vue'
import AlertMessage from '../uiUtils/AlertMessage.vue'

const stylings = {
  past(interval) {
    return {
      backgroundColor: interval.past ? 'rgba(0, 0, 0, 0.05)' : undefined
    }
  }
}

export default {
  components: { RouteDetailsModal, AlertMessage },
  mixins: [refreshContent, refreshClientData],
  props: {
    calendarObject: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      displayRouteDetails: false,
      selectedRouteData: null,
      startDate: this.calendarObject.start,
      alertObject: {
        type: 'success',
        value: false,
        message: ''
      }
    }
  },

  computed: {
    /**
     * Mapping Active agent's data from store
     */
    ...mapState('style', ['modal']),
    ...mapState('agent', ['agentData']),
    ...mapState('client', ['clientData']),
    ...mapState('common', ['routeData']),

    intervalStyle() {
      return stylings['past']
    },

    eventsMap() {
      const eventsArray = this.generateCalendarEventArray(this.routeData)
      return groupArrayByKey(eventsArray, 'date')
    }
  },

  watch: {
    agentData(newValue, oldValue) {
      if (newValue && this.calendarObject.display === 'agent') {
        this.getRouteData({ data: newValue, type: 'agent' })
      }
    },

    clientData(newValue, oldValue) {
      if (newValue && this.calendarObject.display === 'client') {
        this.getRouteData({ data: newValue, type: 'client' })
      }
    },

    calendarObject: {
      handler: function(newValue, oldValue) {
        if (newValue.start) {
          this.startDate = newValue.start
        }
      },
      deep: true
    }
  },

  created() {
    this.generateRouteData()
  },

  mounted() {
    this.$refs.calendarComp.scrollToTime('03:00')
  },

  methods: {
    ...mapActions('common', ['getRouteData']),
    ...mapActions('agent', ['setSearchedClient']),
    ...mapMutations('home', {
      setActiveRoute: 'SET_ACTIVE_ROUTE'
    }),
    ...mapMutations('common', {
      setSelectedRoute: 'SET_SELECTED_ROUTE',
      setSelectedRouteLoading: 'SET_SELECTED_ROUTE_LOADING'
    }),

    navigatePrevious() {
      this.$refs.calendarComp.prev()
    },

    navigateNext() {
      this.$refs.calendarComp.next()
    },

    showIntervalLabel(interval) {
      return interval.minute === 0
    },

    generateCalendarEventArray(routeData) {
      let eventsArray = []
      routeData.map(route => {
        const routeTime = moment(route.startTime)
        if (!routeTime.isBefore(moment().format('YYYY-MM-DD'))) {
          let timeFrom = null
          let timeTo = null
          let timeDiff = null
          if (route.routeStops.length > 1) {
            const anotherTemp = sortObjectArrayByKey(
              route.routeStops,
              'arrivalTime'
            )
            timeFrom = moment(anotherTemp[0].arrivalTime)
            timeTo = moment(anotherTemp[anotherTemp.length - 1].arrivalTime)
            timeDiff = timeTo.diff(
              timeFrom < routeTime ? timeFrom : routeTime,
              'minutes'
            )
          } else if (route.routeStops.length > 0) {
            timeFrom = moment(route.routeStops[0].arrivalTime).format('HH:mm')
            timeDiff = '60'
          }

          eventsArray.push({
            ...route,
            date: routeTime.format('YYYY-MM-DD'),
            time: routeTime.format('HH:mm'),
            timeDiff,
            open: false
          })
        }
      })
      return eventsArray
    },

    /**
     * Handles the click on any part of a calendar date or time
     * @public
     */
    // onCalendarClicked(calendarObject) {
    //   this.$emit('set-modal-values', calendarObject)
    // },

    onCalendarEventClicked(event) {
      if (this.calendarObject.routeModal) {
        this.displayRouteDetails = true
        this.selectedRouteData = event
      } else {
        this.$emit('on-calendar-clicked', event)
      }
    },

    closeModal() {
      this.displayRouteDetails = false
      this.selectedRouteData = null
    },

    calculateDateTime({ date, time }) {
      const dateTime = new Date(date + ' ' + time)
      return moment(dateTime).format()
    },

    reviseRoute() {
      const clientAssociatedWithRoute = this.agentData.clients.find(
        client => client._id === this.selectedRouteData.clientId
      )
      this.setSearchedClient(clientAssociatedWithRoute)
      this.setSelectedRoute(this.selectedRouteData)
      this.setSelectedRouteLoading(true)
      this.$router.push({ name: 'plan-route' })
      this.setActiveRoute('plan-route')
    },

    refreshData(alertParams) {
      if (this.calendarObject.display === 'agent') {
        this.getAgentData()
      } else if (this.calendarObject.display === 'client') {
        this.getClientData()
      }
      this.displayRouteDetails = false
      Object.assign(this.alertObject, { ...alertParams })
    },

    generateRouteData() {
      if (this.calendarObject.display === 'agent') {
        if (this.agentData) {
          this.getRouteData({ data: this.agentData, type: 'agent' })
        }
      } else if (this.calendarObject.display === 'client') {
        if (this.clientData) {
          this.getRouteData({ data: this.clientData, type: 'client' })
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.v-calendar,
.calendar__feature-pane
  padding: 2rem !important
  border-radius: 1rem

.v-calendar.plan-route,
.calendar__feature-pane.plan-route
  padding: 1rem !important

.v-calendar
  min-height: 400px !important
  max-height: 800px !important
  &.plan-route
    max-height: 700px !important

.month-event-view
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  color: $hwayzBorder
  width: 100%
  font-size: $hwayzFont1rem
  font-weight: 300
  padding: 0.1rem 0.2rem
  cursor: pointer
  margin-bottom: 0.2rem
  position: relative
  span
    text-transform: uppercase

.day-event-view
  position: absolute
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  color: $hwayzBorder
  border-radius: 1rem
  width: 96%
  font-size: 1.2rem
  cursor: pointer
  margin: 0 auto
  padding: .5rem 1rem
  left: 50%
  min-height: 50px
  text-align: left
  transform: translateX(-50%)
  &.single
    min-height: 60px
    font-size: $hwayzFont1rem6
    display: flex
    flex-flow: column
    justify-content: center
    align-items: center
  span
    text-transform: uppercase

.plan-route .day-event-view.single
  font-size: $hwayzFont1rem3 !important

.calendar__feature-pane
  position: relative
  margin-bottom: 2rem

.calendar__btn-navigation
  width: 100%
  display: flex
  justify-content: space-between
  margin-bottom: 3rem
  padding: 0rem 1rem

.b-saved
  background-color: $saved
.b-pending
  background-color: $hwayzYellow
.b-scheduled
  background-color: $hwayzGreen
.b-confirmed
  background-color: $hwayzBlue

@media only screen and (min-width: 600px)
  .v-calendar
    min-height: 500px !important

@media only screen and (min-width: 960px)
  .v-calendar,
  .calendar__feature-pane
    min-height: 600px !important

  .calendar__feature-pane
    margin-bottom: 0rem
</style>
