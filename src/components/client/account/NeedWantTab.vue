<template>
  <v-layout id="containerTab" fill-height justify-left wrap>
    <alert-message
      :alert-message="alertObject.message"
      :alert-value="alertObject.value"
      :alert-type="alertObject.type"
    />
    <v-layout wrap class="py-5 container_add_more_needs">
      <v-flex xs5 md3 class="pt-3">
        <div class="container-input text-xs-left">
          <label class="area-label">Add More {{ preferenceType }}s</label>
          <input
            v-model="typedPreference"
            type="text"
            @keyup.enter="addTypedPreference({text: typedPreference, wantNeed: preferenceType})"
          >
        </div>
      </v-flex>
      <v-flex xs3 md3 class="pt-4">
        <v-btn
          :color="getThemeColor"
          ripple
          round
          outline
          small
          @click.stop="addTypedPreference({text: typedPreference, wantNeed: preferenceType})"
        >
          + Add {{ preferenceType }}
        </v-btn>
      </v-flex>
      <v-flex xs12 md4 offset-md1 class="text-xs-right py-4">
        <loader-button
          :loading="processUpdate"
          :disabled="!enableUpdate"
          btn-class="white--text px-5"
          :btn-settings="{color: getThemeColor}"
          :btn-text="`Update ${preferenceType}s`"
          @handle-button-click="updateUserPreferences()"
        />
        <!-- <v-btn
          :disabled="!enableUpdate"
          class="white--text hwayzTeal px-5"
          ripple
          @click.stop="updateUserPreferences()"
        >
          Update {{ preferenceType }}s
        </v-btn> -->
      </v-flex>
    </v-layout>

    <v-flex class="text-xs-left" xs12 md5>
      <label class="area-label text-xs-left">Your {{ preferenceType }}s:</label>
      <div class="container-chips">
        <v-chip
          v-for="preference in userPreference"
          :key="preference.text"
          class="my-chip"
          :style="{'background-color': getThemeColor}"
          text-color="white"
          color="#bbb"
          disabled
          @mouseover="hoverChip = preference.text"
          @mouseleave="hoverChip = null"
        >
          {{ preference.text }}
          <v-icon
            v-if="hoverChip === preference.text"
            class="chip-remove-button"
            color="red"
            @click="removeClientPreference(preference)"
          >
            close
          </v-icon>
        </v-chip>
      </div>
    </v-flex>
    <!-- SUGGESTIONS -->
    <v-flex class="text-xs-left" xs12 md7>
      <label class="area-label text-xs-left">{{ preferenceType }} Suggestions:</label>
      <div class="container-chips">
        <v-chip
          v-for="preference in preferenceSuggestions"
          :key="preference.text"
          class="my-chip"
          text-color="white"
          color="#bbb"
          disabled
          @click="addCustomPreference(preference)"
        >
          {{ preference.text }}
        </v-chip>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { genericPutRequestToApi } from '../../../utils/genericRequests'
import {
  RetrieveUpdateClientProfileUrl,
  UpdateFeedbackMatchUrl
} from '../../../utils/clientUrls'
import LoaderButton from '../../uiUtils/LoaderButton.vue'
import AlertMessage from '../../uiUtils/AlertMessage.vue'
import refreshClientData from '../../mixins/refreshClientData'
import { isEmpty } from '../../../utils/generalUtils'

