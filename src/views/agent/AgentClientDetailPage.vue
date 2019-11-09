<template>
  <div>
    <client-detail v-if="selectedClient" :selected-client="selectedClient" />
    <choose-client v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ChooseClient from '../../components/client-detail/ChooseClient.vue'
import ClientDetail from '../../components/client-detail/ClientDetail.vue'

export default {
  components: { ChooseClient, ClientDetail },
  computed: {
    /**
       * Mapping selected client from the Vuex store to local version
       */
    ...mapState('agent', ['selectedClient'])
  }
}
</script>
