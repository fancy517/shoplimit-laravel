<template>
  <v-card id="dateChangerModal" class="modal__card">
    <v-icon
      class="modal__button-close"
      @click.stop="$emit('on-close-modal', {'status': false, 'value': picker})"
    >
      close
    </v-icon>
    <div class="modal__title">
      Choose New Date
    </div>
    <v-date-picker
      v-model="picker"
      :landscape="landscape"
      :reactive="reactive"
      color="pink lighten-1"
    />
    <v-btn
      class="modal__button"
      color="pink lighten-1"
      @click="$emit('on-close-modal', {'status': false, 'value': picker})"
    >
      Send Route Schedule
    </v-btn>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      picker: new Date().toISOString().substr(0, 10),
      landscape: false,
      reactive: false
    }
  }
}
</script>

<style lang="sass" scoped>
.modal__card
  background: $hwayzfb !important
  padding: 3rem
  border-radius: 2rem

.modal__button-close
  @extend %modal__button-close, %disable-selection

.modal__title
  margin: 4rem
  font-size: $hwayzFont1rem5

.modal__button
  margin: 3rem !important
  width: 60%
  min-width: 15rem !important
  height: 6rem
  border-radius: 2rem

@media only screen and (min-width: 600px)
  .modal__button
    width: 60%

</style>
