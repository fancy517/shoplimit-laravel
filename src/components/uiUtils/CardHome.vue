<template>
  <v-hover>
    <v-card slot-scope="{hover}" tile class="card-result">
      <template v-if="homeType === 'favorite' && isAddedByAgent()">
        <div class="corner-angle" />
        <div class="tilted-text">
          <span>Agent</span>
          <br>Added
        </div>
      </template>
      <v-img :src="getPropertyImage()" :aspect-ratio="16/10">
        <template v-if="showProgress" v-slot:placeholder>
          <v-layout fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey darken-1" />
          </v-layout>
        </template>
        <!-- Hover element that shows the additional options for a home listing. -->
        <v-fade-transition>
          <!-- v-if="true" -->
          <v-layout
            v-if="hover || modalShowing"
            wrap
            align-center
            justify-start
            class="transition-fast-in-fast-out text-xs-left card-favorite__image-overlay px-5 py-3"
          >
            <slot name="hoverCard" :propertyInfo="propertyInfo" />
          </v-layout>
        </v-fade-transition>
      </v-img>
      <v-card-title class="text-xs-left card-result-title">
        <!-- <span class="span-address">
            {{ propertyInfo['Address'] }}, {{ propertyInfo['City'] }} {{ propertyInfo['PostalCode'] }}
          </span>
          <span class="text-xs-right pa-0 span-price">
            ${{ propertyInfo["ListPrice"] | commaSeparated }}
        </span>-->
        <v-layout wrap>
          <v-flex
            xs12
          >
            {{ propertyInfo['Address'] }}, {{ propertyInfo['City'] }} {{ propertyInfo['PostalCode'] }}
          </v-flex>
          <!-- <v-flex class="text-xs-left">
            <span class="yellow--text">NEW!</span> Agent added
          </v-flex>-->
          <v-flex v-if="homeType === 'favorite' && isTourRequested()" xs4>
            <v-icon color="#fff" class="green--text" small>
              fas fa-paper-plane
            </v-icon>
          </v-flex>
          <v-flex class="text-xs-right">
            ${{ propertyInfo["ListPrice"] | commaSeparated }}
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <table class="card-result-table">
          <tr>
            <td class="text-xs-left table-key">
              Type
            </td>
            <td class="text-xs-right table-value">
              {{ propertyInfo['PropertyType'] }}
            </td>
          </tr>
          <tr>
            <td class="text-xs-left table-key">
              Size
            </td>
            <td
              class="text-xs-right table-value"
            >
              {{ propertyInfo['SqftTotal'] | commaSeparated }} SqFt
            </td>
          </tr>
          <tr>
            <td class="text-xs-left table-key">
              Rooms
            </td>
            <td
              class="text-xs-right table-value"
            >
              {{ propertyInfo['BedsTotal'] }} Beds + {{ propertyInfo['BathsTotal'] }} Baths
            </td>
          </tr>
        </table>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
import { mapState } from 'vuex'
import { getFavoriteObjectFromPropertyId } from '../../utils/propertyUtils'

export default {
  filters: {
    commaSeparated(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  props: {
    propertyInfo: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    homeType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      modalShowing: false,
      showProgress: true
    }
  },

  computed: {
    ...mapState('client', ['clientData', 'associatedAgent'])
  },

  methods: {
    isAddedByAgent() {
      if (this.clientData && this.clientData.homes) {
        const homeObject = this.clientData.homes.find(
          home => home.propertyId === this.propertyInfo._id
        )
        return homeObject._creator !== this.clientData._id
      }
    },

    getPropertyImage() {
      if (this.propertyInfo.Images &&
        this.propertyInfo.Images.length > 0) {
        return this.propertyInfo.Images[0]
      } else {
        return '/img/lazy-loading.jpg'
      }
    },

    imageSearchTimeout() {
      setTimeout(() => {
        this.showProgress = false
      }, 10000)
    },

    isTourRequested() {
      if (this.clientData && this.clientData.homes) {
        const homeObject = getFavoriteObjectFromPropertyId(
          this.clientData.homes,
          this.propertyInfo._id
        )
        return homeObject.requestTour === true
      }
      return false
    }
  }
}
</script>

<style lang="sass" scoped>
.card-result
  margin: 15px 0px;

.corner-angle
    background-color: transparent;
    position: absolute;
    z-index: 1;

.corner-angle::before, .corner-angle::after
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border-color: transparent;
    border-style: solid;

.corner-angle::after
    border-width: 3.5rem;
    border-left-color: #ff6368;
    border-top-color: #ff6368;

.tilted-text
  position: absolute;
  top: .7rem;
  left: .7rem;
  color: #fafafa;
  font-size: 1rem;
  z-index: 2;
  text-align: center;
  transform: rotate(-45deg);

.card-result-title
  background-color: #3d3d3d;
  color: #fff;
  font-weight: 300;
  font-size: 1.4rem;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  min-height: 7rem;
  position: relative;

.card-result-table
  width: 100%;

.card-result-table td
  padding: 3px;

.table-key
  color: #3d3d3d;

.table-value
  color: #000;

.image-overlay-label
  background-color: #3d3d3d;
  margin: 10px 20px;

.card-favorite__image-overlay
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 !important;

  background-color: #3d3d3d;
  opacity: 0.9;
  color: #fff;

.result-overlay-icon
  font-size: 1.8rem;
  margin-right: 1rem;

.card-favorite__overlay-link
  font-size: 1.4rem;
  cursor: pointer;
  height: 2rem;

.fill-width
  width: 100%;

// .span-price{
//   position: absolute;
//   bottom: 5px;
//   right: 16px;
// }

@media only screen and (max-width: 1280px)
  .card-favorite__image-overlay
    padding: 24px !important
</style>
