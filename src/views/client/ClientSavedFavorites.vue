<template>
  <div id="resultsPage">
    <template v-if="showLoader" class="mt-5">
      <v-progress-circular :size="70" :width="7" color="#64bbc0" indeterminate />
      <div style="font-size: 1.8rem; margin-top: 1rem;">
        Loading your favorites
      </div>
    </template>
    <div v-else-if="noFavs">
      <title-with-message
        title="No Homes Saved"
        message="Please perform a search and save your favorites"
        btn-option="Search Properties Now"
        @button-clicked="redirectToSearch()"
      />
    </div>
    <div v-else>
      <favorites-grid-layout
        :favorites="savedProperties"
        :client-data="clientData"
        :toured="clientToured"
        @remove-from-favorites="removeFromFavorites($event)"
        @toggle-tour="requestTourForProperty($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import refreshClientData from '../../components/mixins/refreshClientData'
import FavoritesGridLayout from '../../components/client/favorites/FavoritesGridLayout.vue'
import TitleWithMessage from '../../components/uiUtils/TitleWithMessage.vue'
import { sortArrayBasedOnAnotherArray } from '../../utils/generalUtils'

export default {
  components: { FavoritesGridLayout, TitleWithMessage },

  mixins: [refreshClientData],

  data() {
    return {
      showLoader: true,
      noFavs: false,
      savedProperties: []
    }
  },

  computed: {
    ...mapState('client', ['clientFavorites']),
    ...mapState('common', ['routeData']),

    clientToured() {
      const properties = this.touredProperties()
      return properties
    },

    propertyDetails() {
      return this.clientFavorites.map(fav => fav)
    }
  },

  watch: {
    clientFavorites(newValue, oldValue) {
      if (this.clientData && newValue) {
        this.initProperties(this.clientData, newValue)
      }
    }
  },

  created() {
    if (this.clientData && this.clientFavorites) {
      this.initProperties(this.clientData, this.clientFavorites)
    }
  },

  methods: {
    initProperties(clientData, clientFavs) {
      const { homes } = clientData
      if (homes && homes.length > 0) {
        this.savedProperties = this.timeSortedProperties(homes)
        if (homes.length === this.savedProperties.length) this.showLoader = false
      } else {
        this.noFavs = true
        this.showLoader = false
      }
    },

    timeSortedProperties(homes) {
      if (homes.length > 0) {
        const tempArray = homes
          .sort((a, b) => (a._timestamp < b._timestamp ? 1 : -1))
          .map(item => item.propertyId)
        return sortArrayBasedOnAnotherArray(this.propertyDetails, tempArray, '_id')
      }
      return []
    },

    touredProperties() {
      // TODO: Implement fetching properties that have been added to a route
      // console.log(this.clientData)
      if (this.routeData) {
        console.log(this.routeData)
      }
      return []
    },

    redirectToSearch() {
      this.$router.push({ name: 'client-search' })
    }
  }
}
</script>

<style scoped lang='sass'>
#resultsGrid
  max-width: 120rem

</style>
