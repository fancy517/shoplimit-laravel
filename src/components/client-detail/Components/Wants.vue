<template>
  <div>
    <v-layout wrap class="container_add_more_Wants">
      <v-flex xs5 md3 class="pt-3">
        <div class="container-input text-xs-left">
          <label class="area-label">Add More Wants</label>
          <input
            v-model="typedPreference"
            type="text"
            @keyup.enter="addTypedPreference()"
          >
        </div>
      </v-flex>
      <v-flex xs3 md3 class="pt-4">
        <v-btn
          :color="'#4caf50'"
          ripple
          round
          outline
          small
          @click.stop="addTypedPreference()"
        >
          + Add Wants
        </v-btn>
      </v-flex>
      <v-flex xs12 md4 offset-md1 class="text-xs-right py-4">
        <loader-button
          :loading="processUpdate"
          btn-class="white--text px-5"
          :btn-settings="{color: '#4caf50'}"
          :btn-text="`Update Wants`"
          @handle-button-click="updateProfileWants()"
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
          v-for="(item, i) in wantsArray"
          :key="i"
          class="chips"
          small
          color="green"
          @click="wantToSeggestions(item)"
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
          @click="suggestionToWant(item)"
        >
          {{ item }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { genericGetRequestToApi, genericPutRequestToApi } from '../../../utils/genericRequests'
import { RetrieveProfileById } from '../../../utils/clientUrls'
import LoaderButton from '../../uiUtils/LoaderButton.vue'
import { isEmpty } from '../../../utils/generalUtils'

export default {
  components: { LoaderButton },
  data() {
    return {
      processUpdate: false,
      typedPreference: '',
      wantsArray: [],
      suggestions: [],
      originalNeedWants: []
    }
  },

  computed: {
    ...mapState('agent', ['selectedClient']),
    ...mapGetters('client', ['getInitialPrefSuggestions']),

    clientForCard() {
      return this.clientDetailForCard
        ? this.clientDetailForCard
        : this.selectedClient
    }
  },

  created() {
    this.wantsArray = this.getClientHomePreferences('Want')
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
    async updateProfileWants() {
      const onlyNeeds = this.originalNeedWants.options
        .filter(needWants => needWants.wantNeed !== 'Want')
        .map(want => {
          return { text: want.text, wantNeed: 'Need' }
        })
      const wantsToAdd = this.wantsArray.map(need => {
        return { text: need, wantNeed: 'Want' }
      })
      const payloadHomePrefs = {
        freetext: '',
        options: [...onlyNeeds, ...wantsToAdd]
      }

      await genericPutRequestToApi(RetrieveProfileById(this.selectedClient._id), {
        homePrefs: payloadHomePrefs
      })
      this.setSelectedClient({ ...this.selectedClient, ...{ homePrefs: payloadHomePrefs } })
    },

    addTypedPreference() {
      if (!isEmpty(this.typedPreference)) {
        this.wantsArray.push(this.typedPreference)
        this.typedPreference = ''
      }
    },

    suggestionToWant(sug) {
      this.wantsArray.push(sug)
      this.suggestions = this.suggestions.filter(
        suggestion => suggestion !== sug
      )
    },

    wantToSeggestions(want) {
      this.suggestions.push(want)
      this.wantsArray = this.wantsArray.filter(wants => wants !== want)
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
    }
  }
}
</script>

<style lang="sass" scoped>
.divider
    display: grid
    grid-template-columns: 1fr 1fr
    text-align: left
    overflow-y: scroll

.chips
    color: $hwayzWhite !important
    &:hover
        cursor: pointer !important

#save__btn
    margin-top: -5%
    margin-bottom: 5%

.wants-container
  overflow: auto
  height: 300px

.v-tabs__div
  font-size: 1.4rem;
  /* padding: 0.5rem 0; */
  text-transform: uppercase;
  color: #6e6e6e !important;

.active-tab
  color: #689bf6 !important;

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
