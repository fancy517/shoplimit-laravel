<template>
  <v-layout id="containerTableNavigation" align-end justify-start>
    <v-flex
      v-for="item in items"
      :key="item.value"
      shrink
      class="table-navigation__tab"
      :class="{'table-navigation__tab--active': active === item.value}"
      :style="{'width': `${60 / items.length}%`}"
      @click="setActive(item.value)"
    >
      <div class="tab">
        <v-icon
          v-if="item.icon"
          class="table-navigation__tab-icon white--text"
          :class="{'red--text': active === item.value}"
        >
          {{ item.icon }}
        </v-icon>
        <template v-else>
          <svg-icon :name="item.svgIcon" class="table-navigation__tab-icon" height="28" width="28" />
        </template>
        <span class="table-navigation__tab-label">{{ item.text }}</span>
      </div>
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

<style lang="sass" scoped>
.table-navigation__tab
  cursor: pointer
  text-align: center
  font-size: $hwayzFont1rem4
  border-radius: 0.9rem 0.9rem 0 0
  margin-right: 1rem
  margin-bottom: 2px
  /* Make this size relative */
  width: 20%
  min-width: 16rem
  background-color: $hwayzRed
  color: white
  height: 5rem
  padding-top: 1.2rem
  padding-bottom: 1rem
  display: table
  -webkit-box-shadow: -0.4rem -0.1rem 0.4rem -0.3rem rgba(179,179,179,1)
  -moz-box-shadow: -0.4rem -0.1rem 0.4rem -0.3rem rgba(179,179,179,1)
  box-shadow: -0.4rem -0.15rem 0.25rem -0.1rem rgba(200,200,200,1)

.table-navigation__tab--active
  background-color: white
  color: $hwayzRed
  padding-bottom: 1rem

.tab
  vertical-align: middle
  display: table-cell

.table-navigation__tab-icon
  color: inherit
  font-size: 28px
  margin-right: 1rem
  vertical-align: middle
</style>
