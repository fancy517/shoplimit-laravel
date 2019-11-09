<template>
  <div class="client-detail__card">
    <div class="card-header">
      <div class="left">
        <div class="approval">
          <v-icon>check</v-icon>
          <p>Approval Letter</p>
        </div>
        <div class="details">
          <p>
            Goal Date:
            <br>
            <b>04/21/19</b>
          </p>
          <p>
            Price Range:
            <br>
            <b>$120-300k</b>
          </p>
        </div>
      </div>
      <div v-if="clientForCard" class="avatar">
        <v-avatar :color="colors[clientForCard.name[0]]">
          <img v-if="clientForCard.avatar" src="clientForCard.avatar" alt="John">
          <span v-else class="white--text headline">{{ clientForCard.name | initials }}</span>
        </v-avatar>
      </div>
      <slot name="close-button" />
    </div>
    <!-- Displaying the selected client details -->
    <template v-if="clientForCard">
      <div class="client-detail__title">
        {{ clientForCard.name }}
      </div>
      <p class="email">
        {{ clientForCard.email }}
      </p>
      <p
        class="phone"
        style="color: gray"
      >
        phone: {{ clientForCard.phone.replace(/^(\d{3})(\d{3})(\d{4}).*/,"$1.$2.$3") }}
      </p>
    </template>
    <!-- <div class="client-detail__buying-stage">
      <div class="client-detail__buying-stage--title">
        Homebuying Stage
      </div>
      <v-layout wrap>
        <v-flex
          v-for="(item, i) in homeBuyingStages"
          :key="i"
          xs12
          sm6
          md12
          lg6
          class="client-detail__buying-stage--name"
        >
          <v-icon
            :color="getStatusColor(homeBuyingStageColors)"
            small
          >
            {{ getStatusIcon(homeBuyingStageColors) }}
          </v-icon>
          <span>{{ item }}</span>
        </v-flex>
      </v-layout>
    </div> -->
    <div class="client-detail__wants text-left">
      <div>Wants:</div>
      <v-chip
        v-for="(item, i) in getClientHomePreferences('Want')"
        id="chips"
        :key="i"
        class="client-detail__chips"
        small
        color="green"
      >
        {{ item }}
      </v-chip>
    </div>
    <div class="client-detail__needs text-left">
      <div>Needs:</div>
      <v-chip
        v-for="(item, i) in getClientHomePreferences('Need')"
        id="chips"
        :key="i"
        class="client-detail__chips"
        small
        color="purple"
      >
        {{ item }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  status,
  homeBuyingStages,
  homeBuyingStageColors
} from './client-fake-data'

export default {
  filters: {
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
    clientDetailForCard: {
      type: Object,
      default: () => {
        return null
      }
    }
  },

  data() {
    return {
      homeBuyingStages,
      homeBuyingStageColors,
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
    ...mapState('agent', ['selectedClient']),

    clientForCard() {
      return this.clientDetailForCard
        ? this.clientDetailForCard
        : this.selectedClient
    }
  },
  methods: {
    /**
     * Returns the icon for home buying status
     *
     * @param {String} value Home buying status
     * @public
     */

    getStatusIcon(value) {
      if (value === status.GREEN) {
        return 'fiber_manual_record'
      } else {
        return 'radio_button_unchecked'
      }
    },
    /**
     * Returns the color of home buying status
     *
     * @param {String} value Home buying status
     * @public
     */
    getStatusColor(value) {
      if (value === status.GREEN) return 'green'
      else return 'orange'
    },

    /**
     * Returns home preferences that are added by client
     *
     * @param {string} preference 'Want' or 'Need'
     * @public
     */
    getClientHomePreferences(preference) {
      if (this.clientForCard && this.clientForCard.homePrefs) {
        return this.clientForCard.homePrefs.options
          .filter(pref => pref.wantNeed === preference)
          .map(item => {
            if (item.minValue) {
              return item.text + '-' + item.minValue
            }
            return item.text
          })
      }
      return []
    }
  }
}
</script>

<style scoped lang='sass'>
.client-detail__card
  margin-top: 2rem
  border-radius: 1.5rem
  box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2)
  padding: 4rem
  background-color: #fff
  position: relative
  text-align: center

.client-detail__title
  font-size: $hwayzFont1rem8
  margin-bottom: 1rem
  margin-top: 1rem
  text-transform: capitalize

.email
  color: $hwayzLink
  font-size: $hwayzFont1rem

.phone
  font-size: $hwayzFont1rem

.client-detail__icon
  border: 0.5px solid #999
  padding: 2rem
  border-radius: 100%

.client-detail__card p
  margin-bottom: 0.5rem

.client-detail__chips
  color: $hwayzWhite !important

.client-detail__buying-stage
  background-color: $hwayzfb
  border-radius: 1.5rem
  margin: 6rem 0
  padding: 2rem 15%

@media only screen and (max-width: 1280px)
  padding: 1rem 7%

.client-detail__buying-stage--title
  margin-bottom: 2rem
  font-size: $hwayzFont1rem2

.client-detail__buying-stage--name
  text-align: left !important
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  font-size: $hwayzFont1rem

.client-detail__buying-stage span
  display: inline-block
  margin-bottom: 1.3rem
  padding-left: 0.5rem
  font-size: $hwayzFont1rem !important
  color: $hwayzBlack

.client-detail__wants,
.client-detail__needs
  margin-bottom: 3rem
  height: 160px
  overflow: auto

#chips
  font-size: $hwayzFont0rem7

.card-header
  background-color: transparent
  display: grid
  grid-template-columns: 6fr 4fr 6fr
  grid-template-areas: "approval" "avatar" "details"
  border: 0

.approval
  grid-area: "approval"
  display: inline-flex
  align-self: center

.approval p
  // color: $hwayzLink
  margin-left: 5px
  font-size: $hwayzFont0rem8

.approval i
  font-size: 1.2em
  padding-bottom: 2.5%
  color: green

.avatar
  grid-area: "avatar"
  align-self: center

.details
  grid-area: "details"
  font-size: $hwayzFont0rem8
  justify-self: flex-end
  align-self: center

.details p
  display: flex

.corner
  position: absolute
  top: 15px
  right: 15px

@media only screen and (min-width: 960px)
  .client-detail__card
    margin-top: 0
    margin-bottom: 5rem
    padding: 2rem

  .client-detail__buying-stage
    margin: 0px

  .client-detail__buying-stage span
    font-size: $hwayzFont0em8

  #chips
    font-size: $hwayzFont0em8

</style>
