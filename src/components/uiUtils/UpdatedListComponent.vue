<template>
  <div>
    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      hide-actions
      :hide-headers="hideHeaders"
    >
      <template v-if="centerHeadingsText" v-slot:headers="props">
        <tr>
          <th
            v-for="columnName in props.headers"
            :key="columnName.value"
            class="text-xs-center"
          >
            {{ columnName.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <td v-for="(item, index) in props.item" :key="index" :class="item.cellClass">
          <div
            v-if="item.type === 'avatar'"
            :class="getMatchPercentClass(item)"
            class="clickable"
            :style="{color: [item.color]}"
            @click.stop="emitClick(item)"
          >
            <v-avatar size="30px" style="margin-right: 15px" :color="colors[item.text[0]]">
              <!-- <img v-if='item.data' src="item.data" alt="John"> -->
              <span class="white--text">{{ item.text | initials }}</span>
            </v-avatar>
            {{ item.data && item.data.type === 'match' ? roundOffMatch(item.text) : item.text }}
          </div>

          <div
            v-else-if="item.type === 'clickable'"
            :class="getMatchPercentClass(item)"
            class="clickable"
            :style="{color: [item.color]}"
            @click.stop="emitClick(item)"
          >
            {{ item.data && item.data.type === 'match' ? roundOffMatch(item.text) : item.text }}
          </div>

          <div v-else-if="item.type === 'button'">
            <v-btn round dark :class="item.class" @click="emitClick(item)">
              {{ item.text }}
            </v-btn>
          </div>

          <div v-else-if="item.type === 'clickableIcon'">
            <v-btn fab small :class="[item.btnClass, 'fabSmall']" @click.stop="emitClick(item)">
              <v-icon small>
                {{ item.text }}
              </v-icon>
            </v-btn>
          </div>

          <div v-else-if="item.type === 'icon'">
            <v-icon :color="item.color" class="thin" @click.stop="emitClick(item)">
              {{ item.text }}
            </v-icon>
          </div>

          <div
            v-else-if="item.type === 'address'"
            class="feedback-address"
            @click.stop="showPropertyModal(true, item.data)"
          >
            <v-icon v-if="item.icon" small>
              place
            </v-icon>
            <div
              v-if="item.preText"
              :class="[item.preTextClass, 'pre-text']"
            >
              {{ item.preText }}&nbsp;
            </div>
            <span>{{ item.text }}</span>
          </div>

          <div v-else-if="item.type === 'date'">
            {{ item.text | dateFormat }}
          </div>

          <div
            v-else-if="item.type === 'addressImg'"
            class="feedback-address_image"
            @mouseenter="hoverRow = item.data.propertyId"
            @mouseleave="hoverRow = null"
            @click.stop="showPropertyModal(true, item.data)"
          >
            <div v-ripple class="img-wrap">
              <img
                :src="getHomeDetails(item.data, 'Images')"
                class="home-image"
                height="100%"
                width="100%"
                :aspect-ratio="16/10"
              >
              <v-layout
                v-if="hoverRow === item.data.propertyId"
                class="img-text"
                align-center
                justify-center
              >
                <v-flex xs12>
                  View Details
                </v-flex>
              </v-layout>
            </div>
            <span>{{ getFullAddress(item.data) }}</span>
          </div>

          <div
            v-else-if="item.type === 'picIndicator'"
            class="indicator-pictures"
            :class="{'indicator-pictures--true': item.picStatus}"
          />

          <div
            v-else-if="item.type === 'checkbox'"
            :class="'isCheckbox'"
            @click="checkboxClick(item.selected, props)"
          >
            <v-checkbox v-model="item.selected" />
          </div>

          <div v-else :class="[item.class]">
            <v-icon v-if="item.icon" small :class="[item.iconClass]">
              {{ item.icon }}
            </v-icon>
            {{ item.text }}
          </div>
        </td>
      </template>
    </v-data-table>
    <property-view-modal
      :show-modal="displayPropertyModal"
      :home-info="selectedProperty"
      @close-modal="showPropertyModal($event)"
    />
  </div>
</template>

<script>
import moment from 'moment'
import {
  calculateFeedbackMatch,
  getPropertyKeyValue,
  propertyFullAddress
} from '../../utils/propertyUtils'
import { isEmpty } from '../../utils/generalUtils'
import PropertyViewModal from '../modals/PropertyViewModal.vue'
import { mapState } from 'vuex'

export default {
  components: { PropertyViewModal },
  filters: {
    dateFormat(value) {
      return moment(value).format('MM-DD-YY')
    },
    initials: function(value) {
      if (!value) return ''
      value = value.split(' ')
      let response = ''
      for (const v of value) {
        response = response + v.charAt(0).toUpperCase()
      }
      return response
    }
  },

  props: {
    tableHeaders: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      required: true
    },
    centerHeadingsText: {
      type: Boolean,
      default: false
    },
    hideHeaders: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      hoverRow: null,
      displayPropertyModal: false,
      selectedProperty: null,
      colors: {
        A: '#e9ccb1',
        a: '#e9ccb1',
        B: '#d3c4b3',
        b: '#d3c4b3',
        C: '#d3c4be',
        c: '#d3c4be',
        D: '#e4dac3',
        d: '#e4dac3',
        E: '#ebcfc4',
        e: '#ebcfc4',
        F: '#ebcfc4',
        f: '#ebcfc4',
        G: '#999999',
        g: '#999999',
        H: '#9eb3bf',
        h: '#9eb3bf',
        I: '#9fc7a1',
        i: '#9fc7a1',
        J: '#D3C4BE',
        j: '#D3C4BE',
        K: '#BBA6A7',
        k: '#BBA6A7',
        L: '#A79993',
        l: '#A79993',
        M: '#BACCB6',
        m: '#BACCB6',
        N: '#9da59f',
        n: '#9da59f',
        O: '#AB919E',
        o: '#AB919E',
        P: '#9B9CB7',
        p: '#9B9CB7',
        Q: '#B6B595',
        q: '#B6B595',
        R: '#868290',
        r: '#868290',
        S: '#e9ccb1',
        s: '#e9ccb1',
        T: '#d3c4b3',
        t: '#d3c4b3',
        U: '#d3c4be',
        u: '#d3c4be',
        V: '#999999',
        v: '#999999',
        W: '#9eb3bf',
        w: '#9eb3bf',
        X: '#9fc7a1',
        x: '#9fc7a1',
        Y: '#BACCB6',
        y: '#BACCB6',
        Z: '#AB919E',
        z: '#AB919E',
        '1': '#9B9CB7',
        '2': '#B6B595',
        '3': '#9fc7a1',
        '4': '#9da59f',
        '5': '#D3C4BE',
        '6': '#BACCB6',
        '7': '#d3c4be',
        '8': '#9eb3bf',
        '9': '#AB919E',
        '0': '#e4dac3'
      }
    }
  },

  computed: {
    ...mapState('client', ['clientFavorites'])
  },

  methods: {
    emitClick(item) {
      const { data } = item
      if (data) {
        if (data.action) {
          this.$emit(data.action, data.value)
        } else {
          this.$emit('clicked', data)
        }
      } else {
        this.$emit('clicked')
      }
    },

    calculateFeedbackPercent(home) {
      if (!isEmpty(home.feedback)) {
        return calculateFeedbackMatch(home.feedback.match)
      }
      return 'N/A'
    },

    getMatchPercentClass(item) {
      if (item.data && item.data.type === 'match') {
        const percentValue = item.data.value
        let percentClass = ''
        if (this.calculateFeedbackPercent(percentValue) / 10 >= 8) {
          percentClass = 'hwayzGreen'
        } else if (this.calculateFeedbackPercent(percentValue) / 10 >= 6) {
          percentClass = 'hwayzSun'
        } else {
          percentClass = 'color-grey'
        }
        return [percentClass, 'matchClass']
      } else if (item.class) {
        return item.class
      }
      return null
    },

    roundOffMatch(value) {
      return Math.round(value) + '%'
    },

    showPropertyModal(status, property = null) {
      this.displayPropertyModal = status
      this.selectedProperty = status
        ? this.clientFavorites.find(home => home._id === property.propertyId)
        : null
    },

    checkboxClick(selected, item) {
      this.$emit('checkboxClicked', { selected, item })
    },

    /**
     * Retrieve home details based on property and required value
     * Calls the common utility function for retrieving a key value for property
     *
     * @public
     * @param {Object} home home object of selected home
     * @param {String} key specific detail for the property
     */
    getHomeDetails(home, key) {
      return getPropertyKeyValue(home.propertyId, this.clientFavorites, key)
    },

    getFullAddress(data) {
      const propertyObject = this.clientFavorites.find(
        home => home._id === data.propertyId
      )
      if (propertyObject) {
        return propertyFullAddress(propertyObject)
      } else {
        return 'Loading Address...'
      }
    }
  }
}
</script>

