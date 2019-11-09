<template>
  <v-card class="modal__card">
    <v-icon
      class="modal__button-close"
      @click.stop="onCloseModal()"
    >
      close
    </v-icon>
    <div class="modal__title">
      homewayz
    </div>
    <div class="modal__info">
      Add homes to existing route
      <br>
      <template v-if="selectedHouses">
        You have selected {{ selectedHouses.length }} house
      </template>
    </div>
    <!-- Populating existing routes here associated with the selected client -->
    <v-expansion-panel
      id="addHomesToRoute"
      v-model="panel"
      class="modal__expansion"
      expand
      readonly
    >
      <v-expansion-panel-content class="modal__expansion-content">
        <div slot="header">
          <v-icon small style="padding-right: 1rem;" class="modal__header">
            keyboard_arrow_down
          </v-icon>
          <span class="modal__header">Route</span>
          <v-btn
            small
            round
            :color="$btnHwayzBlue"
            @click.stop="addSelectedHouses()"
          >
            Add to Route
          </v-btn>
        </div>
        <template v-if="selectedRouteDetails.length > 0">
          <v-card v-for="property in selectedRouteDetails" :key="property.id">
            <v-layout wrap style="font-size: .8em; color: #444; padding: 1rem 2rem;">
              <v-flex xs1>
                <v-icon small color="blue">
                  location_on
                </v-icon>
              </v-flex>
              <v-flex xs7>
                {{ getPropertyValue(property.propertyId, 'Address') }}
              </v-flex>
              <v-flex xs3>
                {{ getPropertyTimeStamp(property.scheduled) || 'pending' }}
              </v-flex>
            </v-layout>
          </v-card>
        </template>
        <div
          v-else
          class="text-xs-center py-3"
          style="font-size: 1.2rem;"
        >
          Not yet added any saved properties for today
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-btn
      round
      class="modal_button"
      color="pink lighten-1"
      @click="onCloseModal()"
    >
      Okay
    </v-btn>
  </v-card>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { getPropertyKeyValue } from '../../utils/propertyUtils'

export default {
  props: {
    onCloseModal: {
      type: Function,
      required: true
    },
    clientProperties: {
      type: Array,
      required: true
    },
    selectedRouteDetails: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    },
    selectedHouses: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    clientName: '',
    showError: false,
    panel: [true]
  }),

  computed: {
    ...mapState('agent', ['agentData', 'selectedClient'])
  },

  methods: {
    getPropertyValue(homeId, key) {
      return getPropertyKeyValue(homeId, this.clientProperties, key)
    },

    getPropertyTimeStamp(scheduled) {
      if (scheduled) {
        return moment(scheduled).format('hh:mm a')
      }
      return null
    },

    /**
     * Calls the mixin for adding a new schedule to a saved property
     * The new schedule is current timestamp
     *
     * @public
     * As a test it's currently adding first home from the selected ones
     */
    addSelectedHouses() {
      this.addSavedHomesToRoute(
        this.selectedClient._id,
        this.selectedHouses[0]._id
      )
    },

    submitName() {
      if (this.clientName === '') {
        this.showError = true
      } else {
        this.showError = false
        this.$emit('onSearchClient', this.clientName)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.modal__card
  background: $hwayzfb !important
  padding: 3rem
  position: relative

.modal__button-close
  @extend %modal__button-close, %disable-selection

@media only screen and (min-width: 600px)
  .choose-client__card
    padding: 5rem 8rem

.modal__title
  font-family: "Montserrat", sans-serif
  text-transform: uppercase
  font-weight: 300
  margin-bottom: 8rem
  color: #999
  letter-spacing: 1px
  font-size: 0.8em

.modal__info
  font-weight: 600
  margin-bottom: 6rem

.modal__expansion
  margin-bottom: 1rem

.modal__expansion-content
  background-color: $hwayzBackgroundColor !important

.modal__add-btn .v-btn__content
  font-weight: 300 !important
  font-size: 0.6em !important

.modal_button
  margin-top: 3rem
  margin-bottom: 3rem
  width: 60%
  min-width: 15rem

@media only screen and (min-width: 600px)
  .modal_button
    width: 60%

</style>
