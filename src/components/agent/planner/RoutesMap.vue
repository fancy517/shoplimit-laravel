<template>
    <html>
        <head>
            <meta charset='utf-8' />
            <title>Display a map</title>
            <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
        </head>
        <body>
            <div id='map'></div>
        </body>
    </html>
</template>

<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.js'></script>
<script>
import mapboxgl from 'mapbox-gl'

export default {

    mounted() {
        this.createMap()
    },

    methods: {
        createMap: function () {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYWRyaWFuLWZpbmdlcm1hcmsiLCJhIjoiY2pxenFicTkyMGg0YjN5bHN2azhhamluYSJ9.9zJow4qUHlgZ9LVVKZ6pGw';

            // init the map
            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                minzoom: 1.3,
                center: [-74.0073, 40.7124], // Manhattan
                zoom: 16
            })

            this.map.addControl(new mapboxgl.NavigationControl());
        }
    }

}
</script>

<style lang="sass">
@import url(https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css)
body
  margin: 0
  padding: 0
#map
  position: absolute
  width: 30%
  height: 75%
  margin: 3.5% 2%
.marker
  background-image: url('/logo.png')
  background-size: cover
  width: 50px
  height: 50px
  border-radius: 50%
  cursor: pointer

</style>