<style lang="sass">
.feedback-address
  text-align: left !important
  i
    padding-right: 1rem
  span
    cursor: pointer
  span:hover
    color: #57869D

.feedback-address_image
  text-align: left !important
  padding-top: 0.8rem
  padding-bottom: 0.8rem
  height: 90px
  display: flex
  align-items: center

  span
    cursor: pointer

  span:hover
    color: #57869D

.img-wrap
  cursor: pointer
  position: relative
  width: 25%
  min-width: 10rem
  height: 100%
  display: inline-block
  vertical-align: middle
  margin-right: 1rem
  float: left

.img-text
  position: absolute
  top: 0
  left: 0
  height: 100%
  width: 100%
  border-radius: 0.5rem
  background-color: #00000070
  color: white
  text-align: center

.home-image
  border-radius: 0.5rem

.indicator-pictures
  width: 1.2rem
  height: 1.2rem
  border-radius: 50%
  margin: 0 auto

  border: 0.1rem solid #ed6c6b
  background-color: white

.indicator-pictures--true
  border: 0.1rem solid #4da449
  background-color: #4da449

.clickable
  cursor: pointer
  text-transform: uppercase

.fab-icon
  height: 2.4rem !important
  width: 2.4rem !important

.pre-text
  margin-left: -2rem
  display: inline

