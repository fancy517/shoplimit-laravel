<template>
  <v-layout fill-height justify-left align-start>
    <v-flex class="text-xs-left my-flex" xs12 md6 lg4>
      <tr class="tab-row">
        <td class="td-first text-xs-right">
          <v-img
            v-if="avatarSrc"
            class="avatar-picture"
            height="6rem"
            width="6rem"
            src="https://cdn.vuetifyjs.com/images/john.jpg"
          />
          <v-icon v-else class="upload-picture-icon" color="#000">
            add_a_photo
          </v-icon>
        </td>
        <td class="td-second">
          <input type="file" @change="onFileSelected">
          <button
            v-ripple="{ class: 'grey--text', center: true}"
            class="button-upload"
            @click="uploadPicture"
          >
            upload picture
          </button>
        </td>
      </tr>
      <div class="row-title">
        General Information
      </div>
      <tr class="tab-row">
        <td class="td-first">
          <label class="general-info-label">Name</label>
          <label class="general-info-label">Email</label>
          <label class="general-info-label">Phone number</label>
          <label class="general-info-label">City</label>
          <label class="general-info-label">State</label>
        </td>
        <td class="td-second">
          <input type="text">
          <input type="text">
          <input type="text">
          <input type="text">
          <input type="text">
        </td>
      </tr>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      avatarSrc: null
      // avatarSrc: 'https://cdn.vuetifyjs.com/images/john.jpg'
    }
  },
  methods: {
    uploadPicture() {
      console.log('Upload picture clicked')
    },
    onFileSelected(event) {

    }
  }
}
</script>

<style lang="sass" scoped>
*:focus
  outline: none

.tab-row
  margin: 30px 30px

.upload-picture-icon
  height: 6rem
  width: 6rem
  border-radius: 50%
  background-color: $hwayzBackgroundColor
  /* padding: 1.5rem */
  margin-right: 1.5rem
  vertical-align: middle

.avatar-picture
  border-radius: 50%
  float: right
  margin-right: 1.5rem
  vertical-align: middle

.td-first
  width: 40%
  padding: 2rem 0
  line-height: 4.2rem
  font-size: $hwayzFont1rem4
.td-second
  width: 60%
  line-height: 3rem
  padding: 2rem 0
.row-title
  font-weight: bold
  font-size: $hwayzFont1rem6
.general-info-label
  display: block
  padding-left: 35%

input[type="text"]
  width: 100%
  box-shadow: inset 0px 1px 2px 1px lightgray
  background-color: $hwayzBackgroundColor
  border-radius: 0.5rem
  margin: 0.5rem
  padding: 0rem 0.5rem
  padding-top: 0.2rem

  color: #666

.button-upload
  height: 3rem
  border: darkgray 1px solid
  box-shadow: $hwayzShadow 0px 1px 3px 1px
  background-color: $hwayzBackgroundColor
  border-radius: 0.5rem

  text-transform: lowercase
  font-size: 1.2rem
  color: #6b6b6b

  padding: 0 1rem
  margin-left: 0.5rem

.tab-date
  display: inline-block
  width: 50%
</style>
