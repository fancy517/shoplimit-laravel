<template>
  <v-dialog v-model="showModal" :width="alert.width" :max-width="alert.small_maxWidth" persistent>
    <v-card id="modalContainerCard">
      <v-icon id="modalClose" @click="$emit('close-modal')">
        close
      </v-icon>
      <div class="content-with-button__title">
        {{ modalParams.title }}
      </div>
      <hr>
      <v-btn
        id="modalButton"
        :color="btnColor"
        @click="$emit('close-modal', modalParams.type)"
      >
        {{ modalParams.btnText }}
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    modalParams: {
      type: Object,
      required: true
    },
    btnColor: {
      type: String,
      default: 'green'
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('style', ['alert'])
  }
}
</script>

<style lang="sass" scoped>
#modalContainerCard
  padding: 4rem 2rem 2rem

#modalClose
  @extend %modal__button-close

#modalButton
  @extend %modal__button

.content-with-button__title
  margin: 2rem auto
</style>
