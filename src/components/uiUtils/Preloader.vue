<template>
  <div class="progress-spinner">
    <template v-if="timer">
      <v-progress-circular indeterminate color="grey darken-1" />
      <div class="py-3">
        {{ loadingMessage }}
      </div>
    </template>
    <template v-else>
      <div class="error-message">
        {{ errorMessage }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    loadingMessage: {
      type: String,
      default: 'Loading...'
    },
    errorMessage: {
      type: String,
      default: "Couldn't load"
    }
  },

  data() {
    return {
      timer: true
    }
  },

  mounted() {
    setTimeout(() => {
      this.timer = false
    }, 10000)
  }
}
</script>

<style lang="sass" scoped>
.progress-spinner
  padding-top: 8rem
  text-align: center

.error-message
  text-align: center
  width: 80%
  margin: 2rem auto
</style>
