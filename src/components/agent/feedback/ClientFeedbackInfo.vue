<template>
  <div>
    <updated-list-component
      :table-headers="getTableHeaders()"
      :table-data="generateTableItems(tableData)"
      @open-feedback-modal="onEditFeedbackListener($event)"
      @ask-for-feedback="askClientForFeedback($event)"
    />
    <template v-if="selectedClient && selectedFeedbackData">
      <feedback-modal
        :key="selectedFeedbackData._id"
        :open-modal="displayFeedbackModal"
        :selected-home="selectedFeedbackData"
        :person-name="agentData ? agentData.name : ''"
        @close-feedback-modal="closeFeedbackDetailsModal()"
      />
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import FeedbackModal from '../../modals/FeedbackModal.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import {
  getWantNeedMatch,
  getPropertyKeyValue,
  calculateFeedbackMatch
} from '../../../utils/propertyUtils'
import { askClientForFeedback } from '../../../services/messagesService'

export default {
  filters: {
    dateFormat: value => {
      return moment(value).format('MM-DD-YY, hh:mm a')
    }
  },

  components: { FeedbackModal, UpdatedListComponent },

  props: {
    active: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      displayFeedbackModal: false,
      displayPropertyModal: false,
      selectedProperty: null,
      selectedFeedbackData: {},
      viewingId: null
    }
  },

  computed: {
    ...mapState('agent', ['selectedClient', 'agentData']),
    ...mapState('client', ['clientFavorites'])
  },

  methods: {
    getTableHeaders() {
      let headers = [
        { text: 'Address', value: 'address', width: '50%', sortable: false },
        { text: 'Needs', value: 'needs', sortable: false },
        { text: 'Wants', value: 'wants', sortable: false },
        { text: 'Pics', value: 'pics', sortable: false },
        { text: 'Date Viewed', value: 'last_viewed', sortable: false }
      ]

      if (this.active === 0) {
        headers.push({
          text: 'Provide',
          value: 'provideFeedback',
          sortable: false,
          align: 'center'
        })
      }
      headers.push({ text: 'Feedback', value: 'feedback', sortable: false })
      return headers
    },

    onEditFeedbackListener(data = null) {
      this.displayFeedbackModal = true
      this.selectedFeedbackData = data
    },

    closeFeedbackDetailsModal() {
      this.displayFeedbackModal = false
      this.selectedFeedbackData = {}
    },

    generateTableItems(tableDataArray) {
      let response = []
      tableDataArray.sort(this.compare)
      tableDataArray.map((item, index) => {
        let rowObject = {}
        rowObject[0] = {
          type: 'addressImg',
          icon: false,
          text: this.getHomeAddress(item.propertyId),
          data: item
        }

        if (this.active === 1) {
          rowObject[1] = {
            text: `${Math.round(getWantNeedMatch(item, 'need'))}%`
          }
          rowObject[2] = {
            text: `${Math.round(getWantNeedMatch(item, 'want'))}%`
          }
          rowObject[5] = {
            type: 'clickable',
            text: this.getMatchPercentage(item),
            data: { value: item, type: 'match', action: 'open-feedback-modal' }
          }
        } else {
          rowObject[1] = { text: '-' }
          rowObject[2] = { text: '-' }
          rowObject[5] = {
            type: 'clickable',
            text: 'Provide',
            class: 'hwayzSun',
            data: {
              type: 'feedback',
              value: item,
              action: 'open-feedback-modal'
            }
          }
          rowObject[6] = {
            type: 'clickable',
            text: 'Request',
            class: 'hwayzTeal',
            data: {
              value: {
                ...item,
                ...{ address: this.getHomeAddress(item.propertyId) }
              },
              action: 'ask-for-feedback'
            }
          }
        }

        rowObject[3] = { type: 'picIndicator', picStatus: false }
        rowObject[4] = { type: 'date', text: item._timestamp }

        response.push(rowObject)
      })
      return response
    },

    /**
     * Retrieve home details based on home id
     */
    getHomeAddress(homeId) {
      const value = getPropertyKeyValue(
        homeId,
        this.clientFavorites,
        'Address'
      )
      return value || homeId
    },

    compare(a, b) {
      // console.log(this.getMatchPercentage(a), this.getMatchPercentage(b), this.getMatchPercentage(a) < this.getMatchPercentage(b))
      if (
        parseInt(this.getMatchPercentage(a)) >
        parseInt(this.getMatchPercentage(b))
      ) {
        return -1
      } else {
        return 1
      }
    },

    getHomeDetails(homeId = null) {
      if (this.clientFavorites) {
        const foundHome = this.clientFavorites.find(
          home => home._id === homeId
        )
        if (foundHome) {
          return foundHome
        }
      }
      return homeId
    },

    /**
     * Returns the match percentage based on wants and needs
     * provided in the feedback by the client
     */
    getMatchPercentage(home) {
      if (home.feedback.match) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return '9999.99'
    },

    askClientForFeedback(data) {
      return askClientForFeedback({
        address: data.address,
        to: [this.selectedClient._id]
      })
    }
  }
}
</script>

<style lang="sass">
</style>
