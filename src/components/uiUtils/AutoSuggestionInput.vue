<template>
  <div id="searchInput">
    <div class="search-client" :class="{'error-box': showError}">
      <v-autocomplete
        id="autoInput"
        v-model="clientName"
        :items="clientObjects"
        :loading="isLoading"
        :search-input.sync="search"
        color="grey"
        hide-no-data
        hide-selected
        item-text="name"
        item-value="_id"
        placeholder="Choose Client"
        prepend-icon="fas fa-search"
        return-object
        flat
        single-line
        class="custom"
        @input="submitName"
      />
    </div>
    <div v-if="showError" class="search__error-message">
      {{ errorString }}
    </div>
    <template v-if="!headerMode">
      <div class="search__tag">
        Get started planning routes for a client
      </div>
      <v-btn
        id="chooseClientButton"
        color="pink lighten-1"
        class="white--text"
        @click="submitName"
      >
        Choose Client
      </v-btn>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { isEmpty } from '../../utils/generalUtils'
export default {
  props: {
    /**
     * Determines whether search widget is being called
     * from the header or other component
     *
     * In the case of header don't show any additional element
     */
    headerMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isLoading: false,
    search: null,
    clientName: null,
    showError: false,
    errorString: ''
  }),

  computed: {
    ...mapState('agent', ['agentData']),

    clientObjects() {
      if (this.agentData && this.agentData.clients) {
        return this.agentData.clients
      }
      return []
    }
  },

  watch: {
    search(val) {
      if (this.clientObjects.length > 0) return
      if (this.isLoading) return
      this.isLoading = true

      if (this.agentData && this.agentData.clients) {
        this.isLoading = false
      }
    }
  },

  methods: {
    ...mapActions('agent', ['setSearchedClient']),
    ...mapMutations('common', {
      setSelectedRoute: 'SET_SELECTED_ROUTE'
    }),

    /**
     * Listener for the event when an input is given to the search box
     * This input is then checked against an existing client's
     * and returns the matching results
     *
     * @public
     */
    submitName() {
      if (isEmpty(this.clientName)) {
        this.showError = true
        this.errorString =
          'Please enter/select a name that exists as your client'
      } else {
        this.errorString = 'Loading data for this client...'
        setTimeout(() => {
          this.errorString = ''
        }, 2000)
        this.setSearchedClient(this.clientName)
        this.setSelectedRoute(null)
      }
    }
  }
}
</script>

<style lang="sass">
.search-client
  display: inline-block
  width: 100%
  max-width: 40rem
  padding: 0rem 2rem
  border: .5px solid #4A4949
  border-radius: 4rem
  background-color: #FFFFFF

// .error-box
//   border: .5px solid darkred

#searchInput
  .v-text-field
    padding: 0 !important
    margin: 2px !important
    height: 3rem
    font-size: 1em
    .v-icon
      font-size: 1em
      color: #909090

.search__error-message
  font-size: 1.1rem
  color: darkred

.search__tag
  font-size: 0.8em
  color: #909090
  margin-bottom: 6rem
  margin-top: 3rem

#chooseClientButton
  margin-bottom: 3rem
  width: 60%
  min-width: 15rem
  border-radius: 2rem
  height: 6rem

//GET RID OF UNDERLINE
.custom.v-text-field>.v-input__control>.v-input__slot:before
    border-style: none !important

.custom.v-text-field>.v-input__control>.v-input__slot:after
    border-style: none !important

@media only screen and (max-width: 1280px)
  .search__tag
    margin-bottom: 4rem
</style>
