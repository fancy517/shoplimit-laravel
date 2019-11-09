<template>
  <v-container id="detailPropertyView">
    <div v-if="homeInfoLoaded" class="main-grid">
      <div class="imageWrap">
        <div class="image">
          <v-carousel hide-delimiters height="400" :cycle="false">
            <v-carousel-item
              v-for="(image, index) in getImages"
              :key="index"
              :src="image"
              :lazy-src="'/img/lazy-loading.jpg'"
            >
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey darken-1" />
                </v-layout>
              </template>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div v-if="profileStatus === 'client'" style="margin: 1rem 0rem;" class="inside-image">
          <div class="favourite">
            <v-btn
              id="assignToBtn"
              icon
              large
              depressed
              flat
              @click.stop="isFavorite ? removeFromFavorites({propertyId: homeInfo._id}) : setPropertyAsFavorite()"
            >
              <v-icon large :color="isFavorite ? 'red' : '#373737'">
                fas fa-heart
              </v-icon>
            </v-btn>
            {{ isFavorite ? 'Added as Favorite' : 'Add as Favorite' }}
          </div>
          <div>
            <div v-show="profileStatus === 'client' && isFavorite" class="request">
              <v-btn
                id="assignToBtn"
                icon
                depressed
                large
                flat
                @click.stop="isTourRequested() ? null : toggleTour()"
              >
                <v-icon large :color="isTourRequested() ? '#00aa22' : '#373737'">
                  fas fa-paper-plane
                </v-icon>
              </v-btn>
              {{ isTourRequested() ? 'Tour Requested' : 'Request Tour' }}
            </div>
          </div>
        </div>
      </div>
      <div class="information">
        <h3 class="detail-property-view__title">
          <strong>{{ homeInfo['Address'] ? getCustomAddress() : '' }}</strong>
        </h3>
        <property-view-section
          :section-data="getPropertyTopSection()"
          :property-details="homeInfo"
        />
        <div v-if="profileStatus === 'agent'" style="margin: 1rem 0rem;">
          <div class="detail-property-view__assign-to">
            Assign To
          </div>
          <div class="text-xs-left">
            <v-btn
              id="assignToBtn"
              color="#373737"
              class="white--text"
              @click.stop="setAssignModal(true)"
            >
              Client
            </v-btn>
          </div>
        </div>
        <v-btn
          v-if="!propertyObjectId"
          id="backToSearch"
          color="#373737"
          class="white--text"
          @click.stop="backToSpecificPage()"
        >
          Go back
        </v-btn>
      </div>

      <div class="sections">
        <v-container v-for="(params, index) in sectionParams" :key="index">
          <property-view-section
            :section-params="sectionParams[index]"
            :section-data="getPropertySectionData(index)"
            :property-details="homeInfo"
          />
        </v-container>
        <v-btn
          v-if="!propertyObjectId"
          id="backToSearch"
          color="#373737"
          class="white--text"
          @click="backToSpecificPage()"
        >
          Go back
        </v-btn>
      </div>
      <div v-if="latLng.length > 0" class="map">
        <map-component :key="componentKey" :lat-lgn-markers="latLng" :map-zoom="16" />
      </div>
      <preloader v-else :loading-message="'Loading Location map...'" />
    </div>
    <full-screen-spinner v-else spinner-text="Loading Property details..." />
    <!-- <div>{{ homeInfo }}</div> -->
    <client-list-menu
      v-if="profileStatus === 'agent'"
      :show-modal="displayAssignModal"
      :selected-property="homeInfo"
      :associated-clients="associatedClients"
      @assign-client-to-property="assignProperty($event)"
      @close-modal="setAssignModal(false)"
    />
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import {
  genericPostRequestToApi,
  genericGetRequestToApi
} from '../../../utils/genericRequests'
import {
  RetrieveProfileUrl
} from '../../../utils/agentUrls'

import refreshContent from '../../mixins/refreshContent'
import refreshClientData from '../../mixins/refreshClientData'
import PropertyViewSection from './PropertyViewSection.vue'
import ClientListMenu from '../ClientListMenu.vue'
import Preloader from '../../uiUtils/Preloader.vue'
import FullScreenSpinner from '../../uiUtils/FullScreenSpinner.vue'
import MapComponent from '../../common/MapComponent.vue'
import { CreateFavoriteUrl } from '../../../utils/clientUrls'
import { getFavoriteObjectFromPropertyId } from '../../../utils/propertyUtils'
import { getPropertyById } from '../../../services/propertiesService'
import { isEmpty } from '../../../utils/generalUtils'

