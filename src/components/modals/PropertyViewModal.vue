<template>
  <v-dialog v-model="showModal" :width="modal.xlarge_width" :max-width="modal.xlarge_maxWidth">
    <v-card class="property-view-modal__container">
      <v-icon class="property-view-modal__close" @click.stop="$emit('close-modal', false)">
        close
      </v-icon>
      <detail-property-view v-if="homeInfo" :key="homeInfo._id" :property-object-id="homeInfo._id" />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import DetailPropertyView from '../search/property_view/DetailPropertyView.vue'

export default {
  components: { DetailPropertyView },
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
      modalShowing: false
    }
  },

  computed: {
    ...mapState('style', ['modal'])
  }
}
</script>

<style lang="sass" scoped>

*
  box-sizing: border-box

.property-view-modal__container
  padding: 1.5rem 5rem
  min-height: 60vh

.property-view-modal__close
  @extend %modal__button-close, %disable-selection

#containerData
  margin-top: 2rem

.data-header
  background-color: $hwayzDarkerGray
  color: hwayzWhite
  padding: 1rem 2rem !important

.data-header-fill
  background-color: $hwayzDarkerGray

.item-pair
  padding: 1rem 2rem !important
  color: $hwayzDarkerGray
</style>
