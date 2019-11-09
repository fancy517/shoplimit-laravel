<template>
  <div class="widget-table-nested">
    <v-container class="header-container">
      <v-layout>
        <v-flex
          v-for="header in nestedTableHeader"
          :key="header.value"
          class="normal-font"
          :style="{'width': header.width, 'text-align': header.align}"
        >
          {{ header.text }}
        </v-flex>
      </v-layout>
    </v-container>
    <div v-for="row in offerData" :key="row.id">
      <!-- {{row|json}} -->
      <v-toolbar flat dense color="white" class="name">
        <v-avatar size="30px" class="avatar-margin" :color="colors[row.name[0]]">
          <img v-if="row.avatar" src="row.avatar" alt="row.name">
          <span v-else class="white--text">{{ row.name | initials }}</span>
        </v-avatar>
        <a @click="$emit('client-clicked', row)">{{ row.name }}</a>
        <v-spacer />
        <v-toolbar-items class="hidden-sm-and-down">
          <v-subheader class="toolbar-text">
            {{ row.confirmedRoutes }}
          </v-subheader>
        </v-toolbar-items>
      </v-toolbar>

      <template v-if="row.nestedTableData && getDataLength(row.nestedTableData)">
        <updated-list-component
          class="nested-table"
          :table-headers="columnNames"
          :hide-headers="true"
          :table-data="generateTableData(row.nestedTableData)"
          @submit-send-offer="submitSendOfferToClient($event, row)"
        />
      </template>
    </div>
  </div>
</template>

<script>
// import tableWithButton from './TableWithButton.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import { calculateFeedbackMatch } from '../../../utils/propertyUtils'
import avatarColors from '../../../utils/avatarColors'

export default {
  components: { UpdatedListComponent },
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
    offerData: {
      type: Array,
      default: () => []
    },
    nestedTableHeader: {
      type: Array,
      required: true
    }
  },

  data: function() {
    return { colors: avatarColors }
  },

  methods: {
    generateTableData(tableDataArray) {
      let responseData = []
      tableDataArray
        // .filter(item => Math.round(this.calculateFeedbackPercent(item)) / 10 >= 8)
        .forEach((item, index) => {
          const matchPercent = Math.round(this.calculateFeedbackPercent(item))
          let rowObject = {}
          rowObject[0] = {
            text: item.propertyData['Address'],
            cellClass: 'address-cell-class',
            class: 'textLeft'
          }

          rowObject[1] = {
            type: 'clickable',
            text: matchPercent,
            cellClass: 'percents-cell-class',
            data: { value: item, type: 'match', action: 'open-feedback-modal' }
          }

          rowObject[2] = {
            type: 'button',
            text: 'SEND',
            class: 'btnSmall hwayzTeal',
            outline: true,
            data: { action: 'submit-send-offer',
              value: { ...item, ...{ address: item.propertyData['Address'] } } }
          }
          responseData.push(rowObject)
        })
      return responseData
    },

    submitSendOfferToClient(item, row) {
      this.$emit('request-offer', {
        _id: row._id,
        address: item.address
      })
    },

    getDataLength(data) {
      let highMatch = false
      data.map(item => {
        if (Math.round(this.calculateFeedbackPercent(item)) / 10 >= 8) {
          highMatch = true
        }
      })
      return highMatch
    },

    calculateFeedbackPercent(home) {
      if (home.feedback) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return 'N/A'
    }
  }
}
</script>

<style lang="sass">
.address-cell-class
  width: 45%

.percents-cell-class
  width: 35%

.widget-table-nested
  padding: 5px

.header-container
  width: 100%
  margin: 0

.theme--light.v-table thead th
  color: $hwayzBlack
  font-weight: 500

.theme--light.v-table thead tr:first-child
  border-style: none

.theme--light.v-table tbody tr:not(:last-child)
  border-style: none

.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row)
  background-color: $hwayzBackgroundColor

.avatar-margin
  margin-right: 10px

.white-override
  color: white !important

.nested-table
  width: 95%
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
