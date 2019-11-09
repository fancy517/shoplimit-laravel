<template>
  <v-container>
    <v-flex
      v-for="(message, i) in messages"
      :key="i"
      class="row planner-comm__message"
      :class="getClass(message)"
    >
      <v-layout
        wrap
      >
        <v-flex
          xs8
          offset-xs2
          class="message__subject"
        >
          subject: {{ message.subject }}
        </v-flex>
        <v-flex
          xs2
          class="text-right"
        >
          {{ displayDate(message._timestamp) }}
        </v-flex>
        <v-flex>
          <div class="planner-comm__name">
            <v-avatar size="40px" style="margin-right: 15px" :color="colors[message.from.name[0]]">
              <span class="white--text">{{ message.from.name | initials }}</span>
            </v-avatar>
            <span class="message__sender-name">{{ message.from.name }}</span>
          </div>
        </v-flex>
        <v-flex
          xs12
          class="text-xs-left message__body"
        >
          <div>
            {{ message.message }}
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <div id="scroll-to" />
  </v-container>
</template>

<script>
import moment from 'moment'
import avatarColors from '../../utils/avatarColors'

export default {
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
    messages: {
      type: Array,
      default: () => []
    },
    sender: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      senderClasses: 'offset-xs2 message message__sender',
      receiverClasses: 'xs10 message message_receiver',
      colors: avatarColors
    }
  },
  mounted() {
    const options = {
      container: '.user-dialog_wrapper',
      force: true,
      y: true
    }
    const el = document.getElementById('scroll-to')
    this.$scrollTo(el, 1, options)
  },
  methods: {
    getClass(message) {
      return message.from._id === this.sender ? this.senderClasses : this.receiverClasses
    },
    displayDate(date) {
      return moment(date).format('DD/MM')
    },

    displayMessageOrigin(origin) {
      return origin === 'web' ? 'text' : origin
    }
  }
}
</script>

<style lang="scss">
  .message {
    margin-bottom: 10px;
    &__subject {
      margin-bottom: 10px;
      color: $hwayzTeal;
    }
    &__body {
      padding-left: 70px;
    }
    &__sender-name {
      color: $hwayzNested;
    }
  }

  .planner-comm__message.message__sender {
    background-color: #E1E1E1;
  }

  .planner-comm__message {
  background-color: $hwayzfb;
  border: 2px solid #E1E1E1;
  border-radius: 0.6rem;
  font-size: 1.4rem;
  padding: 2rem;
}

.planner-comm__message .row {
  cursor: pointer;
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
  background-color: $hwayzfb;
  border-radius: 0.5rem;
  border: 2px solid #bebebe;
  font-size: 1.4rem;
  margin-bottom: 4rem;
}

.button-sort-by{
  position: absolute;
  top: -1.2rem;
  right: 1rem;
  font-size: 1.2rem;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
}

.v-menu__content{
  box-shadow: none;
  border: 1px solid lightgray;
}

/* Scrollbar style */
.planner-comm__message::-webkit-scrollbar-track{
  background-color: $hwayzfb;
  border-left: solid 2px white; /* make the track seem narrower than the thumb */
  border-top: solid 5px $hwayzfb;
}
.planner-comm__message::-webkit-scrollbar{
  width: 14px;
  background-color: $hwayzfb;
}
.planner-comm__message::-webkit-scrollbar-thumb{
  background-color: $hwayzfb;
  border-left: solid 3px #00000060;
}

@media only screen and (min-width: 600px) {
  .planner-comm__content {
    padding: 3rem;
  }
}
</style>
