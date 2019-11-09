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
        <v-expansion-panel-content
          class="planner-routes__header"
        >
          <v-icon slot="actions">
            keyboard_arrow_down
          </v-icon>
          <div slot="header" height="90px">
            <v-layout wrap>
              <v-flex
                xs7
                order-xs1
                sm4
                order-sm1
                md2
                order-md1
                style="color: #b02bc7;"
              >
                Pending Route
              </v-flex>
              <v-flex
                xs12
                order-xs4
                sm7
                order-sm2
                md4
                order-md2
              >
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
              <v-flex
                xs4
                order-xs2
                sm4
                order-sm4
                md1
                order-md3
                style="color: #ff9800;"
              >
                pending
              </v-flex>
              <v-flex
                xs1
                order-xs3
                sm1
                order-sm3
                md1
                order-md4
              >
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
              <v-flex
                xs6
                sm8
                md2
                order-5
                class="text-center"
              >
                <v-btn
                  color="#00acc1"
                  round
                  small
                  class="planner-routes__button"
                >
                  REQUEST SHOWINGS
                </v-btn>
              </v-flex>
            </v-layout>
          </div>
          <v-card>
            <v-layout wrap>
              <v-flex xs12 md8 class="p-3">
                <v-data-table
                  :headers="routeTableHeaders"
                  :items="routeDetails"
                  item-key="id"
                  hide-actions
                >
                  <template v-slot:headers="props">
                    <tr>
                      <th
                        v-for="column in props.headers"
                        :key="column.name"
                        class="text-xs-center"
                      >
                        {{ column.text }}
                      </th>
                    </tr>
                  </template>
                  <template v-slot:items="props">
                    <tr>
                      <td class="text-xs-center">
                        {{ getHomeDetails(props.item.propertyId)['Address'] }}
                      </td>
                      <td class="text-xs-center">
                        {{ getETATimeFormat(props.item.scheduled) || 'pending' }}
                      </td>
                      <td class="text-xs-center" style="text-transform: capitalize;">
                        pending
                      </td>
                      <td class="text-xs-center">
                        <v-btn
                          disabled
                          fab
                          small
                          color="pink"
                          class="planner-overview__fab"
                          @click.native.stop="$emit('remove-house-data', {selectedHome: props.item, route})"
                        >
                          <v-icon small color="white">
                            close
                          </v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 md4>
                <div class="hidden-sm-and-down planner-routes__map p-5">
                  <img src="/img/map.png" alt="map">
                </div>
              </v-flex>
            </v-layout>
          </v-card>
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
    routeDate: {
      type: String,
      default: moment().format('MM-DD-YYYY')
    }
  },
  data() {
    return {
      routeTableHeaders: [
        { text: 'Home Address', value: 'address' },
        { text: 'Time', value: 'time' },
        { text: 'Status', value: 'status' },
        { text: '', value: 'action' }
      ],
      panel: [true]
    }
  },

  methods: {
    /**
     * Retrieve home details based on home id
     */
    getHomeDetails(homeId) {
      if (this.savedHomes) {
        const foundHome = this.savedHomes.filter(
          home => home._id === homeId
        )
        if (foundHome[0]) {
          return foundHome[0]
        }
      }
      return homeId
    },

    /**
     * Get expected time of arrival for the scheduled property
     */
    getETATimeFormat(scheduled) {
      if (scheduled) {
        return moment(scheduled).format('hh:mm a')
      }
      return null
    },

    /**
     * Create Route details
     */
    getRouteDetails(viewings) {
      const filteredViewings = viewings.filter(viewing => {
        return (
          moment(this.date).format('YYYY-MM-DD') ===
          moment(viewing.scheduled).format('YYYY-MM-DD')
        )
      })

      console.log(this.getUniqueArrayObject(filteredViewings, 'propertyId'))
      return null
    },

    getUniqueArrayObject(arrayObject, comparingParam) {
      return arrayObject.filter((element, index, final) => final.findIndex(v => {
        let elementTime = moment(element['scheduled'])
        let vTime = moment(v['scheduled'])
        return (v[comparingParam] === element[comparingParam] && elementTime.isSame(vTime))
      }) === index)
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
  font-size: .7em
  margin-top: 1rem !important

.planner-routes__map img
  max-width: 100%
  height: auto

@media only screen and (min-width: 960px)
  .planner-routes__button
    margin: 0 !important

</style>
