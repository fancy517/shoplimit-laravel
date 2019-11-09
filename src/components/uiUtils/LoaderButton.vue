<template>
  <v-btn
    :disabled="disabled"
    :loading="loading"
    :color="btnSettings.color"
    :outline="btnSettings.outline"
    :round="btnSettings.round"
    :class="btnClass"
    @click="$emit('handle-button-click')"
  >
    {{ btnText }}
    <template v-slot:loader>
      <span class="spinner-loader">
        <v-icon light>cached</v-icon>
      </span>
    </template>
  </v-btn>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      required: true
    },
    btnClass: {
      type: String,
      required: true
    },
    btnSettings: {
      type: Object,
      default: () => ({
        outline: false,
        color: '#00d3d5',
        round: false
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/scss/_animations.scss"

.auth-button
  width: 100%
  margin-top: 3rem
  color: $hwyzHeaderClient !important

.feedback-modal-button
  width: 20rem
  margin: 2rem 3rem 0
  float: right

.spinner-loader
  animation: loader 1s infinite
  display: flex
</style>
