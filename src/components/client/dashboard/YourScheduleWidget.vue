<template>
  <div class="widget-table-nested">
    <v-data-table
      :headers="tableHeader"
      :items="tableData"
      item-key="_id"
      :hide-actions="options.hideActions"
      :hide-headers="options.hideHeaders"
      :expand="options.expand"
    >
      <template v-slot:items="props">
        <v-layout wrap>
          <!-- Avatar on the right of the name. -->
          <v-flex class="your-schedule-widget__time-header" :class="{'expandable-row': options.expand, 'not-nested': !options.nested}" @click="props.expanded = !props.expanded">
            {{ props.item.name }}
          </v-flex>
        </v-layout>
      </template>
      <template v-slot:expand="props">
        <v-card v-if="options.expand" flat class="expand-card">
          <!-- <v-container v-if="options.expand"> -->
          <table-with-map
            :table-data="getFilteredStops(props.item)"
            :table-header="nestedTableHeader"
          />
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// import tableWithButton from '../../home/TableWithButton.vue'
import TableWithMap from '../../home/TableWithMap.vue'

export default {
  components: {
    // tableWithButton,
    TableWithMap
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      required: false,
      default: function() {
        return {
          hideHeaders: false,
          hideActions: false,
          expand: false
        }
      }
    }
  },

  data() {
    return {
      nestedTableHeader: [
        { text: 'Home Address', value: 'homeAddress', sortable: false },
        { text: 'Time', value: 'time', sortable: false }
      ],
      tableHeader: [{ text: '', value: 'name' }]
    }
  },

  methods: {
    getFilteredStops(routeData) {
      if (routeData && routeData.routeStops) {
        return routeData.routeStops.filter(stop => stop.state !== 'decline')
      }
      return []
    }
  }
}
</script>

<style scoped lang='sass'>
.widget-table-nested
  padding: 5px

.theme--light.v-table thead th
  color: $hwayzBlack
  font-weight: 500

.theme--light.v-table thead tr:first-child
  border-style: none

.theme--light.v-table tbody tr:not(:last-child)
  border-style: none

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row)
  background-color: $hwayzF8

.your-schedule-widget__time-header
  text-align: left !important
  padding: 1rem 2rem
  background: $hwayzec
  margin: 1rem
  border-radius: 1rem 1rem 0 0
  cursor: pointer

.white-override
  color: white !important

.nested-table
  width: 90%
  margin: 0 auto

.toolbar-text
  font-size: $hwayzFont10pt
  padding-right: 50px

.name
  color: $hwayzTeal !important

.container
  /* width: 90%; */
  padding: 7px
  font-size: $hwayzFont10pt

.normal-font
  font-weight: normal

.nested-header
  font-weight: normal

</style>
