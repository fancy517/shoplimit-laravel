<template>
  <v-layout wrap>
    <v-flex xs12 xl8>
      <div class="feedback-tab-header">
        <planner-tab-navigation :items="tabHeaders" @tab-changed="setActive($event)" />
      </div>
      <div class="feedback-tab-content">
        <client-feedback-info :active="active" :table-data="active === 0 ? feedbackNeededHomes : feedbackProvidedHomes" />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ClientFeedbackInfo from './ClientFeedbackInfo.vue'
import PlannerTabNavigation from '../planner/PlannerTabNavigation.vue'

export default {
  components: { ClientFeedbackInfo, PlannerTabNavigation },
  data() {
    return {
      active: 0,
      tabHeaders: [
        { value: 0, title: 'Feedback Required', icon: 'feedback' },
        {
          value: 1,
          title: 'Feedback Provided',
          svgIcon: 'hw-verified_feedback-24px',
          size: '20px'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('client', ['feedbackNeededHomes', 'feedbackProvidedHomes'])
  },

  methods: {
    setActive(val) {
      this.active = val
    }
  }
}

</script>

<style lang='sass' scoped>
.feedback-tab-header
  margin: 0 2rem
  padding: 0

.feedback-tab-content
  border-radius: 0 0 1rem 1rem
  background: $hwayzWhite
  padding: 3rem
  min-height: 40vh
  -webkit-box-shadow: 0.2rem 0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  -moz-box-shadow: 0.2rem 0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  box-shadow: 0.2rem 0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  margin: 0 2rem 2rem 2rem
</style>
