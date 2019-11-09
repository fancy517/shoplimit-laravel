<template>
  <v-layout id="plannerTabNavigation" align-end justify-start>
    <v-flex
      v-for="item in items"
      :key="item.value"
      shrink
      class="planner-tab-navigation__tab"
      :class="{'planner-tab-navigation__tab--active': active === item.value}"
      :style="{'width': `${100 / items.length}%`}"
      @click="setActive(item.value)"
    >
      <v-icon
        v-if="item.icon"
        class="planner-tab-navigation__tab-icon white--text"
        :class="{'red--text': active === item.value}"
      >
        {{ item.icon }}
      </v-icon>
      <template v-else>
        <svg-icon :name="item.svgIcon" class="planner-tab-navigation__tab-icon" :height="item.size" :width="item.size" />
      </template>
      <span class="planner-tab-navigation__tab-label">{{ item.title }}</span>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      active: 0
    }
  },
  methods: {
    setActive(val) {
      this.active = val
      this.$emit('tab-changed', val)
    }
  }
}
</script>

<style scoped lang="sass">
.planner-tab-navigation__tab
  background-color: $hwayzNavigationTab
  color: $hwayzWhite
  border-radius: 0.9rem 0.9rem 0 0
  cursor: pointer
  text-align: center
  height: 5rem

.planner-tab-navigation__tab:not(:last-child)
  margin-right: 1rem

.planner-tab-navigation__tab--active
  background-color: $hwayzWhite
  color: $hwayzNavigationTab
  -webkit-box-shadow: 0.2rem -0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  -moz-box-shadow: 0.2rem -0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)
  box-shadow: 0.2rem -0.2rem 0.5rem -0.2rem rgba(0, 0, 0, 0.3)

.planner-tab-navigation__tab-icon
  color: inherit
  font-size: $hwayzFont2rem
  margin-right: 1rem
  vertical-align: middle

.planner-tab-navigation__tab-label
  line-height: 5rem
</style>