export default {
  components: { PropertyViewSection, ClientListMenu, Preloader, FullScreenSpinner, MapComponent },

  mixins: [refreshContent, refreshClientData],

  props: {
    propertyObjectId: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      sectionParams: [
        { title: 'Property Attributes' },
        { title: 'General Information' },
        { title: 'Utility Information' },
        { title: 'Financial Information' }
      ],
      displayAssignModal: false,
      associatedClients: [],
      homeInfo: {},
      latLng: [],
      componentKey: 0
    }
  },

  computed: {
    ...mapState('client', ['clientData', 'clientHomes']),
    ...mapState('common', ['profileStatus']),
    ...mapGetters('agent', ['getSearchObject']),

    homeInfoLoaded() {
      return !isEmpty(this.homeInfo)
    },

    getImages() {
      return this.homeInfo['Images']
    },

    isFavorite() {
      if (this.clientData) {
        const isClientFavorite = this.clientHomes.some(
          home => home.propertyId === this.homeInfo._id
        )
        return isClientFavorite
      }
      return false
    }
  },

  watch: {
    homeInfo: {
      handler: function(newValue, oldValue) {
        if (!isEmpty(newValue)) {
          this.latLng = [{
            position: {
              lat: newValue.Latitude,
              lng: newValue.Longitude
            }
          }]
          this.componentKey++
        }
      },
      deep: true
    }
  },

  created() {
    // Later some routes will be made specific to the client
    // or agent side only to avoid overlapping
    window.scrollTo(0, 0)
    // console.log('details called >>>', this.$route.params, this.$route.path, this.propertyObjectId)
    if (this.$route.params.homeId) {
      if (this.$route.path.includes('favorites')) {
        this.getPropertyDetails(this.$route.params.homeId, 'favorites')
      } else {
        if (this.getSearchObject.data && this.getSearchObject.data.length > 0) {
          this.homeInfo = this.getSearchObject.data.find(
            home => home._id === this.$route.params.homeId
          )
        } else {
          this.getPropertyDetails(this.$route.params.homeId, 'search')
        }
      }
    } else if (this.propertyObjectId) {
      this.getPropertyDetails(this.propertyObjectId, null)
    }

    genericGetRequestToApi(RetrieveProfileUrl()).then(response => {
      if (response.data) {
        if (response.data.clients) {
          this.associatedClients = response.data.clients
        }
      }
    })
  },

  methods: {
    ...mapActions('client', ['removeFromFavoritesAction']),

    // ...mapMutations('common', {
    //   setContinueQuery: 'SET_CONTINUE_QUERY'
    // }),

    isTourRequested() {
      if (this.clientHomes && this.homeInfo) {
        const homeObject = getFavoriteObjectFromPropertyId(
          this.clientHomes,
          this.homeInfo._id
        )
        if (homeObject) {
          return homeObject.requestTour === true
        }
      }
      return false
    },

    toggleTour() {
      const homeObject = getFavoriteObjectFromPropertyId(
        this.clientData.homes,
        this.homeInfo._id
      )
      this.requestTourForProperty(homeObject)
    },

    getPropertyDetails(homeId, section) {
      getPropertyById(homeId).then(response => {
        if (response.status === 200) {
          this.homeInfo = response.data
        } else if (section) {
          // Entered a wrong home id so redirect to search/favorite
          this.$router.push({ name: `${this.profileStatus}-${section}` })
        }
      })
    },

    backToSpecificPage() {
      if (this.$route.path.includes('favorites')) {
        this.$router.push({ name: 'client-favorites' })
      } else {
        // this.setContinueQuery(true)
        this.$router.push({ name: `${this.profileStatus}-search` })
      }
    },

    getCustomAddress() {
      return (
        this.homeInfo['Address'] +
        ', ' +
        this.homeInfo['City'] +
        ' ' +
        this.homeInfo['StateOrProvince']
      )
    },

    assignProperty(selectedClient) {
      this.setAssignModal(false)
      this.assignPropertyToClient(this.homeInfo, selectedClient)
    },

    setPropertyAsFavorite() {
      genericPostRequestToApi(
        CreateFavoriteUrl(this.clientData._id, this.homeInfo._id)
      ).then(response => {
        if (response.status === 201) {
          // Changed data receiving process after setting as favorite
          // to handle broken link due to API updates
          // Can be changed later once other actions are fixed
          this.getClientData(true)
        }
      })
    },

    setAssignModal(status) {
      this.displayAssignModal = status
    },

    getPropertySectionData(sectionNum) {
      switch (sectionNum) {
        case 0:
          return [
            { text: 'Address', key: 'Address' },
            // { text: 'MLS Number', key: 'MLSNumber' },
            // { text: 'List Price', value: this.getListPrice() },
            { text: 'County', key: 'CountyOrParish' },
            { text: 'Subdivision', key: 'SubdivisionName' },
            // { text: 'Bed Bath Count', value: this.getBedBathCount() },
            // { text: 'Living Room(s)', key: 'NumLiving' },
            // { text: 'Dining Room(s)', key: 'NumDining' },
            // { text: 'Area', value: this.getArea() },
            { text: 'Year Built', key: 'YearBuilt' },
            { text: 'Type', key: 'PropertyType' },
            { text: 'Sub Type', key: 'PropertySubType' },
            {
              text: 'Schools',
              value: {
                tableHeaders: [
                  { text: 'Gr9', value: '', sortable: false },
                  { text: 'Intermediate', value: '', sortable: false },
                  { text: 'Senior', value: '', sortable: false }
                ],
                tableValues: [
                  {
                    1: 'Gr9HighSchool',
                    2: 'MiddleIntermediateSchool',
                    3: 'SeniorHighSchool'
                  }
                ]
              }
            }
          ]
        case 1:
          return [
            { text: 'Garage', key: 'ParkingFeatures' },
            { text: 'Lot Description', key: 'LegalDescription' },
            { text: 'Flooring', key: 'Wood' },
            { text: 'Kitchen', key: 'Kitchen' },
            { text: 'Appliances', key: 'KitchenAppliances' },
            { text: 'View', key: 'View' },
            { text: 'Foundation', key: 'FoundationDetails' }
          ]
        case 2:
          return [
            { text: 'Heat', key: 'Heating' },
            { text: 'AC', key: 'AC' },
            { text: 'Utilities', key: 'Utilities' },
            { text: 'Sewer', key: 'Sewer' },
            { text: 'Water', key: 'WaterSource' }
          ]
        case 3:
          return [
            { text: 'HOA Fee', value: this.getAmountValue('AssociationFee') },
            { text: 'Financing', key: 'ListingFinancing' },
            { text: 'Tax Rate', value: this.getTaxRate() },
            { text: 'Estimated Tax', value: this.getAmountValue('TaxAmount') }
          ]
        default:
          return null
      }
    },
    getPropertyTopSection() {
      return [
        { text: 'MLS Number', key: 'MLSNumber' },
        { text: 'List Price', value: this.getAmountValue('ListPrice') },
        { text: 'Bed Bath Count', value: this.getBedBathCount() },
        { text: 'Living Room(s)', key: 'NumLiving' },
        { text: 'Dining Room(s)', key: 'NumDining' },
        { text: 'Area', value: this.getArea() }
      ]
    },
    getBedBathCount() {
      return this.homeInfo['BedsTotal'] + ' / ' + this.homeInfo['BathsTotal']
    },
    getAmountValue(key) {
      // const decimalValue = parseFloat(this.homeInfo['ListPrice']).toFixed(2)
      const decimalValue = Math.round(parseFloat(this.homeInfo[key]))
      return (
        '$ ' + decimalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      )
    },
    getArea() {
      // return parseFloat(this.homeInfo['SqftTotal']).toFixed(2) + ' Sq Ft'
      const decimalValue = Math.round(parseFloat(this.homeInfo['SqftTotal']))
      return (
        decimalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' Sq Ft'
      )
    },
    getTaxRate() {
      return parseFloat(this.homeInfo['TaxRate']).toFixed(4) + '%'
    }
  }
}
</script>

