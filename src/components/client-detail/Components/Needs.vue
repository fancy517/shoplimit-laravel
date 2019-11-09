<template>
  <div>
    <v-layout wrap class="container_add_more_needs">
      <v-flex xs5 md3 class="pt-3">
        <div class="container-input text-xs-left">
          <label class="area-label">Add More Needss</label>
          <input
            v-model="typedPreference"
            type="text"
            @keyup.enter="addTypedPreference()"
          >
        </div>
      </v-flex>
      <v-flex xs3 md3 class="pt-4">
        <v-btn
          :color="'purple'"
          ripple
          round
          outline
          small
          @click.stop="addTypedPreference()"
        >
          + Add Needs
        </v-btn>
      </v-flex>
      <v-flex xs12 md4 offset-md1 class="text-xs-right py-4">
        <loader-button
          :loading="processUpdate"
          btn-class="white--text px-5"
          :btn-settings="{color: 'purple'}"
          :btn-text="`Update Needs`"
          @handle-button-click="updateProfileNeeds()"
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
    <div class="divider">
      <div class="wants-container">
        <v-chip
          v-for="(item, i) in needsArray"
          :key="i"
          class="chips"
          small
          color="purple"
          @click="needsToSeggestions(item)"
        >
          {{ item }}
        </v-chip>
      </div>
      <div class="wants-container">
        <v-chip
          v-for="(item, i) in suggestions"
          :key="i"
          class="chips"
          small
          color="grey"
          @click="suggestionToNeed(item)"
        >
          {{ item }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import {
  genericGetRequestToApi,
  genericPutRequestToApi
} from '../../../utils/genericRequests'
import {
  RetrieveProfileById,
  UpdateFeedbackMatchUrl
} from '../../../utils/clientUrls'
import { isEmpty } from '../../../utils/generalUtils'
import LoaderButton from '../../uiUtils/LoaderButton.vue'

export default {
  components: {
    LoaderButton
  },
  data() {
    return {
      typedPreference: '',
      processUpdate: false,
      needsArray: [],
      suggestions: [],
      originalNeedWants: []
    }
  },
  computed: {
    ...mapState('agent', ['selectedClient']),
    ...mapState('client', ['clientData']),
    ...mapGetters('client', ['getInitialPrefSuggestions']),

    clientForCard() {
      return this.clientDetailForCard
        ? this.clientDetailForCard
        : this.selectedClient
    }
  },

  created() {
    this.needsArray = this.getClientHomePreferences('Need')
    this.suggestions = this.getInitialPrefSuggestions.map(want => want.text)

    genericGetRequestToApi(RetrieveProfileById(this.selectedClient._id)).then(
      response => {
        this.originalNeedWants = response.data.homePrefs
      }
    )
  },

  methods: {
    ...mapMutations('agent', {
      'setSelectedClient': 'SET_SELECTED_CLIENT'
    }),
    async updateProfileNeeds() {
      const onlyWants = this.originalNeedWants.options
        .filter(needWants => needWants.wantNeed !== 'Need')
        .map(want => {
          return { text: want.text, wantNeed: 'Want' }
        })
      const needsToAdd = this.needsArray.map(need => {
        return { text: need, wantNeed: 'Need' }
      })

      const payloadHomePrefs = {
        freetext: '',
        options: [...onlyWants, ...needsToAdd]
      }

      await genericPutRequestToApi(RetrieveProfileById(this.selectedClient._id), {
        homePrefs: payloadHomePrefs
      })
      this.setSelectedClient({ ...this.selectedClient, ...{ homePrefs: payloadHomePrefs } })
    },

    addTypedPreference() {
      if (!isEmpty(this.typedPreference)) {
        this.needsArray.push(this.typedPreference)
        this.typedPreference = ''
      }
    },

    suggestionToNeed(sug) {
      this.needsArray.push(sug)
      this.suggestions = this.suggestions.filter(
        suggestion => suggestion !== sug
      )
    },

    needsToSeggestions(need) {
      this.suggestions.push(need)
      this.needsArray = this.needsArray.filter(needs => needs !== need)
    },

    getClientHomePreferences(preference) {
      if (this.clientForCard && this.clientForCard.homePrefs) {
        return this.clientForCard.homePrefs.options
          .filter(pref => pref.wantNeed === preference)
          .map(item => {
            if (item.minValue) {
              return item.text + '-' + item.minValue
            }
            return item.text
          })
      }
      return []
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
              }
            })
          }
        })
      } else {
        this.getClientData()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.divider
  display: grid
  grid-template-columns: 1fr 1fr
  text-align: left

.chips
  color: $hwayzWhite !important
  &:hover
    cursor: pointer !important

.wants-container
  overflow: auto
  height: 300px

#save__btn
  margin-top: -5%
  margin-bottom: 5%

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
