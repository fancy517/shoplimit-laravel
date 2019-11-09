<template>
  <div id="chooseHomeModal">
    <v-card class="choose-homes__modal">
      <v-icon
        class="choose-homes__close"
        @click.stop="$emit('close-modal')"
      >
        close
      </v-icon>
      <div class="choose-homes__title">
        <v-icon color="pink lighten-1">
          map
        </v-icon>
        <span>
          Choose homes for route
        </span>
      </div>
      <div class="choose-homes__client">
        {{ selectedClient.name }}'s Saved Homes
      </div>
      <div class="choose-homes__content">
        <v-data-table
          :headers="tableHeaders"
          :items="selectedClientHomes"
          :item-key="selectedClientHomes._id"
          hide-actions
        >
          <template v-slot:items="props">
            <td class="text-xs-right p-0">
              <v-icon small>
                location_on
              </v-icon>
            </td>
            <td class="text-xs-left">
              {{ getHouseNameById(props.item._id) }}
            </td>
            <td class="text-xs-left">
              {{ props.item.added_ts | dateFormat }}
            </td>
            <td class="text-xs-center">
              <v-checkbox
                v-model="selectedHouses"
                hide-details
                :value="props.item"
              />
            </td>
          </template>
        </v-data-table>
        <div class="choose-homes__button" @click="$emit('close-modal', selectedHouses)">
          <v-btn round color="#5a859f">
            Select for route
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getPropertyKeyValue } from '../../utils/propertyUtils'

export default {
  filters: {
    dateFormat: value => {
      return moment(value).format('Do MMMM, YYYY')
    }
  },

  props: {
    clientPropertyDetails: {
      type: Array,
      required: true
    },
    selectedClient: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      tableHeaders: [
        { text: '', value: 'marker', sortable: false },
        { text: 'Home Address', value: 'address', width: '60%', sortable: false },
        { text: 'Date Added', value: 'date', width: '30%', sortable: false },
        { text: 'Add To Route', value: 'addToRoute', sortable: false, width: '10%' }
      ],
      selectedHouses: []
    }
  },

  computed: {
    selectedClientHomes() {
      console.log(this.selectedHouses)
      if (this.selectedClient && this.selectedClient.homes) {
        return this.selectedClient.homes.filter(home => home.queuelevel === 'initial')
      }
      return []
    }
  },

  created() {
    console.log('created')
    this.selectedHouses = []
  },

  methods: {
    getSavedHomes(clientHomes) {
      return (clientHomes.filter(home => home.queuelevel === 'initial'))
    },
    getHouseNameById(houseId) {
      return getPropertyKeyValue(houseId, this.clientPropertyDetails, 'Address')
    }
  }
}
</script>

<style lang="sass" scoped>
.choose-homes__modal
  padding: 3rem 5rem
  border-radius: 2rem

.choose-homes__close
  @extend %modal__button-close, %disable-selection

.choose-homes__title
  display: flex
  flex-flow: row
  justify-content: center
  align-items: center
  margin-bottom: 3rem

.choose-homes__title i
  font-size: 6rem
  border-radius: 50%
  padding: 1rem
  border: .1rem solid $hwayzec

.choose-homes__title span
  font-size: 2.5rem
  padding-left: 2rem

.choose-homes__client
  text-align: left
  padding-left: 2rem
  font-size: $hwayzFont1rem8
  font-weight: 600

.choose-homes__content
  padding: 2rem

.choose-homes__button
  margin-top: 5rem
</style>
