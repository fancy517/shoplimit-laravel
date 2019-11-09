<template>
  <div class="my-menu">
    <v-autocomplete
      v-model="modelLocations"
      :items="locations"
      item-text="cityName"
      item-value="cityName"
      :search-input.sync="autocompleteInputValue"
      background-color="white"
      placeholder="City, Area, Zip, or Address"
      append-icon=""
      :flat="options.flat"
      box
      solo
      dense
      single-line
      chips
      multiple
      reverse
      hide-no-data
      :menu-props="{maxHeight: 300}"
      @change="locationsChanged"
    >
      <template v-slot:selection="data">
        <span
          v-if="data.index === ((modelLocations.length -1) - numberOfVisibleChips)"
          class="grey--text caption"
        >
          (+{{ modelLocations.length - numberOfVisibleChips }} others)
        </span>
        <v-chip
          v-if="data.index > ((modelLocations.length -1) - numberOfVisibleChips) && data.index < modelLocations.length"
          :selected="data.selected"
          label
          small
          outline
          color="#d9d9d9"
        >
          <span class="black-text">
            {{ data.item.cityName }}
          </span>
          <v-icon class="close-icon" right @click="remove(data)">
            close
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template>
          <v-list-tile-content :class="{'menu-item-selected': data.tile.props.value}">
            <v-container class="no-margin no-padding">
              <v-layout>
                <v-flex xs6 class="no-padding text-xs-left">
                  {{ data.item.cityName }}
                </v-flex>
                <v-spacer />
                <v-flex xs6 class="no-padding text-xs-right">
                  {{ data.item.countryName }}
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 class="no-padding text-xs-left">
                  <v-list-tile-sub-title>
                    {{ data.item.amount | dotNumber }} averaging ${{ data.item.avgPrice | kNumber }}
                  </v-list-tile-sub-title>
                </v-flex>
              </v-layout>
            </v-container>
          </v-list-tile-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  filters: {
    dotNumber(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    kNumber(val) {
      return (val / 1000).toString() + 'K'
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      autocompleteInputValue: '',
      numberOfVisibleChips: 4,
      modelLocations: [],
      locations: [
        { cityName: 'Dallas', countryName: 'USA', amount: 10633, avgPrice: 448000 },
        { cityName: 'Tarrant', countryName: 'USA', amount: 12002, avgPrice: 450000 },
        { cityName: 'Travis', countryName: 'USA', amount: 11012, avgPrice: 450000 },
        { cityName: 'Collin', countryName: 'USA', amount: 9000, avgPrice: 450000 },
        { cityName: 'Denton', countryName: 'USA', amount: 8782, avgPrice: 450000 },
        { cityName: 'Houston', countryName: 'USA', amount: 13123, avgPrice: 450000 }
      ]
    }
  },
  methods: {
    remove (data) {
      /* Because we replaced the default close button with ours, we aren't using deletable chips so we
        have to remove the location manually from modelLocations in the case of button press. */
      const index = this.modelLocations.findIndex((elem) => elem === data.item.cityName)
      if (index !== -1) {
        this.modelLocations.splice(index, 1)
      }
      this.$emit('locations-changed', this.modelLocations)
    },
    locationsChanged(arr) {
      this.$emit('locations-changed', this.modelLocations)
      // Reset the user input
      this.autocompleteInputValue = null
    }
  }
}
</script>

<style scoped>
.no-margin{
  margin: 0;
}

.no-padding{
  padding: 0 !important;
}

.black-text{
  color: #000;
}

.close-icon{
  color: #d9d9d9;
  font-size: 10pt !important;
  font-weight: bold;
  cursor: pointer;
}

.menu-item-selected{
  font-weight: bold;
  color: #000;
  border: none !important;
}
</style>
