<template>
  <div class="client-signup__content">
    <div class="flex-item signup-card__title">
      Homewayz
      <br>
      <div class="signup-card__title-page-name">
        {{ stepTitle }}
      </div>
    </div>
    <div class="flex-item signup-card__body">
      <div class="mb-5 px-5">
        Please enter your basic information!!!
      </div>
      <v-layout
        column
        justify-space-between
        justify-center
        fill-height
        class="basic-info-form"
      >
        <v-flex>
          <v-form ref="basicInfoForm" lazy-validation>
            <v-text-field
              v-model="clientInfo.name"
              :rules="[rules.required]"
              label="Name"
              placeholder="Can be filled from database"
              color="black"
              required
            />
            <v-text-field
              v-model="clientInfo.phone"
              :rules="[rules.required]"
              label="Phone"
              placeholder="Can be filled from database"
              color="black"
              required
            />
            <v-text-field label="Email" readonly value="readonlyfromemail@link.com" />
          </v-form>
        </v-flex>
      </v-layout>
    </div>
    <div class="flex-item signup-card__footer">
      <button
        v-ripple="{ class: 'grey--text', center: true}"
        class="buttonContinue"
        @click="submitClientBasicInfo"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { emailRules } from '../../input-forms/formValidation'
// import { genericPutRequestToApi } from '../../../utils/genericRequests'
// import { RetrieveUpdateClientProfileUrl } from '../../../utils/clientUrls'

export default {
  props: {
    stepTitle: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      showPassword: false,
      emailRules,
      password: '',
      confirmPassword: '',
      clientInfo: {
        name: '',
        phone: ''
      },
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => "The email and password you entered don't match"
      }
    }
  },

  methods: {
    submitClientBasicInfo() {
      // if (this.$refs.basicInfoForm.validate()) {
      //   const clientBasicInfo = {
      //     name: this.clientInfo.name,
      //     phone: this.clientInfo.phone,
      //     availability: [],
      //     homePrefs: {
      //       freetext: '',
      //       options: []
      //     }
      //   }

      //   genericPutRequestToApi(RetrieveUpdateClientProfileUrl(), clientBasicInfo)
      //     .then(response => {
      //       console.log(response)
      //       this.$emit('submit-info-clicked')
      //     })
      // }
      this.$emit('submit-info-clicked')
    }
  }
}
</script>

<style scoped>
.basic-info-form {
  width: 65%;
  margin: 0 auto;
}
</style>
