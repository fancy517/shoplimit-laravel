<template>
  <div id="homeWrap" class="text-left">
    <v-layout wrap justify-space-between>
      <v-flex xs12 sm9 md8 lg12 class="no-padding">
        <v-layout wrap>
          <v-flex xs12 class="dropdown-widget">
            <drop-down-widget
              :title="widgetTitle[0]"
              :number-of-rows="clientHomes ? clientHomes.length : 0"
              :header-style="widgetStyles[0]"
              :is-open="widgetState[0].isOpen"
              @on-open="widgetExpand(0)"
            >
              <template v-if="clientFavorites" v-slot:widget-content>
                <saved-favorites-widget
                  :table-data="clientHomes"
                  :client-favorites="clientFavorites"
                  :options="{hideActions: true}"
                  @favorite-clicked="removeFromFavorites($event)"
                />
              </template>
            </drop-down-widget>
          </v-flex>

          <v-flex xs12 class="dropdown-widget">
            <drop-down-widget
              :title="widgetTitle[1]"
              :number-of-rows="yourScheduleTotalRows"
              :header-style="widgetStyles[1]"
              :is-open="widgetState[1].isOpen"
              @on-open="widgetExpand(1)"
            >
              <!-- The component has to be wrapped in a template. -->
              <template v-slot:widget-content>
                <your-schedule-widget
                  :table-data="clientScheduleData"
                  :options="{hideHeaders: true, hideActions: true, expand: true}"
                  @button-clicked="btnCallback"
                />
              </template>
            </drop-down-widget>
          </v-flex>

          <!-- FEEDBACK MATCH -->
          <v-flex xs12 class="dropdown-widget">
            <drop-down-widget
              :title="widgetTitle[2]"
              :number-of-rows="highMatchFeedbackHomes ? highMatchFeedbackHomes.length : 0"
              :header-style="widgetStyles[2]"
              :is-open="widgetState[2].isOpen"
              @on-open="widgetExpand(2)"
            >
              <!-- The component has to be wrapped in a template. -->
              <template v-slot:widget-content>
                <feedback-match-widget
                  :table-data="highMatchFeedbackHomes"
                  :client-data="clientData"
                  :client-homes="clientFavorites"
                />
              </template>
            </drop-down-widget>
          </v-flex>

          <!-- PROVIDE FEEDBACK -->
          <v-flex xs12 class="dropdown-widget">
            <drop-down-widget
              :title="widgetTitle[3]"
              :number-of-rows="feedbackNeededHomes ? feedbackNeededHomes.length : 0"
              :header-style="widgetStyles[3]"
              :is-open="widgetState[3].isOpen"
              @on-open="widgetExpand(3)"
            >
              <!-- The component has to be wrapped in a template. -->
              <template v-slot:widget-content>
                <feedback-match-widget
                  :table-data="feedbackNeededHomes"
                  :client-data="clientData"
                  :client-homes="clientFavorites"
                  :match-data="false"
                />
              </template>
            </drop-down-widget>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm3 md4>
        <!-- Sidebar -->
        <v-slide-x-reverse-transition>
          <client-detail-card
            v-show="showClientCard"
            :selected-client="clientData"
            :home-buying-stages="homeBuyingStages"
          >
            <template v-slot:close-button>
              <div class="button-close" @click="showClientCard = false">
                <v-icon class="button-close-icon">
                  close
                </v-icon>
              </div>
            </template>
          </client-detail-card>
        </v-slide-x-reverse-transition>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { homeBuyingStages } from '../../components/client-detail/client-fake-data.js'

import SavedFavoritesWidget from '../../components/client/dashboard/SavedFavoritesWidget.vue'
import YourScheduleWidget from '../../components/client/dashboard/YourScheduleWidget.vue'
import FeedbackMatchWidget from '../../components/client/dashboard/FeedbackMatchWidget.vue'
import DropDownWidget from '../../components/home/DropDownWidget.vue'
import ClientDetailCard from '../../components/client-detail/ClientDetailCard.vue'

