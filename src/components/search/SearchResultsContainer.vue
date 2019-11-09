<template>
  <div id="searchResultsContainer">
    <!-- The result info bar on the top of the page showing the number of results. -->
    <v-container id="resultInfoContainer" fluid class="text-xs-left">
      <span>
        <!-- <b>{{ searchResults.length | commaSeparated }}</b> results matching -->
        Results matching
        <b>{{ searchResultHeader }}</b> for
        <b>{{ searchPropertyType ? searchPropertyType : 'All Types' }}</b>
      </span>
    </v-container>

    <!-- RESULTS -->
    <!-- <h3>Output result sample cards</h3> -->
    <results-layout
      :search-results="searchResults"
      :associated-clients="associatedClients"
      :assign-to-client="assignToClient"
      @open-display-property="$emit('open-display-property', $event)"
    />
  </div>
</template>

<script>
import ResultsLayout from './ResultsLayout.vue'
import { genericGetRequestToApi } from '../../utils/genericRequests'
import { RetrieveProfileUrl } from '../../utils/agentUrls'

export default {
  components: { ResultsLayout },
  filters: {
    commaSeparated(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },

  props: {
    searchResults: {
      type: Array,
      default: function() {
        return []
      }
    },
    searchResultHeader: {
      type: String,
      required: true
    },
    searchPropertyType: {
      type: String,
      required: true
    },
    assignToClient: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      selectedLayout: 0,
      sortByOption: 0,
      associatedClients: [],
      sortOptions: [
        { text: 'Price $-$$', value: 0 },
        { text: 'Price $$-$', value: 1 },
        { text: 'Beds', value: 2 },
        { text: 'Baths', value: 3 },
        { text: 'Footage', value: 4 },
        { text: 'Acreage', value: 5 },
        { text: 'Reducations', value: 6 },
        { text: 'Days on Website', value: 7 },
        { text: '# Pictures', value: 8 },
        { text: 'Walk Score', value: 9 },
        { text: 'Popularity', value: 10 }
      ],
      layoutOptions: [
        { text: 'Grid', value: 0 },
        { text: 'List', value: 1 },
        { text: 'Map', value: 2 }
      ]
    }
  },

  created() {
    genericGetRequestToApi(RetrieveProfileUrl()).then(response => {
      if (response.data) {
        if (response.data.clients) {
          this.associatedClients = response.data.clients
        }
      }
    })
  }
}
</script>

<style scoped>
#resultInfoContainer {
  padding: 30px 60px 30px 60px;
  /* background-color: #4f4f4f; */
  color: #4f4f4f;
  font-size: 16px;
}

#searchQueryLayout {
  background-color: #f8f8f8;
  padding: 2rem;
}

#moreOptionsLayout {
  padding: 15px 100px 25px 100px;
  background-color: #f8f8f8;
}

#searchAndSortLayout {
  padding: 15px 90px;
  background-color: #f3f3f3;
}

.search-container__input {
  width: 100%;
  padding: 0 12px;
  height: 42px;
  background: white;
  border-left: #d9d9d9 1px solid !important;
  outline: none;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.label-link {
  text-transform: uppercase;
  cursor: pointer;
  font-size: 16px;
}

.select-field-label {
  text-align: left;
  color: #4f4f4f;
  font-size: 16px;
  margin-bottom: 10px;
}

.menu-item {
  margin: 0 -5px 0 -5px;
  padding: 2px 5px 2px 5px;
  border: transparent 2px solid;
}

.menu-item-selected {
  border: #4f4f4f 2px solid !important;
  color: #4f4f4f;
}

.my-spacer {
  width: 1px;
}

#searchButton {
  width: 100%;
  margin: 0;
  border-radius: 0px;
  height: 42px;
  font-size: 18px;
  font-weight: bold !important;
  text-transform: capitalize;
}
</style>
