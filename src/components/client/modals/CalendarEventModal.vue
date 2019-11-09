<template>
  <v-card color="grey lighten-4">
    <v-toolbar
      color="grey darken-4"
      dark
      class="calendar-event-modal__toolbar"
      card
    >
      Event for {{ eventDetails.date | displayDate }}
    </v-toolbar>
    <div class="calendar-event-modal__body">
      <v-layout wrap>
        <v-flex xs12 class="calendar-event-modal__title">
          {{ eventDetails.title }}
        </v-flex>
        <v-flex xs12 class="calendar-event-modal__details">
          {{ eventDetails.details }}
        </v-flex>
      </v-layout>
      <v-btn
        round
        color="red darken-3"
        small
        @click="closeModal()"
      >
        Ok
      </v-btn>
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
     * The calendar event object that is clicked to view or edit
     */
    eventDetails: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    }
  },

  methods: {
    closeModal() {
      this.$emit('close-add-event-modal')
    }
  }
}
</script>
<style lang="sass" scoped>
.calendar-event-modal__toolbar .v-toolbar__content
  height: 4rem !important

.calendar-event-modal
  &__body
    padding: 2rem
  &__title
    margin-top: 1rem
    font-size: 2rem !important
  &__details
    padding: 2rem 3rem
    text-align: left

@media only screen and (min-width: 960px)
  .calendar-event-modal__toolbar .v-toolbar__content
    height: 5rem !important
</style>
