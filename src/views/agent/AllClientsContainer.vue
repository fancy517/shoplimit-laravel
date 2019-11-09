<template>
  <panel-container :panel-icon="'people'" :panel-title="'All Clients'">
    <template v-slot:panel-content>
      <template v-if="agentData">
        <updated-list-component
          :table-headers="clientsTableHeader"
          :table-data="generateClientList()"
          :center-headings-text="true"
          @clicked="onClientNameClicked($event)"
          @send-message-clicked="onSendMessageClicked($event)"
        />
      </template>
      <template v-else>
        <v-progress-linear height="5" :color="$btnHwayzBlue" :indeterminate="true" />Loading Associated Clients...
      </template>
    </template>
  </panel-container>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import PanelContainer from '../../components/uiUtils/PanelContainer.vue'
import UpdatedListComponent from '../../components/uiUtils/UpdatedListComponent.vue'

import colors from '../../scss/_colors.scss'

export default {
  components: { PanelContainer, UpdatedListComponent },
  data() {
    return {
      clientsTableHeader: [
        { text: 'Client', value: 'clientName', sortable: false },
        { text: 'Tasks Required', value: 'tasksRequired', sortable: false },
        { text: 'Last Active', value: 'lastActive', sortable: false },
        { text: 'Send message', value: 'email', sortable: false },
        { text: 'Phone', value: 'phone', sortable: false },
        { text: 'Offers Made', value: 'offersMade', sortable: false }
      ]
    }
  },

  computed: {
    /**
     * Mapping getter to get active agent's data
     */
    ...mapState('agent', ['agentData'])
  },

  methods: {
    /**
     * Mapping agent auth login functionality with the component
     */
    ...mapActions('agent', ['getAgentProfile', 'setSearchedClient']),

    generateClientList() {
      let responseData = []
      if (this.agentData) {
        this.agentData.clients.map((item, index) => {
          let rowObject = {}
          rowObject[0] = {
            type: 'avatar',
            text: item.name,
            class: 'textLeft text-capitalize',
            data: item
          }
          rowObject[1] = { text: 'Icons here' }
          rowObject[2] = { text: moment(item.lastActivity).format('MM-DD-YY') }
          rowObject[3] = {
            type: 'icon',
            color: colors.hwayzBlack,
            text: 'chat',
            data: {
              type: 'sendMessageClick',
              value: item,
              action: 'send-message-clicked'
            }
          }
          rowObject[4] = {
            text: item.phone.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1)-$2-$3')
          }
          rowObject[5] = { text: '0' }
          responseData.push(rowObject)
        })
      }
      return responseData
    },

    onClientNameClicked(data) {
      this.setSearchedClient(data)
      this.$router.push({ name: 'client-detail' })
    },

    onSendMessageClicked(data) {
      this.setSearchedClient(data)
      this.$router.push({ name: 'communication' })
    }
  }
}
</script>
