<template>
  <div id="planRouteContainer">
    <!-- Data of selected homes for creation of a new route
    <p
      v-for="(house, index) in computedHouses"
      :key="house._id"
      style="font-size: 1.2rem; text-align: left;"
    >
      {{ index + 1 }} - {{ house }}
      <br>
    </p>-->
    <template v-if="selectedClient">
      <v-layout wrap class="pt-5">
        <v-flex xs12 md8>
          <div style="color: #FF9800" class="text-left">
            Selected home for route
          </div>
          <hr style="border-top: 1px solid #FF9800; margin-top: 0rem;">

          <!-- chosen date and date selector -->
          <div class="plan-route__header">
            <v-layout wrap>
              <v-flex xs8 class="text-xs-left">
                <v-icon
                  color="pink"
                  medium
                  :style="{'display' : $vuetify.breakpoint.xsOnly ? 'none' : 'inline-block'}"
                >
                  calendar_today
                </v-icon>
                <span class="plan-route__small-text">Chosen Date</span>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="date"
                  lazy
                  transition="scale-transition"
                  offset-y
                >
                  <v-text-field slot="activator" v-model="date" readonly />
                  <v-date-picker v-model="date" no-title scrollable>
                    <v-spacer />
                    <v-btn flat color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs4 class="text-xs-right">
                <v-btn
                  color="pink"
                  small
                  class
                  disabled
                >
                  Set Date
                </v-btn>
              </v-flex>
            </v-layout>
          </div>

          <!-- Name of Route and adding route header -->
          <div class="plan-route__header">
            <v-layout wrap class="d-flex">
              <v-flex md8 class="align-items-center text-xs-left">
                <v-icon
                  color="pink"
                  medium
                  :style="{'display' : $vuetify.breakpoint.xsOnly ? 'none' : 'inline-block'}"
                >
                  home
                </v-icon>
                <span class="plan-route__small-text">Route Name</span>
                <input
                  id="displayedRoute"
                  type="text"
                  name="routeName"
                  :value="routeName"
                  disabled
                >
              </v-flex>
              <v-flex md4 class="text-xs-right">
                <!-- <v-dialog model="openSetName" width="480px"> -->
                <v-btn
                  slot="activator"
                  disabled
                  color="pink"
                  small
                  class="plan-route__"
                >
                  Set name
                </v-btn>
              <!-- <route-name-modal :current-name="routeName" @route-name-entered="routeNameEntered" />
              </v-dialog>-->
              </v-flex>
            </v-layout>
          </div>

          <!-- Displaying the homes table currently associated with this route -->
          <div class="plan-route__table">
            <v-layout>
              <v-flex md10>
                <template v-if="computedHouses">
                  <v-data-table
                    :headers="homesForCurrentRoute"
                    :items="computedHouses"
                    :item-key="computedHouses.id"
                    hide-actions
                  >
                    <template v-slot:items="props">
                      <td
                        class="text-left"
                      >
                        {{ getHomeDetails(props.item.propertyId)["MLSNumber"] }} - {{ getHomeDetails(props.item.propertyId)['Address'] }}
                      </td>
                      <td class="text-left">
                        {{ getETATimeFormat(props.item.scheduled) || 'pending' }}
                      </td>
                      <td>
                        <v-btn
                          disabled
                          fab
                          small
                          color="pink"
                          class="planner-overview__fab"
                          @click.native.stop="openConfirmationModal(props.item)"
                        >
                          <v-icon small color="white">
                            close
                          </v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
                </template>
              </v-flex>
            </v-layout>
          </div>
          <hr>

          <!-- adding a home from MLS row -->
          <v-layout wrap class="plan-route__header pl-md-5 mt-3">
            <v-flex xs8 md3>
              <input
                id="mlsNum"
                type="number"
                name="mlsNum"
                placeholder="MLS #"
                @input="onInputChange($event)"
              >
            </v-flex>
            <v-flex xs8 md6>
              <input
                id="mlsAddress"
                ref="addressValue"
                disabled
                type="text"
                name="mlsAddress"
                placeholder="Address from MLS"
              >
            </v-flex>
            <v-flex xs4 md2>
              <!-- <v-btn
              :disabled="mlsNum === ''"
              color="pink"
              small
              style="font-size: 1.2rem; margin-top: -.5rem;"
              @click.stop="newHomeAdded"
            >
              Add Home
            </v-btn>-->
              <v-btn
                disabled
                color="pink"
                small
                style="font-size: 1.2rem; margin-top: -.5rem;"
                @click.stop="newHomeAdded"
              >
                Add Home
              </v-btn>
            </v-flex>
          </v-layout>

          <!-- the bottom button row -->
          <v-layout wrap class="plan-route__footer-btn">
            <v-flex xs6 sm4>
              <v-btn color="#00ACC1" round class="plan-route__btn-set">
                Calculate Route
              </v-btn>
            </v-flex>
            <v-flex xs6 sm4>
              <v-dialog v-model="openSaveRoute" width="480px">
                <v-btn
                  slot="activator"
                  color="#51D16F"
                  round
                  class="plan-route__btn-set"
                >
                  Save Route
                </v-btn>
                <save-route-confirmed
                  :current-name="routeName"
                  route-name-entered="routeNameEntered"
                  @redirect-to-overview="$router.push({name: 'overview'})"
                  @redirect-to-saved-route="$router.push({name: 'saved'})"
                />
              </v-dialog>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn color="#FF9800" round class="plan-route__btn-set">
                Request Showings
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex
          xs8
          offset-xs2
          md4
          offset-md0
          class="plan-route__map mt-lg-0 mt-sm-5"
        >
          <img src="/img/plan-route-map.png" alt="Plan Route Map">
        </v-flex>
        <v-dialog v-model="showModal" width="800">
          <choose-homes-for-route
            :selected-client="selectedClient"
            :client-property-details="clientSavedHomes"
            @close-modal="onCloseHouseSelectModal"
          />
        </v-dialog>
        <v-dialog v-model="confirmationModal.status" width="500">
          <confirmation-modal
            :modal-options="confirmationModal"
            @on-negative-clicked="onCancelDelete"
            @on-positive-clicked="removeHouseData"
          />
        </v-dialog>
      </v-layout>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import ChooseHomesForRoute from '../../modals/ChooseHomesForRoute.vue'