export default {
  components: { LoaderButton, AlertMessage },
  mixins: [refreshClientData],

  props: {
    preferenceType: {
      type: String,
      default: 'Need'
    }
  },

  data() {
    return {
      hoverChip: null,
      typedPreference: '',
      enableUpdate: false,
      processUpdate: false,
      alertObject: {
        type: 'success',
        value: false,
        message: ''
      }
    }
  },

  computed: {
    ...mapState('client', ['clientData', 'preferenceSuggestions']),
    ...mapGetters('client', ['clientHomePrefs', 'feedbackProvidedHomes']),

    userPreference() {
      return this.clientHomePrefs(this.preferenceType)
    },

    isCustomEmpty() {
      return isEmpty(this.typedPreference)
    },

    getThemeColor() {
      return this.preferenceType === 'Need' ? '#b34f92' : '#4da449'
    }
  },

  watch: {
    typedPreference(newValue, oldValue) {

    }
  },

  created() {
    this.setPreferenceList()
  },

  methods: {
    ...mapMutations('client', {
      setPreferenceList: 'SET_PREFERENCE_LIST',
      updatePreferenceList: 'UPDATE_PREFERENCE_LIST'
    }),

    addCustomPreference(val) {
      if (!this.enableUpdate) this.enableUpdate = true
      this.userPreference.push({
        text: val.text,
        wantNeed: this.preferenceType
      })
      this.updatePreferenceList({ value: val.text, step: 'add' })
    },

    addTypedPreference(val) {
      if (!isEmpty(val.text)) {
        if (!this.enableUpdate) this.enableUpdate = true
        let isPresent = false
        this.userPreference.forEach(pref => {
          if (pref.text === val.text) isPresent = true
        })
        if (!isPresent) {
          this.userPreference.push(val)
          this.typedPreference = ''
        // TODO - Add an indicator to show that it's already present
        }
      }
    },

    removeClientPreference(val) {
      if (!this.enableUpdate) this.enableUpdate = true
      const i = this.userPreference.findIndex(pref => pref.text === val.text)
      this.userPreference.splice(i, 1)
      this.updatePreferenceList({ value: val, step: 'remove' })
    },

    updateUserPreferences() {
      this.processUpdate = true
      let otherPreferences = []
      if (this.preferenceType === 'Need') {
        otherPreferences = this.clientHomePrefs('Want')
      } else {
        otherPreferences = this.clientHomePrefs('Need')
      }
      const payloadHomePrefs = [...this.userPreference, ...otherPreferences]

      genericPutRequestToApi(RetrieveUpdateClientProfileUrl(), {
        homePrefs: {
          freetext: '',
          options: payloadHomePrefs
        }
      }).then(response => {
        if (response.status === 200) {
          this.updateFeedbackWantNeed(payloadHomePrefs)
        } else {
          this.updateProcessEnded()
          Object.assign(this.alertObject, {
            type: 'error',
            value: true,
            message: "Couldn't process that request at the moment. We apologize for inconvenience."
          })
        }
      })
    },

    updateFeedbackWantNeed(payloadHomePrefs) {
      const feedbackHomes = this.feedbackProvidedHomes
      if (feedbackHomes.length > 0) {
        feedbackHomes.forEach(home => {
          if (home.feedback.match) {
            const feedbackWantNeedList = home.feedback.match.results
            let updatedPrefs = []
            payloadHomePrefs.forEach(payloadPref => {
              let prefFound = false
              let prefValue = null
              for (let i = 0; i < feedbackWantNeedList.length; i++) {
                const tempValue = feedbackWantNeedList[i]
                if (
                  payloadPref.text === tempValue.name &&
                  payloadPref.wantNeed === tempValue.wantNeed
                ) {
                  prefFound = true
                  prefValue = tempValue
                }
              }
              if (prefFound) {
                updatedPrefs.push(prefValue)
              } else {
                updatedPrefs.push({
                  match: false,
                  name: payloadPref.text,
                  wantNeed: payloadPref.wantNeed
                })
              }
            })
            genericPutRequestToApi(
              UpdateFeedbackMatchUrl(this.clientData._id, home._id),
              updatedPrefs
            ).then(response => {
              if (response.status === 200) {
                this.getClientData()
                this.updateProcessEnded()
                Object.assign(this.alertObject, {
                  type: 'success',
                  value: true,
                  message: `Successfully updated your ${this.preferenceType}s and feedback for homes`
                })
              }
            })
          }
        })
      } else {
        this.getClientData()
        this.updateProcessEnded()
        Object.assign(this.alertObject, {
          type: 'success',
          value: true,
          message: `Successfully updated your ${this.preferenceType}s`
        })
      }
    },

    updateProcessEnded() {
      this.processUpdate = false
      this.enableUpdate = false
    }
  }
}
</script>

<style lang="sass" scoped>
*:focus
  outline: none

.container_add_more_needs
  width: 100%
  padding-top: 0px !important

.hwayzTeal
  background: $hwayzTeal !important

#containerTab
  height: 100%;

.container-chips
  max-width: 90%;

.my-chip
  position: relative;
  height: 2.4rem;
  font-size: $hwayzFont1rem2;
  margin: 0.5rem;

.chip-remove-button
  cursor: pointer;
  position: absolute;
  height: fit-content;
  width: fit-content;
  border-radius: 50%;
  top: -0.6rem;
  right: -0.6rem;
  padding: 0.1rem;

  background-color: $hwayzWhite !important;
  border: red 0.2rem solid;

  font-size: $hwayzFont1rem !important;
  font-weight: bold;

.my-chip >>> .v-chip__content
  padding-left: 1rem !important;

input[type="text"]
  width: 100%;
  display: block;
  font-size: $hwayzFont1rem4;
  border-bottom: 0.1rem black solid;

.area-label
  display: block;
  text-transform: capitalize;
  font-size: $hwayzFont1rem4;
  margin-bottom: 10px !important;
</style>
