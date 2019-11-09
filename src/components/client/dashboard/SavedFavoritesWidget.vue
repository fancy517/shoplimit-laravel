<template>
  <div v-if="tableData">
    <updated-list-component
      :table-headers="tableHeaders"
      :table-data="generateFavoritesData(tableData)"
      @open-message-modal="openMessageModal($event)"
      @remove-favorite="$emit('favorite-clicked', $event)"
      @clicked="requestTourForProperty($event)"
    />
    <modal-send-message
      :show-modal="displayMessageModal"
      :selected-property="selectedProperty"
      @close-modal="closeMessageModal()"
      @submit-modal="sendMessage($event)"
    />
  </div>
</template>

<script>
import ModalSendMessage from '../modals/ModalSendMessage.vue'
import UpdatedListComponent from '../../uiUtils/UpdatedListComponent.vue'
import { getPropertyKeyValue } from '../../../utils/propertyUtils'
import refreshClientData from '../../mixins/refreshClientData'
import { sendMessage } from '../../../services/messagesService'

export default {
  components: { ModalSendMessage, UpdatedListComponent },

  mixins: [refreshClientData],

  props: {
    options: {
      type: Object,
      required: false,
      default: function() {
        return {
          hideHeaders: false,
          hideActions: false
        }
      }
    },
    tableData: {
      type: Array,
      default: () => []
    },
    clientFavorites: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      tableHeaders: [
        { text: 'Home Address', value: 'homeAddress', width: '60%', sortable: false },
        { text: '', value: 'message', sortable: false },
        { text: '', value: 'favorite', sortable: false },
        { text: '', value: 'requestTour', sortable: false }
      ],
      displayPropertyModal: false,
      selectedProperty: null,
      displayMessageModal: false
    }
  },

  methods: {
    generateFavoritesData(tableDataArray) {
      let responseData = []
      tableDataArray.map((item, index) => {
        let rowObject = {}
        rowObject[0] = {
          type: 'addressImg',
          icon: true,
          text: this.getHomeAddress(item),
          data: item
        }
        rowObject[1] = {
          type: 'icon',
          text: 'email',
          color: '#f1b856',
          data: { type: 'message', value: item, action: 'open-message-modal' }
        }
        rowObject[2] = {
          type: 'icon',
          text: 'favorite',
          color: '#ec407a',
          data: { type: 'removeFav', value: item, action: 'remove-favorite' }
        }

        if (item.requestTour === false) {
          rowObject[3] = {
            type: 'clickable',
            color: '#20b7c9',
            text: 'REQUEST TOUR',
            data: item
          }
        } else {
          rowObject[3] = {
            text: 'TOUR REQUESTED',
            class: 'green--text',
            icon: 'check',
            iconClass: 'green--text'
          }
        }
        responseData.push(rowObject)
      })
      return responseData
    },

    openMessageModal(home) {
      this.displayMessageModal = true
      this.selectedProperty = this.clientFavorites.find(favorite => favorite._id === home.propertyId)
    },

    closeMessageModal() {
      this.displayMessageModal = false
      this.selectedProperty = null
    },

    async sendMessage(data) {
      await sendMessage(data)
      this.closeMessageModal()
    },

    getHomeAddress(homeObject) {
      return getPropertyKeyValue(
        homeObject.propertyId,
        this.clientFavorites,
        'Address'
      )
    }
  }
}
</script>

<style scoped>
#favoriteIcon {
  cursor: pointer;
}

.saved-fav-widget__address {
  text-align: left !important;
}

.saved-fav-widget__address span {
  padding-left: 1rem;
  cursor: pointer;
}

.saved-fav-widget__request {
  cursor: pointer;
  color: #20b7c9;
}
</style>
