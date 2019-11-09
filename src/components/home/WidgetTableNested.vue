<template>
  <div class="widget-table-nested">
    <!-- <v-item-group class="nested-header" > -->
    <v-container v-if="nestedTableHeader.findIndex((elem) => elem.text !== '') !== -1" grid-list-md>
      <v-layout>
        <v-flex
          v-for="header in nestedTableHeader"
          :key="header.value"
          class="normal-font"
          :style="{'width': header.width}"
        >
          {{ header.text }}
        </v-flex>
      </v-layout>
    </v-container>
    <!-- </v-item-group> -->
    <div v-for="row in data" :key="row.id">
      <!-- The whole row is actually using the flat toolbar component. -->
      <v-toolbar flat dense color="white" class="name">
        <!-- Avatar on the left of the name. -->
        <v-avatar size="30px" class="avatar-margin">
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
        </v-avatar>
        <a @click="$emit('client-clicked', row)">{{ row.name }}</a>
        <v-spacer />
        <v-toolbar-items class="hidden-sm-and-down">
          <v-subheader class="toolbar-text">
            {{ row.confirmedRoutes }}
          </v-subheader>
        </v-toolbar-items>
      </v-toolbar>

      <template v-if="row.nestedTableData && row.nestedTableData.length > 0">
        <table-with-button
          class="nested-table"
          :column-names="nestedTableHeader"
          :data="row.nestedTableData"
          :button-text="buttonText"
          :options="{hideHeaders: true, hideActions: true, expand: options.expand, disableAvatar: true, nested: true}"
          @button-clicked="$emit('button-clicked', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import tableWithButton from './TableWithButton.vue'
export default {
  components: {
    tableWithButton
  },
  props: {
    columnNames: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    buttonText: {
      type: String,
      required: true
    },
    nestedTableHeader: {
      type: Array,
      required: true
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
  computed: {
    columnNamesWithoutName() {
      return this.columnNames.slice(1)
    }
  }
}
</script>

<style lang="sass" scoped>
.widget-table-nested
  padding: 5px

.theme--light.v-table thead th
  color: $hwayzWhite
  font-weight: 500

.theme--light.v-table thead tr:first-child
  border-style: none

.theme--light.v-table tbody tr:not(:last-child)
  border-style: none

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row)
  background-color: $hwayzF8

.avatar-margin
  margin-right: 10px

.white-override
  color: white !important

.nested-table
  width: 90%
  margin: 0 auto

.toolbar-text
  font-size: $hwayzFont10pt
  padding-right: 50px

.name
  @extend %clientName

.container
  // width: 90%
  padding: 7px
  font-size: $hwayzFont10pt

.normal-font
  font-weight: normal

.nested-header
  font-weight: normal
</style>
