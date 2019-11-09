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
        </tr>
      </template>
      <!-- Content Rows -->
      <template v-slot:items="props">
        <tr>
          <!-- Avatar on the right of the name. -->
          <td class="text-xs-left clientName">
            <v-avatar size="30px" class="avatar-margin" :color="colors[props.item.name[0]]">
              <!-- <img v-if='item.data' src="item.data" alt="John"> -->
              <span class="white--text">{{ props.item['name'] | initials }}</span>
            </v-avatar>
            <a class="name" @click="$emit('client-clicked', props.item)">{{ props.item.name }}</a>
          </td>
          <!-- Iterate through the columnNames to show all needed fields. -->

          <td
            v-for="column in columnNamesWithoutName"
            :key="column.value"
            class="text-xs-center"
          >
            {{ props.item[column.value] }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import avatarColors from '../../utils/avatarColors'

export default {

  filters: {
    initials: function(value) {
      if (!value) return ''
      value = value.split(' ')
      let response = ''
      for (const v of value) {
        response = response + v.charAt(0).toUpperCase()
      }
      return response
    }
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
    options: {
      type: Object,
      required: false,
      default: function() {
        return {
          hideHeaders: false,
          hideActions: false
        }
      }
    }
  },

  data: function() {
    return { colors: avatarColors }
  },

  computed: {
    columnNamesWithoutName() {
      return this.columnNames.slice(1)
    }
  }
}
</script>

<style lang="sass" scoped>
.name
  color: $hwayzNested !important

.theme--light.v-table thead th
  color: $hwayzBlack
  font-weight: 500

.theme--light.v-table thead tr:first-child
  border-style: none

.theme--light.v-table tbody tr:not(:last-child)
  border-style: none

.avatar-margin
  margin-right: 15px

.white-override
  color: $hwayzWhite !important

.clientName
  @extend %clientName

</style>
