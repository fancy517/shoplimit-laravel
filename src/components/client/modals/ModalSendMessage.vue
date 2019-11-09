<template>
  <v-dialog v-model="showModal" :width="modal.width" :max-width="modal.maxWidth" persistent>
    <v-card v-if="selectedProperty" id="modalContainerCard">
      <v-icon class="modal-send-message__close" @click.stop="$emit('close-modal')">
        close
      </v-icon>
      <div class="modal-send-message__title">
        Send a message about home:
        <br>
        {{ getPropertyAddress() }}
      </div>
      <div class="modal-send-message__content">
        <div class="modal-send-message__person">
          <table class="modal-send-message__top">
            <tbody v-if="associatedAgent">
              <tr>
                <td>Agent:</td>
                <td>{{ associatedAgent.name }}</td>
              </tr>
              <tr>
                <td>Subject:</td>
                <td>Regarding {{ getPropertyAddress() }}</td>
              </tr>
            </tbody>
          </table>
          <div class="modal-send-message__message">
            <v-textarea
              v-model="replyMessage"
              outline
              label="Write your message"
              name="clientMessage"
              auto-grow
            />
          </div>
        </div>
        <div class="text-right">
          <v-btn
            class="modal-send-message__reply"
            :color="$btnHwayzBlue"
            :disabled="!replyMessage"
            @click="submit"
          >
            SEND
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { propertyFullAddress } from '../../../utils/propertyUtils'
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    selectedProperty: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      selectedMessage: null,
      replyMessage: null
    }
  },

  computed: {
    ...mapState('client', ['associatedAgent']),
    ...mapState('style', ['modal']),
    subject() {
      return `A message regarding ${this.selectedProperty['Address']}`
    }
  },

  methods: {
    getPropertyAddress() {
      return propertyFullAddress(this.selectedProperty)
    },
    submit() {
      this.$emit('submit-modal', {
        to: [this.associatedAgent._id],
        propertyId: this.selectedProperty._id,
        message: this.replyMessage,
        subject: this.subject
      })
    }
  }
}
</script>

<style lang="sass" scoped>
#modalContainerCard
  padding: 4rem 2rem 2rem

.modal-send-message__close
  @extend %modal__button-close, %disable-selection

.modal-send-message__title
  font-size: $hwayzFont1rem8
  text-transform: capitalize

.modal-send-message__content
  padding: 2rem
  text-align: left
  border-radius: 1rem
  border-color: gray

.modal-send-message__person
  margin-bottom: 1rem

.modal-send-message__top
  margin-left: 1rem

.modal-send-message__top tr
  height: 3rem

.modal-send-message__top td:first-child
  padding-right: 1rem

.modal-send-message__message
  margin-top: 2rem

.modal-send-message__message-subject
  font-size: 1.4rem
  padding-left: 1rem
  margin-bottom: 1rem

.modal-send-message__message-detail
  padding: 2rem
  background-color: $hwayzfb
  border-radius: 0.5rem
  border: 2px solid $hwayzShadow
  font-size: 1.4rem
  margin-bottom: 4rem

#messageBox
  margin-top: 1rem

.modal-send-message__reply
  border-radius: 1rem
  height: 3.5rem
  padding-left: 4rem
  padding-right: 4rem
  margin-bottom: 3rem
  color: $hwayzWhite

.button-sort-by
  position: absolute
  top: -1.2rem
  right: 1rem
  font-size: $hwayzFont1rem2
  padding: 0.2rem 0.6rem
  cursor: pointer

.v-menu__content
  box-shadow: none
  border: 1px solid lightgray

/* Scrollbar style */
.modal-send-message__message::-webkit-scrollbar-track
  background-color: $hwayzfb
  border-left: solid 2px white /* make the track seem narrower than the thumb */
  border-top: solid 5px $hwayzfb

.modal-send-message__message::-webkit-scrollbar
  width: 14px
  background-color: $hwayzfb

.modal-send-message__message::-webkit-scrollbar-thumb
  background-color: $hwayzfb
  border-left: solid 3px #00000060

@media only screen and (min-width: 600px)
  .modal-send-message__content
    padding: 3rem
</style>
