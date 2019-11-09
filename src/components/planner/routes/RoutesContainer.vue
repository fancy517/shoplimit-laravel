<template>
  <div class="mt-5 routes__container">
    <div class="routes__title">
      <v-icon color="white">
        home
      </v-icon>
      <span>{{ activeSubRoute }} routes</span>
    </div>
    <div class="routes__content">
      <template v-if="selectedClient">
        <router-view
          :key="activeSubRoute"
          :route-details="selectedRouteDetails"
          :saved-homes="clientSavedHomes"
          :on-open-modal="onOpenModal"
          :route-date="dateSelectorModal['value']"
          :show-request-showing-btn="activeSubRoute === 'saved'"
          :show-send-schedule-btn="activeSubRoute === 'confirmed'"
        >
          <template v-slot:route-table-widget>
            <route-table-widget
              :key="routeTableKey"
              :route-table-headers="routeTableHeaders"
              :route-details="selectedRouteDetails"
              :saved-homes="clientSavedHomes"
            />
          </template>
        </router-view>
        <v-dialog
          v-model="dateSelectorModal['status']"
          :width="alert.width"
          :max-width="alert.maxWidth"
        >
          <date-changer-modal @on-close-modal="onCloseModal" />
        </v-dialog>
        <v-dialog
          v-model="confirmationModal.status"
          :width="alert.width"
          :max-width="alert.maxWidth"
        >
          <confirmation-modal
            :modal-options="confirmationModal"
            @on-negative-clicked="onCancelDelete"
            @on-positive-clicked="onConfirmDelete"
          />
        </v-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import DateChangerModal from '../../modals/DateChangerModal.vue'
import RouteTableWidget from './RouteTableWidget.vue'
import ConfirmationModal from '../../modals/ConfirmationModal.vue'

export default {
  components: { DateChangerModal, RouteTableWidget, ConfirmationModal },
  data() {
    return {
      activeSubRoute: this.$route.name,
      dateSelectorModal: {
        status: false,
        value: moment().format('MM-DD-YY')
      },
      confirmationModal: {
        status: false,
        message: null,
        positive: null,
        negative: null
      },
      routeTableHeaders: [
        { text: 'Home Address', value: 'address' },
        { text: 'Time', value: 'time' },
        { text: '', value: 'action' }
      ],
      routePendingTableHeaders: [
        { text: 'Home Address', value: 'address' },
        { text: 'Time', value: 'time' },
        { text: 'Status', value: 'status' },
        { text: '', value: 'action' }
      ],
      routeTableKey: 0,
      deleteOption: null
    }
  },
  computed: {
    ...mapState('agent', ['selectedClient', 'clientSavedHomes']),
    ...mapState('style', ['alert']),

    selectedRouteDetails() {
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
    selectedRouteDetails(newValue) {
      this.routeTableKey += 1
    },
    $route(to, from) {
      this.activeSubRoute = to.name
    }
  },
  methods: {
    /**
     * Function to open the confirmation modal when user
     * selects to remove a route from current status
     *
     * @public
     */
    updateRouteDetails(selectedRoute) {
      this.deleteOption = { option: 'route', data: selectedRoute }
      Object.assign(this.confirmationModal, {
        status: true,
        message: `Do you really want to remove the route '${
          selectedRoute.name
        }'?`,
        positive: 'Yes, remove Route',
        negative: 'Not Now'
      })
    },

    /**
     * Function to open the confirmation modal when user
     * selects to delete a home associated with a home
     *
     * @public
     */
    removeSelectedRouteHomes(data) {
      this.deleteOption = { option: 'home', data: data }
      Object.assign(this.confirmationModal, {
        status: true,
        message: `Do you really want to remove this home from '${
          data.route.name
        }' route?`,
        positive: 'Yes, remove Home',
        negative: 'Not Now'
      })
    },

    /**
     * Filteres all properties based on viewings and schedules
     * to distribute based on Route status
     */
    getClientFilteredViewings(filteredViewings, status) {
      console.log(status)
      switch (status) {
        case 'pending':
          return filteredViewings.filter(viewing => viewing.scheduled === null)
        default:
          return filteredViewings
      }
    },

    /**
     * Create Route details
     */
    getRouteDetails(viewings) {
      const filteredViewings = viewings.filter(viewing => {
        return (
          moment(this.dateSelectorModal['value']).format('MM-DD-YY') ===
          moment(viewing.scheduled).format('MM-DD-YY')
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

    onConfirmDelete(data) {
      if (this.deleteOption) {
        const { option, data } = this.deleteOption
        if (option === 'home') {
          let removedHome = data.selectedHome
          let fromRoute = data.route

          let updatedRoutes = this.selectedRouteDetails.map(route => {
            if (route.id === fromRoute.id) {
              route.home_address = route.home_address.filter(
                home => home.home_id !== removedHome.home_id
              )
            }
            return route
          })
          this.selectedRouteDetails = updatedRoutes
        } else if (option === 'route') {
          let updatedRoutes = this.selectedRouteDetails.filter(
            route => route.id !== data.id
          )
          this.selectedRouteDetails = updatedRoutes
        }
      }
      this.onCancelDelete()
    },
    onCancelDelete() {
      this.confirmationModal = { status: false, message: null }
    },

    onOpenModal() {
      Object.assign(this.dateSelectorModal, { status: true })
    },

    onCloseModal(value) {
      // we get date of modal as value.dateValue
      // Use this value to update route date in selectedRouteDetails
      console.log(value)
      Object.assign(this.dateSelectorModal, { ...value })
    }
  }
}
</script>

<style>
.planner-routes__container .v-expansion-panel__header {
  border-bottom: 0.2rem solid #00acc1 !important;
}

.routes__container {
  background-color: transparent !important;
}

.routes__container .v-expansion-panel__container,
.routes__container .v-expansion-panel__container:first-child {
  border-radius: 1.5rem 1.5rem 0rem 0rem;
  border: 0.2rem solid #00acc1 !important;
  margin-bottom: 2rem !important;
}

.routes__title {
  background-color: #b02bc7;
  box-shadow: 0.2rem 0.2rem 0.5rem #b02bc7;
  position: absolute;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  margin-top: -2rem;
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  min-width: 30rem;
  text-align: left;
  color: #fff;
}

.routes__title i {
  font-size: 3rem;
}

.routes__title span {
  padding-left: 1.2rem;
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.routes__content {
  padding: 6rem 1rem;
}

#dateChangerModal .modal__button .v-btn__content {
  text-transform: none;
}

.routes__container .v-dialog {
  box-shadow: none !important;
}

.routes__container .v-picker {
  border-radius: 1.5rem !important;
}
</style>
