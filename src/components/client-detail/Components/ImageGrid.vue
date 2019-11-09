<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex  v-for="(image, index) in images"  :key="index" :data-index="index" xs4>
          <img 
            v-lazy="image.src" 
            style="height: 100px; width: 180px; object-fit: contain; " 
            @click="openGallery(index)"
          >
          
      </v-flex>
      <LightBox :images="images"         
        ref="lightbox"
        :show-caption="true"
        :show-light-box="false"></LightBox>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import LightBox from 'vue-image-lightbox'
export default {
  components: {
    LightBox
  },
  props: {
    srcarr: {
      type: Array,
      default: false
    },
  },
   methods: {
    openGallery(index) {
      this.$refs.lightbox.showImage(index)
    },
    open (e) {
      fancyBox(e.target, this.imageList);
    }
  },
  created: function(){
    for(var x in this.srcarr) {
      this.images.push({
        thumb: this.srcarr[x],
        src: this.srcarr[x]
      });
    }
    console.log(this.images);
  },
  data: () => ({
    size: 'xl',
    images: []
    // images: [
    //     {
    //       thumb: 'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
    //       src: 'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
    //       caption: '<h4>Elephant</h4>',
    //     },
    //     {
    //       thumb: 'https://i-kinhdoanh.vnecdn.net/2018/06/18/1-1529296929_680x0.jpg',
    //       src: 'https://i-kinhdoanh.vnecdn.net/2018/06/18/1-1529296929_680x0.jpg',
    //       caption: '<h4>Messi</h4>',
    //     },
    //     {
    //       thumb: 'https://i-thethao.vnecdn.net/2018/05/27/775162441-MR-2031-8E033EFCEBB928DC12A2A0AA3CEC4C33-21885-1527376486_680x0.jpg',
    //       src: 'https://i-thethao.vnecdn.net/2018/05/27/775162441-MR-2031-8E033EFCEBB928DC12A2A0AA3CEC4C33-21885-1527376486_680x0.jpg',
    //       caption: '<h4>Bale and Marcelo</h4>',
    //     },
    //     {
    //       thumb: 'https://i-thethao.vnecdn.net/2018/05/27/Screen-Shot-2018-05-27-at-7-1527379562_680x0.png',
    //       src: 'https://i-thethao.vnecdn.net/2018/05/27/Screen-Shot-2018-05-27-at-7-1527379562_680x0.png',
    //       caption: '<h4>Madrid crowd</h4>',
    //     }
    // ]
  })
}
</script>

<style>
.vue-lb-container {
  background-color: rgba(3,3,3,0.55) !important;
}
</style>