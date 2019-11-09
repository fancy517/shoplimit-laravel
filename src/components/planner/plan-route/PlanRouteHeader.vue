<template>
  <div class="toolbar">
    <p style="height: 10px; text-transform: uppercase; margin-right: 2%">
      PLAN ROUTE FOR {{ selectedClient.name }}
    </p>
    <!--v-spacer></v-spacer-->
    <auto-suggestion-input :header-mode="true" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AutoSuggestionInput from '../../uiUtils/AutoSuggestionInput.vue'

export default {
  components: { AutoSuggestionInput },
  computed: {
    ...mapState('agent', ['selectedClient'])
  }
}
</script>

<style lang="sass" scoped>
  .toolbar
    width: 100%
    height: 60px
    background-color: $hwayzBlue
    color: white
    display: inline-flex
    justify-content: center !important
    align-items: center !important

  select
    border-bottom: 1px solid white
    border-radius: 0
    min-width: 200px
</style>
