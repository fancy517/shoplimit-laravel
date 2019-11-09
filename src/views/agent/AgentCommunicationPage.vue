<template>
  <div>
    <div class="communication" pa-0>
      <v-layout id="containerClientCommunication" wrap>
        <v-flex xs12 md5 class="list-section">
          <v-breadcrumbs
            id="breadcrumbs"
            :items="[{ text: 'Communication' }]"
            divider="/"
          />
          <panel-container
            :panel-icon="'message'"
            :panel-title="'Communication'"
          >
            <template v-slot:panel-content>
              <template>
                <dialogs-list
                  :dialogs="agentDialogs"
                  @select-dialog="selectDialog($event)"
                />
              </template>
            </template>
          </panel-container>
        </v-flex>

        <!-- This is the right hand message component -->
        <v-flex
          xs12
          md7
          class="messages-section"
        >
          <div class="messages-section__title">
            Messages:
          </div>
          <div
            v-if="selectedMessages.length"
            class="user-dialog_wrapper"
          >
            <user-dialog
              :messages="selectedMessages"
              :sender="agentData._id"
            />
          </div>
          <reply-message
            v-if="selectedMessages.length"
            @on-submit="onSubmitNewMessage($event)"
          />
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import DialogsList from '../../components/communication/DialogsList'
import UserDialog from '../../components/communication/UserDialog'
import ReplyMessage from '../../components/communication/ReplyMessage'
import PanelContainer from '../../components/uiUtils/PanelContainer.vue'
import { sendMessage } from '../../services/messagesService'

export default {
  components: { UserDialog, DialogsList, ReplyMessage, PanelContainer },
  data() {
    return {
      selectedMessages: [],
      selectedUser: {}
    }
  },
  computed: {
    ...mapState('agent', ['agentData', 'agentMessages', 'agentDialogs']),
    ...mapGetters('agent', ['agentUnreadMessages'])
  },
  watch: {
    getDialogsUsers() {
      this.getDialogsUsers()
    }
  },
  created() {
    this.getDialogsUsers()
  },
  methods: {
    ...mapActions('agent', ['markMessagesAsRead', 'getDialogsUsers']),
    async selectDialog(user) {
      this.selectedUser = user
      this.selectedMessages = this.getMessagesWithUser(this.agentMessages, user._id).map(message => {
        const from = message.from === this.agentData._id ? this.agentData : user
        return Object.assign({}, message, { from })
      })
      const messages = this.selectedMessages.filter(message =>
        !message.read && message.from._id !== this.agentData._id
      )
      await this.markMessagesAsRead({ user, messages })
    },

    getMessagesWithUser(messages, userId) {
      return messages.filter(message => message.from === userId || message.to[0] === userId)
    },

    async onSubmitNewMessage(message) {
      const newMessage = (await sendMessage({
        to: [this.selectedUser._id],
        message,
        subject: 'Chat message'
      })).data
      newMessage.from = this.agentData
      this.selectedMessages.push(newMessage)
    }
  }
}
</script>

<style lang="scss">
#breadcrumbs {
  a {
    font-size: 15px;
  }
}
.messages-section {
  background: #FFFF;
  border-left: 1px solid #BEBEBE;
  height: calc(100vh - 64px);
}

.list-section {
  padding: 25px 20px 0;
}

.messages-section__title {
  margin-top: 25px;
  margin-bottom: 20px;
  text-align-last: left;
  padding-left: 20px;
}

.communication {
  background: $hwayzBackgroundColor;
  display: block;
  align-items: stretch;
  height: calc(100% - 64px)
}

.user-dialog_wrapper {
  height: calc(100vh - 225px);
  min-height: 0px;
  overflow-y: scroll;
}
</style>