<style lang="sass" scoped>
.detail-property-view__title
  font-weight: 400
  text-align: left

.detail-property-view__assign-to
  text-align: left
  float: left
  font-weight: 600
  font-size: 13px
  padding: 0 24px
  padding-left: 2rem
  line-height: 4rem
  width: 40%

#assignToBtn i
  font-size: 2em !important
  &:hover
    cursor: pointer

#backToSearch
  margin: 2rem auto
  width: 20rem

.blueBtn
  color: #20b7c9 !important
  &:hover:before
    color: transparent !important

.imageWrap
  height: 100%
  grid-area: image
  display: grid
  grid-template-areas: "image" "insideImage"
  grid-template-columns: 1fr

.image
  max-width: 100%
  grid-area: image

.inside-image
  grid-area: insideImage
  display: grid
  grid-template-areas: "favourite request"
  grid-template-columns: 1fr 1fr
  justify-items: center
  align-items: center

.favourite
  grid-area: favourite
.request
  grid-area: request
.information
  grid-area: information
.sections
  grid-area: sections
.map
  grid-area: map
.back
  grid-area: back
.main-grid
  display: grid
  grid-template-areas: "image" "information" "sections" "map"
  grid-row-gap: 2%

@media only screen and (min-width: 1264px)
  .main-grid
    display: grid
    grid-template-areas: "image information" "sections map"
    grid-template-rows: minmax(425px, 450px) auto
    grid-template-columns: 3fr 2fr
    grid-column-gap: 2%

  .information
    grid-area: information
    padding: 2%

  .map
    grid-area: map
    padding: 2%

</style>