import SaveRouteConfirmed from '../../modals/SaveRouteConfirmed.vue'
import ConfirmationModal from '../../modals/ConfirmationModal.vue'

export default {
  components: {
    ChooseHomesForRoute,
    // RouteNameModal,
    SaveRouteConfirmed,
    ConfirmationModal
  },

  props: {
    selectedHouses: {
      type: Array,
      default: function() {
        return []
      }
    },
    showPlanRouteModal: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    showModal: false,
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    emptyInput: true,
    localSelectedHouses: null,
    selectedForRemoval: null,
    confirmationModal: {
      status: false,
      message: null,
      positive: null,
      negative: null
    },
    mlsNum: '',
    homesForCurrentRoute: [
      { text: 'Home Address', value: 'address', width: '70%', sortable: false },
      { text: 'ETA', value: 'time', width: '25%', sortable: false },
      { text: 'Actions', value: 'actions', width: '10%', sortable: false }
    ],
    openSetName: false,
    openSaveRoute: false,
    routeName: 'Scheduled Routes'
  }),

  computed: {
    ...mapState('agent', ['selectedClient', 'clientSavedHomes']),

    computedHouses() {
      // const clientViewings = [].concat(
      //   ...this.getClientPOIs.map(property => {
      //     return property.viewings
      //   })
      // )

      // const clientActiveViewings = clientViewings.filter(viewing => {
      //   return activeViewingStatus.includes(viewing.workflowState)
      // })

      // return this.getRouteDetails(clientActiveViewings)
      return []
    }
  },

  watch: {
    showPlanRouteModal: {
      immediate: true,
      handler(newValue, oldValue) {
        this.showModal = newValue
      }
    }
  },

  created() {
    if (this.selectedHouses && this.selectedHouses.length > 0) {
      this.addSavedHomesToRoute(this.selectedClient._id, this.selectedHouses[0]._id)
    }
  },

  methods: {
    /**
     * Sets the new name for the current active router
     * @param {string} newName new name for the router
     * @public
     */
    routeNameEntered(newName) {
      if (newName.length > 0) {
        this.routeName = newName
      }
      this.openSetName = false
    },

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
        positive: 'Yes, remove that',
        negative: 'No, keep it'
      })
    },

    /**
     * Create Route details
     */
    getRouteDetails(viewings) {
      const filteredViewings = viewings.filter(viewing => {
        return (
          moment(this.date).format('YYYY-MM-DD') ===
          moment(viewing.scheduled).format('YYYY-MM-DD')
        )
      })

      return this.getUniqueArrayObject(filteredViewings, 'propertyId')
    },

    getUniqueArrayObject(arrayObject, comparingParam) {
      return arrayObject.filter((element, index, final) => final.findIndex(v => {
        let elementTime = moment(element['scheduled'])
        let vTime = moment(v['scheduled'])
        return (v[comparingParam] === element[comparingParam] && elementTime.isSame(vTime))
      }) === index)
    },

    /**
     * Retrieve home details based on home id
     */
    getHomeDetails(homeId) {
      if (this.clientSavedHomes) {
        const foundHome = this.clientSavedHomes.find(
          home => home._id === homeId
        )
        if (foundHome) {
          return foundHome
        }
      }
      return homeId
    },

    /**
     * Get expected time of arrival for the scheduled property
     */
    getETATimeFormat(scheduled) {
      if (scheduled) {
        return moment(scheduled).format('hh:mm a')
      }
      return null
    },

    /**
     * Removes the property from the list after confirmation
     */
    removeHouseData() {
      this.localSelectedHouses = this.localSelectedHouses.filter(
        home => home._id !== this.selectedForRemoval._id
      )
      this.onCancelDelete()
    },

    /**
     * Handles negative confirmation for removal of property
     */
    onCancelDelete() {
      this.confirmationModal = { status: false, message: null }
    },

    /**
     * Handles closing of house select modal for route creation
     */
    onCloseHouseSelectModal(checkedProperties) {
      if (checkedProperties && checkedProperties.length > 0) {
        this.addSavedHomesToRoute(this.selectedClient._id, checkedProperties[0]._id)
      }
      this.showModal = false
    },

    /**
     * Input text handler for
     */
    onInputChange(event) {
      this[event.target.name] = event.target.value
    },

    /**
     * Search for MLS home whether it exists
     */
    newHomeAdded() {
      if (this.mlsNum === '') {
        this.emptyInput = true
        console.log('please enter something')
      } else {
        this.emptyInput = false
        if (
          this.localSelectedHouses.some(
            home => home['MLSNumber'] === this.mlsNum
          )
        ) {
          console.log('already selected')
          this.$refs.addressValue.value = ''
        } else {
          if (
            this.clientSavedHomes.some(
              home => home['MLSNumber'] === this.mlsNum
            )
          ) {
            console.log(`found in client's saved homes`)
            const foundProperty = this.clientSavedHomes.find(
              home => home['MLSNumber'] === this.mlsNum
            )
            this.$refs.addressValue.value = foundProperty['Address']
            this.localSelectedHouses.push(foundProperty)
          } else {
            console.log(`no property for that MLS in client saved homes`)
            this.$refs.addressValue.value = ''
          }
        }
      }
    }
  }
}
</script>