.isCheckbox
  justify-self: center !important
  position: relative
  top: 50%
  left: 50%
  transform: translate(-5%, -25%)

.textLeft
  text-align: left !important

.capitalize
  text-transform: capitalize !important

.uppercase
  text-transform: uppercase !important

.fabSmall
  width: 30px !important
  height: 30px !important

.v-datatable, .v-table
  overflow: hidden

.btnSmall
  height: 2.5rem !important
  font-size: 1.1rem !important
  &.hwayzTeal
    background-color: $hwayzTeal !important
  &.hwayzSun
    background-color: $hwayzSun !important

/* Color classes - can be modified if needed
 * Using same name for class and color at the moment. */
// Define a color for grey around #999
.color-grey
  color: #999
  &.matchClass:hover
    background-color: rgba(#999, .2)

.hwayzGreen
  color: $hwayzGreen
  &.matchClass:hover
    background-color: rgba($hwayzGreen, .2)

.hwayzTeal
  color: $hwayzTeal
  &.matchClass:hover
    background-color: rgba($hwayzTeal, .2)

.hwayzSun
  color: $hwayzSun
  &.matchClass:hover
    background-color: rgba($hwayzSun, .2)

.hwayzBlue
  color: $hwayzBlue

.matchClass
  margin-left: 35%
  text-align: center
  border-radius: 50%
  width: 36px
  height: 36px
  line-height: 36px

.wide
  width: 50%
.thin
  width: 50px
.text-left
  text-align: left

.saved
  color: $saved
.pending
  color: $hwayzYellow
.scheduled
  color: $hwayzGreen
.accept
  color: $accept
.decline
  color: $decline
.confirmed
  color: $hwayzBlue
.completed
  color: $completed
.expired
  color: $hwayzMediumGray

.wide
  width: 50%
</style>
