<template>
  <v-container id="mainCalendar" class="pa-0" fill-height>
    <v-layout wrap align-content-start fill-height>
      <v-flex
        xs12
        class="desc-text hwayzGray text-xs-center pa-3"
      >
        Today, you have {{ todayRoutes }} routes.
      </v-flex>
      <v-flex
        v-for="event in schedule"
        :key="event.id"
        v-ripple
        xs12
        class="row-event"
        @click="$emit('click-to-expand')"
      >
        <v-layout align-center class="pa-3">
          <v-flex class="text-xs-left">
            <div>{{ event.date }}&nbsp;{{ event.time }}</div>
            <div class="hwayzGray">
              {{ event.showingsLength }}&nbsp;showings
            </div>
          </v-flex>
          <v-flex shrink>
            <v-icon>chevron_right</v-icon>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    allRoutesShowing: true,
    singleRouteShowing: false,
    todayRoutes: 4,
    schedule: [
      { id: 0, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 },
      { id: 1, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 },
      { id: 2, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 },
      { id: 3, date: 'Friday 12.03.19', time: '2.00PM', showingsLength: 4 }
    ]
  })
}
</script>

<style lang="sass" scoped>
.row-event
  font-size: 1.8rem
  height: fit-content;
  background-color: #f5f5f5
  border-bottom: solid 4px #fff
  .v-icon
    font-size: 3.5rem !important

.desc-text
    font-size: 1.8rem

.hwayzGray
  color: $hwayzDarkGray
</style>
