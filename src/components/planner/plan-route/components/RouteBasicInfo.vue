<template>
  <div v-if="routeObject" class="route-info">
    <div class="route-name">
      {{ routeObject.name.toUpperCase() }}
    </div>
    <div :class="[routeObject.state, 'route-name', 'mb-5']">
      {{ routeObject.state.toUpperCase() }}
    </div>
    <div class="route-info-row">
      <div class="mr-4">
        <span>Date:</span> {{ routeObject.startTime | dateFormat }}
      </div>
      <div>
        <span>Time:</span> {{ routeObject.startTime | timeFormat }}
      </div>
    </div>
    <div class="route-info-row mb-5">
      <span>Start Location:&nbsp;</span> {{ routeStart }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  filters: {
    dateFormat: (value) => {
      return moment(value).format('MM/DD/YYYY')
    },
    timeFormat: (value) => {
      return moment(value).format('hh:mm A')
    }
  },
  props: {
    routeObject: {
      type: Object,
      required: true
    },
    routeStart: {
      required: true,
      validator: prop => typeof prop === 'string' || prop === null
    }
  },

  created() {
    console.log('RouteBasicInfo.vue >>>', this.routeObject)
  }
}
</script>

<style lang="sass" scoped>
.route-info
  margin: 0 auto

.route-info-row
  padding: 1.5rem
  display: flex
  flex-flow: row
  justify-content: center
  align-items: center
  font-size: $hwayzFont1rem4
  span
    color: $hwayz9

.house-section
  padding: 2rem

.route-name
  margin-bottom: 2.5rem
</style>
