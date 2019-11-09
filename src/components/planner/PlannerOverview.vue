<template>
  <v-layout wrap>
    <!-- <v-flex xs12 lg8 order-xs1> -->
    <v-flex xs12>
      <template v-if="selectedClient">
        <panel-container :panel-icon="'home'" :panel-title="`${selectedClient.name}'s Saved Homes`">
          <template v-slot:panel-content>
            <v-layout wrap>
              <v-flex
                xs12
                md7
                offset-md5
                lg6
                offset-lg6
              >
                <v-layout wrap class="planner-overview__mls-wrapper">
                  <v-flex xs8 offset-md0>
                    <input
                      id="mlsAddress"
                      ref="inputValue"
                      type="text"
                      name="mlsAddress"
                      placeholder="MLS# or address"
                      :class="{'error-class': emptyInput}"
                    >
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      color="#00ACC1"
                      style="font-size: 1.2rem; height: 2.8rem"
                      @click.stop="newHomeAdded"
                    >
                      Add Home
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-data-table
              :headers="savedHomeHeaders"
              :items="selectedClientHomes"
              :item-key="selectedClientHomes._id"
              hide-actions
            >
              <template v-if="selectedClientHomes && selectedClientHomes.length > 0" v-slot:items="props">
                <td class="text-xs-left planner-overview__image-data">
                  <img
                    :src="getHomeDetails(props.item._id, 'Images')"
                    :alt="getHomeDetails(props.item._id, 'Images')"
                    class="planner-overview__home-image"
                  >
                  <div>{{ getHomeDetails(props.item._id, 'Address') }}</div>
                </td>
                <td class="text-xs-left">
                  {{ props.item.added_ts | dateFormat }}
                </td>
                <td class="text-xs-left">
                  <v-btn
                    fab
                    small
                    color="pink"
                    class="planner-overview__fab"
                    @click.stop="openConfirmationModal(props.item)"
                  >
                    <v-icon small color="white">
                      close
                    </v-icon>
                  </v-btn>
                </td>
                <td v-if="props.item.queuelevel === 'initial'">
                  <div class="text-xs-center">
                    <v-checkbox
                      v-model="selectedHouses"
                      :input-value="props.selected"
                      hide-details
                      :value="props.item"
                    />
                  </div>
                </td>
                <td v-else class="text-xs-left">
                  Added
                </td>
              </template>
            </v-data-table>
            <div class="planner-overview__house-btn">
              <!-- if at least one home is selected -->
              <v-dialog
                v-if="selectedHouses && selectedHouses.length > 0"
                v-model="openAddHomesModal"
                :width="alert.width"
                :max-width="alert.small_maxWidth"
              >
                <v-btn slot="activator" small round>
                  ADD TO ROUTE
                </v-btn>
                <add-homes-to-route
                  :selected-client="selectedClient"
                  :selected-houses="selectedHouses"
                  :on-close-modal="closeModals"
                  :client-properties="clientSavedHomes"
                  :selected-route-details="selectedRouteDetails"
                />
              </v-dialog>
              <v-dialog
                v-else
                v-model="openPlanRouteModal"
                :width="alert.width"
                :max-width="alert.small_maxWidth"
              >
                <v-btn slot="activator" small round>
                  ADD TO ROUTE
                </v-btn>
                <no-home-selected :on-close-modal="closeModals" />
              </v-dialog>
              <v-btn
                v-if="selectedHouses && selectedHouses.length > 0"
                small
                round
                @click="redirectToRoutePlanning()"
              >
                PLAN ROUTE
              </v-btn>
              <v-dialog
                v-else
                v-model="openPlanRouteModal"
                :width="alert.width"
                :max-width="alert.small_maxWidth"
              >
                <v-btn slot="activator" small round>
                  PLAN ROUTE
                </v-btn>
                <no-home-selected :on-close-modal="closeModals" />
              </v-dialog>
            </div>
          </template>
        </panel-container>
      </template>
      <template v-else>
        Loading Data...
      </template>
    </v-flex>

    <!-- Schedule details for the client -->
    <!-- <v-flex
      xs12
      order-xs3
      md6
      lg4
      order-lg2
    >
      <panel-container :panel-icon="'calendar_today'" :panel-title="`${selectedClient.name}'s Schedules`">
        <template v-slot:panel-content>
          <v-data-table :headers="scheduleHeaders" :items="getClientSchedules()" hide-actions>
            <template v-slot:items="props">
              <td>{{ props.item.scheduledDate | dateFormat }}</td>
              <td>{{ props.item.scheduledDate | displayDayFilter }}</td>
              <td>{{ props.item.scheduledDate | displayTimeFilter }}</td>
            </template>
          </v-data-table>
        </template>
      </panel-container>
    </v-flex>-->

    <!-- Route details and related homes for the client -->
    <!-- <v-flex
      xs12
      lg8
      order-xs2
      order-lg3
    >-->
    <v-flex xs12>
      <panel-container
        :panel-icon="'calendar_today'"
        :panel-title="`${selectedClient.name}'s Routes`"
      >
        <template v-slot:panel-content>
          <v-layout wrap class="planner-overview__route-header">
            <v-flex xs4 md2>
              Route Name
            </v-flex>
            <v-flex xs4 md3>
              Date and Time
            </v-flex>
            <v-flex xs4 md2>
              Status
            </v-flex>
          </v-layout>
          <hr>
          <!-- <div v-for="route in selectedClient.route_details" :key="route.id"> -->
          <!-- A temporary looping... this will be replaced by object data -->
          <client-route-details :saved-homes="clientSavedHomes" />
        </template>
      </panel-container>
    </v-flex>
    <v-dialog
      v-model="confirmationModal.status"
      :width="alert.width"
      :max-width="alert.maxWidth"
    >
      <confirmation-modal
        :modal-options="confirmationModal"
        @on-negative-clicked="onCancelDelete"
        @on-positive-clicked="removePropertyFromSavedHomes"
      />
    </v-dialog>
    <!-- Communication details for the client -->
    <!-- <v-flex
      xs12
      md6
      lg4
      order-xs4
    >
      <communication-widget :messages="dummyClientData.messages" />
    </v-flex>-->
  </v-layout>
