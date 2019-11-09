<template>
  <div v-if="selectedClient">
    <!-- <v-layout wrap>
      <v-flex xs12 md7 offset-md5 lg6 offset-lg6>
        <v-layout wrap class="requested-home-tours__mls-wrapper">
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
              :color="$btnHwayzBlue"
              class="requested-home-button"
              @click.stop="newHomeAdded"
            >
              Add Home
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout> -->
    <updated-list-component
      :table-headers="savedHomeHeaders"
      :table-data="generateTableItems(selectedClientHomes)"
      @clicked="openConfirmationModal"
      @checkboxClicked="updateSelectedHomes"
    />
    <div class="select-btn-container">
      <v-btn
        class="select-all-button"
        small
        outline
        color="#cc3371"
        @click="clearAllHouses"
      >
        Deselect all
      </v-btn>
      <v-btn
        class="select-all-button"
        small
        outline
        :color="$btnHwayzBlue"
        @click="selectAllHouses"
      >
        Select all
      </v-btn>
    </div>
    <div class="requested-home-tours__house-btn">
      <!-- if at least one home is selected -->
      <!-- <v-dialog
        v-if="selectedHouses && selectedHouses.length > 0"
        v-model="openAddHomesModal"
        :width="alert.width"
        :max-width="alert.small_maxWidth"
      >
        <v-btn slot="activator" class="requested-home-button" small round>
          ADD TO ROUTE
        </v-btn>
        <add-homes-to-route
          :selected-client="selectedClient"
          :selected-houses="selectedHouses"
          :on-close-modal="closeModals"
          :client-properties="clientFavorites"
          :selected-route-details="selectedHouses"
        />
      </v-dialog>
      <v-dialog
        v-else
        v-model="openPlanRouteModal"
        :width="alert.width"
        :max-width="alert.small_maxWidth"
      >
        <v-btn slot="activator" class="requested-home-button" small round>
          ADD TO ROUTE
        </v-btn>
        <no-home-selected :on-close-modal="closeModals" />
      </v-dialog>-->
      <v-btn
        v-if="selectedHouses && selectedHouses.length > 0"
        class="requested-home-button"
        small
        round
        :color="$btnHwayzBlue"
        @click="redirectToRoutePlanning"
      >
        PLAN ROUTE
      </v-btn>
      <v-dialog
        v-else
        v-model="openPlanRouteModal"
        :width="alert.width"
        :max-width="alert.small_maxWidth"
      >
        <v-btn
          slot="activator"
          class="requested-home-button"
          small
          round
          :color="$btnHwayzBlue"
        >
          PLAN ROUTE
        </v-btn>
        <no-home-selected :on-close-modal="closeModals" />
      </v-dialog>
    </div>
    <v-dialog v-model="confirmationModal.status" :width="alert.width" :max-width="alert.maxWidth">
      <confirmation-modal
        :modal-options="confirmationModal"
        @on-negative-clicked="onCancelDelete"
        @on-positive-clicked="removePropertyFromSavedHomes"
      />
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions, mapMutations } from 'vuex'
import refreshContent from '../../mixins/refreshContent'

// import AddHomesToRoute from '../../modals/AddHomesToRoute.vue'
import NoHomeSelected from '../../modals/NoHomeSelected.vue'
import ConfirmationModal from '../../modals/ConfirmationModal.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import { genericPutRequestToApi } from '../../../utils/genericRequests'
import { UpdateDeleteFavoriteUrl } from '../../../utils/clientUrls'

