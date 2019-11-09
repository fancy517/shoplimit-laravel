<template>
  <v-layout wrap>
    <v-flex xs12 md4 class="mb-5">
      <client-detail-card />
    </v-flex>

    <!-- Right side data -->
    <v-flex xs12 md8>
      <div class="right-box">
        <v-tabs
          v-model="tab"
          color="#e1e1e1"
          hide-slider
          fixed-tabs
          height="40px"
          width="50px"
        >
          <!-- <v-tabs-slider  /> -->

          <v-tab
            v-for="(item,index) in items"
            :key="item"
            :class="{'active-tab': active === index}"
            @click="active=index"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <div class="inner-content">
          <div v-show="tab === 3">
            <image-grid />
          </div>
          <div v-show="tab === 1">
            <wants />
          </div>
          <div v-show="tab === 2">
            <needs />
          </div>
          <div v-show="tab === 0">
            <profile-tab
              :disabled-update="true"
              :profile="selectedClient"
            />
            <!-- Not Notes -->
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import ClientDetailCard from './ClientDetailCard.vue'
import { plannerCommData } from '../planner/planner-communication-data'
import ImageGrid from './Components/ImageGrid.vue'
import ProfileTab from '../client/account/ProfileTab'
import Wants from './Components/Wants.vue'
import Needs from './Components/Needs.vue'

export default {
  components: {
    ClientDetailCard,
    ImageGrid,
    Wants,
    ProfileTab,
    Needs
  },

  filters: {
    dateFormat: value => {
      return moment(value).format('Do MMMM, YYYY')
    }
  },

  props: {
    /**
     * The client that is selected either by the agent to check details
     * or the client that is currently logged in
     */
    selectedClient: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      active: null,
      messages: plannerCommData[0],
      openPlanRouteModal: false,
      selectedHouses: [],
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
      tabContent: {
        tabHeaders: ['SAVED HOMES', 'VIEWED HOMES'],
        tableHeaders: [
          { text: 'Address', value: 'address', width: '50%' },
          { text: 'Date Added', value: 'date', width: '15%' },
          { text: 'Match', value: 'match', width: '10%' },
          { text: 'Viewed', value: 'viewed', width: '15%' },
          { text: '', value: 'checkbox', width: '10%' }
        ]
      },
      items: ['Details', 'Wants', 'Needs', 'Documents'],
      tab: 4
    }
  }
}
</script>

<style scoped lang='sass'>
#tabContainer td
  text-align: left !important
  padding-right: 0 !important

.v-tabs__div
  color: $hwayzNavigationTab !important
  min-width: 20rem

.tab-container__tab
  background-color: $hwayzNavigationTab
  color: $hwayzWhite !important
  border-top-left-radius: 0.9rem
  border-top-right-radius: 0.9rem

.tab-container__tab:hover
  color: $hwayzWhite !important

.tab-container__content
  padding: 2rem
  min-height: 10rem

.right-box
  margin: 0 2rem
  border-radius: 1.5rem
  box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2)
  background-color: $hwayzWhite
  height: 578px !important

.inner-content
  padding: 10%

.v-tabs__div
  font-size: 1.4rem;
  /* padding: 0.5rem 0; */
  text-transform: uppercase;
  color: #6e6e6e !important;

.active-tab
  color: #689bf6 !important;

</style>
