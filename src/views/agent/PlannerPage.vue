<template>
  <div>
    <planner-container v-if="selectedClient" />
    <choose-client v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlannerContainer from '../../components/agent/planner/PlannerContainer.vue'
import ChooseClient from '../../components/client-detail/ChooseClient.vue'
export default {
  components: { PlannerContainer, ChooseClient },
  computed: {
    ...mapState('agent', ['selectedClient'])
  }
}
</script>

<style>

</style>
