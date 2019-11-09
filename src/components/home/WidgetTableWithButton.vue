<template>
  <div>
    <v-data-table
      :headers="columnNames"
      :items="data"
      item-key="id"
      :hide-actions="options.hideActions"
      :hide-headers="options.hideHeaders"
    >
      <!-- Header Row -->
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
      <!-- Content Rows -->
      <template v-slot:items="props">
        <tr @click="props.expanded = !props.expanded">
          <!-- Avatar on the right of the name. -->
          <td class="text-xs-left name-column-width" :class="{'expandable-row': options.expand, 'not-nested': !options.nested}">
            <v-avatar
              v-if="!options.disableAvatar"
              size="32px"
              class="avatar-margin"
            >
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              >
            </v-avatar><a @click="$emit('client-clicked', props.item)">{{ props.item.name }}</a>
          </td>
          <!-- Iterate through the columnNames to show all needed fields. -->
          <td
            v-for="column in columnNamesWithoutName"
            :key="column.value"
            class="text-xs-center"
          >
            {{ props.item[column.value] }}
          </td>
          <td class="text-xs-center">
            <div>
              <v-btn
                class="rounded-button"
                color="#00ABC2"
                round
                dark
                @click="$emit('button-clicked', props.item['id'])"
              >
                {{ buttonText }}
              </v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
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
  color: $hwayzBlack;
  font-weight: 500;
}
/* Disables row hover color change */
.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row){
  background-color: $hwayzF8;
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
  color: $hwayzWhite !important;
}

.name-column-width{
  width: 40%;
}

.rounded-button{
  padding: 6px 8px;
  height: 25px;
  font-size: $hwayzFont10pt;
}

.not-nested{
  color: $hwayzNested !important;
}

.expandable-row{
  color: $hwayzPurple !important;
}
</style>
