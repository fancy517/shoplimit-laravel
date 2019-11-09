<template>
  <v-layout wrap>
    <v-flex xs12 md12 class="px-2">
      <div class="calendar__feature-pane">
        <v-select v-model="type" :items="typeOptions" label="Type" class="calendar_select" />
        <date-picker
          picker-label="Select Date:"
          :picker-date="start"
          class="calendar_date-picker"
          @changeDate="dateUpdater"
        />
        <div class="calendar__btn-navigation">
          <v-btn fab outline small @click="leftNavClicked">
            <v-icon dark>
              keyboard_arrow_left
            </v-icon>
          </v-btn>
          <v-btn fab outline small @click="rightNavClicked">
            <v-icon dark>
              keyboard_arrow_right
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-flex>
    <v-flex xs12 md12 class="pa-1">
      <div v-if="profileStatus === 'agent'" class="calendar-avatars">
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
        ref="calendar"
        :calendar-object="{start, type, now, display: profileStatus, routeModal: true}"
        @set-modal-values="setModalValues($event)"
      />

      <v-dialog v-model="showInfoModal" width="400" persistent>
        <event-info-modal :selected-date="selectedDate" @on-ok-clicked="onCloseEventModal" />
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import EventInfoModal from './EventInfoModal.vue'
import CalendarNewComponent from './CalendarNewComponent.vue'
import DatePicker from '../planner/plan-route/components/DatePicker.vue'
import refreshContent from '../mixins/refreshContent'
import colors from '../../scss/_colors.scss'

export default {
  components: { EventInfoModal, CalendarNewComponent, DatePicker },
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
      { text: 'Day', value: 'day', shift: '1', type: 'days' },
      { text: '4 Day', value: '4day', shift: '4', type: 'days' },
      { text: 'Week', value: 'week', shift: '1', type: 'weeks' },
      { text: 'Month', value: 'month', shift: '1', type: 'months' }
    ],
    events: [],
    editMode: false,
    calendarAvatars: [
      { type: 'saved', color: colors.saved },
      { type: 'pending', color: colors.pending },
      { type: 'confirmed', color: colors.confirmed },
      { type: 'scheduled', color: colors.scheduled },
      { type: 'completed', color: colors.completed }
    ]
  }),

  computed: {
    ...mapState('common', ['profileStatus'])
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
    },

    rightNavClicked() {
      const selectedTypeOption = this.typeOptions.find(option => option.value === this.type)
      this.start = moment(this.start, 'YYYY-MM-DD')
        .add(selectedTypeOption.shift, selectedTypeOption.type)
        .format('YYYY-MM-DD')
      this.$refs.calendar.navigateNext()
    },

    leftNavClicked() {
      const selectedTypeOption = this.typeOptions.find(option => option.value === this.type)
      this.start = moment(this.start, 'YYYY-MM-DD')
        .subtract(selectedTypeOption.shift, selectedTypeOption.type)
        .format('YYYY-MM-DD')
      this.$refs.calendar.navigatePrevious()
    }
  }
}
</script>

<style lang="sass" scoped>
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

.calendar-avatars
  margin-bottom: 1rem
  margin-top: 1rem

.pa-2

.calendar__feature-pane
  position: relative
  margin-bottom: 2rem

.calendar__btn-navigation
  display: table-cell
  width: 20%
  button
    color: $hwayzLink !important

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
