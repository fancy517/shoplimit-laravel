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
    <v-card id="referFriendForm">
      <v-icon
        class="refer-friend__close"
        @click.stop="setModalShowing(false)"
      >
        close
      </v-icon>
      <div class="v-card__icon">
        <v-icon class="refer-friend__icon">
          how_to_reg
        </v-icon>
        <br>
        Refer a friend to NAME
      </div>
      <v-card-text>
        <v-form ref="inviteForm" lazy-validation>
          <!-- <div class="v-card__refer-friend text-xs-center"> -->
          <v-text-field
            v-model="friendInfo.name"
            class="referFriend__input-field"
            :rules="nameRules"
            placeholder="Can be filled from database"
            color="black"
            required
            single-line
          />
          <v-text-field
            v-model="friendInfo.phone"
            class="referFriend__input-field"
            :rules="phoneRules"
            placeholder="Can be filled from database"
            color="black"
            required
            single-line
            mask="phone"
          />
          <v-text-field
            v-model="friendInfo.email"
            class="referFriend__input-field"
            color="black"
            readonly
            value="readonlyfromemail@link.com"
            placeholder="Email"
            :rules="emailRules"
            single-line
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <!-- <div class="v-card__send-offer"> -->
        <button v-ripple="{ class: 'grey--text', center: true}" class="buttonSend" @click="sendOffer">
          reffer
        </button>
      <!-- </div> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { emailRules } from '../../input-forms/formValidation'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      modalShowing: false,
      offerAmount: '',
      friendInfo: {
        name: '',
        phone: '',
        email: ''
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length > 3) || 'Name must be at least 3 characters'
      ],
      emailRules,
      phoneRules: [
        v => !!v || 'Phone is required',
        v => (v && v.length > 4) || 'Phone number should be at least 10 digits'
      ]
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
      console.log('Callback for sending the offer. Offered amount: ' + this.offerAmount)
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

#referFriendForm
  @extend %modal

.refer-friend__close
  @extend %modal__button-close, %disable-selection

.refer-friend__icon
  @extend %modal__icon

.refer-friend__input-field
  @extend %modal__text-field

.buttonSend
  @extend %modal__button
</style>
