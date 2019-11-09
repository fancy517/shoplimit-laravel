<template>
  <div id="agentRegisterForm">
    <v-alert
      :value="authStatus.errorAlert"
      type="error"
      class="auth-form__alert-bar"
      transition="scale-transition"
    >
      <div class="auth-form__alert-bar--content">
        {{ authStatus.loginError }}
        <v-btn
          small
          fab
          dark
          flat
          @click="handleResetRegisterForm"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </v-alert>
    <v-card class="auth-card">
      <v-card-title>
        <v-flex xs12>
          <h2 style="text-transform: capitalize">
            register to homewayz
          </h2>
        </v-flex>
      </v-card-title>
      <div class="mb-3">
        Please enter the MLS that you are licensed in and your agent ID below.
      </div>
      <v-form ref="agentRegisterForm" lazy-validation>
        <v-select
          v-model="mls.value"
          :items="['Texas - ABOR']"
          label="MLS"
          :rules="mlsRules"
        />
        <v-text-field
          v-model="licenseNum.value"
          label="License Number"
          :rules="licenseNumRules"
        />
      </v-form>
      <v-flex xs12 sm6 offset-sm3>
        <loader-button
          :loading="authStatus.loading"
          :disabled="authStatus.loading"
          :btn-text="'Register'"
          :btn-class="'auth-button'"
          @handle-button-click="handleAgentRegisterSubmit"
        />
      </v-flex>
      <router-link :to="{name: 'login'}" class="btn btn-link">
        If you have an account please
        <span>Go to Login</span>
      </router-link>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import LoaderButton from '../uiUtils/LoaderButton.vue'

export default {
  components: { LoaderButton },
  data: () => ({
    showAlert: false,
    message: '',
    licenseNum: {
      value: null,
      apiErrors: null
    },
    mls: {
      value: null,
      apiErrors: null
    },
    licenseNumRules: [v => !!v || 'License is required'],
    mlsRules: [v => !!v || 'MLS is required']
  }),

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
    ...mapActions('agent', ['agentRegister']),
    /**
     * Mapping agent's error disable functional mutation
     */
    ...mapMutations('common', {
      deactivateErrorStatus: 'DEACTIVATE_ERROR_STATUS'
    }),

    /**
     * message
     */
    handleAgentRegisterSubmit() {
      if (this.$refs.agentRegisterForm.validate()) {
        const agentRegisterPayload = {
          mls: this.mls.value,
          agentid: this.licenseNum.value
        }
        console.log(agentRegisterPayload)
        // this.agentRegister(agentRegisterPayload);
      }
    },

    /**
     * Handles resetting the form - After an error alert is shown we close it
     * and reset the auth form to allow user enter data again
     *
     * @public
     */
    handleResetRegisterForm() {
      this.$refs.agentRegisterForm.reset()
      this.$refs.agentRegisterForm.resetValidation()
      this.deactivateErrorStatus()
    }
  }
}
</script>
