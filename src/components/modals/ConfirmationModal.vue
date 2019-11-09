<template>
  <div class="confirmation-modal__card">
    <div class="confirmation-modal__title">
      homewayz
    </div>
    <v-icon class="confirmation-modal__icon" color="red darken-2" size="40px">
      {{ modalIcon }}
    </v-icon>
    <div class="confirmation-modal__message">
      {{ modalOptions.message }}
    </div>
    <div class="d-flex">
      <v-btn
        class="confirmation-modal__button"
        color="green darken-1"
        dark
        @click.stop.native="$emit('on-negative-clicked')"
      >
        {{ modalOptions.negative }}
      </v-btn>
      <v-btn
        class="confirmation-modal__button"
        color="red darken-1"
        dark
        @click.stop.native="$emit('on-positive-clicked')"
      >
        {{ modalOptions.positive }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalOptions: {
      type: Object,
      default: () => {
        return {
          status: true,
          message: 'Are you sure you want to delete this?',
          positive: 'Yes',
          negative: 'No'
        }
      }
    },
    modalIcon: {
      type: String,
      default: 'delete'
    }
  }
}
</script>

<style lang="sass" scoped>
.confirmation-modal
  &__card
    background: $hwayzF8
    border-radius: 1rem
    box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2)
    padding: 4rem
    position: relative
    .v-btn
      border-radius: 2rem
    .v-btn__content
      text-transform: none
      padding: 0

  &__title
    font-family: "Montserrat", sans-serif
    text-transform: uppercase
    font-weight: 300
    margin-bottom: 4rem
    color: $hwayz9
    letter-spacing: 1px
    font-size: 1.4rem

  &__icon
    border: .1rem solid $hwayzec
    padding: 2rem
    border-radius: 50%
    margin-bottom: 3rem

  &__message
    font-size: $hwayzFont1rem6
    margin-bottom: 4rem
    margin-top: 2rem
</style>
