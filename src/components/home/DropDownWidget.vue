<template>
  <v-expansion-panel v-model="panelIndex" :value="panelIndex" class="header">
    <v-expansion-panel-content class="header" :style="headerStyle">
      <!-- White arrow in the top right corner. -->
      <template v-slot:actions>
        <v-icon color="white">
          {{ $vuetify.icons.expand }}
        </v-icon>
      </template>
      <!-- Widget header - Name and number of rows. -->
      <template v-slot:header>
        <div class="text-aligner">
          <span class="notification-bubble">{{ numberOfRows }}</span>
          {{ title }}
        </div>
      </template>
      <!-- Widget content - This is the slot we fill with content. Could be anything. -->
      <v-card>
        <slot name="widget-content" />
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'SAMPLE TITLE'
    },
    numberOfRows: {
      type: Number,
      required: true
    },
    headerStyle: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Number,
      default: () => -1
    }
  },
  data() {
    return {
      panelIndex: this.isOpen
    }
  },
  watch: {
    panelIndex() {
      if (this.panelIndex !== this.isOpen) {
        this.onPangelStateChange()
      }
    },
    isOpen() {
      this.panelIndex = this.isOpen
    }
  },
  methods: {
    onPangelStateChange() {
      this.$emit('on-open')
    }
  }
}
</script>

<style lang="sass" scoped>
// .v-expansion-panel
//   box-shadow: none !important

.header
  border-radius: 1.5rem 1.5rem 0 0
  text-align: center

.text-aligner
  text-align: left
  margin-left: 35%

@media screen and (max-width: 992px)
  .text-aligner
    text-align: left
    margin-left: 30%

.notification-bubble
  height: 3.2rem
  width: 3.2rem
  background-color: $hwayzWhite
  color: $hwayzDarkerGray
  border-radius: 50%
  display: inline-block
  line-height: 3.2rem
  margin-right: 1rem
  text-align: center
</style>
