<template>
  <div id="titleWithMessage">
    <div class="twm-title">
      {{ title }}
    </div>
    <div class="twm-message">
      {{ message }}
    </div>
    <v-btn v-if="btnOption" id="btnOption" color="#64bbc0" @click.stop="$emit('button-clicked')">
      {{ btnOption }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    btnOption: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="sass" scoped>
#titleWithMessage
  display: flex
  flex-flow: column
  align-items: center
  justify-content: center
  min-height: 60vh

  .twm-title
    font-size: 3rem
    margin-bottom: 2rem

  .twm-message
    font-size: 2rem
    margin-bottom: 2rem

  #btnOption
    width: 80%
    max-width: 20rem

</style>
