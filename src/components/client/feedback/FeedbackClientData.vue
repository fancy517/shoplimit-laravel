<template>
  <div v-if="tableData">
    <updated-list-component
      :table-headers="tableHeaders"
      :table-data="generateFeedbackData(tableData)"
      @open-offer-modal="setModalShowing($event, true)"
      @open-feedback-modal="onFeedbackModalOpen($event)"
    />
    <!--
      <template v-else class="ma-5">
        <div v-if="feedbackType === 'provided'">
          There are no properties that have been given feedback yet.
          <br>Please check if there are some with pending feedback from the 'Feedback Needed' tab above.
        </div>
        <div v-else>
          No Properties pending for feedback<br>
          If you want to see homes with provided feedback then Please select the 'Feedback Provided' tab above.
        </div>
    </template>-->
    <template v-if="selectedFeedbackData">
      <feedback-modal
        :key="selectedFeedbackData._id"
        :open-modal="displayFeedbackModal"
        :selected-home="selectedFeedbackData"
        :person-name="clientData ? clientData.name : ''"
        @close-feedback-modal="closeFeedbackDetailsModal()"
      />
    </template>
    <content-with-button-modal
      :modal-params="modalParams"
      :show-modal="displayPrefModal"
      @close-modal="closePrefModal($event)"
    />
    <modal-make-offer
      ref="modalMakeOffer"
      :home-address="selectedHomeAddress"
      :agent="associatedAgent || {}"
      @submit-modal="sendOfferMessage($event)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ModalMakeOffer from '../modals/ModalMakeOffer.vue'
import FeedbackModal from '../../modals/FeedbackModal.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import ContentWithButtonModal from '../../modals/ContentWithButtonModal.vue'
import refreshClientData from '../../mixins/refreshClientData'
import {
  calculateFeedbackMatch,
  getPropertyKeyValue
} from '../../../utils/propertyUtils'
import { sendOfferMessage } from '../../../services/messagesService'

export default {
  components: {
    ModalMakeOffer,
    UpdatedListComponent,
    ContentWithButtonModal,
    FeedbackModal
  },

  mixins: [refreshClientData],

  props: {
    tableHeaders: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    feedbackType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      maxVisible: 6,
      hoverRow: null,
      displayFeedbackModal: false,
      selectedFeedbackData: null,
      displayPropertyModal: false,
      selectedProperty: null,
      selectedHomeAddress: '',
      displayPrefModal: false,
      modalParams: {}
    }
  },

  computed: {
    ...mapState('client', ['clientData', 'clientFavorites', 'associatedAgent'])
  },

  methods: {
    generateFeedbackData(tableDataArray) {
      let responseData = []
      tableDataArray.sort(this.compare)

      tableDataArray.map((item, index) => {
        let rowObject = {}
        rowObject[0] = {
          type: 'addressImg',
          data: item
        }
        rowObject[1] = { type: 'date', text: item._timestamp }
        rowObject[2] = { type: 'picIndicator', picStatus: false }
        rowObject[3] = {
          type: 'clickable',
          text: 'Make An Offer',
          color: '#bb68cd',
          data: { value: item, type: 'offer', action: 'open-offer-modal' }
        }

        if (this.feedbackType === 'provided') {
          rowObject[4] = {
            type: 'clickable',
            text: this.calculateFeedbackPercent(item),
            data: { value: item, type: 'match', action: 'open-feedback-modal' }
          }
        } else {
          rowObject[4] = {
            type: 'clickable',
            text: 'Provide Feedback',
            class: 'scheduled',
            data: {
              value: item,
              type: 'feedback',
              action: 'open-feedback-modal'
            }
          }
        }
        responseData.push(rowObject)
      })
      return responseData
    },

    onFeedbackModalOpen(data) {
      if (this.clientData && this.clientData.homePrefs) {
        this.displayFeedbackModal = true
        this.selectedFeedbackData = data
      } else {
        Object.assign(this.modalParams, {
          title:
            'Please set your needs and wants preferences in your account before filling out feedback for a home',
          btnText: 'Redirect to Account',
          type: 'redirect'
        })
        this.displayPrefModal = true
      }
    },

    compare(a, b) {
      if (
        parseInt(this.calculateFeedbackPercent(a)) >
        parseInt(this.calculateFeedbackPercent(b))
      ) {
        return -1
      } else {
        return 1
      }
    },

    closeFeedbackDetailsModal() {
      this.displayFeedbackModal = false
      this.selectedFeedbackData = null
    },

    closePrefModal(type = null) {
      this.displayPrefModal = false
      if (type === 'redirect') {
        this.closeFeedbackDetailsModal()
        this.$router.push({ name: 'client-account' })
      } else if (type === 'offer') {
        this.closeFeedbackDetailsModal()
      }
    },

    setModalShowing(data, status) {
      if (data.feedback.match) {
        this.selectedHomeAddress = status
          ? getPropertyKeyValue(
            data.propertyId,
            this.clientFavorites,
            'Address'
          )
          : ''
        this.$refs.modalMakeOffer.setModalShowing(status)
      } else {
        Object.assign(this.modalParams, {
          title: 'Please provide feedback before making an offer',
          btnText: 'Close',
          type: 'offer'
        })
        this.displayPrefModal = true
      }
    },

    async sendOfferMessage(data) {
      await sendOfferMessage(data)
      this.$refs.modalMakeOffer.setModalShowing(false)
    },

    calculateFeedbackPercent(home) {
      if (home.feedback) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return '9999.99'
    }
  }
}
</script>

<style lang="sass" scoped>
#feedbackTableData
  background-color: #fff
  box-sizing: border-box
  font-size: $hwayzFont1rem4
  height: 60vh

.column-location
  padding: 1rem !important

.img-wrap
  cursor: pointer
  position: relative
  width: 25%
  min-width: 10rem
  height: 100%
  display: inline-block
  vertical-align: middle
  margin-right: 1rem

.img-text
  position: absolute
  top: 0
  left: 0
  height: 100%
  width: 100%
  border-radius: 0.5rem
  background-color: #00000070
  color: $hwayzWhite
  text-align: center

.home-image
  border-radius: 0.5rem

a
  text-transform: uppercase
  font-size: $hwayzFont1rem2

.hyperlink-feedback
  color: $hwayzTeal !important

.label-feedback-percentage
  text-transform: uppercase
  font-size: 1.2rem
  cursor: pointer

.hyperlink-offer
  color: $hwayzPink !important

.indicator-pictures
  width: 1.2rem
  height: 1.2rem
  border-radius: 50%
  margin: 0 auto

  border: 0.1rem solid $hwayzOrange
  background-color: white

.indicator-pictures--true
  border: 0.1rem solid $hwayzIndicator
  background-color: $hwayzIndicator

/* Scrollbar style */
tbody::-webkit-scrollbar-track
  background-color: $hwayzce
  /* make the track seem narrower than the thumb */
  border: solid 1px white

tbody::-webkit-scrollbar
  width: 4px
  background-color: $hwayzce

tbody::-webkit-scrollbar-thumb
  background-color: red
</style>
