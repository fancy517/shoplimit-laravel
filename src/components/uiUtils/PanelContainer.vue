<template>
  <div class="panel-container__wrap">
    <div class="panel-container__title" :class="panelTitleClass">
      <v-icon color="white">
        {{ panelIcon }}
      </v-icon>
      <span>{{ panelTitle }}</span>
    </div>
    <div class="panel-container__content">
      <slot name="panel-content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    panelTitle: {
      type: String,
      required: true
    },
    panelIcon: {
      type: String,
      required: true
    },
    panelTitleClass: {
      type: String,
      required: false,
      default: () => 'hwyzPink-background'
    }
  }
}
</script>

<style scoped lang="sass">
.default-title-styles
  background: $hwayzNavigationTab

.panel-container__content
  position: relative
  padding: 4rem 0

.panel-container__title
  position: absolute
  text-transform: capitalize
  display: flex
  align-items: center
  border-radius: 0.5rem
  padding: 1rem 2rem
  min-width: 30rem
  text-align: left
  color: #fff
  user-select: none
  z-index: 1

.panel-container__title i
  font-size: 3rem

.panel-container__title span
  color: #fff
  padding-left: 1rem
  font-size: 1.4rem
</style>
