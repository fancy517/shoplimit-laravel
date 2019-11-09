<template>
  <v-data-table
    :headers="columnNames"
    :items="data"
    item-key="id"
    :hide-actions="options.hideActions"
    :hide-headers="options.hideHeaders"
    :expand="options.expand"
  >
    <template v-slot:headers="props">
      <tr>
        <th
          v-for="columnName in props.headers"
          :key="columnName.value"
          class="text-xs-center"
        >
          {{ columnName.text }}
        </th>
        <th class="text-xs-center">
          {{ buttonHeaderText }}
        </th>
      </tr>
    </template>
    <template v-slot:items="props">
      <v-container
        bg
        fill-height
        grid-list-md
        text-xs-center
        class="hover-style my-container reduced-padding"
        :class="{'my-container-expanded': props.expanded}"
      >
        <v-layout row wrap align-center>
          <v-flex
            class="text-xs-left name-column-width"
            :class="{'expandable-row': options.expand, 'not-nested': !options.nested}"
            @click="props.expanded = !props.expanded"
          >
            <v-avatar v-if="!options.disableAvatar" size="32px" class="avatar-margin">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-avatar>
            <span>{{ props.item.name }}</span>
          </v-flex>
          <v-flex
            v-for="column in columnNamesWithoutName"
            :key="column.value"
            class="text-xs-left"
          >
            {{ props.item[column.value] }}
          </v-flex>
          <v-flex class="text-xs-right">
            <v-btn
              v-if="props.item.displayBtn"
              class="rounded-button"
              color="#00ABC2"
              round
              dark
              @click="$emit('button-clicked', props.item['id'])"
            >
              <b>{{ buttonText }}</b>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
    <template v-slot:expand="props">
      <v-card v-if="options.expand" flat class="expand-card">
        <table-with-map :data="props.item.addresses" />
      </v-card>
    </template>
  </v-data-table>
</template>

<script>
import tableWithMap from './TableWithMap.vue'
export default {
  components: {
    tableWithMap
  },
  props: {
    columnNames: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    buttonHeaderText: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: Object,
      required: false,
      default: function() {
        return {
          hideHeaders: false,
          hideActions: false,
          expand: false,
          disableAvatar: false,
          nested: false
        }
      }
    }
  },
  data() {
    return {
      expandableTableHeader: [
        { text: '', value: 'id' },
        { text: 'Home Address', value: 'homeAddress' },
        { text: 'Time', value: 'time' }
      ]
    }
  },
  computed: {
    columnNamesWithoutName() {
      return this.columnNames.slice(1)
    }
  }
}
</script>

<style scoped lang='sass'>
.theme--light.v-table thead th {
  color: #333;
  font-weight: 500;
}
/* Disables row hover color change */
.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
  background-color: #f8f8f8;
}

.theme--light.v-table thead tr:first-child {
  border-style: none;
}

.theme--light.v-table tbody tr:not(:last-child) {
  border-style: none;
}

.avatar-margin {
  margin-right: 15px;
}

.white-override {
  color: white !important;
}

.name-column-width {
  width: 40%;
}

.rounded-button {
  padding: 2px 10px;
  height: 25px;
  font-size: 9pt;
  text-transform: capitalize;
}

.not-nested {
  color: $hwayzNested !important;
}

.expandable-row {
  color: $hwayzPurple !important;
  cursor: pointer;
}

.my-container {
  font-weight: normal;
  font-size: 10pt;
  border-radius: 5px;
}

.reduced-padding {
  padding: 4px 24px;
}

.my-container-expanded {
  background-color: $hwayzF8;
}
.hover-style {
  transition-duration: 0.3s;
  transition-delay: 0s;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 0.1);
}

.hover-style:hover {
  background-color: $hwayzF8;
}

.expand-card {
  border: $hwayzF8 3px solid !important;
  border-radius: 5px;
  box-shadow: none;
}
</style>
