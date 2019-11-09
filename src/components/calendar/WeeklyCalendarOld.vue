<template>
  <v-layout wrap>
    <v-flex xs12 md3 class="px-2">
      <div class="calendar__feature-pane">
        <div class="calendar__btn-navigation">
          <v-btn
            fab
            outline
            small
            color="blue lighten-1"
            @click="$refs.calendar.prev()"
          >
            <v-icon dark>
              keyboard_arrow_left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            outline
            small
            color="blue lighten-1"
            @click="$refs.calendar.next()"
          >
            <v-icon dark>
              keyboard_arrow_right
            </v-icon>
          </v-btn>
        </div>
        <v-select v-model="type" :items="typeOptions" label="Type" />
        <v-menu
          ref="startMenu"
          v-model="startMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="start"
          transition="scale-transition"
          min-width="300px"
          lazy
          offset-y
          full-width
        >
          <v-text-field
            slot="activator"
            v-model="start"
            label="Start Date"
            prepend-icon="event"
            readonly
          />
          <v-date-picker v-model="start" no-title scrollable>
            <v-spacer />
            <v-btn flat color="blue lighten-1" @click="startMenu = false">
              Cancel
            </v-btn>
            <v-btn flat color="blue lighten-1" @click="$refs.startMenu.save(start)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          v-if="hasEnd"
          ref="endMenu"
          v-model="endMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="end"
          transition="scale-transition"
          min-width="300px"
          lazy
          offset-y
          full-width
        >
          <v-text-field
            slot="activator"
            v-model="end"
            label="End Date"
            prepend-icon="event"
            readonly
          />
          <v-date-picker v-model="end" no-title scrollable>
            <v-spacer />
            <v-btn flat color="blue lighten-1" @click="endMenu = false">
              Cancel
            </v-btn>
            <v-btn flat color="blue lighten-1" @click="$refs.endMenu.save(end)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-menu
          ref="nowMenu"
          v-model="nowMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="now"
          transition="scale-transition"
          min-width="300px"
          lazy
          offset-y
          full-width
        >
          <v-text-field
            slot="activator"
            v-model="now"
            label="Today"
            prepend-icon="event"
            readonly
          />
          <v-date-picker v-model="now" no-title scrollable>
            <v-spacer />
            <v-btn flat color="blue lighten-1" @click="nowMenu = false">
              Cancel
            </v-btn>
            <v-btn flat color="blue lighten-1" @click="$refs.nowMenu.save(now)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <!-- <v-select v-model="weekdays" :items="weekdaysOptions" label="Weekdays" /> -->
        <v-text-field
          v-if="type === 'custom-weekly'"
          v-model="minWeeks"
          label="Minimum Weeks"
          type="number"
        />
        <v-select
          v-if="hasIntervals"
          v-model="intervals"
          :items="intervalsOptions"
          label="Intervals"
        />
        <v-select
          v-if="type === 'custom-daily'"
          v-model="maxDays"
          :items="maxDaysOptions"
          label="# of Days"
        />
      </div>
    </v-flex>
    <v-flex xs12 md9 class="px-2">
      <v-calendar
        ref="calendar"
        v-model="start"
        color="blue lighten-1"
        :type="type"
        :start="start"
        :end="end"
        :min-weeks="minWeeks"
        :max-days="maxDays"
        :now="now"
        :weekdays="weekdays"
        :first-interval="intervals.first"
        :interval-minutes="intervals.minutes"
        :interval-count="intervals.count"
        :interval-height="40"
        :interval-style="intervalStyle"
        :show-interval-label="showIntervalLabel"
        @click:date="dateClicked"
        @click:day="dayClicked"
        @click:interval="onIntervalLabelClicked"
        @click:time="onTimeIntervalClicked"
      >
        <template slot="day" slot-scope="{ date }">
          <template v-for="event in eventsMap[date]">
            <div
              :key="event.id"
              class="calendar__event-container"
              @click="onCalendarEditEvent(event)"
            >
              {{ event.title }}
            </div>
          </template>
        </template>

        <template slot="dayHeader" slot-scope="{ date }">
          <template v-for="event in eventsMap[date]">
            <div
              v-if="!event.time"
              :key="event.id"
              class="calendar__event-container"
              @click="onCalendarEditEvent(event)"
            >
              {{ event.title }}
            </div>
          </template>
        </template>

        <!-- the timely events -->
        <template slot="dayBody" slot-scope="{ date, timeToY }">
          <template v-for="event in eventsMap[date]">
            <div
              v-if="event.time"
              :key="event.id"
              class="calendar__time-event-container"
              :style="{top: timeToY(event.time) + 'px'}"
              @click="onCalendarEditEvent(event)"
            >
              {{ event.details || 'Add Details' }}
            </div>
          </template>
        </template>
      </v-calendar>

      <template v-if="selectedEvent">
        <v-dialog
          v-model="createNewEvent"
          :width="modal.small_width"
          :max-width="modal.small_maxWidth"
          persistent
        >
          <add-new-event
            :event-details="selectedEvent"
            @close-add-event-modal="onCloseEventModal"
            @save-add-event-modal="addNewEvent"
          />
        </v-dialog>
      </template>

      <template v-else-if="selectedDate && !selectedDate['past']">
        <v-dialog v-model="createNewEvent" max-width="400" persistent>
          <add-new-event
            :date-object="selectedDate"
            @close-add-event-modal="onCloseEventModal"
            @save-add-event-modal="addNewEvent"
          />
        </v-dialog>
      </template>

      <v-dialog v-model="showInfoModal" width="400" persistent>
        <event-info-modal @on-ok-clicked="onCloseEventModal" />
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import AddNewEvent from './AddNewEvent.vue'
import EventInfoModal from './EventInfoModal.vue'
// import { isEmpty, arrayToObject } from '../../utils/generalUtils'
import {
  genericPutRequestToApi
} from '../../utils/genericRequests'
import {
  RetrieveUpdateViewingTimesUrl
} from '../../utils/agentUrls'
import refreshContent from '../mixins/refreshContent'
import { getPropertyById } from '../../services/propertiesService'

