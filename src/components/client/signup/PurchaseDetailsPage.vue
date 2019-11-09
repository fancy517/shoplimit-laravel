<template>
  <div id="containerPurchaseDetailsPage">
    <div id="containerDatePickers">
      <label class="my-label text-xs-center">What timeframe do you have to find a home in?</label>
      <div>
        <v-container class="no-padding">
          <v-layout align-center justify-center>
            <!-- FROM Date -->
            <v-flex shrink>
              <label>from</label>
            </v-flex>
            <v-flex xs4 class="no-padding">
              <v-menu
                v-model="menuFrom"
                class="menu-date-picker"
                :close-on-content-click="false"
                lazy
                transition="scale-transition"
                offset-y
                nudge-bottom="5px"
                max-width="250px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="dateFromFormatted" color="purple" readonly v-on="on" />
                </template>
                <v-date-picker
                  v-model="dateFrom"
                  color="purple"
                  no-title
                  full-width
                  scrollable
                  show-current="false"
                  :max="dateTo"
                />
              </v-menu>
            </v-flex>
            <v-flex shrink>
              <v-icon color="#3fc1d2">
                calendar_today
              </v-icon>
            </v-flex>
            <v-spacer />
            <!-- TO Date -->
            <v-flex shrink>
              <label>to</label>
            </v-flex>
            <v-flex xs4 class="no-padding">
              <v-menu
                v-model="menuTo"
                class="menu-date-picker"
                :close-on-content-click="false"
                lazy
                transition="scale-transition"
                offset-y
                nudge-bottom="5px"
                max-width="250px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="dateToFormatted" color="purple" readonly v-on="on" />
                </template>
                <v-date-picker
                  v-model="dateTo"
                  color="purple"
                  no-title
                  full-width
                  scrollable
                  show-current="false"
                  :min="dateFrom"
                />
              </v-menu>
            </v-flex>
            <v-flex shrink>
              <v-icon color="#3fc1d2">
                calendar_today
              </v-icon>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>
    <div class="containerBuyOrRent">
      <label class="my-label text-xs-center">Are you looking to buy or rent a home?</label>
      <v-container>
        <v-layout justify-center>
          <v-flex shrink class="text-xs-right container-checkbox">
            <label class="container-form-checkbox">
              Buy
              <input v-model="buy" type="checkbox">
              <span class="form-checkmark" />
            </label>
          </v-flex>
          <v-flex shrink class="container-checkbox">
            <label class="container-form-checkbox">
              Rent
              <input v-model="rent" type="checkbox">
              <span class="form-checkmark" />
            </label>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuFrom: false,
      menuTo: false,
      dateFrom: undefined,
      dateTo: undefined,
      buy: true,
      rent: false,
      weekdays: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
      homeNeeds: [
        { value: 0, text: '4 bedroom' },
        { value: 1, text: '3 bath' },
        { value: 2, text: '2500sf' },
        { value: 3, text: 'large yard' },
        { value: 4, text: 'open plan' },
        { value: 5, text: 'updated kitchen' },
        { value: 6, text: 'good school' },
        { value: 7, text: 'singe story' },
        { value: 8, text: 'curb appeal' },
        { value: 9, text: 'fixer' },
        { value: 10, text: '3 car garage' },
        { value: 11, text: 'golf course' },
        { value: 12, text: 'views' },
        { value: 13, text: 'modern' },
        { value: 14, text: 'floor to ceiling windows' },
        { value: 15, text: 'culdesac' },
        { value: 16, text: 'solar' },
        { value: 17, text: 'bay windows' }
      ],
      selectedHomeNeeds: []
    }
  },
  computed: {
    dateFromFormatted() {
      return this.formatDate(this.dateFrom)
    },
    dateToFormatted() {
      return this.formatDate(this.dateTo)
    }
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return null
      }
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) {
        return null
      }
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    weekdayFn() {
      return this.weekdays[++this.counter % 7]
    }
  }
}
</script>

<style scoped lang='sass'>
*:focus
  outline: none

#containerPurchaseDetailsPage
  height: 100%
  width: 100%
  margin: 0 auto

#containerDatePickers
  text-align: left
  margin: 0% 14%
  font-size: $hwayzFont0em8
  padding-bottom: 15%

.my-label
  display: block
  font-size: $hwayzFont1em2
  margin-bottom: 10px !important

.v-menu__content
  border-radius: 10px !important
  box-shadow: 0px 0px 2px 0px gray

.v-picker >>> .v-btn--active
  color: white !important

.v-picker >>> th
  font-weight: 300
  border-bottom: 1px solid lightgray

.v-text-field >>> input[type=text]
  padding: 0 !important
  text-align: center

.no-padding
  padding: 0 !important

/* Custom checkbox style */
/* Customize the label (the container) */
.container-checkbox
  width: fit-content
  /* padding: 20px; */

.container-form-checkbox
  display: block
  position: relative
  padding-left: 25px
  cursor: pointer
  font-size: $hwayzFont1em2
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

/* Hide the browser's default checkbox */
.container-form-checkbox input
  position: absolute
  opacity: 0
  cursor: pointer
  height: 0
  width: 0

/* Create a custom checkbox */
.form-checkmark
  position: absolute
  top: 0
  left: 0
  height: 18px
  width: 18px
  -moz-box-shadow:    inset 0 2px 4px 0px lightgray
  -webkit-box-shadow: inset 0 2px 4px 0px lightgray
  box-shadow:         inset 0 2px 4px 0px lightgray

/* Create the form-checkmark/indicator (hidden when not checked) */
.form-checkmark:after
  content: ""
  position: absolute
  display: none

/* Show the form-checkmark when checked */
.container-form-checkbox input:checked ~ .form-checkmark:after
  display: block

/* Style the form-checkmark/indicator */
.container-form-checkbox .form-checkmark:after
  left: 6px
  top: 2px
  width: 5px
  height: 12px
  border: solid $hwayzTeal
  border-width: 0 2px 2px 0
  -webkit-transform: rotate(40deg)
  -ms-transform: rotate(40deg)
  transform: rotate(40deg)

/* On mouse-over, add a grey background color */
/* .container-form-checkbox:hover input ~ .form-checkmark {
  background-color: #ccc;

/* When the checkbox is checked, add a blue background */
/* .container-form-checkbox input:checked ~ .form-checkmark {
  -moz-box-shadow:    inset 0 2px 4px 0px lightgray;
  -webkit-box-shadow: inset 0 2px 4px 0px lightgray;
  box-shadow:         inset 0 2px 4px 0px lightgray;

</style>
