<template>
  <div>
    <updated-list-component
      :table-headers="matchData ? tableHeaders : provideFeedbackHeaders"
      :table-data="generateFeedbackData(tableData)"
      @open-feedback-modal="openFeedbackFillupModal($event)"
    />
    <template v-if="selectedFeedbackData">
      <feedback-modal
        :key="selectedFeedbackData._id"
        :open-modal="displayFeedbackModal"
        :selected-home="selectedFeedbackData"
        :person-name="clientData ? clientData.name : ''"
        @close-feedback-modal="closeFeedbackFillupModal()"
      />
    </template>
    <content-with-button-modal
      :modal-params="modalParams"
      :show-modal="displayPrefModal"
      @close-modal="closePrefModal($event)"
    />
  </div>
</template>

<script>
import FeedbackModal from '../../modals/FeedbackModal.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import ContentWithButtonModal from '../../modals/ContentWithButtonModal.vue'
import { calculateFeedbackMatch, propertyFullAddress } from '../../../utils/propertyUtils'

export default {
  components: { FeedbackModal, UpdatedListComponent, ContentWithButtonModal },

  props: {
    matchData: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    clientHomes: {
      type: Array,
      required: true
    },
    clientData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      tableHeaders: [
        { text: 'Address', value: 'address', width: '60%', sortable: false },
        { text: 'Date Toured', value: 'dateToured', sortable: false, align: 'center' },
        { text: 'Match', value: 'match', sortable: false, align: 'center' }
      ],
      provideFeedbackHeaders: [
        { text: 'Address', value: 'address', sortable: false },
        { text: 'Viewed Date', value: 'dateToured', sortable: false, align: 'center' },
        { text: '', value: '', sortable: false }
      ],
      displayPropertyModal: false,
      selectedProperty: null,
      displayFeedbackModal: false,
      selectedFeedbackData: null,
      displayPrefModal: false,
      modalParams: {
        title: 'Please set your needs and wants preferences in your account before filling out feedback for a home',
        btnText: 'Redirect to Account'
      }
    }
  },

  methods: {
    generateFeedbackData(tableDataArray) {
      let responseData = []
      tableDataArray.sort(this.compare)
      tableDataArray.map((item, index) => {
        let rowObject = {}
        rowObject[0] = {
          type: 'addressImg',
          icon: true,
          text: this.getHomeFullAddress(item),
          data: item
        }
        rowObject[1] = { type: 'date', text: item._timestamp }

        if (this.matchData) {
          rowObject[2] = {
            type: 'clickable',
            text: this.getMatchPercent(item),
            data: { value: item, type: 'match', action: 'open-feedback-modal' }
          }
        } else {
          rowObject[2] = {
            type: 'clickable',
            text: 'Provide Feedback',
            class: 'scheduled',
            data: { value: item, type: 'feedback', action: 'open-feedback-modal' }
          }
        }
        responseData.push(rowObject)
      })
      return responseData
    },

    compare(a, b) {
      if (parseInt(this.getMatchPercent(a)) < parseInt(this.getMatchPercent(b))) { return -1 } else { return 1 }
    },

    getHomeFullAddress(home) {
      if (this.clientHomes) {
        const searchedProperty = this.clientHomes.find(
          property => property._id === home.propertyId
        )
        if (searchedProperty) {
          return propertyFullAddress(searchedProperty)
        }
      }
      return 'Loading address...'
    },

    getMatchPercent(home) {
      if (home.feedback.match) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return 999
    },

    openFeedbackFillupModal(data = null) {
      if (this.clientData && this.clientData.homePrefs) {
        this.displayFeedbackModal = true
        this.selectedFeedbackData = data
      } else {
        this.displayPrefModal = true
      }
    },

    closeFeedbackFillupModal() {
      this.displayFeedbackModal = false
      this.selectedFeedbackData = null
    },

    closePrefModal(status = false) {
      this.displayPrefModal = false
      if (status) {
        this.$router.push({ name: 'client-account' })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
#favoriteIcon
  cursor: pointer

.feedback-widget__address
  text-align: left !important

.feedback-widget__address span
  padding-left: 1rem
  cursor: pointer

.feedback-widget__percent
  text-align: center
  cursor: pointer
</style>
