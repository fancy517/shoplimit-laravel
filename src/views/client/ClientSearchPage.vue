<template>
  <div>
    <div id="searchEntry">
      <h1>Real Estate Search</h1>
      <search-property-input @on-search-clicked="searchProperties" />
    </div>
    <div style="margin-top: 5rem;">
      <template v-if="isEmptySearchObject()">
        <div v-if="searchObject.loading">
          <v-progress-linear :indeterminate="true" color="#64bbc0" />Loading Properties...
        </div>
        <template v-else>
          <div style="margin-bottom: 2rem">
            No properties matching
            <strong>{{ getCityStateHeader() }}</strong>
          </div>
        </template>
      </template>
      <template v-else>
        <search-results-container
          :search-property-type="resultHeaderOptions ? resultHeaderOptions.type : ''"
          :search-result-header="getCityStateHeader()"
          :search-results="searchObject.data"
          @open-display-property="showPropertyDetails"
        />
        <div v-if="searchObject.loading">
          <v-progress-circular id="lazyLoader" color="primary" indeterminate />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import SearchPropertyInput from '../../components/common/SearchPropertyInput.vue'
import SearchResultsContainer from '../../components/search/SearchResultsContainer.vue'
import { isEmpty } from '../../utils/generalUtils'
import { SEARCH_LIMIT, stateOptions } from '../../components/common/searchPropertyConst'

export default {
  components: {
    SearchPropertyInput,
    SearchResultsContainer
  },

  data() {
    return {
      currentPage: 0,
      scrolled: false,
      resultHeaderOptions: null
    }
  },

  computed: {
    /**
     * Mapping the search result object from the store
     */
    ...mapState('agent', ['searchObject']),
    ...mapState('common', ['lastRequestedQuery'])
  },

  /**
   * Retrieve the default properties list by sending get request
   * In this case all properties will be listed
   * We are retrieving 20 properties at a time
   * and more can be searched using infinite scroll
   */
  created() {
    window.addEventListener('scroll', this.handleInfiniteScroll)
  },

  mounted() {
    this.assignSearchElement(true)
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleInfiniteScroll)
  },

  methods: {
    /**
     * Mapping search property action with the component's method
     */
    ...mapActions('agent', ['searchPropertiesList']),

    ...mapMutations('common', {
      setRequestedQuery: 'SET_REQUESTED_QUERY'
    }),

    getCityStateHeader() {
      if (this.resultHeaderOptions) {
        if (this.resultHeaderOptions.state !== '') {
          return this.resultHeaderOptions.city
            ? `'${this.resultHeaderOptions.city}' (${this.getStateName(
              this.resultHeaderOptions.state
            )})`
            : this.getStateName(this.resultHeaderOptions.state)
        } else if (this.resultHeaderOptions.city !== '') {
          return `'${this.resultHeaderOptions.city}'`
        }
      }
      return 'All Areas'
    },

    getStateName(stateCode) {
      return stateOptions.find(option => option.value === stateCode)['text']
    },

    isEmptySearchObject() {
      return isEmpty(this.searchObject.data)
    },

    /**
     * A scroll event listener that listens to window scrolling
     * and loads the search options in steps when reached at bottom
     */
    handleInfiniteScroll() {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        // You're at the bottom of the page
        if (!this.scrolled) {
          this.assignSearchElement()
          this.scrolled = true
          setTimeout(() => {
            this.scrolled = false
          }, 200)
        }
      }
    },

    searchProperties(queryFromInput) {
      this.setRequestedQuery(queryFromInput)
      this.currentPage = 0
      this.assignSearchElement(true)
    },

    assignSearchElement(refresh = false) {
      const { query } = this.lastRequestedQuery
      this.resultHeaderOptions = Object.assign(
        {},
        {
          city: query['City'],
          state: query['StateOrProvince'],
          type: query['PropertyType']
        }
      )

      const searchElement = Object.assign(
        {},
        {
          index: {
            skip: SEARCH_LIMIT * this.currentPage++,
            limit: SEARCH_LIMIT
          },
          query
        }
      )
      this.searchPropertiesList({ searchElement, refresh })
    },

    showPropertyDetails(selectedProperty) {
      this.$router.push({
        path: `search/${selectedProperty._id}`
      })
    }
  }
}
</script>

<style scoped>
#searchEntry {
  background: url("/img/client-search-back.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 3rem 0.5rem 0rem;
  height: 100%;
  box-shadow: inset 0 0 0 100rem rgba(0, 0, 0, 0.5);
}

#searchEntry h1 {
  margin-top: 10rem;
  font-size: 4rem;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
}

@media only screen and (min-width: 600px) {
  #searchEntry {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
