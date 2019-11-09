<template>
  <div class="border-top">
    <v-container class="communication" pa-0>
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
            :panel-title-class="'secondary-background'"
          >
            <template v-slot:panel-content>
              <template>
                <dialogs-list
                  :dialogs="clientDialogs"
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
              :sender="clientData._id"
            />
          </div>
          <reply-message
            v-if="selectedMessages.length"
            @on-submit="onSubmitNewMessage($event)"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PanelContainer from '../../components/uiUtils/PanelContainer.vue'
import { sendMessage } from '../../services/messagesService'
import DialogsList from '../../components/communication/DialogsList'
import UserDialog from '../../components/communication/UserDialog'
import ReplyMessage from '../../components/communication/ReplyMessage'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: { PanelContainer, ReplyMessage, UserDialog, DialogsList },
  data() {
    return {
      selectedMessages: [],
      selectedUser: {}
    }
  },
  computed: {
    ...mapState('client', ['clientData', 'clientMessages', 'clientDialogs']),
    ...mapGetters('client', ['clientUnreadMessages'])
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
    ...mapActions('client', ['markMessagesAsRead', 'getDialogsUsers']),

    async selectDialog(user) {
      this.selectedUser = user
      this.selectedMessages = this.getMessagesWithUser(this.clientMessages, user._id).map(message => {
        const from = message.from === this.clientData._id ? this.clientData : user
        return Object.assign({}, message, { from })
      })
      const messages = this.selectedMessages.filter(message => {
        return !message.read && message.from._id !== this.clientData._id
      })
      await this.markMessagesAsRead({ user, messages })
    },

    getMessagesWithUser(messages, userId) {
      return messages
        .filter(message => (message.from === userId || message.from === this.clientData._id))
    },

    async onSubmitNewMessage(message) {
      const newMessage = (await sendMessage({
        to: [this.selectedUser._id],
        message,
        subject: 'Chat message'
      })).data
      newMessage.from = this.clientData
      this.selectedMessages.push(newMessage)
    }
  }
}
</script>

<style scoped lang="scss">
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

.border-top {
  border-top: 1px solid #BEBEBE;
}

.communication {
  background: $hwayzBackgroundColor;
  display: block;
  max-width: 100%;
  margin: 0;
  align-items: stretch;
  height: calc(100% - 64px)
}

.user-dialog_wrapper {
  height: calc(100vh - 225px);
  min-height: 0px;
  overflow-y: scroll;
}
</style>
