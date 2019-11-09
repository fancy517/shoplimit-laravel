<template>
  <v-card class="modal__card">
    <div class="modal__title">
      homewayz
    </div>
    <v-icon
      class="modal__icon"
      color="pink darken-2"
      :size="$vuetify.breakpoint.xsOnly ? '60px' : '80px'"
    >
      home
    </v-icon>
    <div class="modal__tag">
      No Homes Selected
    </div>
    <div class="modal__tag">
      Please Select Home
    </div>
    <v-btn
      round
      class="modal__button"
      color="pink lighten-1"
      @click="onCloseModal()"
    >
      Okay
    </v-btn>
  </v-card>
</template>

<script>
export default {
  props: {
    onCloseModal: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    clientName: '',
    showError: false
  }),
  methods: {
    submitName() {
      if (this.clientName === '') {
        this.showError = true
      } else {
        this.showError = false
        this.$emit('onSearchClient', this.clientName)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.modal__card
  background: $hwayzF8 !important
  padding: 3rem
  position: relative

@media only screen and (min-width: 600px)
  .modal__card
    padding: 5rem 8rem

.modal__title
  font-family: "Montserrat", sans-serif
  text-transform: uppercase
  font-weight: 300
  margin-bottom: 8rem
  color: $hwayz9
  letter-spacing: 1px
  font-size: $hwayzFont0rem8

.modal__icon
  border: 1px solid $hwayzce
  padding: 3rem
  border-radius: 50%
  margin-bottom: 3rem

.modal__tag
  color: $hwayz9
  margin-top: 3rem

.modal__button
  margin-bottom: 3rem !important
  width: 60%
  min-width: 15rem !important

@media only screen and (min-width: 600px)
  .modal__button
    width: 60%

</style>
