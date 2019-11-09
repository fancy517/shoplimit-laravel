<template>
  <div id="containerLegalitiesPage">
    <div id="containerCopyrightPolicy" />
    <div class="container-checkbox">
      <label class="container-form-checkbox">
        I agree with the following information
        <input type="checkbox" checked="checked">
        <span class="form-checkmark" />
      </label>
    </div>
  </div>
</template>

<script>
import privacyPolicyText from './privacyPolicy.js'

export default {
  data() {
    return {
      checkboxAgreement: false
    }
  },
  mounted() {
    var customTextElement = document.getElementById('containerCopyrightPolicy')
    customTextElement.innerHTML = privacyPolicyText
  }
}
</script>

<style scoped lang='sass'>
*:focus
  outline: none

#containerLegalitiesPage
  height: 100%
  width: 100%
  margin: 0 auto
  padding: 0 20px

#containerCopyrightPolicy
  overflow-y: scroll
  text-align: left
  height: 80%
  /* width: 100%; */
  margin: 3% 4%
  font-size: $hwayzFont0em8
  padding-right: 10px
  border: none

/* Scrollbar style */
#containerCopyrightPolicy::-webkit-scrollbar-track
  background-color: $hwayzce
  border: solid 1px white; /* make the track seem narrower than the thumb */

#containerCopyrightPolicy::-webkit-scrollbar
  width: 4px
  background-color: $hwayzce

#containerCopyrightPolicy::-webkit-scrollbar-thumb
  background-color: $hwayzBlack

/* Custom checkbox style */
/* Customize the label (the container) */
.container-checkbox
  width: fit-content
  margin: 0 auto
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
  border: solid #3fc1d2
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
