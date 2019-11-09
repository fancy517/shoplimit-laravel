<template>
  <div class="choose-client__card">
    <div class="choose-client__title">
      homewayz
    </div>
    <v-icon class="roundedIconLight" :class="windowWidth <= 1280 ? 'mediumBlownIcon' : 'blownIcon'" color="pink darken-2">
      how_to_reg
    </v-icon>
    <auto-suggestion-input />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AutoSuggestionInput from '../uiUtils/AutoSuggestionInput.vue'

export default {
  components: { AutoSuggestionInput },

  computed: {
    ...mapState('home', ['windowWidth'])
  },

  methods: {
    /**
     * Function that emits the search client name to the
     * Client detail container
     *
     * @public
     */
    onSubmitName(clientName) {
      /**
       * Returns the entered non null value to the parent component AgentClientDetailPage
       *
       * @event on-search-client
       * @type {string}
       */
      // console.log(clientName)
      this.$emit('on-search-client', clientName)
    }
  }
}
</script>

<style lang="sass" scoped>
.choose-client__card
  margin: 0 auto
  max-width: 48rem
  border-radius: 1.5rem
  box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2)
  background-color: $hwayzWhite
  padding: 3rem

.choose-client__title
  font-family: "Montserrat", sans-serif
  text-transform: uppercase
  font-weight: 300
  margin-bottom: 2.5rem
  color: $hwayzMediumGray
  letter-spacing: 1px
  font-size: $hwayzFont0rem8

.choose-client__error-message
  font-size: 0.7em
  color: darkred

@media only screen and (min-width: 600px)
  .choose-client__card
    padding: 2rem 6rem

@media only screen and (min-width: 1280px)
  .choose-client__card
    width: 40% !important
    padding: 2rem 3rem

  .choose-client__title
    margin-bottom: 1rem

</style>
