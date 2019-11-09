<template>
  <v-card id="inviteBuyerForm">
    <div class="invite-buyer-form__title">
      Invite Client
    </div>
    <v-icon
      class="invite-buyer-form__close"
      @click.stop="closeModal()"
    >
      close
    </v-icon>
    <v-icon class="invite-buyer-form__icon">
      how_to_reg
    </v-icon>
    <div style="width: 70%; margin: 0 auto;">
      Please enter new user's details and send invitation to add them to your client's list
    </div>
    <v-card-text>
      <v-form id="inviteForm" ref="inviteForm" lazy-validation>
        <v-text-field
          v-model="buyer_name.value"
          class="inviteForm__input-field"
          placeholder="Name*"
          :rules="nameRules"
          single-line
        />
        <v-text-field
          v-model="buyer_phone.value"
          class="inviteForm__input-field"
          placeholder="Phone*"
          :rules="phoneRules"
          single-line
          mask="phone"
        />
        <v-text-field
          v-model="buyer_email.value"
          class="inviteForm__input-field"
          placeholder="Email*"
          :rules="emailRules"
          single-line
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <!-- <div class="mx-5 w-100"> -->
      <v-btn
        id="sendInvitationButton"
        :disabled="authStatus.loading"
        @click.stop="handleInviteFormSubmit"
      >
        send invitation
      </v-btn>
      <!-- </div> -->
    </v-card-actions>
  </v-card>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
import { emailRules } from './formValidation'
import { genericPostRequestToApi } from '../../utils/genericRequests'
import { AccountInviteUserUrl } from '../../utils/agentUrls'
import { mapState } from 'vuex'

export default {
  data: () => ({
    buyer_name: {
      value: null,
      apiErrors: null
    },
    buyer_phone: {
      value: null,
      apiErrors: null
    },
    buyer_email: {
      value: null,
      apiErrors: null
    },
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length > 3) || 'Name must be at least 3 characters'
    ],
    emailRules,
    phoneRules: [
      v => !!v || 'Phone is required',
      v => (v && v.length > 4) || 'Phone number should be at least 10 digits'
    ],
    authStatus: {
      loading: false
    }
  }),

  computed: {
    ...mapState('agent', ['agentData'])
  },

  methods: {
    /**
     * Mapping agent invite buyer action to this component
     */
    // ...mapActions('agent', ['agentInviteBuyer']),

    handleInviteFormSubmit() {
      if (this.$refs.inviteForm.validate()) {
        this.authStatus.loading = true
        console.log(this.buyer_name, this.buyer_phone, this.buyer_email)
        const inviteBuyerPayload = {
          name: this.buyer_name.value,
          phone: this.buyer_phone.value,
          email: this.buyer_email.value
        }

        if (this.agentData) {
          let clientExist = false
          const clientList = this.agentData.clients
          clientList.forEach(client => {
            if (client.email === this.buyer_email.value) {
              clientExist = true
            }
          })

          if (!clientExist) {
            genericPostRequestToApi(
              AccountInviteUserUrl(),
              inviteBuyerPayload
            ).then(response => {
              this.authStatus.loading = false
              if (response.status === 200) {
                this.closeModal(true, 'You have successfully invited a user')
              } else {
                this.closeModal(
                  true,
                  'Validation error regarding the input fields. Please try invitation again.'
                )
              }
            })
          } else {
            this.closeModal(true, `The client with email id ${this.buyer_email.value} already exists`)
          }
        }
      }
    },

    closeModal(showMessage = false, message = null) {
      this.$refs.inviteForm.reset()
      this.$emit('on-modal-close', { showMessage, message })
    }
  }
}
</script>

<style lang="sass" scoped>
#inviteBuyerForm
  @extend %modal

.invite-buyer-form__close
  @extend %modal__button-close, %disable-selection

.invite-buyer-form__title
  @extend %modal__title

.invite-buyer-form__icon
  @extend %modal__icon

.inviteForm__input-field
  @extend %modal__text-field

#sendInvitationButton
  @extend %modal__button

// @media only screen and (min-width: 600px)
//   #inviteBuyerForm
//     padding: 2rem;

</style>
