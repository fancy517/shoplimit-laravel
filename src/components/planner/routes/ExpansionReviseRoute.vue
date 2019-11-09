<template>
  <v-layout wrap>
    <v-flex
      xs12
      lg10
      xl8
    >
      <v-expansion-panel
        v-model="panel"
        class="planner-routes__container"
        expand
        readonly
      >
        <v-expansion-panel-content class="planner-routes__header">
          <v-icon slot="actions">
            keyboard_arrow_down
          </v-icon>
          <div slot="header" height="90px">
            <v-layout wrap>
              <v-flex
                xs12
                sm3
                md3
                style="color: #b02bc7;"
              >
                {{ 'Route' }}
              </v-flex>
              <v-flex xs10 sm6 md4>
                {{ routeDate }}
                <v-icon
                  slot="activator"
                  small
                  color="grey"
                  @click="onOpenModal"
                >
                  edit
                </v-icon>
              </v-flex>
              <v-flex xs2 sm3 md1>
                <v-btn
                  disabled
                  fab
                  small
                  color="pink"
                  class="planner-overview__fab"
                  @click.native.stop="$emit('remove-route-data', route)"
                >
                  <v-icon small color="white">
                    close
                  </v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs6 md2 class="text-center">
                <v-dialog v-model="openReviseRoute" max-width="1600px">
                  <v-btn
                    slot="activator"
                    color="#E91E63"
                    round
                    small
                    class="planner-routes__button"
                  >
                    REVISE ROUTE
                  </v-btn>
                  <!-- <revise-route-modal
                    :selected-route="route"
                    :saved-homes="savedHomes"
                    @save-and-close="openReviseRoute=false"
                  /> -->
                </v-dialog>
              </v-flex>

              <!-- Conditionally displaying Request Showing Button -->
              <v-flex
                v-if="showRequestShowingBtn"
                xs6
                md2
                class="text-center"
              >
                <v-btn
                  ref="requestShowing"
                  color="#00acc1"
                  round
                  small
                  class="planner-routes__button"
                >
                  REQUEST SHOWINGS
                </v-btn>
              </v-flex>

              <!-- Conditionally displaying Send Schedule Button -->
              <v-flex
                v-if="showSendScheduleBtn"
                xs6
                md2
                class="text-center"
              >
                <v-btn
                  color="#00acc1"
                  round
                  small
                  class="planner-routes__button"
                >
                  SEND SCHEDULE
                </v-btn>
              </v-flex>
            </v-layout>
          </div>
          <slot name="route-table-widget" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    routeDetails: {
      type: Array,
      required: true
    },
    savedHomes: {
      type: Array,
      required: true
    },
    onOpenModal: {
      type: Function,
      required: true
    },
    showRequestShowingBtn: {
      type: Boolean,
      required: true
    },
    showSendScheduleBtn: {
      type: Boolean,
      required: true
    },
    routeDate: {
      type: String,
      default: moment().format('MM-DD-YY')
    }
  },
  data() {
    return {
      panel: [true, true],
      openReviseRoute: false
    }
  }
}
</script>

<style scoped lang='sass'>
.planner-routes__container
  border-radius: 1.5rem 1.5rem 0rem 0rem
  box-shadow: none !important

.planner-routes__header
  border-radius: 1.5rem 1.5rem 0 0
  font-size: $hwayzFont1rem5

.layout
  align-items: center

.planner-routes__button
  font-size: 0.7em
  margin-top: 1rem !important

@media only screen and (min-width: 960px)
  .planner-routes__button
    margin: 0 !important

</style>
