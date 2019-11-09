<template>
  <v-container id="searchPropertyInput" fluid>
    <v-layout wrap align-start justify-center fill-height>
      <!-- LOCATION -->
      <!-- <v-flex
        xs8
        md3
        class="no-padding"
      >
        <auto-complete-location
          :options="{flat: true}"
          @locations-changed="searchQuery['City'] = $event"
        />
      </v-flex>-->
      <v-flex xs4 md2 class="no-padding">
        <input
          v-model="searchQuery['City']"
          type="text"
          name="City"
          placeholder="City"
          class="search-container__input"
          @input="searchQuery['City'] = $event.target.value"
        >
      </v-flex>

      <!-- STATE -->
      <v-flex xs4 md2 class="no-padding">
        <v-select
          v-model="searchQuery['StateOrProvince']"
          :items="stateOptions"
          background-color="white"
          append-icon
          box
          flat
          solo
          dense
          single-line
          placeholder="State"
          :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
        >
          <template v-slot:item="data">
            <v-layout
              d-flex
              align-center
              justify-start
              class="text-xs-left menu-item"
              :class="{'menu-item-selected': data.tile.props.value}"
            >
              <v-flex class="no-margin no-padding">
                {{ data.item.text }}
              </v-flex>
            </v-layout>
          </template>
        </v-select>
      </v-flex>

      <!-- HOME TYPE -->
      <v-flex xs4 md2 class="no-padding">
        <v-select
          v-model="searchQuery['PropertyType']"
          :items="propertyOptions"
          background-color="white"
          append-icon
          box
          flat
          solo
          dense
          single-line
          placeholder="Property Type"
          :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
        >
          <template v-slot:item="data">
            <v-layout
              d-flex
              align-center
              justify-start
              class="text-xs-left menu-item"
              :class="{'menu-item-selected': data.tile.props.value}"
            >
              <v-flex class="no-margin no-padding">
                {{ data.item.text }}
              </v-flex>
              <!-- <v-flex v-if="data.tile.props.value" class="text-xs-right no-margin no-padding">
                  <v-icon small right color="black">
                    check
                  </v-icon>
              </v-flex>-->
            </v-layout>
          </template>
          <!-- HOME TYPE - how the selected items are presented. For 2 and more selections we write 'x items selected'. -->
          <!-- <template v-slot:selection="data"> -->
          <!-- If there is only one, and this is it, print it out. -->
          <!-- <span v-if="searchQuery.homeTypes.length === 1">{{ data.item }}</span> -->
          <!-- If there are more than 1, just for the 2nd one print out how many are selected. -->
          <!-- <span v-if="data.index === 1">{{ searchQuery.homeTypes.length }} items selected</span>
          </template>-->
        </v-select>
      </v-flex>

      <!-- Status of Property -->
      <v-flex xs4 md2 class="no-padding">
        <v-select
          v-model="searchQuery['Status']"
          :items="statusOptions"
          background-color="white"
          append-icon
          box
          flat
          solo
          dense
          single-line
          placeholder="Status"
          :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
        >
          <template v-slot:item="data">
            <v-layout
              d-flex
              align-center
              justify-start
              class="text-xs-left menu-item"
              :class="{'menu-item-selected': data.tile.props.value}"
            >
              <v-flex class="no-margin no-padding">
                {{ data.item }}
              </v-flex>
            </v-layout>
          </template>
        </v-select>
      </v-flex>

      <!-- MLS NUMBER -->
      <v-flex xs4 md2 class="no-padding">
        <input
          v-model="searchQuery['MLSNumber']"
          type="text"
          name="MLSNumber"
          placeholder="MLS#"
          class="search-container__input"
          @input="searchQuery['MLSNumber'] = $event.target.value"
        >
      </v-flex>

      <!-- BEDS -->
      <v-flex xs2 md1 class="no-padding">
        <v-select
          v-model="searchQuery['Beds']"
          :items="dropdownNoOfBeds"
          background-color="white"
          append-icon
          box
          flat
          solo
          dense
          single-line
          placeholder="Beds"
          :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
        >
          <template v-slot:item="data">
            <v-layout
              d-flex
              align-center
              justify-start
              class="text-xs-left menu-item"
              :class="{'menu-item-selected': data.tile.props.value}"
            >
              <v-flex class="no-margin no-padding">
                {{ data.item.text }}
              </v-flex>
            </v-layout>
          </template>
        </v-select>
      </v-flex>

      <!-- BATHS -->
      <v-flex xs2 md1 class="no-padding">
        <v-select
          v-model="searchQuery['Baths']"
          :items="dropdownNoOfBaths"
          background-color="white"
          append-icon
          box
          flat
          solo
          dense
          single-line
          placeholder="Baths"
          :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
        >
          <template v-slot:item="data">
            <v-layout
              d-flex
              align-center
              justify-start
              class="text-xs-left menu-item"
              :class="{'menu-item-selected': data.tile.props.value}"
            >
              <v-flex class="no-margin no-padding">
                {{ data.item.text }}
              </v-flex>
            </v-layout>
          </template>
        </v-select>
      </v-flex>
    </v-layout>

    <v-expand-transition>
      <v-layout v-show="showMoreOptions" wrap>
        <!-- LOCATION -->
        <!-- <v-flex
                xs12
                md4
                class="no-padding"
              >
                <auto-complete-location
                  :options="{flat: true}"
                  @locations-changed="searchQuery['locations'] = $event"
                />
        </v-flex>-->

        <!-- SUB PROPERTY TYPE -->
        <v-flex xs4 class="no-padding">
          <v-select
            v-model="searchQuery['PropertySubType']"
            :items="subPropertyOptions"
            background-color="white"
            append-icon
            box
            flat
            solo
            dense
            single-line
            placeholder="Sub Property Type"
            :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
          >
            <template v-slot:item="data">
              <v-layout
                d-flex
                align-center
                justify-start
                class="text-xs-left menu-item"
                :class="{'menu-item-selected': data.tile.props.value}"
              >
                <v-flex class="no-margin no-padding">
                  {{ data.item.text }}
                </v-flex>
              </v-layout>
            </template>
          </v-select>
        </v-flex>

        <!-- Minimum and Maximum for Property Price Range -->
        <!-- MIN -->
        <v-flex xs2 class="no-padding">
          <v-select
            v-model="searchQuery['ListPrice']"
            :items="dropdownPrice"
            background-color="white"
            append-icon
            box
            flat
            solo
            dense
            single-line
            placeholder="Min Price"
            :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
          >
            <template v-slot:item="data">
              <v-layout
                d-flex
                align-center
                justify-start
                class="text-xs-left menu-item"
                :class="{'menu-item-selected': data.tile.props.value}"
              >
                <v-flex class="no-margin no-padding">
                  ${{ data.item | commaSeparated }}
                </v-flex>
              </v-layout>
            </template>
            <template v-slot:selection="data">
              ${{ data.item | commaSeparated }}
            </template>
          </v-select>
        </v-flex>

        <!-- MAX -->
        <v-flex xs2 class="no-padding">
          <v-select
            v-model="searchQuery['maxPrice']"
            :items="dropdownPrice"
            background-color="white"
            append-icon
            box
            flat
            solo
            dense
            single-line
            full-width
            placeholder="Max Price"
            :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
          >
            <template v-slot:item="data">
              <v-layout
                d-flex
                align-center
                justify-start
                class="text-xs-left menu-item"
                :class="{'menu-item-selected': data.tile.props.value}"
              >
                <v-flex class="no-margin no-padding">
                  ${{ data.item | commaSeparated }}
                </v-flex>
              </v-layout>
            </template>
            <template v-slot:selection="data">
              ${{ data.item | commaSeparated }}
            </template>
          </v-select>
        </v-flex>

        <!-- Range for selecting the area -->
        <!-- MIN -->
        <v-flex xs2 class="no-padding">
          <v-select
            v-model="searchQuery['LivingArea']"
            :items="dropdownArea"
            background-color="white"
            append-icon
            box
            flat
            solo
            dense
            single-line
            placeholder="Min Area"
            :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
          >
            <template v-slot:item="data">
              <v-layout
                d-flex
                align-center
                justify-start
                class="text-xs-left menu-item"
                :class="{'menu-item-selected': data.tile.props.value}"
              >
                <v-flex class="no-margin no-padding">
                  {{ data.item | commaSeparated }} sq ft
                </v-flex>
              </v-layout>
            </template>
            <template v-slot:selection="data">
              {{ data.item | commaSeparated }} sq ft
            </template>
          </v-select>
        </v-flex>

        <!-- MAX -->
        <v-flex xs2 class="no-padding">
          <v-select
            v-model="searchQuery['maxArea']"
            :items="dropdownArea"
            background-color="white"
            append-icon
            box
            flat
            solo
            dense
            single-line
            full-width
            placeholder="Max Area"
            :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
          >
            <template v-slot:item="data">
              <v-layout
                d-flex
                align-center
                justify-start
                class="text-xs-left menu-item"
                :class="{'menu-item-selected': data.tile.props.value}"
              >
                <v-flex class="no-margin no-padding">
                  {{ data.item | commaSeparated }} sq ft
                </v-flex>
              </v-layout>
            </template>
            <template v-slot:selection="data">
              {{ data.item | commaSeparated }} sq ft
            </template>
          </v-select>
        </v-flex>
      </v-layout>
    </v-expand-transition>

    <!-- Expand Transition More Options opened by the button click -->
    <v-layout wrap>
      <!-- <v-flex xs12>
        <v-btn
          id="showMoreOptions"
          depressed
          color="black"
          @click="showMoreOptions = !showMoreOptions"
        >
          more options
          <v-icon v-if="showMoreOptions" small class="ml-2">
            arrow_upward
          </v-icon>
          <v-icon v-else small class="ml-2">
            arrow_downward
          </v-icon>
        </v-btn>
      </v-flex>-->

      <!-- BUTTON -->
      <v-flex xs12 class="text-xs-right pr-0">
        <v-btn
          id="searchButton"
          depressed
          color="black"
          class="white--text"
          @click="searchProperties"
        >
          Search
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- <template v-if="!isEmpty(getSearchObject['data'])">
      <v-layout id="extraSearchOptions" wrap>
        <v-flex xs12 sm6>
          <div class="select-field-label">
            View
          </div>
          <v-radio-group
            v-model="selectedLayout"
            row
            color="#4f4f4f"
            class="radio-group-layout"
          >
            <v-radio
              v-for="option in layoutOptions"
              :key="option.value"
              :label="option.text"
              :value="option.value"
              color="black"
            />
          </v-radio-group>
        </v-flex>

        <v-flex xs12 sm6 class="text-xs-right">
          <div class="select-field-label">
            Sort By:
          </div>
          <v-select
            v-model="sortByOption"
            class
            :items="sortOptions"
            v-bind="defaultSelectParameters"
            :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
          >
            <template v-slot:item="data">
              <v-layout
                d-flex
                align-center
                justify-start
                class="text-xs-left menu-item"
                :class="{'menu-item-selected': data.tile.props.value}"
              >
                {{ data.item.text }}
              </v-layout>
            </template>
          </v-select>
        </v-flex>
      </v-layout>
    </template>-->
  </v-container>
