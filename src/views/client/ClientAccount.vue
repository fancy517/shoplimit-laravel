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
            <profile-tab
              :profile="clientData"
            />
          </v-container>
        </v-tab-item>
        <!-- NEEDS TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid>
            <need-want-tab :preference-type="'Need'" />
          </v-container>
        </v-tab-item>
        <!-- WANTS TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid>
            <need-want-tab :preference-type="'Want'" />
          </v-container>
        </v-tab-item>
        <!-- DOCUMENTS TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid>
            <approval-letter-tab />
          </v-container>
        </v-tab-item>
        <!-- OFFERS TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid />
        </v-tab-item>
        <!-- BROKER & AGENT INFO TAB -->
        <v-tab-item class="container-tab">
          <div class="tab-title text-xs-left">
            {{ tabTitles[active] }}
          </div>
          <v-container class="ma-0 my-container" fill-height fluid />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import ProfileTab from '../../components/client/account/ProfileTab.vue'
import NeedWantTab from '../../components/client/account/NeedWantTab.vue'
import ApprovalLetterTab from '../../components/client/account/ApprovalLetterTab.vue'

import { mapState } from 'vuex'

export default {
  components: {
    ProfileTab,
    NeedWantTab,
    ApprovalLetterTab
  },
  data() {
    return {
      active: null,
      tabs: [
        'profile',
        'needs',
        'wants',
        'documents',
        'offers',
        'broker & agent info'
      ],
      tabTitles: [
        'PROFILE INFORMATION',
        'YOUR NEEDS',
        'YOUR WANTS',
        'DOCUMENTS',
        'OFFERS',
        'BROKER & AGENT INFO'
      ],
      text:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  computed: {
    ...mapState('client', ['clientData'])
  }
}
</script>

<style lang="sass" scoped>
.v-tabs__div
  font-size: 1.4rem;
  /* padding: 0.5rem 0; */
  text-transform: uppercase;
  color: #6e6e6e !important;

.active-tab
  color: #689bf6 !important;

.v-sheet
  border-radius: 0 !important;

.container-tab
  background-color: $hwyzAccountTabClient;
  padding: 3.5rem 4rem;
  height: 100%;

.tab-title
  font-size: 1.6rem;
  display: block;
  padding-bottom: 3rem;

.my-container
  padding: 0;
</style>
