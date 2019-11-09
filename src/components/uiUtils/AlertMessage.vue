<template>
  <v-alert
    :value="value"
    :type="alertType"
    class="alert-bar"
    :class="alertPosition"
    transition="scale-transition"
  >
    <div class="alert-bar--content">
      {{ message }}
      <v-btn small fab dark flat @click="closeAlert()">
        <v-icon>close</v-icon>
      </v-btn>
    </div>
  </v-alert>
</template>

<script>
export default {
  props: {
    alertValue: {
      type: Boolean,
      default: false
    },
    alertMessage: {
      type: String,
      required: true
    },
    alertType: {
      type: String,
      default: 'success'
    },
    alertPosition: {
      type: String,
      default: 'top-position'
    }
  },

  data() {
    return {
      value: this.alertValue,
      message: this.alertMessage
    }
  },

  watch: {
    alertValue(newValue, oldValue) {
      this.value = newValue
      if (newValue) {
        setTimeout(() => {
          this.value = false
        }, 3000)
      }
    },

    alertMessage(newValue, oldValue) {
      this.message = newValue
    }
  },

  methods: {
    closeAlert() {
      this.value = false
      this.message = null
    }
  }
}
</script>

<style lang="sass" scoped>
.alert-bar
  height: 5rem
  position: absolute
  left: 50%
  width: 100%
  transform: translateX(-50%)
  font-size: 1.2rem
  z-index: 9999
  &--content
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between

.top-position
  top: 0
.bottom-position
  bottom: 0
</style>