export default {
  components: {
    NoHomeSelected,
    // AddHomesToRoute,
    ConfirmationModal,
    UpdatedListComponent
  },

  filters: {
    dateFormat: value => {
      return moment(value).format('MM-DD-YYYY')
    }
  },

  mixins: [refreshContent],

  data() {
    return {
      confirmationModal: {
        status: false,
        message: null,
        positive: null,
        negative: null
      },
      selectedForRemoval: null,
      savedHomeHeaders: [
        {
          text: 'Home Address',
          value: 'address',
          width: '50%',
          sortable: false
        },
        //  TODO - fill empty column on line 168 with future content -->
        { text: '', value: 'requests', sortable: false },
        { text: 'Remove', value: 'remove', sortable: false, align: 'center' },
        {
          text: 'Plan Route',
          value: 'planroute',
          sortable: false,
          align: 'center'
        }
      ],
      selectedHouses: [],
      openPlanRouteModal: false,
      openAddHomesModal: false,
      emptyInput: false,
      tableItems: []
    }
  },

  computed: {
    ...mapState('agent', ['selectedClient']),
    ...mapState('client', ['clientFavorites']),
    ...mapState('style', ['alert']),

    selectedClientHomes() {
      if (this.selectedClient && this.selectedClient.homes) {
        return this.selectedClient.homes.filter(
          home => home.requestTour === true
        )
      }
      return []
    }
  },

  created() {
    this.clientHomeDetailsAction(this.selectedClient)
  },

  methods: {
    ...mapActions('client', ['clientHomeDetailsAction']),
    /**
     * Mapping home actions
     */
    ...mapMutations('home', {
      setActiveRoute: 'SET_ACTIVE_ROUTE'
    }),
    ...mapMutations('common', {
      setRouteHomes: 'SET_ROUTE_HOMES'
    }),

    updateSelectedHomes(payload) {
      const _id = payload.item.item[0].data._id

      // If true (selected), filters through selectedClientHomes for _id of payload.
      // If false (deselected), filters through selectedHouses to take payload off.
      switch (payload.selected) {
        case true:
          const selectedHome = this.selectedClientHomes.find(
            home => home._id === _id
          )
          this.selectedHouses.push(selectedHome)
          break
        case false:
          this.selectedHouses = this.selectedHouses.filter(
            home => home._id !== _id
          )
          break
        default:
          console.log('must receive true or false')
          break
      }
    },

    generateTableItems(fromArray) {
      let response = []
      fromArray.forEach((item, index) => {
        let obj = {}
        obj[0] = { type: 'addressImg', data: item }
        obj[1] = { text: '' }
        obj[2] = {
          type: 'clickableIcon',
          text: 'close',
          btnClass: 'gray black--text',
          data: item
        }
        obj[3] = {
          type: 'checkbox',
          selected: this.selectedHouses.some(house => house._id === item._id)
        }

        response.push(obj)
      })

      return response
    },

    clearAllHouses() {
      if (this.selectedHouses.length > 0) {
        this.selectedHouses = []
      }
    },

    selectAllHouses() {
      this.selectedHouses = this.selectedClientHomes.map(house => house)
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
        message: `Do you really want to remove this property from adding to the route`,
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

    removePropertyFromSavedHomes() {
      genericPutRequestToApi(
        UpdateDeleteFavoriteUrl(
          this.selectedClient._id,
          this.selectedForRemoval._id
        ),
        null,
        { params: { requestTour: false } }
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
      if (this.selectedHouses.length > 0) {
        this.getAgentData()
      }
      this.selectedHouses = []
    },

    /**
     * Handles redirecting to creation of a new route
     * when some homes are selected to create a new route
     */
    redirectToRoutePlanning() {
      this.setRouteHomes(this.selectedHouses)
      this.$router.push({
        name: 'plan-route'
      })
      this.setActiveRoute('plan-route')
    },

    newHomeAdded() {
      console.log('New home added', this.$refs.inputValue.value)
    }
  }
}
</script>

<style lang="sass" scoped>
.requested-home-tours__mls-wrapper
  padding-top: 2rem
  margin-bottom: 2rem

#mlsAddress
  outline: none
  width: 100%
  height: 4rem
  border-bottom: 0.1rem solid $hwayzShadow

.requested-home-tours__image-data
  display: flex
  flex-flow: column
  margin-bottom: 0.5rem
  height: 100% !important
  min-height: 10rem
  div
    font-weight: 600

.requested-home-button, .select-all-button
  font-size: $hwayzFont1rem2 !important
  height: 2.8rem

.requested-home-button
  color: $hwyzHeaderAgent !important

.select-btn-container
  margin: 3rem 4rem
  float: left

.requested-home-tours__fab
  height: 2.4rem !important
  width: 2.4rem !important

.requested-home-tours__house-btn
  margin: 1.5rem 0
  text-align: right

.requested-home-tours__house-btn #btnContent
  font-weight: 300
  font-size: $hwayzFont1rem2

.requested-home-tours__route-header
  padding: 2rem
  font-size: $hwayzFont1rem4

.requested-home-tours__home-image
  height: auto
  max-width: 12rem
  padding: 1rem 0

#addHomesToRoute
  .v-expansion-panel__header
    padding: 1rem 2rem !important
  .v-expansion-panel__header__icon
    display: none !important
  .v-btn
    font-size: $hwayzFont0rem7 !important
    float: right
  .modal__header
    padding-top: 1.2rem

@media only screen and (min-width: 960px)
  .requested-home-tours__mls-wrapper
    padding-top: 0

  .requested-home-tours__image-data
    flex-flow: row
    max-height: 12rem
    width: auto
    align-items: center

  .requested-home-tours__image-data div
    padding-left: 2rem

#tabContainer td
  text-align: left !important
  padding-right: 0 !important

.v-tabs__div
  color: #e91e63 !important
  min-width: 20rem

.tab-container__tab
  background-color: #e91e63
  color: #fff !important
  border-top-left-radius: 0.9rem
  border-top-right-radius: 0.9rem

.tab-container__tab:hover
  color: #fff !important

.tab-container__content
  padding: 2rem
  min-height: 10rem

.table
  @extend %plannerTable

.boldRow
  font-weight: map-get($text, boldText)

</style>
