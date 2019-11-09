<template>
  <v-container v-if="clientData" id="containerFeedback" grid-list-sm fluid>
    <v-container class="pa-0 ma-0">
      <navigation-favorites
        :items="feedbackFields"
        :client-data="clientData"
        @tab-changed="setActive($event)"
      />
    </v-container>
    <div class="container-table">
      <feedback-client-data
        :table-headers="feedbackTableHeaders[active]"
        :table-data="active === 0 ? feedbackNeededHomes : feedbackProvidedHomes"
        :client-data="clientData"
        :feedback-type="feedbackTypes[active]"
      />
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import NavigationFavorites from '../../components/client/favorites/NavigationFavorites.vue'
import FeedbackClientData from '../../components/client/feedback/FeedbackClientData.vue'
import '../../components/icons/hw-verified_feedback-24px'

export default {
  components: { NavigationFavorites, FeedbackClientData },

  data() {
    return {
      active: 0,
      feedbackFields: [
        { value: 0, text: 'Feedback Needed', icon: 'feedback' },
        { value: 1, text: 'Feedback Provided', svgIcon: 'hw-verified_feedback-24px' }
      ],
      feedbackTableHeaders: [
        [
          { value: 'address', text: 'Address', sortable: false, width: '50%' },
          { value: 'showingDate', text: 'Showing Date', sortable: false },
          { value: 'pictures', text: 'Pictures', sortable: false },
          { value: 'offer', text: 'Make Offer', sortable: false, align: 'center' },
          { value: 'feedback', text: 'Provide', sortable: false, align: 'center' }
        ],
        [
          { value: 'address', text: 'Address', sortable: false, width: '50%' },
          { value: 'showingDate', text: 'Showing Date', sortable: false },
          { value: 'pictures', text: 'Pictures', sortable: false },
          { value: 'offer', text: 'Make Offer', sortable: false, align: 'center' },
          { value: 'feedback', text: 'View Feedback', sortable: false }
        ]
      ],
      feedbackTypes: ['needed', 'provided']
    }
  },

  computed: {
    ...mapState('client', ['clientData']),
    ...mapGetters('client', ['feedbackNeededHomes', 'feedbackProvidedHomes'])
  },

  methods: {
    setActive(val) {
      this.active = val
    }
  }
}
</script>

<style lang="sass" scoped>
#containerFeedback
  height: 100%
  padding-top: 0

.container-table
  padding: 2rem 3rem !important
  margin: auto -2px !important
  background-color: $hwayzWhite
  overflow: auto
  max-width: 120rem
  -webkit-box-shadow: -2px 1px 3px 0px rgba(179, 179, 179, 1)
  -moz-box-shadow: -2px 1px 3px 0px rgba(179, 179, 179, 1)
  box-shadow: -2px 1px 3px 0px rgba(179, 179, 179, 1)
</style>
