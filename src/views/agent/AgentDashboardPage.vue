<template>
  <div id="homeWrap" class="text-left">
    <v-container grid-list-md fluid>
      <v-layout justify-space-between>
        <v-flex xs12 lg9 class="no-padding">
          <!-- CREATE HOME SEARCH DATA -->
          <v-layout wrap>
            <v-flex xs12 class="dropdown-widget">
              <drop-down-widget
                :title="'CREATE HOME SEARCH'"
                :number-of-rows="homeSearchData ? homeSearchData.length : 0"
                :header-style="widgetStyles[0]"
                :is-open="widgetOptions[0].isOpen"
                @on-open="openWidgetChanged(0)"
              >
                <template v-if="agentData" v-slot:widget-content>
                  <create-home-search-widget
                    :table-data="homeSearchData"
                    :options="{hideActions: true}"
                    @client-clicked="toggleClientDetailCard($event)"
                  />
                </template>
              </drop-down-widget>
            </v-flex>

            <!-- ROUTE PLANNER DATA -->
            <v-flex xs12 class="dropdown-widget">
              <drop-down-widget
                :title="widgetTitles[0]"
                :number-of-rows="widgetData[0] ? widgetData[0].length : 0"
                :header-style="widgetStyles[1]"
                :is-open="widgetOptions[1].isOpen"
                @on-open="openWidgetChanged(1)"
              >
                <template v-slot:widget-content>
                  <widget-table
                    :column-names="widgetHeaders[0]"
                    :data="widgetData[0]"
                    :options="{hideActions: true}"
                    @client-clicked="toggleClientDetailCard"
                  />
                </template>
              </drop-down-widget>
            </v-flex>

            <!-- REQUEST FEEDBACK -->
            <v-flex xs12 class="dropdown-widget">
              <drop-down-widget
                :title="'REQUEST FEEDBACK'"
                :number-of-rows="homeSearchData ? homeSearchData.length : 0"
                :header-style="widgetStyles[2]"
                :is-open="widgetOptions[2].isOpen"
                @on-open="openWidgetChanged(2)"
              >
                <!-- The component has to be wrapped in a template. -->
                <template v-slot:widget-content>
                  <request-feedback-widget
                    :table-data="homeSearchData"
                    :options="{hideHeaders: false, hideActions: true, expand: false}"
                    @button-clicked="btnCallback"
                    @client-clicked="toggleClientDetailCard"
                    @request-feedback="sendFeedbackRequest($event)"
                  />
                </template>
              </drop-down-widget>
            </v-flex>
            <!-- MAKE OFFER -->
            <v-flex xs12 class="dropdown-widget">
              <drop-down-widget
                :title="'MAKE OFFER'"
                :number-of-rows="makeOfferData.count"
                :header-style="widgetStyles[3]"
                :is-open="widgetOptions[3].isOpen"
                @on-open="openWidgetChanged(3)"
              >
                <!-- The component has to be wrapped in a template. -->
                <template v-slot:widget-content>
                  <make-offer-widget
                    :offer-data="makeOfferData.data"
                    :column-names="makeOfferHeader"
                    :nested-table-header="makeOfferNestedHeader"
                    @client-clicked="toggleClientDetailCard"
                    @request-offer="sendRequestOffer($event)"
                  />
                </template>
              </drop-down-widget>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-slide-x-reverse-transition>
          <v-flex v-if="showClientCard" xs10 lg4>
            <!-- Sidebar -->
            <client-detail-card :client-detail-for-card="clientDetailForCard">
              <template v-slot:close-button>
                <i class="material-icons corner" @click="showClientCard = false">close</i>
              </template>
            </client-detail-card>
          </v-flex>
        </v-slide-x-reverse-transition>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import DropDownWidget from '../../components/home/DropDownWidget.vue'
import CreateHomeSearchWidget from '../../components/agent/dashboard/CreateHomeSearchWidget.vue'
import RequestFeedbackWidget from '../../components/agent/dashboard/RequestFeedbackWidget.vue'
import MakeOfferWidget from '../../components/agent/dashboard/MakeOfferWidget.vue'

import widgetTable from '../../components/home/WidgetTable.vue'
import ClientDetailCard from '../../components/client-detail/ClientDetailCard.vue'
import { calculateFeedbackMatch, feedbackProvidedProperties } from '../../utils/propertyUtils'
import { isEmpty } from '../../utils/generalUtils'
import { askClientForFeedback, askClientForOffer } from '../../services/messagesService'
import { getPropertyById } from '../../services/propertiesService'

import colors from '../../scss/_variables.scss'

