<template>
  <div class="border-top reply-message">
    <v-container p-0>
      <v-layout row wrap>
        <v-flex sm10>
          <v-textarea
            v-model="replyMessage"
            height="62"
            :color="colors.hwayzTeal"
            :hide-details="true"
            class="reply-message__text"
            outline
            label="Enter the message"
            name="clientReplyMessage"
          />
        </v-flex>
        <v-flex sm2>
          <v-btn class="reply-message__button" @click="sendMessage">
            REPLY
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import colors from '../../scss/_colors.scss'

export default {
  data() {
    return {
      colors: colors,
      replyMessage: null
    }
  },
  methods: {
    sendMessage() {
      if (this.replyMessage.length) {
        this.$emit('on-submit', this.replyMessage)
        this.replyMessage = ''
      }
    }
  }
}
</script>

<style lang="sass">
  .reply-message
    padding: 16px 20px 0 34px
    &__button
      background-color: $hwayzMediumGray !important
      border-radius: 1rem
      height: 3.5rem
      margin-right: 0
      padding-left: 2rem
      padding-right: 2rem
      margin-bottom: 3rem
      color: #fff !important
</style>
