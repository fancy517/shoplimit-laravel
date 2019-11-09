<template>
  <v-container id="resultsGrid" grid-list-sm fluid>
    <v-layout wrap>
      <v-flex
        v-for="(result, index) in searchResults"
        :key="index"
        xs12
        sm6
        md4
        lg3
        class="px-2"
      >
        <card-home :property-info="result" :index="index" :home-type="'search'">
          <template v-slot:hoverCard>
            <!-- THIS SHOWS ON AGENT SEARCH -->
            <v-flex v-if="profileStatus === 'agent'" xs10>
              <div class="result-overlay-link" @click.stop="$emit('open-display-property', result)">
                <v-icon color="#fff" class="result-overlay-icon">
                  fas fa-search
                </v-icon>View Details
              </div>
              <!-- <div class="result-overlay-link">
                <v-icon color="#fff" class="result-overlay-icon">
                  image
                </v-icon>Request Showing
              </div>-->
              <div v-if="assignToClient && assignToClient.name" class="result-overlay-link" @click.stop="isAllocated(assignToClient, result) ? null : assignProperty(result, assignToClient)">
                <v-icon color="#fff" class="result-overlay-icon">
                  fas fa-id-badge
                </v-icon>
                <template v-if="isAllocated(assignToClient, result)">
                  Assigned To <span>{{ assignToClient.name }}</span>
                </template>
                <template v-else>
                  Assign To <span>{{ assignToClient.name }}</span>
                </template>
              </div>
              <div v-else class="result-overlay-link" @click.stop="setAssignModal(true, result)">
                <v-icon color="#fff" class="result-overlay-icon">
                  fas fa-id-badge
                </v-icon>Assign To
              </div>
            </v-flex>
            <!-- THIS SHOWS ON CLIENT SEARCH -->
            <v-flex v-else-if="profileStatus === 'client'" xs10>
              <div class="result-overlay-link" @click.stop="$emit('open-display-property', result)">
                <v-icon color="#fff" class="result-overlay-icon">
                  fas fa-search
                </v-icon>View Details
              </div>
              <div
                class="result-overlay-link"
                @click.stop="isFavorite(result) ? setPropertyAsUnfavorite(result) : setPropertyAsFavorite(result)"
              >
                <v-icon
                  :color="isFavorite(result) ? 'red' : '#fff'"
                  class="result-overlay-icon"
                >
                  fas fa-heart
                </v-icon>Save
              </div>
              <div
                v-if="isFavorite(result)"
                class="result-overlay-link"
                @click="isTourRequested(result) ? null : requestTour(result)"
              >
                <v-icon
                  color="#fff"
                  class="result-overlay-icon"
                  :class="{'green--text': isTourRequested(result)}"
                >
                  fas fa-paper-plane
                </v-icon>
                {{ isTourRequested(result) ? 'Tour Requested' : 'Request Tour' }}
              </div>
            </v-flex>
          </template>
        </card-home>
      </v-flex>
      <client-list-menu
        v-if="profileStatus === 'agent'"
        :show-modal="displayAssignModal"
        :selected-property="selectedProperty"
        :associated-clients="associatedClients"
        @assign-client-to-property="assignProperty(selectedProperty, $event)"
        @close-modal="setAssignModal(false)"
      />
    </v-layout>
  </v-container>
</template>

<script>
import {
  genericPostRequestToApi,
  genericDeleteRequestToApi
} from '../../utils/genericRequests'
import ClientListMenu from './ClientListMenu.vue'
import refreshContent from '../mixins/refreshContent'
import { mapState } from 'vuex'
import refreshClientData from '../mixins/refreshClientData'
import {
  CreateFavoriteUrl,
  UpdateDeleteFavoriteUrl
} from '../../utils/clientUrls'
import CardHome from '../uiUtils/CardHome.vue'
import { getFavoriteObjectFromPropertyId } from '../../utils/propertyUtils'

export default {
  components: { ClientListMenu, CardHome },
  filters: {
    commaSeparated(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    kNumber(val) {
      return (val / 1000).toString() + 'K'
    }
  },
  mixins: [refreshContent, refreshClientData],

  props: {
    searchResults: {
      type: Array,
      required: true
    },
    associatedClients: {
      type: Array,
      required: true
    },
    assignToClient: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      resultImageHoverOptions: [
        {
          icon: 'image',
          title: 'Request Showing'
        },
        {
          icon: 'heart',
          title: 'Save'
        }
      ],
      displayPropertyModal: false,
      displayAssignModal: false,
      selectedProperty: null,
      showProgress: true
    }
  },

  computed: {
    ...mapState('client', ['clientFavorites']),
    ...mapState('common', ['profileStatus'])
  },

  methods: {
    isFavorite(property) {
      const isClientFavorite = this.clientData.homes.some(
        home => home.propertyId === property._id
      )
      return isClientFavorite
    },

    setModalOpened(status) {
      this.displayPropertyModal = status
    },

    setAssignModal(status, value = null) {
      this.displayAssignModal = status
      this.selectedProperty = value
    },

    setViewModal(status, value = null) {
      this.displayPropertyModal = status
      this.selectedProperty = value
    },

    assignProperty(propertyObject, selectedClient) {
      this.setAssignModal(false)
      this.assignPropertyToClient(propertyObject, selectedClient)
    },

    isAllocated(clientObject, property) {
      const isClientAssigned = clientObject.homes.some(
        home =>
          home.propertyId === property._id
          // home.requestTour === true
      )
      return isClientAssigned
    },

    setPropertyAsFavorite(propertyObject) {
      genericPostRequestToApi(
        CreateFavoriteUrl(this.clientData._id, propertyObject._id)
      ).then(response => {
        if (response.status === 201) {
          this.getClientData(true)
        }
      })
    },

    setPropertyAsUnfavorite(propertyObject) {
      if (this.isTourRequested(propertyObject) === false) {
        const favObject = this.clientData.homes.find(
          home => home.propertyId === propertyObject._id
        )
        if (favObject) {
          genericDeleteRequestToApi(
            UpdateDeleteFavoriteUrl(this.clientData._id, favObject._id)
          ).then(response => {
            if (response.status === 200) {
              this.getClientData(true)
            }
          })
        }
      }
    },

    getPropertyImage(propertyObject) {
      if (propertyObject['Images'] && propertyObject['Images'].length > 0) {
        return propertyObject['Images'][0]
      }
    },

    imageSearchTimeout() {
      setTimeout(() => {
        this.showProgress = false
      }, 10000)
    },

    isTourRequested(property) {
      if (this.clientData && property._id) {
        const homeObject = getFavoriteObjectFromPropertyId(
          this.clientData.homes,
          property._id
        )
        return homeObject.requestTour === true
      }
      return false
    },

    requestTour(property) {
      this.requestTourForProperty(
        getFavoriteObjectFromPropertyId(this.clientData.homes, property._id)
      )
    }
  }
}
</script>

<style lang="sass" scoped>
.card-result
  margin: 15px 0px

.result-overlay-link
  @extend %card__hover-link
  span
    text-transform: capitalize

.result-overlay-icon
  @extend %card__hover-icon

.container.grid-list-sm .layout:only-child
  margin: 0px

@media only screen and (max-width: 960px)
  .result-overlay-link
    font-size: 1.8rem
    margin: 3rem 0

  .result-overlay-icon
    font-size: 2.2rem
</style>
