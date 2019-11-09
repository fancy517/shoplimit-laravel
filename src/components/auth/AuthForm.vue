<template>
  <div id="authForm">
    <v-alert
      :value="authStatus.errorAlert"
      type="error"
      class="auth-form__alert-bar"
      transition="scale-transition"
    >
      <div class="auth-form__alert-bar--content">
        {{ authStatus.loginError }}
        <v-btn small fab dark flat @click="handleResetAuthForm">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </v-alert>
    <v-card class="auth-card">
      <v-card-title>
        <v-flex xs12>
          <h2 style="text-transform: capitalize">
            {{ authRoute }} to homewayz
          </h2>
        </v-flex>
      </v-card-title>
      <v-form ref="authForm" lazy-validation>
        <v-text-field
          v-model="email_auth.value"
          name="email"
          label="E-mail"
          :rules="emailRules"
          browser-autocomplete
          @keyup.enter="handleAuthFormSubmit"
        />
        <v-text-field
          v-model="password_auth.value"
          name="password"
          label="Password"
          :rules="passwordRules"
          :type="'password'"
          @keyup.enter="handleAuthFormSubmit"
        />
        <v-checkbox
          v-if="authRoute === 'login'"
          v-model="checkbox"
          label="Remember me"
          type="checkbox"
        />
        <v-text-field
          v-else
          v-model="confirmPassword_auth.value"
          label="Confirm Password"
          :rules="passwordRules"
          :type="'password'"
        />
      </v-form>
      <v-flex xs12 sm6 offset-sm3>
        <loader-button
          :loading="authStatus.loading"
          :disabled="authStatus.loading"
          :btn-text="authRoute"
          :btn-class="'auth-button'"
          @handle-button-click="handleAuthFormSubmit"
        />
      </v-flex>
      <router-link v-if="authRoute === 'login'" :to="{ name: 'signup' }" class="btn btn-link">
        Don't have an account?
        <span>Go to Register</span>
      </router-link>
      <router-link v-else :to="{ name: 'login' }" class="btn btn-link">
        Already have an account?
        <span>Go to Login</span>
      </router-link>
    </v-card>
    <!-- <template>
      <div class="mt-3">
        <h4>
          A direct {{ authRoute }} to agent dashboard for development testing only
          <br>To try standard process use above form
        </h4>
      </div>
      <v-btn
        color="red"
        class="white--text"
        @click="directDevelopmentEnvironmentLogin"
      >
        Direct {{ authRoute }} without validation
      </v-btn>
    </template>-->
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { emailRules } from '../input-forms/formValidation'
import LoaderButton from '../uiUtils/LoaderButton.vue'

export default {
  components: { LoaderButton },
  props: {
    authRoute: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      username_auth: {
        value: null,
        apiErrors: null
      },
      email_auth: {
        value: null,
        apiErrors: null
      },
      password_auth: {
        value: null,
        apiErrors: null
      },
      confirmPassword_auth: {
        value: null,
        apiErrors: null
      },
      emailRules,
      passwordRules: [v => !!v || 'Password is required'],
      checkbox: null
    }
  },

  computed: {
    /**
     * Mapping login status for agent
     */
    ...mapState('common', ['authStatus'])
  },

  methods: {
    /**
     * Mapping agent auth login functionality with the component
     */
    ...mapActions('agent', ['profileLogin']),
    /**
     * Mapping agent's error disable functional mutation
     */
    ...mapMutations('common', {
      deactivateErrorStatus: 'DEACTIVATE_ERROR_STATUS'
    }),

    /**
     * Handles submission of the form
     * sends user entered credentials to the server in request body
     * and determines success of failure
     *
     * @public
     */
    handleAuthFormSubmit() {
      if (this.$refs.authForm.validate()) {
        if (this.authRoute === 'login') {
          const loginCredentials = {
            username: this.email_auth.value,
            password: this.password_auth.value
          }
          this.profileLogin(loginCredentials)
        } else if (this.authRoute === 'signup') {
          console.log(
            this.email_auth,
            this.password_auth,
            this.confirmPassword_auth
          )
        }
      }
    },

    // For testing purposes only
    directDevelopmentEnvironmentLogin() {
      this.$router.push({ name: 'Task-Manager / Task-View' })
      window.location.reload()
    },

    /**
     * Handles resetting the form - After an error alert is shown we close it
     * and reset the auth form to allow user enter data again
     *
     * @public
     */
    handleResetAuthForm() {
      this.$refs.authForm.reset()
      this.$refs.authForm.resetValidation()
      this.deactivateErrorStatus()
    }
  }
}
</script>

<style scoped lang='sass'>
.auth-form__alert-bar
  height: 5rem
  position: absolute
  top: 0
  left: 50%
  width: 100%
  transform: translateX(-50%)
  font-size: $hwayzFont1rem2

.auth-form__alert-bar--content
  display: flex
  flex-direction: row
  align-items: center
  justify-content: space-between

.logo-container
  margin-top: 0rem
  margin-bottom: 3rem

.logo-container img
  width: 16rem
  height: auto

.auth-card
  border-radius: 1.5rem !important
  padding: 1rem 3rem
  max-width: 80rem

.btn-link span
  color: $hwayzLink !important
  text-transform: uppercase

.btn-link
  margin-top: 3rem !important
  font-size: $hwayzFont1rem4

.spinner-loader
  animation: loader 1s infinite
  display: flex

@-moz-keyframes loader
  from
    transform: rotate(0)

  to
    transform: rotate(360deg)

@-webkit-keyframes loader
  from
    transform: rotate(0)

  to
    transform: rotate(360deg)

@-o-keyframes loader
  from
    transform: rotate(0)

  to
    transform: rotate(360deg)

@keyframes loader
  from
    transform: rotate(0)

  to
    transform: rotate(360deg)

@media only screen and (min-width: 600px)
  .auth-form__alert-bar
    width: 60%
    font-size: $hwayzFont1rem4
    max-width: 60rem

@media only screen and (min-width: 960px)
  .auth-card
    padding: 2rem 5rem

@media only screen and (max-width: 1280px)
  #authForm
    -webkit-transform:scale(0.8)
    -moz-transform:scale(0.8)
    -ms-transform:scale(0.8)
    transform:scale(0.8)

</style>
