<template>
  <div id="map" :key="mapKey">
    <gmap-map
      ref="routeMap"
      :center="center"
      :zoom="mapZoom"
      :style="{width: '95%', height: mapHeight}"
    >
      <gmap-marker
        v-for="(m, index) in latLgnMarkers"
        :key="index"
        :position="m.position"
        :draggable="true"
      />
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  props: {
    latLgnMarkers: {
      type: Array,
      required: true
    },
    returnedRoute: {
      type: Object,
      default: () => {}
    },
    mapHeight: {
      type: String,
      default: '350px'
    },
    mapZoom: {
      type: Number,
      default: 8
    }
  },

  data() {
    return {
      center: { lat: this.latLgnMarkers[0].position.lat, lng: this.latLgnMarkers[0].position.lng },
      directionsDisplay: null,
      mapKey: 0
    }
  },

  watch: {
    latLgnMarkers: function() {
      this.mapKey++
    },

    returnedRoute(newValue, oldValue) {
      if (newValue) {
        if (!oldValue) {
          this.directionsDisplay.setMap(this.$refs.routeMap.$mapObject)
        }
        let includedWaypoints = newValue.routes[0].waypoint_order.map(point => point)
        let waypointToBeRemoved = -1
        for (let i = 0; i < newValue.routes[0].legs.length; i++) {
          if (!includedWaypoints.includes(i)) waypointToBeRemoved = i
        }

        newValue.routes[0].legs.splice(waypointToBeRemoved, 1)
        this.directionsDisplay.setDirections(newValue)
      } else {
        this.directionsDisplay.setMap(null)
      }
    }
  },

  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.$refs.routeMap && this.$refs.routeMap.$mapPromise.then(() => {
        this.initMap()
      })
    })
  },

  methods: {
    initMap() {
      // console.log('map loaded>>>', this.latLgnMarkers)
      // eslint-disable-next-line
      this.directionsDisplay = new google.maps.DirectionsRenderer()
      this.directionsDisplay.setMap(this.$refs.routeMap.$mapObject)
    }
  }
}
</script>

<style lang="sass" scoped>
    #map
        position: relative
        width: 100%
        height: 200px
</style>
