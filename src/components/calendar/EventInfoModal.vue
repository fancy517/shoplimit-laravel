<template>
  <div class="information-modal__card">
    <div class="information-modal__title">
      homewayz
    </div>
    <v-icon class="information-modal__icon" color="red darken-2" size="40px">
      info
    </v-icon>
    <div
      v-if="selectedDate"
      class="information-modal__message"
    >
      {{ selectedDate.date }} date selected
    </div>
    <div class="d-flex">
      <v-btn
        class="information-modal__button"
        color="green darken-1"
        @click.stop.native="$emit('on-ok-clicked')"
      >
        Ok
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedDate: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    }
  }
}
</script>

<style scoped lang='sass'>
.information-modal__card
  background: $hwayzBackgroundColor
  border-radius: 1rem
  box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2)
  padding: 4rem

.information-modal__title
  font-family: "Montserrat", sans-serif
  text-transform: uppercase
  font-weight: 300
  margin-bottom: 4rem
  color: $hwayzShadow
  letter-spacing: 1px
  font-size: $hwayzFont1rem4

.information-modal__icon
  border: 0.1rem solid $hwayzShadow
  padding: 2rem
  border-radius: 50%
  margin-bottom: 3rem

.information-modal__message
  font-size: $hwayzFont1rem6
  margin-bottom: 4rem
  margin-top: 2rem

.information-modal__card .v-btn
  border-radius: 2rem

.information-modal__card .v-btn__content
  text-transform: none
  padding: 0
</style>
