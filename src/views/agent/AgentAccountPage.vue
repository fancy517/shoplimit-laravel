<template>
  <div>
    <v-tabs
      id="myContainer"
      v-model="active"
      color="#e1e1e1"
      hide-slider
      fixed-tabs
      height="40px"
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab"
        ripple
        class="title-tab"
        :class="{'active-tab': tabs[active] === tab}"
      >
        {{ tab }}
      </v-tab>
      <v-tabs-items cycle>
        <!-- PROFILE TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid>
            <profile-tab />
          </v-container>
        </v-tab-item>
        <!-- BROKER INFO TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid />
        </v-tab-item>

        <!-- UPLOAD LOGO TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid>
            <button
              v-ripple="{ class: 'grey--text', center: true}"
              class="button-upload"
              @click="uploadPicture"
            >
              upload logo
            </button>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import ProfileTab from '../../components/agent/account/ProfileTab.vue'

export default {
  components: {
    ProfileTab
  },
  data() {
    return {
      active: null,
      tabs: [
        'profile',
        'broker info',
        'upload logo'

      ],
      tabTitles: [
        'PROFILE INFORMATION',
        'BROKER INFO',
        'UPLOAD LOGO'
      ],
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  methods: {
    uploadPicture() {
      console.log('Upload picture clicked')
    }
  }
}
</script>

<style lang="sass" scoped>
.v-tabs__div
  font-size: 1.4rem
  /* padding: 0.5rem 0; */
  text-transform: uppercase
  color: #6e6e6e !important

.active-tab
  color: #689bf6 !important

.v-sheet
  border-radius: 0 !important

.container-tab
  background-color: $hwyzAccountTabClient
  padding: 3.5rem 4rem
  height: 100%

.tab-title
  font-size: 1.6rem
  display: block
  padding-bottom: 3rem

.my-container
  padding: 0

.button-upload
  height: 3rem
  border: darkgray 1px solid
  box-shadow: #ababab 0px 1px 3px 1px
  background-color: #ffffff
  border-radius: 0.5rem

  text-transform: lowercase
  font-size: 1.2rem
  color: #6b6b6b

  padding: 0 1rem
  margin-left: 0.5rem
</style>
