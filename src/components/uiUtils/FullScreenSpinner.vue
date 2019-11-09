<template>
  <div class="full-spinner">
    <v-progress-circular
      indeterminate
      color="#51b3c6"
      width="4"
      size="100"
    />
    <div class="full-spinner_text">
      {{ spinnerText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    spinnerText: {
      type: String,
      default: 'Please wait...'
    }
  }

}
</script>

<style lang="sass" scoped>
.full-spinner
  @extend %disable-selection
  background: rgba(#fff, 0.9)
  z-index: 9999
  display: flex
  flex-flow: column
  justify-content: center
  align-items: center
  position: absolute
  top: 100px
  right: 0
  left: 0
  bottom: 0

  &_text
    font-size: 2rem
    margin-top: 2rem
    color: #51b3c6
</style>
