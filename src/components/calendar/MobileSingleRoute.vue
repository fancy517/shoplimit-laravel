<template>
  <v-layout id="calendarDayView" wrap class="px-3 pt-3">
    <v-layout id="calendarDayViewHeader">
      <v-flex xs6 class="text-xs-left pl-3 py-2">
        Address
      </v-flex>
      <v-flex xs6 class="text-xs-right py-2">
        Time
      </v-flex>
    </v-layout>
    <v-flex v-for="(event, index) in calendar" :key="event.id" xs12>
      <v-layout wrap align-center class="row-calendar mt-3">
        <v-flex xs6 class="text-xs-left mb-3">
          {{ index+1 }}.
          {{ event.address }}
        </v-flex>
        <v-flex xs6 class="text-xs-right mb-3">
          {{ event.time }}
        </v-flex>
        <v-flex
          v-show="event.feedback !== null"
          class="data-feedback text-xs-left pl-3 mb-3"
          :class="{'feedback-excellent': event.feedback >= 75, 'feedback-bad': event.feedback < 40 }"
        >
          {{ event.feedback }}%
        </v-flex>
        <v-flex class="text-xs-right mb-3">
          <v-btn
            v-show="event.feedback === null"
            class="button-toolbar white--text hwayzSun"
            ripple
            round
          >
            PROVIDE FEEDBACK
          </v-btn>
          <v-btn
            v-show="event.feedback !== null"
            class="button-toolbar white--text hwayzTeal"
            ripple
            round
          >
            REVISE FEEDBACK
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import refreshContent from '../mixins/refreshContent'
import { mapState } from 'vuex'

export default {
  mixins: [refreshContent],

  data: () => ({
    startMenu: false,
    start: moment().format('YYYY-MM-DD'),
    endMenu: false,
    nowMenu: false,
    now: null,
    type: 'day',
    showInfoModal: false,
    selectedDate: null,
    typeOptions: [
      { text: 'Day', value: 'day' },
      { text: '4 Day', value: '4day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' }
    ],
    events: [],
    editMode: false,
    calendar: [
      { id: 0, address: '123 Main St', time: '2.00PM', feedback: 75 },
      { id: 1, address: '124 Main St', time: '4.00PM', feedback: null },
      { id: 2, address: '125 Main St', time: '6.00PM', feedback: 45 },
      { id: 3, address: '126 Main St', time: '8.00PM', feedback: 85 },
      { id: 4, address: '127 Main St', time: '10.00PM', feedback: null }
    ]
  }),

  computed: {
    ...mapState('common', ['profileStatus']),

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
    }
  },

  methods: {
    /**
     * Common method that sets the selected date object
     * and associated modal listeners required
     * @public
     */
    setModalValues(calendarObject) {
      this.start = calendarObject.date
      this.selectedDate = calendarObject
      this.showInfoModal = true
    },

    onCloseEventModal() {
      this.showInfoModal = false
      this.selectedDate = null
    },

    dateUpdater(dateFromChild) {
      this.start = moment(dateFromChild, 'MM/DD/YYYY').format('YYYY-MM-DD')
    },

    changeTodayDate(dateFromChild) {
      this.now = moment(dateFromChild, 'MM/DD/YYYY').format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="sass" scoped>
// MY STYLE
#calendarDayView
  color: $hwayzBlack
  background-color: #fff;

#calendarDayViewHeader
  // font-weight: bold
  font-size: 1.8rem;
  border-bottom: 2px solid $hwayzBlack

.row-calendar
  font-size: 1.8rem
  border-bottom: 2px solid $hwayzLightGray

.button-toolbar
  cursor: pointer
  font-size: 1.5rem !important
  font-weight: bold
  width: 16rem
  margin: 0
  i
    color: #fff !important

.data-feedback
  font-size: 3.5rem;

.feedback-excellent
  color: $hwayzGreen

.feedback-bad
  color: $hwayzRed

.hwayzSun
  background-color: $hwayzSun !important

.hwayzTeal
  background-color: $hwayzTeal !important

// WAS HERE
.v-calendar,
.calendar__feature-pane
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3) !important
  padding: 2rem !important
  border-radius: 1rem
  height: 50px !important
  display: table
  width: 100%
  table-layout: fixed
  border-spacing: 10px
.calendar_select
  width: 50%
  display: table-cell
.v-calendar
  min-height: 100px !important
  max-height: 800px !important

.calendar__feature-pane
  position: relative
  margin-bottom: 2rem

.calendar__btn-navigation
  display: table-cell
  width: 20%
  button
    color: #42a5f5 !important

@media only screen and (min-width: 600px)
  .v-calendar
    min-height: 500px !important

@media only screen and (min-width: 960px)
  .v-calendar,
  .calendar__feature-pane
    min-height: 50px !important

  .calendar__feature-pane
    margin-bottom: 0rem

</style>
