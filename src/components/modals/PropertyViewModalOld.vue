<template>
  <v-dialog v-model="showModal" :width="modal.large_width" :max-width="modal.large_maxWidth">
    <v-card class="property-view-modal__container">
      <v-icon class="property-view-modal__close" @click.stop="$emit('close-modal', false)">
        close
      </v-icon>
      <v-container v-if="homeInfo">
        <v-carousel hide-delimiters height="400" dark :cycle="false">
          <v-carousel-item
            v-for="(image, index) in getImages"
            :key="index"
            :src="image"
            :lazy-src="`https://picsum.photos/10/6?image=10`"
          />
        </v-carousel>
      </v-container>
      <!-- HOME DATA -->
      <v-container v-if="homeInfo" id="containerData">
        <v-layout id="layoutData" row wrap class="elevation-3">
          <!-- HEADER ROW -->
          <v-flex xs12 class="text-xs-left data-header">
            {{ homeInfo['Address'] }}, {{ homeInfo['City'] }}
            <br>
            $ {{ homeInfo['ListPrice'] | kNumber }}
          </v-flex>
          <!-- DATA ROWS -->
          <!-- We can specify how many pairs we want to see in a single row. -->
          <v-flex
            v-for="(pair, index) in itemPairs"
            :key="index"
            xs4
            :md2="nPerRow === 6"
            :md3="nPerRow === 4"
            :md4="nPerRow === 3"
            :md6="nPerRow === 2"
            class="item-pair"
            :class="{'text-xs-left': index%nPerRow === 0 || windowWidth < 960, 'text-xs-right': index%nPerRow === nPerRow-1 && windowWidth >= 960}"
          >
            {{ pair.text }}
            <b>{{ pair.value }}</b>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  filters: {
    kNumber(val) {
      return (val / 1000).toString() + 'K'
    }
  },
  props: {
    homeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalShowing: false,
      nPerRow: 3
    }
  },

  computed: {
    ...mapState('home', ['windowWidth']),
    ...mapState('style', ['modal']),
    nOfRows() {
      var temp = Number.parseInt(this.itemPairs.length / this.nPerRow)
      return this.itemPairs.length % this.nPerRow > 0 ? temp + 1 : temp
    },

    itemPairs() {
      if (this.homeInfo) {
        return [
          { text: 'Type', value: this.homeInfo['PropertyType'] },
          { text: 'Size', value: `${this.homeInfo['SqftTotal']} SqFt` },
          {
            text: 'Rooms',
            value: `${this.homeInfo['BedsTotal']} Beds + ${
              this.homeInfo['BathsTotal']
            } Baths`
          },
          { text: 'MLS#', value: this.homeInfo['MLSNumber'] },
          { text: 'Year Built', value: this.homeInfo['YearBuilt'] },
          { text: 'Living Rooms', value: this.homeInfo['NumLiving'] }
        ]
      }
      return {}
    },

    getImages() {
      if (this.homeInfo['Images']) return this.homeInfo['Images']
      return ['/img/sample-placeholder.jpg']
    }
  }
}
</script>

<style lang="sass" scoped>

*
  box-sizing: border-box

.property-view-modal__container
  padding: 1.5rem 5rem

.property-view-modal__close
  @extend %modal__button-close, %disable-selection

#containerData
  margin-top: 2rem

.data-header
  background-color: $hwayzDarkerGray
  color: #fff
  padding: 1rem 2rem !important

.data-header-fill
  background-color: $hwayzDarkerGray

.item-pair
  padding: 1rem 2rem !important
  color: $hwayzDarkerGray
</style>
