<template>
  <v-layout id="plannerCommunication" wrap align-start>
    <v-flex xs12 md6>
      <panel-container :panel-icon="'message'" :panel-title="'Communication'">
        <template v-slot:panel-content>
          <div class="sort-by-button">
            sort by <v-icon small>
              expand_more
            </v-icon>
          </div>
          <div style="height: 1rem;" />
          <div class="planner-comm__person">
            <div class="planner-comm__name">
              <v-icon size="60px" color="grey">
                fiber_manual_record
              </v-icon>
              <span>{{ selectedClient.name }}</span>
            </div>
            <div class="planner-comm__message">
              <div v-if="isLoadingMessages">
                <v-progress-linear :indeterminate="true" :color="loadingColor" />Loading Messages...
              </div>
              <div
                v-for="(message, i) in clientMessages"
                v-else
                :key="i"
                :class="{'bold': !message.read}"
                class="row"
                @click="messageSelected(message)"
              >
                <v-layout wrap>
                  <v-flex xs2>
                    {{ displayDate(message._timestamp) }}
                  </v-flex>
                  <v-flex xs8 class="text-xs-left">
                    Sub: {{ message.subject }}
                  </v-flex>
                  <v-flex
                    :class="{
                      'green--text': message.origin === 'web',
                      'orange--text': message.origin === 'email',
                    }"
                    xs2
                  >
                    {{ displayMessageOrigin(message.origin) }}
                  </v-flex>
                </v-layout>
              </div>
            </div>
          </div>
        </template>
      </panel-container>
    </v-flex>

    <!-- This is the right hand message component -->
    <v-flex v-if="selectedMessage" xs12 md6>
      <div class="planner-comm__wrap mt-4">
        <div style="padding-top: 2rem; text-transform: capitalize">
          {{ selectedMessage.type }}
        </div>
        <div class="planner-comm__content">
          <div class="planner-comm__person">
            <div class="planner-comm__name">
              <v-icon size="60px" color="grey">
                fiber_manual_record
              </v-icon>
              <span>{{ selectedClient.name }}</span>
            </div>
            <div
              class="planner-comm__message-subject"
            >
              Subject: {{ selectedMessage.subject || null }}
            </div>
            <div class="planner-comm__message-detail">
              {{ selectedMessage.message }}
            </div>
          </div>
          <div class="text-right">
            <v-btn class="planner-comm__reply" :color="$btnHwayzBlue">
              REPLY
            </v-btn>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import PanelContainer from '../uiUtils/PanelContainer.vue'
import moment from 'moment'
import { getUserMessages } from '../../services/messagesService'
import colors from '../../scss/_colors.scss'

export default {
  components: { PanelContainer },
  props: {
    selectedClient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedMessage: null,
      isLoadingMessages: true,
      clientMessages: [],
      loadingColor: colors.hwayzLightGreen
    }
  },
  watch: {
    selectedClient() {
      this.fetchMessagesWithClient()
    }
  },
  async created() {
    this.fetchMessagesWithClient()
  },
  methods: {
    messageSelected(message) {
      this.selectedMessage = message
    },

    displayDate(date) {
      return moment(date).format('DD/MM')
    },

    displayMessageOrigin(origin) {
      return origin === 'web' ? 'text' : origin
    },

    async fetchMessagesWithClient() {
      this.isLoadingMessages = true
      this.clientMessages = (await getUserMessages(this.selectedClient._id)).data.reverse()
      this.isLoadingMessages = false
    }
  }
}
</script>

<style scoped>
#plannerCommunication {
  height: fit-content;
}

.planner-comm__wrap {
  background-color: #fff;
}

.planner-comm__content {
  padding: 2rem;
  text-align: left;
  border-radius: 1rem;
}

.planner-comm__name {
  display: flex;
  align-items: center;
}

.planner-comm__name span {
  font-weight: 500;
  padding-left: 1rem;
}

.planner-comm__message {
  background-color: #fbfbfb;
  box-shadow: 0px 3px 6px #00000020;
  border-radius: 0.6rem;
  font-size: 1.4rem;
  padding: 2rem;
  overflow-y: scroll;
}

.planner-comm__message .row {
  cursor: pointer;
  margin-bottom: 2rem;
}

.planner-comm__message .row div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 0;
}

.planner-comm__message .bold {
  font-weight: 700;
}

.planner-comm__message-subject {
  font-size: 1.4rem;
  padding-left: 3rem;
  margin-bottom: 2rem;
}

.planner-comm__message-detail {
  padding: 2rem;
  background-color: #fbfbfb;
  border-radius: 0.5rem;
  border: 1px solid #bebebe;
  font-size: 1.4rem;
  margin-bottom: 4rem;
}

.planner-comm__reply {
  border-radius: 1rem;
  height: 3.5rem;
  padding-left: 4rem;
  padding-right: 4rem;
  margin-bottom: 3rem;
  color: #fff;
}

.sort-by-button{
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  cursor: pointer;
}

/* Scrollbar style */
.planner-comm__message::-webkit-scrollbar-track{
  background-color: #fbfbfb;
  border-left: solid 2px white; /* make the track seem narrower than the thumb */
  border-top: solid 5px #fbfbfb;
}
.planner-comm__message::-webkit-scrollbar{
  width: 14px;
  background-color: #fbfbfb;
}
.planner-comm__message::-webkit-scrollbar-thumb{
  background-color: #fbfbfb;
  border-left: solid 3px #00000060;
}

@media only screen and (min-width: 600px) {
  .planner-comm__content {
    padding: 3rem;
  }
}
</style>