import refreshClientData from '../../components/mixins/refreshClientData'

import { UpdateDeleteFavoriteUrl } from '../../utils/clientUrls'
import { genericDeleteRequestToApi } from '../../utils/genericRequests'
import { feedbackMatchData, dummyRouteData } from './dummy-data'
import { calculateFeedbackMatch } from '../../utils/propertyUtils'

import colors from '../../scss/_colors.scss'

export default {
  name: 'Home',
  components: {
    SavedFavoritesWidget,
    YourScheduleWidget,
    FeedbackMatchWidget,
    DropDownWidget,
    ClientDetailCard
  },

  mixins: [refreshClientData],

  data() {
    return {
      showClientCard: false, // used for toggling the sidebar with client info
      clientDetailForCard: {},
      homeBuyingStages,
      widgetTitle: [
        'SAVED FAVORITES',
        'YOUR SCHEDULE',
        'FEEDBACK MATCH',
        'PROVIDE FEEDBACK'
      ],
      widgetStyles: [
        { 'background-color': colors.hwayzHover, color: 'white', 'font-weight': '400' },
        { 'background-color': colors.hwayzTeal, color: 'white', 'font-weight': '400' },
        { 'background-color': colors.modalIcon, color: 'white', 'font-weight': '400' },
        { 'background-color': colors.hwayzVioletLight, color: 'white', 'font-weight': '400' }
      ],
      dummyRouteData,
      feedbackHomes: [],
      // savedFavoritesData: [],
      feedbackMatchData,
      widgetState: [0, 1, 2, 3].map(position => ({ isOpen: -1 }))
    }
  },

  computed: {
    ...mapState('client', ['clientData', 'clientFavorites', 'clientHomes']),
    ...mapState('home', {
      homeSearchHeader: state => state.homeSearchHeader,
      homeSearchData: state => state.homeSearchData
    }),
    ...mapGetters('client', ['feedbackNeededHomes', 'feedbackProvidedHomes']),

    yourScheduleTotalRows() {
      return this.clientScheduleData.length || 0
      // var sum = 0
      // if (this.clientScheduleData) {
      //   this.clientScheduleData.forEach((item, index) => {
      //     sum += item.routeStops.length
      //   })
      // }
      // return sum
    },

    highMatchFeedbackHomes() {
      return this.feedbackProvidedHomes.filter(data => Math.round(this.getMatchPercent(data)) / 10 >= 8)
    },

    clientScheduleData() {
      if (this.clientData && this.clientData.routes) {
        return (this.clientData.routes)
      }
      return []
    }
  },

  created() {
    // A temporary function to check properties list for a client
    // Used for debugging purposes
    // for (const property of this.clientFavorites) {
    //   console.log(property._id, '>>>', property.Address, '(', property['MLSNumber'], ')')
    // }
  },

  methods: {
    ...mapActions('client', ['removeFromFavoritesAction']),

    removeFromFavorites(selectedHome) {
      if (selectedHome.requestTour === false) {
        genericDeleteRequestToApi(
          UpdateDeleteFavoriteUrl(this.clientData._id, selectedHome._id)
        ).then(response => {
          if (response.status === 200) {
            this.getClientData()
          }
        })
      }
    },

    getMatchPercent(home) {
      if (home.feedback.match) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return 'N/A'
    },

    btnCallback(id) {
      console.log('test', id)
    },

    widgetExpand(position) {
      this.widgetState.forEach((item, index) => {
        item.isOpen = position === index ? 0 : -1
      })
    }
  }
}
</script>

<style scoped>
#homeWrap h3,
p {
  padding-left: 15px;
}

.dropdown-widget {
  margin: 5px 0;
}

.dropdown-widget:first-child {
  margin-top: 0;
}

.no-padding {
  padding: 0 !important;
}

.button-close {
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
}

.button-close-icon {
  color: #a1a1a1 !important;
  font-size: 15px;
}

.dropdown-widget{
  margin-left: 5px;
  margin-right: 12%;
}
</style>
