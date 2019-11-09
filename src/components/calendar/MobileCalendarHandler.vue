<template>
  <div id="mainCalendar">
    <v-container class="pa-0" align-content-start>
      <v-layout wrap>
        <v-flex id="currentDate" xs12>
          <v-expansion-panel v-model="datePanel" expand dark>
            <v-expansion-panel-content
              id="mobileFieldSelectedDate"
              :ripple="datePanel.length === 0 && allRoutesShowing"
              :readonly="datePanel.length !== 0 || !allRoutesShowing"
              hide-actions
            >
              <template v-slot:header>
                <v-text-field
                  dark
                  color="white"
                  :value="computedDateFormattedMomentjs"
                  :disabled="!allRoutesShowing"
                  prepend-icon="event"
                  readonly
                />
              </template>
              <v-card>
                <v-date-picker
                  id="mobileDatePicker"
                  v-model="date"
                  color="grey"
                  light
                  full-width
                  no-title
                >
                  <v-layout>
                    <v-flex>
                      <v-btn color="grey" block flat large @click="clearDate">
                        Cancel
                      </v-btn>
                    </v-flex>
                    <v-flex>
                      <v-btn color="grey" block flat large @click="closeDatePanel">
                        OK
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-date-picker>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-container>

    <div id="cont">
      <div v-if="datePanel.length !== 0" id="blocker" />
      <transition name="slide-left">
        <all-routes v-if="allRoutesShowing" id="allRoutes" @click-to-expand="expandRoute" />
      </transition>

      <transition name="slide-right">
        <single-route v-if="!allRoutesShowing" id="singleRoute" />
      </transition>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapMutations } from 'vuex'
import AllRoutes from './MobileAllRoutes.vue'
import SingleRoute from './MobileSingleRoute.vue'

export default {
  components: { AllRoutes, SingleRoute },

  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    datePanel: [],

    picker: new Date().toISOString().substr(0, 10),
    currentDate: 'Friday, 12.03.19',
    datePickerShowing: false,
    todayRoutes: 4,
    schedule: [
      { id: 0, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 },
      { id: 1, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 },
      { id: 2, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 },
      { id: 3, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 }
    ]
  }),

  computed: {
    ...mapState('common', ['profileStatus']),
    ...mapState('mobile', ['allRoutesShowing']),

    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
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
    }
  },

  methods: {
    ...mapMutations('mobile', {
      setAllRoutesShowing: 'SET_ALL_ROUTES_SHOWING'
    }),

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

    // MINE
    clearDate() {
      this.date = new Date().toISOString().substr(0, 10)
      this.closeDatePanel()
    },

    closeDatePanel() {
      this.datePanel = []
    },

    expandRoute() {
      console.log(this.datePanel)

      // this.closeDatePanel()
      if (this.datePanel.length === 0) {
        this.setAllRoutesShowing(false)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
#mainCalendar
  background-color: #fff
  height: 100vh

#currentDate
  .v-expansion-panel
    box-shadow: none

#allRoutes, #singleRoute
  position: absolute

.slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active,.slide-down-enter-active, .slide-down-leave-active
  transition: all 0.4s;

.slide-right-enter, .slide-right-leave-to
  transform: translate(100%, 0);

.slide-left-enter, .slide-left-leave-to
  transform: translate(-100%, 0);

.slide-down-enter, .slide-down-leave-to
  transform: translate(0, 100%);

#cont
  position: relative
  #blocker
    position: absolute
    background-color: #00000080
    z-index: 100
    height: 100%
    width: 100%
</style>
