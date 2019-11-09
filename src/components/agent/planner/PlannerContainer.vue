<template>
  <v-layout wrap>
    <v-flex xs12 xl8>
      <div class="planner-container__tab-header">
        <planner-tab-navigation :items="tabHeaders" @tab-changed="setActive($event)" />
      </div>
      <div class="planner-container__tab-content">
        <requested-home-tours v-show="active === 0" />
        <client-route-details v-show="active === 1" />
        <client-feedback-info v-show="active === 2" :table-data="feedbackNeededHomes" />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import PlannerTabNavigation from './PlannerTabNavigation.vue'
import ClientRouteDetails from './ClientRouteDetails.vue'
import RequestedHomeTours from './RequestedHomeTours.vue'
import ClientFeedbackInfo from '../../agent/feedback/ClientFeedbackInfo.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    PlannerTabNavigation,
    ClientRouteDetails,
    RequestedHomeTours,
    ClientFeedbackInfo
  },

  data() {
    return {
      active: 0,
      tabHeaders: [
        {
          value: 0,
          icon: 'favorite',
          title: 'Requested Home Tours'
        },
        {
          value: 1,
          icon: 'map',
          title: 'Routes'
        },
        {
          value: 2,
          icon: 'home',
          title: 'Viewed Homes'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('client', ['feedbackNeededHomes'])
  },

  watch: {
    feedbackNeededHomes(newValue, oldValue) {
      console.log(newValue, oldValue)
    }
  },

  methods: {
    setActive(val) {
      this.active = val
    }
  }
}
</script>

<style lang="sass" scoped>
.planner-container__tab-header
  margin: 0 2rem
  padding: 0

.planner-container__tab-content
  border-radius: 0 0 1rem 1rem
  background: $hwayzWhite
  padding: 3rem
  min-height: 40vh
  -webkit-box-shadow: 0.2rem 0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  -moz-box-shadow: 0.2rem 0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  box-shadow: 0.2rem 0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  margin: 0 2rem 2rem 2rem
</style>
