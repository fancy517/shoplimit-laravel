<template>
  <div id="containerUploadLetter">
    <label>Do you have an Approval letter or other documents?</label>
    <div class>
      <button
        v-ripple="{ class: 'grey--text', center: true}"
        class="buttonUpload"
      >
        Upload Here
      </button>
    </div>
    <label id="uploadMessage">
      Don't worry if you don't have one yet.
      <br>You can add it in your account later.
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
  computed: {},
  methods: {
    isHomeNeedSelected(value) {
      return (
        this.selectedHomeNeeds.findIndex(need => need.value === value) !== -1
      )
    },
    chipClicked(val) {
      let i
      if (
        (i = this.selectedHomeNeeds.findIndex(
          need => need.value === val.value
        )) === -1
      ) {
        this.selectedHomeNeeds.push(val)
      } else {
        this.selectedHomeNeeds.splice(i, 1)
      }
    }
  }
}
</script>

<style scoped lang='sass'>
*:focus
  outline: none

#containerUploadLetter
  height: 100%
  padding-top: 10%
  /* background-color: #aaa; */

.buttonUpload
  border: darkgray 1px solid
  text-transform: uppercase
  font-size: $hwayzfb
  border-radius: 5px
  padding: 3px 10px
  margin-top: 5%
  background-color: $hwayzF7
  box-shadow: $hwayzShadow 0px 2px 2px 1px

#uploadMessage
  padding-top: 40%
  font-size: 13px
  color: $hwayzDarkerGray

</style>
