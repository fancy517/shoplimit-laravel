<template>
  <v-app id="main-container">
    <router-view />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
/**
 * The main application container which loads components based on the route passed
 * @version 1.0.0
 */
export default {
  computed: {
    ...mapState('common', ['isMobile'])
  },

  created() {
    this.setWindowSpecs()
    window.addEventListener('resize', this.setWindowSpecs, { passive: true })
  },

  mounted() {
    // Check whether a session is already active
    if (localStorage.getItem('x-authentication')) {
      const profileStatus = localStorage.getItem('profileStatus')
      const { currentRoute } = this.$router
      console.log(profileStatus, currentRoute)
      if (profileStatus === 'agent') {
        if (this.isMobile) {
          this.$router.push({
            name:
              currentRoute.name === 'login' ? 'agent-search' : currentRoute.name
          })
        } else {
          this.$router.push({
            name:
              currentRoute.name === 'login'
                ? 'Task-Manager / Task-View'
                : currentRoute.name
          })
        }
      } else {
        if (this.isMobile) {
          this.$router.push({
            name:
              currentRoute.name === 'login'
                ? 'client-schedule'
                : currentRoute.name
          })
        } else {
          this.$router.push({
            name:
              currentRoute.name === 'login'
                ? 'client-dashboard'
                : currentRoute.name
          })
        }
      }
    }
  },

  methods: {
    /**
     * Saves the window width to Vuex store via mutation at each DOM update
     * @public
     */
    setWindowSpecs() {
      window.addEventListener('resize', () => {
        /**
         * @event SET_WINDOW_WIDTH
         * @type {number}
         */
        this.$store.commit('home/SET_WINDOW_WIDTH', window.innerWidth)
        /* Let us know whether this is a mobile screen. */

        var isMobile = window.innerWidth < 600
        this.$store.commit('common/SET_IS_MOBILE', isMobile)
      })
    }
  }
}
</script>

<style lang="sass">
html
  font-size: 56.25% !important

.application
  background-color: $hwayzBackgroundColor !important

table tr th
  font-size: 1.4rem !important
  color: #333 !important

#main-container
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  font-size: 1.5rem

a,
a:hover,
a:focus,
a:active
  text-decoration: none !important
  color: inherit !important

label
  margin: 0 !important

h2
  margin-bottom: 2rem
  font-weight: 300

ul,
li
  list-style: none !important
  padding: 0rem !important
  margin: 0rem !important

.button-rounded
  padding: 0.5rem 2rem !important
  margin-left: 1.5rem !important
  font-size: 0.8em !important

.padding-3
  padding: 3rem !important

.v-btn
  font-weight: 300 !important
  outline: none !important

.v-picker .v-btn
  color: #373737 !important

.v-dialog
  border-radius: map-get($modal, border-radius) !important

#mobileFieldSelectedDate
  .v-expansion-panel__header
    padding: 0.5rem 6rem !important;
    i
      font-size: 3rem
      vertical-align: middle
    input
      font-size: 2rem
      text-align: center
#mobileDatePicker
  .v-date-picker-table
    height: auto
  .v-date-picker-header, .v-date-picker-table .v-btn, table tr th
    font-size: 2rem !important
  table tr td
    padding: 0.5rem
  .v-date-picker-header, table tr th
    padding: 1rem

.sidebar-link .v-list__tile
  height: 4.2rem !important
  line-height: 4.2rem
  font-weight: 400 !important
  background: none !important
  padding-left: 2rem
  @media only screen and (max-width: 600px)
    margin: 1rem 0;
    height: 5rem !important;

.sidebar-mini-link .v-list__tile
  height: 4.2rem !important
  line-height: 4.2rem
  font-weight: 400 !important
  background: none !important
  width: 80px

.v-list__group__header .v-list__tile
  background: none !important

.sidebar-submenu__link .v-list__tile
  font-size: 1.2rem !important
  height: 4rem !important
  min-width: 10rem !important

.sidebar-children-link .v-list__tile
  font-size: 1.3rem !important
  padding-right: 2rem
  height: 4rem !important
  line-height: 4rem

.sidebar-subchild-link .v-list__tile
  font-size: 1.2rem !important
  height: 3.6rem !important
  line-height: 3.6rem
  border-top: 0.1rem solid $hwayzLinkWater

#sidebar .v-list__tile__title
  font-size: 1.3rem
  color: #373737 !important
  @media only screen and (max-width: 600px)
    font-size: 2rem;

.sidebar-children-link .v-list__tile__title
  text-align: right
  padding-right: 6rem

.sidebar-subchild-link .v-list__tile__title
  text-align: right
  padding-right: 3rem

.v-carousel__next,
.v-carousel__prev
  background: #101010

#sidebar .v-list__tile:hover
  background: $hwayzLinkWater !important

#sidebar .v-list__group__header:hover
  background: $hwayzLinkWater !important

#searchPropertyInput .v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot
  border-left: #d9d9d9 1px solid !important
  border-radius: 0px !important
  font-size: 14px
  min-height: 42px !important

#inviteBuyerForm .v-text-field >.v-input__control>.v-input__slot>.v-text-field__slot
  @extend %modal__v-text-field__slot

#referFriendForm .v-text-field >.v-input__control>.v-input__slot>.v-text-field__slot
  @extend %modal__v-text-field__slot

// #inviteBuyerForm .v-text-field >.v-input__control>.v-input__slot>.v-text-field__slot
//   @extend %modal__v-text-field__slot

/* Responsive designs */
@media only screen and (min-width: 600px)
  html
    font-size: 59.375% !important

@media only screen and (min-width: 960px)
  html
    font-size: 62.5% !important

.smallIcon
  font-size: map-get($icon, font-small) !important
  color: $hwayzBlack !important

.mediumIcon
  font-size: map-get($icon, font-medium) !important
  color: $hwayzBlack !important

.largeIcon
  font-size: map-get($icon, font-large) !important
  color: $hwayzBlack !important

.mediumBlownIcon
  font-size: map-get($icon, font-medium-blown) !important
  color: $hwayzBlack !important

.blownIcon
  font-size: map-get($icon, font-blown) !important
  color: $hwayzBlack !important

.roundedIconLight
  border: 1px solid $color-grey
  padding: 10%
  border-radius: 50%
  margin-bottom: 3rem
@media only screen and (max-width: 1280px)
  .roundedIconLight
    -webkit-transform: scale(0.8)
    -moz-transform: scale(0.8)
    -ms-transform: scale(0.8)
    transform: scale(0.8)
    margin-bottom: 0px

.roundedIconDark
  border: 1px solid $hwayzBlack
  padding: 10%
  border-radius: 50%
  margin-bottom: 3rem

.isNumber
  font-family: map-get($number, family)
  font-size: map-get($number, size)
  color: $hwayzBlack

/* CSS code for vue-svgicon */
.svg-icon
    display: inline-block
    width: 16px
    height: 16px
    color: inherit
    vertical-align: middle
    fill: none
    stroke: currentColor

.svg-fill
    fill: currentColor
    stroke: none

.svg-up
    transform: rotate(0deg)

.svg-right
    transform: rotate(90deg)

.svg-down
    transform: rotate(180deg)

.svg-left
    transform: rotate(-90deg)

.hwyzPink-background
  background-color: $hwayzNavigationTab

.secondary-background
  background-color: $secondary
</style>