</template>

<script>
// import AutoCompleteLocation from '../search/AutoCompleteLocation.vue'
import { mapState } from 'vuex'
import {
  statusOptions,
  stateOptions,
  propertyOptions,
  subPropertyOptions,
  dropdownNoOfBeds,
  dropdownNoOfBaths,
  sortOptions,
  layoutOptions,
  INITIAL_SEARCH_QUERY
} from './searchPropertyConst.js'

export default {
  // components: { AutoCompleteLocation },
  filters: {
    commaSeparated(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },

  data() {
    return {
      searchQuery: { ...INITIAL_SEARCH_QUERY, maxArea: '', maxPrice: '' },
      statusOptions,
      propertyOptions,
      stateOptions,
      subPropertyOptions,
      dropdownNoOfBeds,
      dropdownNoOfBaths,
      sortOptions,
      layoutOptions,
      showMoreOptions: true
    }
  },

  computed: {
    ...mapState('common', ['lastRequestedQuery']),

    dropdownPrice() {
      var arr = []
      for (let i = 25000; i <= 200000; i += 25000) {
        arr.push(i)
      }
      for (let i = 200000; i <= 2000000; i += 50000) {
        arr.push(i)
      }
      arr.push(5000000)
      arr.push(10000000)
      return arr
    },

    dropdownArea() {
      let areaOptions = []
      for (let i = 200; i <= 2000; i += 200) {
        areaOptions.push(i)
      }
      for (let i = 2000; i <= 10000; i += 500) {
        areaOptions.push(i)
      }
      areaOptions.push(15000)
      areaOptions.push(20000)
      return areaOptions
    }
  },

  created() {
    this.searchQuery = Object.assign({}, this.lastRequestedQuery.query)
    // console.log('created called', this.lastRequestedQuery)
    // if (this.lastRequestedQuery && this.lastRequestedQuery.status) {
    //   if (this.lastRequestedQuery.query) {
    //     this.searchQuery = this.lastRequestedQuery.query
    //     this.setContinueQuery(false)
    //   }
    // }
  },

  methods: {
    // ...mapMutations('common', {
    //   setContinueQuery: 'SET_CONTINUE_QUERY'
    // }),

    /**
     * Handles the click event of Search button
     * Sends request to the server to retrieve data based
     * on the options entered
     */
    searchProperties() {
      /* The Search option allows an 'empty' search query and then it just shows all the listings
        from the page. The only thing we should check is that the min should be smaller than or equal to max. */

      const requestedQuery = {
        ...this.searchQuery,
        SqFt: `${this.searchQuery['LivingArea'] || '0'}-${this.searchQuery['maxArea'] || '10000'}`,
        Price: `${this.searchQuery['ListPrice'] || '0'}-${this.searchQuery['maxPrice'] || '10000000'}`
      }

      this.$emit('on-search-clicked', requestedQuery)
    }
  }
}
</script>

<style scoped lang='sass'>
#showMoreOptions
  border-radius: 0rem
  font-size: $hwayzFont1rem3
  text-transform: capitalize

#searchButton
  min-width: 24rem
  border-radius: 0rem
  height: 42px
  margin-right: 0
  font-weight: bold !important
  text-transform: capitalize

#extraSearchOptions
  margin-top: 1rem
  padding: 1rem

#extraSearchOptions .v-input--selection-controls
  margin-top: 0rem !important
  font-size: $hwayzFont1rem2 !important

.no-margin
  margin: 0

.no-padding
  padding: 0 !important

.menu-item
  margin: -0.5rem -1rem -0.5rem -1rem
  padding: 0.5rem 0.5rem 0.5rem 0.5rem
  border: transparent 0.2rem solid

.menu-item-selected
  border: #000 0.2rem solid !important
  color: #000

.search-container__input
  width: 100%
  padding: 0 12px
  height: 42px
  background: white
  border-left: $hwayzLightGray 1px solid !important
  outline: none

.label-link
  text-transform: uppercase
  cursor: pointer
  font-size: 16px

.select-field-label
  text-align: left
  color: $hwayzBorder
  font-size: 16px
  margin-bottom: 0.5rem

.radio-group-layout
  font-size: 1.2rem

</style>
