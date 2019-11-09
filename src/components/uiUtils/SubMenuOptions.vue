<template>
  <div>
    <slot name="menu-title" />
    <v-list-tile
      v-for="option in menuOptions"
      :key="option.link"
      ripple
      class="sub-menu-options__navigation-link"
      :class="{'sub-menu-options__active': currentRoute === option.link}"
      :to="{name: option.link}"
      @click="$emit('link-clicked')"
    >
      <v-list-tile-action v-if="option.icon">
        <v-icon>{{ option.icon }}</v-icon>
      </v-list-tile-action>

      <v-list-tile-content>
        <v-list-tile-title>{{ option.text }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </div>
</template>

<script>
export default {
  props: {
    currentRoute: {
      type: String,
      required: true
    },
    menuOptions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="sass">
.sub-menu-options__navigation-link .v-list__tile
  height: 4rem !important
  line-height: 4rem
  font-weight: 400 !important
  padding-left: 40%
  margin-left: -25px !important

.sub-menu-options__active
  background-color: $hwayzLinkWater !important
</style>
