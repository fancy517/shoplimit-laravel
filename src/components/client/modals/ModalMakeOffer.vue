<template>
  <v-dialog
    v-model="modalShowing"
    content-class="my-dialog"
    :width="modal.width"
    :max-width="modal.maxWidth"
  >
    <template v-slot:activator="{ on }">
      <!-- This slot allows us to use the modal in the Feedback tables and in the saved favorites -->
      <slot name="button" :modalShowing="modalShowing" />
    </template>
    <v-card id="makeOfferForm">
      <v-icon class="modal__close" @click.stop="setModalShowing(false)">
        close
      </v-icon>
      <div class="v-card__icon">
        <v-icon
          class="make-offer__icon"
          color="pink darken-2"
          :size="$vuetify.breakpoint.xsOnly ? '80px' : '100px'"
        >
          how_to_reg
        </v-icon>
        <br>Congratulations on moving forward
        <br>with the home of your dreams!
        <br>
        <br>
        You are interested in making an offer on {{ homeAddress }}
        <br>
        Please include the offer price you would like to discuss and your agent {{ agent.name }} will contact you shortly.
      </div>
      <v-card-text>
        <div class="v-card__make-offer text-xs-center">
          <label class="area-label">Enter your offer amount:</label>
          <input v-model.lazy="offerAmount" v-money="money">
        </div>
      </v-card-text>
      <v-card-actions>
        <!-- <div class="v-card__send-offer"> -->
        <button
          v-ripple="{ class: 'grey--text', center: true}"
          class="buttonSend"
          @click="sendOffer"
        >
          Send
        </button>
        <!-- </div> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { VMoney } from 'v-money'

export default {
  directives: { money: VMoney },

  props: {
    agent: {
      type: Object,
      required: true
    },
    homeAddress: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      modalShowing: false,
      offerAmount: 0.0,
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        // suffix: ' #',
        precision: 2,
        masked: false /* doesn't work with directive */,
        allowBlank: false,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER
      }
    }
  },

  computed: {
    ...mapState('style', ['modal'])
  },

  watch: {
    modalShowing(newVal, oldVal) {
      this.$emit('modal-changed', newVal)
    }
  },
  methods: {
    sendOffer() {
      this.$emit('submit-modal', {
        agent: this.agent.name,
        address: this.homeAddress,
        amount: this.offerAmount,
        to: [this.agent._id]
      })
    },
    setModalShowing(val) {
      this.modalShowing = val
    }
  }
}
</script>

<style lang="sass" scoped>
*:focus
  outline: none

#makeOfferForm
  @extend %modal

.modal__close
  @extend %modal__button-close, %disable-selection

.make-offer__icon
  @extend %modal__icon

.v-card__make-offer
  width: fit-content
  margin: 1rem auto
  margin-top: 3rem

input
  display: block
  text-align: center
  border-bottom: 1px black solid

.area-label
  display: block
  text-transform: capitalize
  margin-bottom: 1.5rem !important

.buttonSend
  @extend %modal__button

// @media only screen and (min-width: 600px)
//   .v-card
//     padding: 3rem;
</style>
