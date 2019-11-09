<template>
  <div>
    <feedback-container v-if="selectedClient" :selected-client="selectedClient" />
    <choose-client v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChooseClient from '../../components/client-detail/ChooseClient.vue'
import FeedbackContainer from '../../components/agent/feedback/FeedbackContainer.vue'

export default {
  components: { ChooseClient, FeedbackContainer },
  computed: {
    /**
       * Mapping selected client from the Vuex store to local version
       */
    ...mapState('agent', ['selectedClient'])
  }
}
</script>