const weekdaysDefault = [0, 1, 2, 3, 4, 5, 6]

const intervalsDefault = {
  first: 0,
  minutes: 60,
  count: 24
}

const stylings = {
  past(interval) {
    return {
      backgroundColor: interval.past ? 'rgba(0,0,0,0.05)' : undefined
    }
  }
}

export default {
  components: { AddNewEvent, EventInfoModal },
  mixins: [refreshContent],

  data: () => ({
    startMenu: false,
    start: moment().format('YYYY-MM-DD'),
    endMenu: false,
    end: moment()
      .add(15, 'days')
      .format('YYYY-MM-DD'),
    nowMenu: false,
    minWeeks: 1,
    now: null,
    type: 'month',
    createNewEvent: false,
    showInfoModal: false,
    selectedDate: null,
    selectedEvent: null,
    eventArray: [],
    eventsMap: {},
    typeOptions: [
      { text: 'Day', value: 'day' },
      { text: '4 Day', value: '4day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' },
      { text: 'Custom Daily', value: 'custom-daily' },
      { text: 'Custom Weekly', value: 'custom-weekly' }
    ],
    weekdays: weekdaysDefault,
    weekdaysOptions: [
      { text: 'Sunday - Saturday', value: weekdaysDefault },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] }
    ],
    intervals: intervalsDefault,
    intervalsOptions: [
      { text: 'Default', value: intervalsDefault },
      {
        text: 'Workday',
        value: { first: 16, minutes: 30, count: 20 }
      }
    ],
    maxDays: 7,
    maxDaysOptions: [
      { text: '7 days', value: 7 },
      { text: '5 days', value: 5 },
      { text: '4 days', value: 4 },
      { text: '3 days', value: 3 }
    ],
    color: 'blue lighten-1',
    events: [],
    editMode: false
  }),

  computed: {
    /**
     * Mapping Active agent's data from store
     */
    ...mapGetters('agent', ['getActiveAgentData', 'getAgentCalendarEvents']),
    ...mapState('style', ['modal']),

    intervalStyle() {
      return stylings['past']
    },
    hasIntervals() {
      return (
        this.type in
        {
          week: 1,
          day: 1,
          '4day': 1,
          'custom-daily': 1
        }
      )
    },

    hasEnd() {
      return (
        this.type in
        {
          'custom-weekly': 1,
          'custom-daily': 1
        }
      )
    }
  },

  watch: {
    eventArray(newValue, oldValue) {
      // this.eventsMap = arrayToObject(newValue, 'date')
      // console.log(this.eventsMap)

      const temp = newValue.reduce((obj, item) => {
        obj[item.date] = obj[item.date] || []
        obj[item.date].push(item)
        return obj
      }, {})
      this.eventsMap = temp
      console.log(temp)
    }
  },

  created() {
    if (this.getActiveAgentData) {
      this.getActiveAgentData.propertiesOfInterest.map(property => {
        property.viewings.forEach(viewing => {
          if (viewing.scheduled) {
            getPropertyById(viewing.propertyId).then(response => {
              if (response.data) {
                const eventDetail = this.getEventDetail(
                  viewing.workflowState,
                  response.data['Address'],
                  moment(viewing.scheduled).format('hh:mma')
                )
                this.eventArray.push({
                  id: viewing.id,
                  clientId: property.parent._id,
                  propertyId: viewing.propertyId,
                  title: eventDetail.title,
                  details: eventDetail.detail,
                  date: moment(viewing.scheduled).format('YYYY-MM-DD'),
                  time: moment(viewing.scheduled).format('HH:mm'),
                  open: false
                })
              }
              console.log(this.eventArray)
            })
          }
        })
      })
    }
  },

  /**
   * Retrieve data and formulate to display as calendar events
   */
  mounted() {
    this.$refs.calendar.scrollToTime('03:00')
  },

  methods: {
    /**
     * Mapping mutation to set retrieved agent data
     */
    ...mapMutations('agent', {
      setActiveAgentData: 'SET_ACTIVE_AGENT_DATA',
      setAgentCalendarEvents: 'SET_AGENT_CALENDAR_EVENTS'
    }),

    /**
     * Mapping agent auth login functionality with the component
     */
    ...mapActions('agent', ['getAgentHomes']),

    getEventDetail(state, propertyName, scheduledTime = null) {
      switch (state) {
        case 'agentConfirm':
          return {
            title: 'Agent Confirmation',
            detail: `Requires Agent's Confirmation for ${propertyName}`
          }
        case 'buyerConfirm':
          return {
            title: 'Buyer Confirmation',
            detail: `Requires Buyer's Confirmation for ${propertyName}`
          }
        case 'scheduled':
          return {
            title: 'Scheduled Property',
            detail: `Property ${propertyName} is scheduled to be viewed at ${scheduledTime}`
          }
        case 'viewed':
          return {
            title: 'Viewed Property',
            detail: `The property ${propertyName} is viewed at ${scheduledTime}`
          }
        default:
          return {
            title: 'Newly Added',
            detail: `Property ${propertyName} has been added to client's properties of interest. Not scheduled yet`
          }
      }
    },

    showIntervalLabel(interval) {
      return interval.minute === 0
    },
    dayClicked(dayObject) {
      if (!this.editMode) {
        this.setModalValues(dayObject)
      }
    },
    dateClicked(dateObject) {
      this.setModalValues(dateObject)
    },

    /**
     * Handles all the click events when a calendar event
     * clicked and opens the edit modal
     * @public
     */
    onCalendarEditEvent(calendarEvent) {
      this.editMode = true
      this.createNewEvent = true
      this.selectedDate = null
      this.selectedEvent = calendarEvent
    },

    /**
     * Handles the click on a particular interval label
     * in a day or week view
     * @public
     */
    onIntervalLabelClicked(timeObject) {
      console.log('[WeeklyCalendar.vue] - interval label', timeObject)
      this.setModalValues(timeObject)
    },

    /**
     * Handles the click on a particular time interval
     * for a day in calendar day or week view
     * @public
     */
    onTimeIntervalClicked(timeObject) {
      if (!this.editMode) {
        console.log('[WeeklyCalendar.vue] - within time interval', timeObject)
        this.setModalValues(timeObject)
      }
    },

    /**
     * Common method that sets the selected date object
     * and associated modal listeners required
     * @public
     */
    setModalValues(calendarObject) {
      this.start = calendarObject['date']
      this.selectedDate = calendarObject
      this.showInfoModal = calendarObject['past']
      this.createNewEvent = !calendarObject['past']
      this.selectedEvent = null
    },

    /**
     * Listen to 'save' clicked on the event modal
     * determines whether it was from add or edit mode
     * and redirects based on that information
     */
    addNewEvent(newEventValues) {
      console.log(newEventValues, this.editMode)
      if (this.editMode) {
        this.updateEvent(newEventValues)
      } else {
        let eventLength = this.events.length + 1
        let newEvent = Object.assign(newEventValues, {
          id: eventLength.toString(),
          date: this.selectedDate.date,
          open: false
        })
        this.events.push(newEvent)
      }
      this.onCloseEventModal()
    },

    onCloseEventModal() {
      this.createNewEvent = false
      this.showInfoModal = false
      this.editMode = false
      this.selectedDate = null
      this.selectedEvent = null
    },

    /**
     * Will send request to update the scheduling for
     * selected calendar event
     *
     * @public
     */
    updateEvent(enteredEvent) {
      console.log('update', enteredEvent)
      if (enteredEvent) {
        console.log(this.calculateDateTime(enteredEvent))
        genericPutRequestToApi(
          RetrieveUpdateViewingTimesUrl(
            enteredEvent.clientId,
            enteredEvent.propertyId,
            enteredEvent.id,
            this.calculateDateTime(enteredEvent)
          )).then(response => {
          if (response.status === 200) {
            this.getAgentData()
          }
        })
      }
      // this.events = this.events.map(event => {
      //   if (event.id === this.selectedEvent.id) {
      //     Object.assign(event, {
      //       title: enteredEvent.title,
      //       details: enteredEvent.details,
      //       time: enteredEvent.time
      //     })
      //   }
      //   return event
      // })
    },

    calculateDateTime({ date, time }) {
      const dateTime = new Date(date + ' ' + time)
      return moment(dateTime).format()
    }
  }
}
</script>

