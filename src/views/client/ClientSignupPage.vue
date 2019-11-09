<template>
  <v-container id="containerClientSignup" fluid>
    <!-- The layout for the whole screen. -->
    <v-layout id="containerSignupCard" justify-center align-center fill-height>
      <!-- The card that contains the signup form -->
      <v-flex class="signup-card" xs12 sm8 md6 lg4>
        <div class="signup-card__wrap">
          <div class="flex-item signup-card__title">
            Homewayz
            <br>
            <div class="signup-card__title-page-name">
              Set Password
            </div>
          </div>
          <div v-if="startSignupProcess" class="flex-item signup-card__body">
            <div class="mb-5 px-5">
              Your password has been set!
              <br>Thanks for registering with Homewayz!!!
            </div>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate />
            <div>Redirecting to Login Page!!!</div>
          </div>
          <div v-else class="flex-item signup-card__body">
            <div class="mb-5 px-5">
              Welcome to HomeWayz, a New Way Home!
              <br>Please enter your password below and start scheduling your home tours today.
            </div>
            <v-layout
              column
              justify-space-between
              justify-center
              fill-height
              class="password-signup__form"
            >
              <v-flex>
                <v-form ref="passwordSignupForm" lazy-validation>
                  <!-- <v-text-field label="Email" readonly value="readonlyfromemail@link.com" /> -->
                  <v-text-field
                    v-model="password"
                    :rules="[rules.required, rules.min]"
                    label="Password"
                    color="black"
                    required
                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                    :type="showPassword ? 'text' : 'password'"
                    hint="Password should be at least 8 characters"
                    counter
                    @click:append="showPassword = !showPassword"
                  />
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    :rules="[rules.required]"
                    type="password"
                  />
                </v-form>
              </v-flex>
              <v-flex
                v-if="errorSettingPassword"
                style="margin-top: -2rem; color: red; font-size: 1.2rem;"
              >
                {{ errorMessage }}
              </v-flex>
            </v-layout>
          </div>
          <div class="flex-item signup-card__footer">
            <button
              v-ripple="{ class: 'grey--text', center: true}"
              :disabled="loading"
              class="buttonConfirm"
              :class="{'button-ready': password.length >= 8 && confirmPassword.length >= 8}"
              @click="submitPasswordSignup"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { getUrlParameters } from '../../utils/generalUtils'
import { genericPostRequestToApi } from '../../utils/genericRequests'
import { CreateClientPasswordUrl } from '../../utils/clientUrls'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      showPassword: false,
      password: '',
      confirmPassword: '',
      rules: {
        required: value => !!value || 'This is the required field.',
        min: v => v.length >= 8 || 'Password should be minimum 8 characters.'
      },
      loading: false,
      startSignupProcess: false,
      errorSettingPassword: false,
      errorMessage: ''
    }
  },

  created() {
    if (localStorage.getItem('x-authentication')) {
      this.profileLogout(false)
    }
  },

  methods: {
    /**
     * Mapping logout action to this component
     */
    ...mapActions('common', ['profileLogout']),

    submitPasswordSignup() {
      // Remove comments from this code after the API link is fixed
      if (this.$refs.passwordSignupForm.validate()) {
        if (this.password === this.confirmPassword) {
          this.startSignupProcess = true
          const passwordPayload = {
            token: getUrlParameters('token'),
            password: this.password
          }
          const configOverride = {
            headers: { 'x-authentication': getUrlParameters('token') }
          }
          genericPostRequestToApi(
            CreateClientPasswordUrl(),
            passwordPayload,
            configOverride
          ).then(res => {
            if (res.status === 200) {
              this.startSignupProcess = false
              this.$router.push({ name: 'login' })
            } else {
              setTimeout(() => {
                this.startSignupProcess = false
                this.errorSettingPassword = true
                this.errorMessage = 'Server responded with an error'
              }, 5000)
            }
          })
        } else {
          this.errorSettingPassword = true
          this.errorMessage = 'Both passwords should match'
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
*:focus
  outline: none

.password-signup__form
  width: 70%
  margin: 0 auto

#containerClientSignup
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/img/home.jpg")
  width: 100%
  height: 100vh
  background-size: cover
  overflow: hidden

#containerSignupCard
  height: 100%
  width: 100%

.signup-card
  height: 90%
  background-color: #fff
  border-radius: 5px
  position: relative

.flex-item
  flex: 0 0

.signup-card__wrap
  height: 100%
  padding-top: 4%
  padding-bottom: 12%
  display: flex
  flex-direction: column
  align-content: center
  justify-content: space-between

.signup-card__title
  text-transform: uppercase
  color: darkgray
  font-size: 14px
  flex-basis: 15%

  display: flex
  flex-direction: column
  justify-content: space-between

.signup-card__title-page-name
  text-transform: uppercase
  color: black
  font-size: 16px

.signup-card__body
  max-height: 79%
  height: fit-content

.signup-card__footer
  max-height: 6%

.buttonConfirm
  border: darkgray 1px solid
  height: 100%
  border-radius: 5px
  padding: 5px 25px
  box-shadow: #ababab 0px 2px 2px 1px

.button-ready
  @extend %button-ready
</style>
