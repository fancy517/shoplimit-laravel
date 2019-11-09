<template>
  <v-card>
    <v-layout wrap>
      <v-flex xs12 md8 class="p-3">
        <v-data-table
          :headers="routeTableHeaders"
          :items="routeDetails"
          item-key="id"
          hide-actions
        >
          <template v-slot:headers="props">
            <tr>
              <th
                v-for="column in props.headers"
                :key="column.name"
                class="text-xs-center"
              >
                {{ column.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr>
              <td class="text-xs-center">
                {{ getHouseNameById(props.item.propertyId) }}
              </td>
              <td class="text-xs-center">
                {{ getETATimeFormat(props.item.scheduled) || 'pending' }}
              </td>
              <td class="text-center">
                <v-btn
                  disabled
                  fab
                  small
                  color="pink"
                  class="planner-overview__fab"
                >
                  <v-icon small color="white">
                    close
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex xs12 md4>
        <div class="hidden-sm-and-down route-table-widget__map p-5">
          <img src="/img/map.png" alt="map">
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import moment from 'moment'
import { getPropertyKeyValue } from '../../../utils/propertyUtils'

export default {
  props: {
    routeTableHeaders: {
      type: Array,
      required: true
    },
    savedHomes: {
      type: Array,
      required: true
    },
    routeDetails: {
      type: Array,
      required: true
    }
  },

  methods: {
    /**
    * Gets the details of a property from the property objects by searching based on it's id
    * @param {string} houseId
    * @public
     */
    getHouseNameById(houseId) {
      return getPropertyKeyValue(houseId, this.savedHomes, 'Address')
    },

    /**
     * Get expected time of arrival for the scheduled property
     */
    getETATimeFormat(scheduled) {
      if (scheduled) {
        return moment(scheduled).format('hh:mm a')
      }
      return null
    }
  }
}
</script>

<style scoped>
.layout {
  align-items: center;
}

.route-table-widget__map img {
  max-width: 100%;
  height: auto;
}
</style>
