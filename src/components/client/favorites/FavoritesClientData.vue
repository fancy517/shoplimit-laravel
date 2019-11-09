<template>
  <v-layout row wrap align-start justify-left class="resultsPage">
    <v-flex
      v-for="(favorite, index) in favorites"
      :key="index"
      xs12
      sm6
      lg4
      class="px-2"
    >
      <!-- The event handlers should probably be separate API calls,
    but at this point I am just propagating them to the Saved Favorites view.-->
      <card-home ref="cardHome" :property-info="favorite" :index="index" :home-type="'favorite'">
        <template v-slot:hoverCard="props">
          <v-flex xs12>
            <div class="card-favorite__overlay-link" @click="showFavoriteDetails(favorite)">
              <v-icon color="#fff" class="result-overlay-icon">
                fas fa-search
              </v-icon>View Details
            </div>
          </v-flex>
          <v-flex xs12>
            <div
              class="card-favorite__overlay-link"
              @click="$emit('remove-from-favorites', {propertyId :favorite._id, isTourRequested: isTourRequested(index)})"
            >
              <v-icon color="#fff" class="result-overlay-icon red--text">
                fas fa-heart
              </v-icon>Unfavorite
            </div>
          </v-flex>
          <v-flex xs12>
            <div
              class="card-favorite__overlay-link"
              @click="isTourRequested(index) ? null : requestTour(index)"
            >
              <v-icon
                color="#fff"
                class="result-overlay-icon"
                :class="{'green--text': isTourRequested(index)}"
              >
                fas fa-paper-plane
              </v-icon>
              {{ isTourRequested(index) ? 'Tour Requested' : 'Request Tour' }}
            </div>
          </v-flex>
          <v-flex xs12>
            <modal-send-message
              :show-modal="displayMessageModal"
              :selected-property="selectedProperty"
              @close-modal="closeMessageModal()"
              @submit-modal="sendMessage($event)"
            />
            <div class="card-favorite__overlay-link" @click="openMessageModal(favorite)">
              <v-icon color="#fff" class="result-overlay-icon">
                fas fa-envelope
              </v-icon>Send Message
            </div>
          </v-flex>
          <v-flex xs12>
            <modal-make-offer
              ref="modalMakeOffer"
              :home-address="favorite['Address']"
              :agent="$refs.cardHome[index].associatedAgent ? $refs.cardHome[index].associatedAgent : ''"
              @modal-changed="$refs.cardHome[index].modalShowing = $event === false ? false : $refs.cardHome[index].modalShowing"
              @submit-modal="sendOfferMessage($event, index)"
            >
              <template v-slot:button="props">
                <div
                  class="card-favorite__overlay-link"
                  @click.stop="setModalShowing(index, true)"
                >
                  <v-icon color="#fff" class="result-overlay-icon">
                    fas fa-arrow-alt-circle-right
                  </v-icon>Make Offer
                </div>
              </template>
            </modal-make-offer>
          </v-flex>
        </template>
      </card-home>
    </v-flex>
  </v-layout>
</template>
<script>

import CardHome from '../../uiUtils/CardHome.vue'
import ModalMakeOffer from '../modals/ModalMakeOffer.vue'
import ModalSendMessage from '../modals/ModalSendMessage.vue'
import { mapState } from 'vuex'
import {
  getFavoriteObjectFromPropertyId,
  getPropertyKeyValue
} from '../../../utils/propertyUtils'
import { sendMessage, sendOfferMessage } from '../../../services/messagesService'

export default {
  components: {
    ModalMakeOffer,
    CardHome,
    ModalSendMessage
  },

  props: {
    favorites: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      displayMessageModal: false,
      selectedProperty: null,
      active: 0

    }
  },

  computed: {
    ...mapState('client', ['clientData', 'associatedAgent', 'clientFavorites'])
  },
  methods: {
    setActive(val) {
      this.active = val
      this.$emit('tab-changed', val)
    },

    isTourRequested(index) {
      if (this.clientData && this.clientData.homes) {
        const homeObject = getFavoriteObjectFromPropertyId(
          this.clientData.homes,
          this.$refs.cardHome[index].propertyInfo._id
        )
        return homeObject.requestTour === true
      }
      return false
    },

    requestTour(index) {
      this.$emit(
        'toggle-tour',
        getFavoriteObjectFromPropertyId(
          this.clientData.homes,
          this.$refs.cardHome[index].propertyInfo._id
        )
      )
    },

    showFavoriteDetails(favorite) {
      this.$router.push({
        path: `favorites/${favorite._id}`
      })
    },

    setModalShowing(i, val) {
      // i - there are more than one component with ref modalMakeOffer, so 'i' helps us find the right one
      this.$refs.cardHome[i].modalShowing = val
      this.$refs.modalMakeOffer[0].setModalShowing(val)
    },

    getHomeAddress(homeObject) {
      return getPropertyKeyValue(
        homeObject._id,
        this.clientFavorites,
        'Address'
      )
    },

    openMessageModal(home) {
      this.displayMessageModal = true
      this.selectedProperty = home
    },

    closeMessageModal() {
      this.displayMessageModal = false
      this.selectedProperty = null
    },

    async sendMessage(data) {
      await sendMessage(data)
      this.closeMessageModal()
    },

    async sendOfferMessage(data, index) {
      await sendOfferMessage(data)
      this.setModalShowing(index, false)
    }

  }
}

</script>

  <style lang="sass" scoped>
  #resultsGrid
    margin: 0

  .resultsPage
    padding: 2rem 3rem !important
    background-color: $hwayzWhite
    overflow: auto
    max-width: 120rem
    -webkit-box-shadow: -2px 1px 3px 0px rgba(179, 179, 179, 1)
    -moz-box-shadow: -2px 1px 3px 0px rgba(179, 179, 179, 1)
    box-shadow: -2px 1px 3px 0px rgba(179, 179, 179, 1)
  .result-overlay-icon
    @extend %card__hover-icon
    width: 3.2rem

  .card-favorite__overlay-link
    @extend %card__hover-link
    margin: 0.5rem

  @media only screen and (min-width: 1260px) and (max-width: 1420px)
    .card-favorite__overlay-link
      font-size: $hwayzFont1rem4
      margin: 0.3rem 0
    .result-overlay-icon
      font-size: $hwayzFont1rem8

  </style>
