<template>
  <v-layout fill-height justify-left align-start>
    <v-flex class="text-xs-left my-flex" xs12 md6>
      <!-- <tr class="tab-row">
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
          <button
            v-ripple="{ class: 'grey--text', center: true}"
            class="button-upload"
            @click="uploadPicture"
          >
            upload picture
          </button>
        </td>
      </tr> -->
      <div class="row-title">
        General Information
      </div>
      <v-form ref="form">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="profileForm.email"
                label="Email"
                :rules="[v => !!v || 'Item is required']"
                name="email"
                :disabled="true"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="profileForm.name"
                :rules="[v => !!v || 'Item is required']"
                name="name"
                :disabled="disabledUpdate"
                label="Name"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="profileForm.phone"
                :rules="[v => !!v || 'Item is required']"
                name="phone"
                :disabled="disabledUpdate"
                label="Phone Number"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="profileForm.city"
                label="City"
                :disabled="disabledUpdate"
                name="city"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="profileForm.state"
                label="State"
                :disabled="disabledUpdate"
                name="state"
              />
            </v-flex>
            <v-flex v-if="!disabledUpdate">
              <v-btn :color="colors.hwayzTeal" @click="updateProfile">
                Update Profile
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <!-- <tr class="tab-row">
        <td class="td-first">
          <div class="row-title">
            Purchase Details
          </div>
        </td>
        <td class="td-second">
          PURCHASE DETAILS
        </td>
      </tr>
      <div class="row-title">
        Purchase Timeframe
      </div>
      <tr class="tab-row">
        <td class="td-first" />
        <td class="td-second">
          <div class="tab-date">
            start: 02/21/2019
          </div>
          <div class="tab-date text-xs-right">
            goal: 02/21/2019
          </div>
        </td>
      </tr> -->
    </v-flex>
  </v-layout>
</template>

<script>
import { updateMyProfile } from '../../../services/profile'
import colors from '../../../scss/_colors.scss'
import { mapMutations } from 'vuex'

export default {
  props: {
    profile: {
      type: Object,
      default: () => {}
    },
    disabledUpdate: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      colors: colors,
      profileForm: {
        email: '',
        name: '',
        phone: '',
        city: '',
        state: ''
      },
      avatarSrc: null
      // avatarSrc: 'https://cdn.vuetifyjs.com/images/john.jpg'
    }
  },
  watch: {
    profile() {
      this.mapForm()
    }
  },
  created() {
    this.mapForm()
  },
  methods: {
    ...mapMutations('client', {
      'setUpdatedProfile': 'SET_CLIENT_DATA'
    }),
    mapForm() {
      for (let key in this.profileForm) {
        if (this.profile && this.profile[key]) {
          this.profileForm[key] = this.profile[key]
        }
      }
    },
    uploadPicture() {
      console.log('Upload picture clicked')
    },
    async updateProfile() {
      await updateMyProfile({ ...this.profile, ...this.profileForm })
      this.setUpdatedProfile({ ...this.profile, ...this.profileForm })
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
  background-color: $hwayzWhite
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
  background-color: $hwayzWhite
  border-radius: 0.5rem
  margin: 0.5rem
  padding: 0rem 0.5rem
  padding-top: 0.2rem

  color: $hwayzLightGray

.button-upload
  height: 3rem
  border: darkgray 1px solid
  box-shadow: $hwayzShadow 0px 1px 3px 1px
  background-color: $hwayzWhite
  border-radius: 0.5rem

  text-transform: lowercase
  font-size: $hwayzFont1rem2
  color: $hwayzShadow

  padding: 0 1rem
  margin-left: 0.5rem

.tab-date
  display: inline-block
  width: 50%
</style>