<style>
.plan-route__header {
  font-size: 0.9em;
}

.plan-route__header .row {
  align-items: center;
}

.plan-route__header button {
  font-weight: 300 !important;
}

.plan-route__small-text {
  color: #808080;
  font-size: 1.2rem;
  padding-right: 2rem;
}

.v-text-field__slot {
  font-size: 0.8em;
}

.plan-route__btn-set {
  color: #fff !important;
  font-size: 1.5rem !important;
}

#displayedRoute {
  border-bottom: 1px solid #aaaaaa;
  height: 3rem;
  font-size: 1.5rem;
  outline: none;
  min-width: 70%;
}

#chooseHomeModal .v-btn {
  font-size: 1.8rem !important;
  text-transform: none;
  font-weight: 300 !important;
  padding: 0 5rem !important;
}

#planRouteContainer .v-date-picker-table .v-btn {
  color: rgba(0, 0, 0, 0.87) !important;
}

#dateChangerModal .v-date-picker-table .v-btn--active {
  color: #fff !important;
}

.plan-route__table {
  margin-top: 4rem;
  padding: 0rem;
}

.plan-route__home {
  padding-left: 2rem;
}

.v-table {
  background-color: transparent !important;
}

.plan-route__footer-btn {
  margin-top: 4rem;
  margin-left: auto;
  margin-right: auto;
}

.plan-route__footer-btn .v-btn {
  font-weight: 300;
  padding: 0 4rem !important;
  text-transform: none;
  margin-bottom: 2rem !important;
}

.plan-route__map img {
  padding: 2rem;
  height: 100%;
  width: 100%;
}

@media only screen and (min-width: 600px) {
  .plan-route__footer-btn .v-btn {
    margin-bottom: 0 !important;
  }

  .plan-route__table {
    margin-top: 6rem;
    padding: 0rem;
  }
}

@media only screen and (min-width: 960px) {
  .plan-route__footer-btn .v-btn {
    padding: 0 4rem !important;
  }
}

@media only screen and (min-width: 1264px) {
  .plan-route__footer-btn {
    max-width: 80rem;
  }
}
</style>