</template>

<script>
import moment from 'moment'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import refreshContent from '../mixins/refreshContent'
import {
  clientData
} from '../client-detail/client-fake-data'
import ClientRouteDetails from '../agent/planner/ClientRouteDetails.vue'
import NoHomeSelected from '../modals/NoHomeSelected.vue'
import AddHomesToRoute from '../modals/AddHomesToRoute.vue'
import PanelContainer from '../uiUtils/PanelContainer.vue'
import ConfirmationModal from '../modals/ConfirmationModal.vue'

import { activeViewingStatus } from '../calendar/calendarConst'
import { genericDeleteRequestToApi } from '../../utils/genericRequests'
import { CreateUpdateDeleteHomeUrl } from '../../utils/agentUrls'
import { getPropertyKeyValue } from '../../utils/propertyUtils'

export default {
  components: {
    // CommunicationWidget,
    ClientRouteDetails,
    NoHomeSelected,
    AddHomesToRoute,
    PanelContainer,
    ConfirmationModal
  },

  filters: {
    dateFormat: value => {
      return moment(value).format('MM-DD-YYYY')
    },

    displayDayFilter: value => {
      return moment(value).format('dddd')
    },

    displayTimeFilter: value => {
      return moment(value).format('hh:mm A')
    }
  },

  mixins: [refreshContent],

  data: () => ({
    active: null,
    confirmationModal: {
      status: false,
      message: null,
      positive: null,
      negative: null
    },
    selectedForRemoval: null,
    savedHomeHeaders: [
      { text: 'Home Address', value: 'address', width: '50%', sortable: false },
      { text: 'Date Requested', value: 'date', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
      { text: 'Plan Route', value: 'planRoute', sortable: false }
    ],
    clientRoutesHeaders: [
      { text: 'Route Name', value: 'routeName' },
      { text: 'Date and Time', value: 'date' },
      { text: 'Status', value: 'status' }
    ],
    scheduleHeaders: [
      { text: 'Date Confirmed', value: 'date', sortable: false },
      { text: 'Day', value: 'day', sortable: false },
      { text: 'Start Time', value: 'startTime', sortable: false }
    ],
    selectedHouses: [],
    openPlanRouteModal: false,
    openAddHomesModal: false,
    emptyInput: false,
    dummyClientData: clientData[0]
  }),

  computed: {
    ...mapState('agent', ['selectedClient', 'clientSavedHomes']),
    /**
     * Mapping selected client from the Vuex store to local version
     */
    ...mapGetters('agent', ['getActiveAgentData']),
    ...mapState('style', ['alert']),

    selectedClientHomes() {
      if (this.selectedClient && this.selectedClient.homes) {
        return this.selectedClient.homes
      }
      return []
    },

    selectedRouteDetails() {
      if (this.getActiveAgentData && this.selectedClient) {
        const clientPropertiesOfInterest = this.getActiveAgentData.propertiesOfInterest.filter(property => property.parent._id === this.selectedClient.Id)

        const clientViewings = [].concat(
          ...clientPropertiesOfInterest.map(property => property.viewings)
        )

        const clientActiveViewings = clientViewings.filter(viewing => {
          return activeViewingStatus.includes(viewing.workflowState)
        })

        return clientActiveViewings.filter(viewing => {
          return (
            moment().format('MM-DD-YY') ===
          moment(viewing.scheduled).format('MM-DD-YY')
          )
        })
      }
      return null
    }
  },

  /**
   * Send request to retrieve API data for cases
   * when the data is modified
   */
  created() {
    console.log(this.selectedClient._id, this.clientSavedHomes)
    this.clientHomeDetailsAction(this.selectedClient)
  },

  updated() {
    console.log('[PlannerOverview.vue] -- updated', this.selectedClient.homes)
    this.selectedHouses = []
  },

  methods: {
    ...mapActions('client', ['clientHomeDetailsAction']),
    /**
     * Mapping home actions
     */
    ...mapMutations('home', {
      setActiveRoute: 'SET_ACTIVE_ROUTE'
    }),

    /**
     * Handling opening of confirmation modal
     * If agent accepts it, then the property is removed from the list
     *
     * @param {Object} houseData house object selected for removal
     */
    openConfirmationModal(houseData) {
      this.selectedForRemoval = houseData
      Object.assign(this.confirmationModal, {
        status: true,
        message: `Do you really want to remove ${
          houseData['Address']
        } from adding to the route`,
        positive: 'Yes, remove it',
        negative: 'No, keep it'
      })
    },

    /**
     * Handles negative confirmation for removal of property
     */
    onCancelDelete() {
      this.confirmationModal = { status: false, message: null }
    },

    /**
     * API request to remove a saved property from the client's
     * listed saved homes - done from agent side
     *
     * @public
     * @param {String} propertyId id of selected home for removal
     */
    removePropertyFromSavedHomes() {
      genericDeleteRequestToApi(
        CreateUpdateDeleteHomeUrl(this.selectedClient._id, this.selectedForRemoval._id)
      ).then(res => {
        if (res.status === 200) {
          this.getAgentData()
          this.onCancelDelete()
        }
      })
    },

    closeModals() {
      this.openPlanRouteModal = false
      this.openAddHomesModal = false
      this.selectedHouses = []
      this.getAgentData()
    },

    /**
     * Handles redirecting to creation of a new route
     * when some homes are selected to create a new route
     */
    redirectToRoutePlanning() {
      this.$router.push({
        name: 'planner',
        params: {
          selectedHouses: this.selectedHouses,
          showPlanRouteModal: false
        }
      })
      this.setActiveRoute('planner')
    },

    newHomeAdded() {
      console.log('New home added', this.$refs.inputValue.value)
    },

    /**
     * Get homes that have associated schedules of the client
     */
    getClientSchedules() {
      let schedulesArray = []
      if (this.selectedClient.homes) {
        this.selectedClient.homes.forEach(home => {
          if (home.queuelevel === 'scheduling') {
            home.schedulings.forEach(schedule => {
              if (schedule.scheduledDate || schedule.completedDate) {
                schedulesArray.push(schedule)
              }
            })
          }
        })
      }
      return schedulesArray
    },

    /**
     * Retrieve home details based on property id and required value
     * Calls the common utility function for retrieving a key value for property
     *
     * @public
     * @param {String} propertyId id of selected home for removal
     * @param {String} key specific detail for the property
     */
    getHomeDetails(propertyId, key) {
      // console.log(propertyId, key, this.clientSavedHomes)
      return getPropertyKeyValue(propertyId, this.clientSavedHomes, key)
    }
  }
}
</script>

<style scoped>
.flex {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.planner-overview__fab {
  height: 2.4rem !important;
  width: 2.4rem !important;
}

.planner-overview__house-btn {
  margin: 1.5rem 0;
  text-align: right;
}

.planner-overview__house-btn button {
  background-color: #00acc1 !important;
}

.planner-overview__house-btn .v-btn__content {
  font-weight: 300;
  font-size: 0.8em;
}

.planner-overview__route-header {
  padding: 2rem;
  font-size: 1.4rem;
}

.planner-overview__image-data {
  display: flex;
  flex-flow: column;
  margin-bottom: 0.5rem;
  height: 100% !important;
  min-height: 10rem;
}

.planner-overview__image-data div {
  font-weight: 600;
}

.planner-overview__home-image {
  height: auto;
  max-width: 12rem;
  padding: 1rem 0;
}

#mlsAddress {
  outline: none;
  width: 100%;
  height: 4rem;
  border-bottom: 0.1rem solid #888;
}

#addHomesToRoute .v-expansion-panel__header {
  padding: 1rem 2rem !important;
}

#addHomesToRoute .v-expansion-panel__header__icon {
  display: none !important;
}

#addHomesToRoute .v-btn {
  font-size: 0.7em !important;
  float: right;
}

#addHomesToRoute .modal__header {
  padding-top: 1.2rem;
}

.planner-overview__mls-wrapper {
  padding-top: 2rem;
  margin-bottom: 2rem;
}

@media only screen and (min-width: 960px) {
  .planner-overview__mls-wrapper {
    padding-top: 0;
  }

  .planner-overview__image-data {
    flex-flow: row;
    max-height: 12rem;
    width: auto;
    align-items: center;
  }

  .planner-overview__image-data div {
    padding-left: 2rem;
  }
}
</style>