<style scoped lang='sass'>
.v-calendar,
.calendar__feature-pane {
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3) !important;
  padding: 2rem !important;
  border-radius: 1rem;
}

.v-calendar {
  min-height: 400px !important;
  max-height: 800px !important;
}

.calendar__event-container {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: grey;
  color: $hwayzBorder;
  width: 100%;
  font-size: $hwayzFont1rem1;
  font-weight: 300;
  padding: 0.1rem 0.2rem;
  cursor: pointer;
  margin-bottom: 0.2rem;
  position: relative;
  border-radius: 1rem;
}

.calendar__time-event-container {
  position: absolute;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: $hwayzCalendarEventContainer;
  color: $hwayzBorder;
  border-radius: 1rem;
  max-width: 100%;
  padding: 0.1rem 0.5rem;
  height: 100%;
  font-size: 1rem;
  cursor: pointer;
  left: 0;
  line-height: 2rem;
  height: 2rem !important;
}

.calendar__feature-pane {
  position: relative;
  margin-bottom: 2rem;
}

.calendar__btn-navigation {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  padding: 0rem 1rem;
}

@media only screen and (min-width: 600px) {
  .v-calendar {
    min-height: 500px !important;
  }
}

@media only screen and (min-width: 960px) {
  .v-calendar,
  .calendar__feature-pane {
    min-height: 600px !important;
  }

  .calendar__feature-pane {
    margin-bottom: 0rem;
  }
}
</style>