export default {
  components: {
    DropDownWidget,
    CreateHomeSearchWidget,
    RequestFeedbackWidget,
    widgetTable,
    MakeOfferWidget,
    ClientDetailCard
  },

  data() {
    return {
      makeOfferData: {
        count: 0,
        data: []
      },
      showClientCard: false, // used for toggling the sidebar with client info
      clientDetailForCard: null,
      widgetTitles: ['ROUTE PLANNER'],
      widgetStyles: [
        {
          'background-color': colors.hwayzHover,
          color: 'white',
          'font-weight': '700'
        },
        {
          'background-color': colors.hwayzTeal,
          color: 'white',
          'font-weight': '700'
        },
        {
          'background-color': colors.hwayzViolet,
          color: 'white',
          'font-weight': '700'
        },
        {
          'background-color': colors.hwayzDarkenGreen,
          color: 'white',
          'font-weight': '700'
        }
      ],
      /* Example of data we can iterate through and create all the widgets that are same styled. */
      // widgetData: [],
      // widgetData: [
      //   [
      //     {
      //       id: '0',
      //       name: 'Ali M',
      //       planRoute: 10,
      //       requestShowings: 10,
      //       sendSchedule: 10,
      //       scheduled: 10
      //     },
      //     {
      //       id: '1',
      //       name: 'Damir B',
      //       planRoute: 10,
      //       requestShowings: 10,
      //       sendSchedule: 10,
      //       scheduled: 10
      //     }
      //   ]
      // ],
      widgetHeaders: [
        [
          { text: '', value: 'name' },
          { text: 'Plan Route', value: 'planRoute' },
          { text: 'Request Showings', value: 'requestShowings' },
          { text: 'Send Schedule', value: 'sendSchedule' },
          { text: 'Scheduled', value: 'scheduled' }
        ],
        [
          { text: 'Client', value: 'name' },
          { text: 'Saved Homes', value: 'savedHomes' },
          { text: 'Toured Homes', value: 'touredHomes' },
          { text: 'Feedback', value: 'feedback' },
          { text: 'Last Active', value: 'lastActive' }
        ]
      ],
      makeOfferNestedHeader: [
        { text: '', value: 'name', width: '45%' },
        { text: 'Match', value: 'match', width: '35%' },
        { text: 'Send Offer Email', value: 'send', width: '25%' }
      ],
      makeOfferHeader: [
        { text: '', value: 'name', sortable: false },
        { text: '', value: 'match', sortable: false },
        { text: '', value: 'send', sortable: false }
      ],
      widgetOptions: [
        {
          isOpen: -1
        },
        {
          isOpen: -1
        },
        {
          isOpen: -1
        },
        {
          isOpen: -1
        }
      ]
    }
  },

  computed: {
    ...mapState('home', ['homeSearchHeader']),
    ...mapState('agent', ['selectedClient', 'agentData']),
    ...mapState('common', ['routeData']),

    widgetData() {
      // TODO: compute the arrays
      let planRoutes = this.countRequested()
      let requestShowings = this.getColumnData('saved')
      let sendSchedules = this.getColumnData('confirmed')
      let scheduleds = this.getColumnData('scheduled')
      // console.log(this.agentData.clients.length)
      if (this.agentData && this.agentData.clients) {
        let clientsData = [[]]
        this.agentData.clients.map((client, index) => {
          clientsData[0].push({
            ...client,
            planRoute: planRoutes[index],
            requestShowings: requestShowings[index],
            sendSchedule: sendSchedules[index],
            scheduled: scheduleds[index]
          })
        })
        return clientsData
      }
      return [[]]
    },

    /**
     * Retrieving number of homes for home search data
     * based on their status
     */
    homeSearchData() {
      if (this.agentData && this.agentData.clients) {
        return this.agentData.clients.map(client => {
          return {
            ...client,
            lastActive: moment(client.lastActivity).format('MM-DD-YY')
          }
        })
      }
      return null
    }
  },

  watch: {
    async agentData() {
      this.makeOfferData = await this.getMakeOfferData()
    }
  },

  async mounted() {
    this.makeOfferData = await this.getMakeOfferData()
  },

  methods: {
    ...mapActions('common', ['getRouteData']),

    btnCallback(id) {
      console.log('test', id)
    },

    countRequested() {
      if (this.agentData) {
        let dataArray = []
        this.agentData.clients.map((client, index) => {
          dataArray[index] = 0
          client.homes.map(home => {
            if (home.requestTour) {
              dataArray[index] += 1
            }
          })
        })
        return dataArray
      }
      return []
    },

    getColumnData(columnState) {
      let dataArray = []
      if (this.agentData) {
        this.agentData.clients.map((client, index) => {
          dataArray[index] = 0
          this.getRouteData({ data: client, type: 'client' })
          this.routeData.map(route => {
            if (route.state === columnState) {
              dataArray[index] += 2 + route.routeStops.length
            }
          })
        })
      }
      return dataArray
    },

    // countSaved() {
    //   // Request showings, will count the number of homes in a saved route for that client.
    //   if (this.agentData) {
    //     let dataArray = []
    //     this.agentData.clients.map((client, index) => {
    //       dataArray[index] = 0
    //       this.getRouteData({ data: client, type: 'client' })
    //       this.routeData.map(route => {
    //         if (route.state === 'saved') {
    //           dataArray[index] += 2 + route.routeStops.length
    //         }
    //       })
    //     })
    //     return dataArray
    //   }
    //   return []
    // },

    // countConfirmed() {
    //   // Send Schedule will count the number of homes in a Confirmed route for that client.
    //   if (this.agentData) {
    //     let dataArray = []
    //     this.agentData.clients.map((client, index) => {
    //       dataArray[index] = 0
    //       this.getRouteData({ data: client, type: 'client' })
    //       this.routeData.map(route => {
    //         if (route.state === 'confirmed') {
    //           dataArray[index] += 2 + route.routeStops.length
    //         }
    //       })
    //     })
    //     return dataArray
    //   }
    //   return []
    // },

    // countScheduled() {
    //   // Scheduled will count the number of homes in a Scheduled route.
    //   // TODO: change state
    //   if (this.agentData) {
    //     let dataArray = []
    //     this.agentData.clients.map((client, index) => {
    //       dataArray[index] = 0
    //       this.getRouteData({ data: client, type: 'client' })
    //       this.routeData.map(route => {
    //         if (route.state === 'scheduled') {
    //           dataArray[index] += 2 + route.routeStops.length
    //         }
    //       })
    //     })
    //     return dataArray
    //   }
    //   return []
    // },

    async getMakeOfferData() {
      let result = {
        count: 0,
        data: []
      }
      if (this.agentData) {
        await Promise.all(this.agentData.clients.map(async client => {
          let feedbackHomes = feedbackProvidedProperties(client.homes)
          feedbackHomes = feedbackHomes
            .filter(item => Math.round(this.calculateFeedbackPercent(item)) / 10 >= 8)
          if (feedbackHomes.length > 0) {
            feedbackHomes = await Promise.all(feedbackHomes.map(async home => {
              const res = (await getPropertyById(home.propertyId)).data
              home.propertyData = res
              return home
            }))
            result.count += feedbackHomes.length
            result.data.push({
              ...{
                id: client._id,
                nestedTableData: feedbackHomes
              },
              ...client })
          }
        }))
      }
      return result
    },

    calculateFeedbackPercent(home) {
      if (home.feedback) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return 'N/A'
    },

    // planRouteHomes(){
    //   if (this.agentData && this.agentData.clients) {
    //     let dataArray = []
    //     this.agentData.clients.map(client => {
    //       let planRoutedHomes = client.homes.filter(home=>home.tourRequest).length
    //       dataArray.push(planRoutedHomes)
    //     }
    //   }
    //   return 0
    // },

    // Modify this method to send request to agent data
    // to retrieve the clicked client data
    // At present it is displaying the searched results details
    toggleClientDetailCard(client) {
      if (!client) {
        console.log('toggleClientDetalCard(): Replace Client Data Here')
      } else {
        this.clientDetailForCard = client
      }

      if (this.showClientCard === false) {
        this.showClientCard = true
      }
    },

    /**
     * Close all panels except panel by index
     * @param {String} index - index of panel which should be open
     */
    openWidgetChanged(index) {
      this.widgetOptions.forEach((item, ind) => {
        if (ind === index) {
          item.isOpen = 0
        } else {
          item.isOpen = -1
        }
      })
    },

    /**
     * Sends messages with asking for feedback
     * @param {Object} data - Client data object
     */
    async sendFeedbackRequest(data) {
      const homesWithoutFeedBack = data.homes
        .filter(home => isEmpty(home.feedback))
      const requests = homesWithoutFeedBack.map(home => {
        return getPropertyById(home.propertyId)
          .then(response => {
            if (response.data) {
              return askClientForFeedback({
                to: [data._id],
                address: response.data['Address']
              })
            }
            return false
          })
      })
      Promise.all(requests).then(res => {
        // TODO: Add modal
      })
    },

    sendRequestOffer(data) {
      return askClientForOffer({
        to: [data._id],
        address: data.address
      })
    }
  }
}
</script>

<style lang="sass" scoped>
#homeWrap
  h3, p
    padding-left: 15px
  .container.fluid
    padding: 5px 5px 0 5px !important

.dropdown-widget
  margin: 1px 0
  &:first-child
    margin-top: 5px

.no-padding
  padding: 0 !important

.button-close
  position: absolute
  top: 5px
  right: 10px
  cursor: pointer

.button-close-icon
  color: #a1a1a1 !important
  font-size: 15px

.dropdown-widget
  margin-right: 10px

</style>
