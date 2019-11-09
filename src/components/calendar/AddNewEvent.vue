<template>
  <v-card color="grey lighten-4">
    <v-toolbar
      color="grey darken-4"
      dark
      class="calendar-add-event__toolbar"
      card
    >
      <!-- Date Object present: event is new -->
      <template v-if="dateObject">
        <template v-if="dateObject.hasTime">
          New Event for {{ dateObject.date }} at {{ dateObject.time }}
        </template>
        <template v-else>
          Add New Event for {{ dateObject.date | displayDate }}
        </template>
      </template>
      <!-- Date Object is null: edit event mode -->
      <template v-else>
        Edit Event for {{ eventDetails.date | displayDate }}
      </template>
    </v-toolbar>
    <div class="calendar-add-event__event-body">
      <v-text-field
        class="calendar-add-event__input-field"
        v-model="getEventDetails.title"
        label="Enter a Title"
        :rules="contentRules"
        :type="'text'"
        required
      />
      <v-textarea
        class="calendar-add-event__input-field"
        v-model="getEventDetails.details"
        label="Enter details"
        :rules="contentRules"
        :type="'text'"
        required
      />
      <div class="calendar-add-event__timepicker">
        <v-time-picker
          v-model="getEventDetails.time"
          color="grey lighten-1"
        />
      </div>
      <div v-if="error.status" class="calendar-add-event__error-message">
        {{ error.text }}
      </div>
      <div class="calendar-add-event__btn-container">
        <v-btn
          round
          color="blue lighten-1"
          small
          @click="onSaveClicked"
        >
          Save
        </v-btn>
        <v-btn
          round
          color="red darken-3"
          small
          @click="closeModal"
        >
          Cancel
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  filters: {
    displayDate: value => {
      return moment(value, 'YYYY-MM-DD').format('Do MMMM, YYYY')
    }
  },
  props: {
    /**
     * The date object for the time or day for the empty block
     * whenever it is clicked on the calendar
     */
    dateObject: {
      type: Object,
      default: () => {
        return null
      }
    },

    /**
     * The calendar event object that is clicked to view or edit
     */
    eventDetails: {
      type: Object,
      default: () => {
        return null
      }
    }
  },

  data() {
    return {
      // event: {
      //   title: this.eventDetails ? this.eventDetails.title : null,
      //   details: this.eventDetails ? this.eventDetails.details : null,
      //   time: this.eventDetails ? this.eventDetails.time : this.dateObject.time
      // },
      error: {
        status: false,
        text: null
      },
      contentRules: [v => !!v || "Please, don't leave this empty"]
    }
  },

  computed: {
    getEventDetails() {
      console.log(this.eventDetails)
      return this.eventDetails
    }
  },

  methods: {
    onSaveClicked() {
      if (this.getEventDetails.title && this.getEventDetails.details) {
        this.$emit('save-add-event-modal', this.getEventDetails)
        this.error.status = false
        this.error.text = null
        this.resetData()
      } else {
        this.error.status = true
        this.error.text = 'Please fill all the fields'
      }
    },

    closeModal() {
      this.resetData()
      this.$emit('close-add-event-modal')
    },

    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>
<style lang="sass" scoped>
.calendar-add-event__toolbar .v-toolbar__content
  height: 4rem !important

.calendar-add-event__title
  font-size: $hwayzFont1rem5: 1.5rem !important

.calendar-add-event__input-title
  background: transparent
  outline: none
  border: none
  border-bottom: 0.1rem solid $hwayzBorder

.calendar-add-event__event-body
  padding: 1rem !important
  text-align: left !important

.calendar-add-event__event-details
  display: flex
  width: 100%
  justify-content: space-between
  align-items: center
  height: 4rem

.calendar-add-event__event-details span
  font-size: $hwayzFont1rem3

.calendar-add-event__input-details
  width: 100%
  background: $hwayzBorder
  padding: 0.5rem 1rem
  border-radius: 2rem
  outline: none !important
  border: none
  font-size: $hwayzFont1rem3

.calendar-add-event__timepicker
  margin-top: 2rem
  text-align: center

.calendar-add-event__error-message
  font-size: $hwayzFont1rem1
  margin: 2rem
  text-align: center
  color: darkred

.calendar-add-event__btn-container
  text-align: center !important
  padding-bottom: 1rem

.calendar-add-event__card .calendar-add-event__btn-container .v-btn--small
  font-size: 1.2rem !important
  height: 2.8rem !important
  padding: 0rem !important

@media only screen and (min-width: 960px)
  .calendar-add-event__toolbar .v-toolbar__content
    height: 5rem !important

  .calendar-add-event__title
    font-size: $hwayzFont1rem6 !important

  .calendar-add-event__event-body
    padding: 2rem !important

  .calendar-add-event__btn-container
    padding-bottom: 2rem

  .calendar-add-event__card .calendar-add-event__btn-container .v-btn--small
    font-size: $hwayzFont1rem3 !important
    height: 3.2rem !important
</style>
