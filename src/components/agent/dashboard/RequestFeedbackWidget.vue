<template>
  <div v-if="tableData">
    <updated-list-component
      :table-headers="tableHeader"
      :table-data="generateFeedbackData(tableData)"
      @client-clicked="clientClicked($event)"
      @request-feedback="sendFeedbackRequest($event)"
    />
    <!-- <v-data-table
      :headers="tableHeader"
      :items="tableData"
      item-key="id"
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
          <td class="request-feedback__client">
            <v-avatar size="30px" class="avatar-margin">
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-avatar>
            <span>{{ props.item.name }}</span>
          </td>
          <td class="text-xs-center">
            {{ props.item.review }}
          </td>
          <td class="text-xs-center">
            {{ props.item.feedbackNeeded }}
          </td>
          <td class="text-xs-center">
            <v-btn
              id="btnFeedback"
              color="#fe613e"
              round
              dark
              @click="$emit('button-clicked', props.item.id)"
            >
              PROVIDE FEEDBACK
            </v-btn>
          </td>
          <td class="text-xs-center">
            <v-btn
              id="btnFeedback"
              color="#00acc1"
              round
              dark
              @click="$emit('button-clicked', props.item.id)"
            >
              REQUEST FEEDBACK
            </v-btn>
          </td>
          <td class="text-xs-center">
            <v-btn
              id="btnFeedback"
              color="#fe613e"
              round
              dark
              @click="$emit('button-clicked', props.item.id)"
            >
              PROVIDE FEEDBACK
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>-->
  </div>
</template>

<script>
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import {
  feedbackNeededProperties,
  feedbackProvidedProperties
} from '../../../utils/propertyUtils'

export default {
  components: { UpdatedListComponent },
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
          hideActions: false
        }
      }
    }
  },

  data() {
    return {
      tableHeader: [
        { text: '', value: 'name', width: '40%', sortable: false },
        // { text: '', value: 'name',  sortable: false },
        { text: 'Review', value: 'review', sortable: false, align: 'center' },
        {
          text: 'Needed',
          value: 'feedbackNeeded',
          sortable: false,
          align: 'center'
        },
        // { text: 'Provide', value: 'provideFeedback', sortable: false, align: 'center' },
        {
          text: 'Request Feedback',
          value: 'requestFeedback',
          sortable: false,
          align: 'center'
        }
      ]
    }
  },

  methods: {
    generateFeedbackData(tableDataArray) {
      let responseData = []
      tableDataArray.map((item, index) => {
        let rowObject = {}
        rowObject[0] = {
          type: 'avatar',
          text: item.name,
          class: 'textLeft hwayzTeal text-capitalize wide',
          data: { action: 'client-clicked', value: item }
        }
        // rowObject[1] = { }
        rowObject[1] = { text: feedbackProvidedProperties(item.homes).length }
        rowObject[2] = { text: feedbackNeededProperties(item.homes).length }

        // rowObject[3] = {
        //   type: 'button',
        //   text: 'PROVIDE FEEDBACK',
        //   class: 'btnSmall hwayzSun',
        //   data: {
        //     type: 'feedback',
        //     value: item
        //   }
        // }

        rowObject[3] = {
          type: 'button',
          text: 'REQUEST',
          class: 'btnSmall hwayzTeal',
          data: { action: 'request-feedback', value: item }
        }
        responseData.push(rowObject)
      })
      return responseData
    },

    clientClicked(data) {
      this.$emit('client-clicked', data)
    },

    sendFeedbackRequest(data) {
      this.$emit('request-feedback', data)
    }
  }
}
</script>

<style lang='sass' scoped>
/* Disables row hover color change */
.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row)
  background-color: $hwayzBackgroundColor

.theme--light.v-table thead tr:first-child
  border-style: none

.theme--light.v-table tbody tr:not(:last-child)
  border-style: none

.request-feedback__client
  text-align: left !important
  display: flex
  justify-content: flex-start
  align-items: center

.request-feedback__client span
  @extend %clientName

#btnFeedback
  height: 2.5rem
  font-size: $hwayzFont1rem1

</style>
