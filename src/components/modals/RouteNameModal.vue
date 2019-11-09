<template>
  <div class="route-name__card">
    <div class="route-name__title">
      homewayz
    </div>
    <v-icon class="route-name__icon" color="pink darken-2" size="100px">
      map
    </v-icon>
    <div class="route-name__input">
      <input
        type="text"
        :value="routeName | uppercase"
        placeholder="Enter name for route"
        @input="routeName = $event.target.value"
        @keyup.enter="submitName"
      >
    </div>
    <div class="route-name__tag">
      Name your route something unique to help you plan.
    </div>
    <v-btn round class="route-name__button" color="pink lighten-1" @click="submitName">
      Name Route
    </v-btn>
  </div>
</template>

<script>
export default {
  filters: {
    uppercase: function(value) {
      if (!value) return ''
      return value.toUpperCase()
    }
  },

  props: {
    initialName: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      routeName: this.initialName || ''
    }
  },

  watch: {
    initialName(newValue, oldValue) {
      if (newValue !== oldValue) this.routeName = newValue
    }
  },

  methods: {
    submitName() {
      this.$emit('route-name-entered', this.routeName.toUpperCase())
    }
  }
}
</script>

<style lang="sass" scoped>
.route-name__card
  background: $hwayzfb
  border-radius: .8rem
  box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2)
  padding: 3rem

@media only screen and (min-width: 600px)
  .route-name__card
    padding: 3rem 8rem

.route-name__title
  font-family: "Montserrat", sans-serif
  text-transform: uppercase
  font-weight: 300
  margin-bottom: 6rem
  color: $hwayz9
  letter-spacing: 1px
  font-size: $hwayzFont1rem4

.route-name__icon
  border: 1px solid $hwayzec
  padding: 4rem
  border-radius: 50%
  margin-bottom: 3rem

.route-name__input input
  height: 4rem
  font-size: 2rem
  text-align: center
  width: 100%
  border-bottom: 1px solid $hwayz9
  outline: none

.route-name__tag
  font-size: 1.4rem
  color: $hwayz9
  margin-bottom: 8rem
  margin-top: 3rem

.route-name__button
  height: 6rem
  margin-bottom: 3rem !important
  width: 60%
  min-width: 15rem !important
  color: $hwayzWhite !important
  font-weight: 400 !important
</style>
