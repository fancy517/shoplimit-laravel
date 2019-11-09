<template>
  <v-container id="resultsGrid" grid-list-sm fluid>
    <v-container class="pa-0 ma-0">
      <navigation-favorites
        :items="favoriteFields"
        :client-data="clientData"
        @tab-changed="setActive($event)"
      />
    </v-container>
    <favorites-client-data
      :favorites="active === 0 ? favorites : toured"
      @toggle-tour="$emit('toggle-tour', $event)"
      @remove-from-favorites="$emit('remove-from-favorites', $event)"
    />
  </v-container>
</template>

<script>
import NavigationFavorites from './NavigationFavorites.vue'
import FavoritesClientData from './FavoritesClientData.vue'
import { mapState } from 'vuex'
import refreshClientData from '../../mixins/refreshClientData.js'

export default {
  components: {
    NavigationFavorites,
    FavoritesClientData
  },
  mixins: [refreshClientData],
  props: {
    favorites: {
      type: Array,
      required: true
    },
    toured: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      displayMessageModal: false,
      selectedProperty: null,
      active: 0,
      favoriteFields: [
        { value: 0, text: 'Saved Favorites', icon: 'favorite' },
        {
          value: 1,
          text: 'Toured Favorites',
          svgIcon: 'hw-verified_feedback-24px'
        }
      ]
    }
  },

  computed: {
    ...mapState('client', ['clientData'])
  },
  methods: {
    setActive(val) {
      this.active = val
    }
  }
}
</script>

<style lang="sass" scoped>
#resultsGrid
  padding-top: 0 !important
</style>
