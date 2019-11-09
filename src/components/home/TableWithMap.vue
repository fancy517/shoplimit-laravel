<template>
  <v-layout row justify-center align-start class="table-with-map">
    <v-flex xs7 class="route-home-list">
      <v-data-table :headers="tableHeader" :items="tableData" hide-actions>
        <template v-slot:items="props">
          <tr>
            <td class="text-xs-left">
              {{ props.index + 1 }}.
              {{ getFullAddress(props.item) }}
            </td>
            <td class="text-xs-left">
              {{ getStopTimeData(props.item) }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex xs4 class="pa-3">
      <div class="hidden-sm-and-down">
        <div v-if="coordinates.length > 0">
          <map-component :lat-lgn-markers="coordinates" :map-height="'300px'" />
        </div>
        <div v-else class="progress-spinner">
          <v-progress-circular indeterminate color="grey darken-1" />
          <div class="py-3">
            Getting location map...
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { propertyFullAddress } from '../../utils/propertyUtils'
import MapComponent from '../common/MapComponent.vue'

export default {
  components: { MapComponent },

  props: {
    tableData: {
      type: Array,
      required: true
    },
    tableHeader: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapState('client', ['clientFavorites']),

    coordinates() {
      let propertyLocations = []
      if (this.clientFavorites) {
        for (const stop of this.tableData) {
          if (stop.state !== 'decline') {
            const property = this.clientFavorites.find(house => house._id === stop.propertyId)
            if (property) {
              propertyLocations.push({
                position: {
                  lat: property.Latitude,
                  lng: property.Longitude
                }
              })
            }
          }
        }
      }
      return propertyLocations
    }
  },

  methods: {
    getFullAddress(propertyObject) {
      if (this.clientFavorites) {
        const foundProperty = this.clientFavorites.find(house => house._id === propertyObject.propertyId)
        if (foundProperty) {
          return propertyFullAddress(foundProperty)
        }
      }
      return 'Getting property address...'
    },

    getStopTimeData(propertyObject) {
      if (propertyObject.arrivalTime) {
        return moment(propertyObject.arrivalTime).format('h:mm a')
      } else if (propertyObject.arrivalTime === null) {
        return propertyObject.state
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.table-with-map
  margin: 0
  min-height: 35rem

.route-home-list
  padding: 0 2rem 0 0
  margin-top: 2rem

table.v-table tbody
  td, tr, th
    height: 40px

.theme--light.v-table thead tr:first-child
  border: none

.theme--light.v-table tbody tr:not(:last-child)
  border: none

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row)
  background-color: $hwayzWhite
</style>
