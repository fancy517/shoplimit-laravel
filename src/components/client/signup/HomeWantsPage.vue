<template>
  <div id="containerHomeWantsPage">
    <div id="containerHomeWantsChips">
      <label class="area-label text-xs-left">Select From Standard Wants:</label>
      <div>
        <v-chip
          v-for="want in homeWants"
          :key="4000 + want.value"
          class="my-chip"
          :class="{'chip-selected': (selectedHomeWants.findIndex(elem => elem.value === want.value) !== -1)}"
          text-color="white"
          color="#bbb"
          disabled
          @click="chipClicked(want)"
        >
          {{ want.text }}
        </v-chip>
      </div>
    </div>
    <div class="container-input text-xs-center">
      <label class="area-label">Enter Your Own Wants:</label>
      <input type="text">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homeWants: [
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
      selectedHomeWants: []
    }
  },
  computed: {},
  methods: {
    isHomeWantSelected(value) {
      return (
        this.selectedHomeWants.findIndex(want => want.value === value) !== -1
      )
    },
    chipClicked(val) {
      let i
      if (
        (i = this.selectedHomeWants.findIndex(
          want => want.value === val.value
        )) === -1
      ) {
        this.selectedHomeWants.push(val)
      } else {
        this.selectedHomeWants.splice(i, 1)
      }
    }
  }
}
</script>

<style scoped lang='sass'>
*:focus
  outline: none

#containerHomeWantsPage
  height: 100%
  width: 100%
  margin: 0 auto

.my-chip
  height: 20px
  font-size: $hwayzFont0em8
  margin: 3px

.my-chip >>> .v-chip__content
  padding-left: 10px !important

.chip-selected
  background-color: #4da449 !important

#containerHomeWantsChips
  text-align: left
  flex: 0 0 100%
  margin: 0% 14%
  font-size: $hwayzFont0em8
  margin-top: -10%
  padding-bottom: 15%

.container-input
  width: fit-content
  margin: 0 auto

input[type="text"]
  display: block
  text-align: center
  font-size: $hwayzFont1em2
  border-bottom: 1px black solid

.area-label
  display: block
  text-transform: capitalize
  font-size: $hwayzFont1em2
  margin-bottom: 10px !important

</style>
