<template>
  <div v-if="tableData">
    <updated-list-component
      :table-headers="tableHeaders"
      :table-data="generateHomeSearchData(tableData)"
      @client-clicked="onClientNameClicked($event)"
      @clicked="onInitialSearchClicked($event)"
    />
    <!-- <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      item-key="_id"
      :hide-actions="options.hideActions"
      :hide-headers="options.hideHeaders"
    >
      <template v-slot:headers="props">
        <tr>
          <th
            v-for="columnName in props.headers"
            :key="columnName.value"
            class="text-xs-center"
            :width="columnName.width ? columnName.width : 'auto'"
          >
            {{ columnName.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr>
          <td class="create-home-search__client">
            <v-avatar size="30px" class="avatar-margin">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-avatar>
            <span @click="$emit('client-clicked', props.item)">{{ props.item.name }}</span>
          </td>
          <td class="text-xs-center">
            <v-icon
              color="#3D3D3D"
              style="cursor: pointer;"
              @click.stop="$router.push({name: 'agent-search'})"
            >
              search
            </v-icon>
          </td>
          <td class="text-xs-center">
            {{ props.item.lastActive }}
          </td>
        </tr>
      </template>
    </v-data-table> -->
  </div>
</template>

<script>
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
export default {
  components: { UpdatedListComponent },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      tableHeaders: [
        { text: '', value: 'clientName', sortable: false },
        {
          text: 'Initial Search',
          value: 'initialSearch',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Last Active',
          value: 'lastActive',
          sortable: false,
          align: 'center'
        }
      ]
    }
  },

  methods: {
    generateHomeSearchData(tableDataArray) {
      let responseData = []
      tableDataArray.forEach((item, index) => {
        let rowObject = {}
        rowObject[0] = {
          type: 'avatar',
          text: item.name,
          class: 'textLeft hwayzTeal text-capitalize',
          data: { type: 'clientName', value: item, action: 'client-clicked' } }
        rowObject[1] = {
          type: 'icon',
          color: '#3d3d3d',
          text: 'search',
          data: item
        }
        rowObject[2] = { text: item.lastActive }
        responseData.push(rowObject)
      })
      return responseData
    },

    onClientNameClicked(data) {
      this.$emit('client-clicked', data)
    },

    onInitialSearchClicked(data) {
      this.$router.push({
        name: 'agent-search',
        params: {
          assignToClient: data
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
#favoriteIcon
  cursor: pointer

.theme--light.v-table tbody
  tr:hover:not(.v-datatable__expand-row)
    background-color: #fff
  tr:not(:last-child)
    border-style: none

.theme--light.v-table thead tr:first-child
  border-style: none

.create-home-search__client
  text-align: left !important
  display: flex
  justify-content: flex-start
  align-items: center
  span
    @extend %clientName
    cursor: pointer

</style>
