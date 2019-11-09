<template>
  <v-card class="revise-route__card">
    <v-flex xs12 style="font-size: 2rem;">
      Revise for {{ selectedRoute.name }}
    </v-flex>
    <hr style="border-top: 2px solid #ccc; margin: 2rem -4rem">
    <v-layout wrap>
      <v-flex xs12 md8>
        <div style="color: #FF9800" class="text-left">
          Selected homes for {{ selectedRoute.name }}
        </div>
        <hr style="border-top: 1px solid #FF9800; margin-top: 0rem;">

        <!-- chosen date and date selector -->
        <div class="revise-route__header">
          <v-layout wrap>
            <v-flex
              xs12
              lg6
              class="text-xs-left"
              style="padding: 0 !important; margin-bottom: 1rem;"
            >
              <v-icon color="pink" medium>
                calendar_today
              </v-icon>
              <span style="font-size: 1.2rem; color: #909090;">Client Suggested Date</span>
              <span style="font-size: 1.2rem; padding-left: 1rem;">{{ selectedRoute.timestamp }}</span>
            </v-flex>
            <v-flex xs12 lg6 style="padding: 0 !important;">
              <v-layout wrap>
                <v-flex xs3 style="line-height: 4rem;">
                  <span style="font-size: 1.2rem; color: #909090;"> Chosen Date</span>
                </v-flex>
                <v-flex xs6 class="text-xs-right">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="date"
                    lazy
                    transition="scale-transition"
                    offset-y
                  >
                    <v-text-field
                      slot="activator"
                      v-model="date"
                      style="padding-top: 0rem"
                      readonly
                    />
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer />
                      <v-btn flat color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex
                  xs3
                  class="text-xs-left"
                >
                  <v-btn
                    color="pink"
                    small
                    style="font-size: .9em; margin-top: 1rem;"
                  >
                    Set Date
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>

        <!-- Name of Route and adding route header -->
        <div class="revise-route__header">
          <v-layout wrap>
            <v-flex xs4 class="text-xs-left" style="padding: 0 !important;">
              <v-icon color="pink" medium>
                home
              </v-icon>
              <span style="font-size: 1.4rem; color: #999;">Name Route</span>
            </v-flex>
            <v-flex xs8>
              <input
                id="routeName"
                type="text"
                name="routeName"
                :value="selectedRoute.name"
                disabled
              >
            </v-flex>
          </v-layout>
        </div>

        <!-- Displaying the homes table currently associated with this route -->
        <div class="revise-route__table">
          <v-layout wrap>
            <v-flex xs12 md10>
              <v-data-table
                :headers="homesForCurrentRoute"
                :items="selectedRoute.home_address"
                item-key="selectedRoute.home_address.id"
                hide-actions
              >
                <template v-slot:items="props">
                  <td class="text-left">
                    {{ getHouseNameById(props.item.home_id) }}
                  </td>
                  <td class="text-left">
                    {{ props.item.time }}
                  </td>
                  <td>
                    <v-btn
                      fab
                      small
                      color="pink"
                      class="planner-overview__fab"
                    >
                      <v-icon small color="white">
                        close
                      </v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </div>
        <hr>

        <!-- adding a home from MLS row -->
        <v-layout wrap class="revise-route__header pl-md-5 mt-3">
          <v-flex xs8 md5>
            <input
              id="mlsAddress"
              type="text"
              name="mlsAddress"
              placeholder="Address from MLS"
            >
          </v-flex>
          <v-flex xs8 md5>
            <input
              id="mlsNum"
              type="text"
              name="mlsNum"
              placeholder="MLS#"
            >
          </v-flex>
          <v-flex xs4 md2>
            <v-btn color="pink" small style="font-size: 1.2rem; margin-top: -.5rem;">
              Add Home
            </v-btn>
          </v-flex>
        </v-layout>

        <!-- the bottom button row -->
        <v-layout wrap class="revise-route__footer-btn">
          <v-flex xs6 sm4>
            <v-btn color="#00ACC1" round class="revise-route__btn-set">
              Calculate Route
            </v-btn>
          </v-flex>
          <v-flex xs6 sm4>
            <v-btn
              slot="activator"
              color="#51D16F"
              round
              class="revise-route__btn-set"
              @click.native.stop="$emit('save-and-close')"
            >
              Save Route
            </v-btn>
          </v-flex>
          <v-flex xs12 sm4>
            <v-btn color="#FF9800" round class="revise-route__btn-set">
              Request Showings
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        xs8
        offset-xs2
        md4
        offset-md0
        class="revise-route__map mt-lg-0 mt-sm-5"
      >
        <img src="/img/plan-route-map.png" alt="Plan Route Map">
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    selectedRoute: {
      type: Object,
      required: true
    },
    savedHomes: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    homesForCurrentRoute: [
      { text: 'Home Address', value: 'address', width: '70%', sortable: false },
      { text: 'ETA', value: 'time', width: '25%', sortable: false },
      { text: 'Actions', value: 'actions', width: '10%', sortable: false }
    ]
  }),

  methods: {
    getHouseNameById(houseId) {
      let houseObject = this.savedHomes.filter(home => home.id === houseId)
      return houseObject[0].address
    }
  }
}
</script>

<style>
.revise-route__card {
  padding: 2rem;
}

.revise-route__header {
  font-size: $hwayzFont0rem9;
}

.revise-route__header .row {
  align-items: center;
}

.revise-route__header button {
  font-weight: 300 !important;
}

.revise-route__card .v-text-field input{
  padding: .5rem 0 0 !important;
  font-size: 1.4rem;
}

#routeName,
#mlsAddress,
#mlsNum {
  border-bottom: .1rem solid $hwayz9s;
  width: 100%;
  height: 3rem;
  font-size: 1.2rem;
  outline: none;
}

.v-text-field__slot {
  font-size: 1.2rem;
}

.revise-route__btn-set {
  color: $hwayzWhite !important;
  font-size: $hwayzFont1rem5 !important;
}

.revise-route__card .v-date-picker-table .v-btn {
  color: rgba(0, 0, 0, 0.87) !important;
}

#dateChangerModal .v-date-picker-table .v-btn--active {
  color: $hwayzWhite !important;
}

.revise-route__table {
  margin-top: 6rem;
  padding: 2rem;
}

.revise-route__home {
  padding-left: 2rem;
}

.v-table {
  background-color: transparent !important;
}

.revise-route__footer-btn {
  margin-top: 4rem;
  margin-left: auto;
  margin-right: auto;
}

.revise-route__footer-btn .v-btn {
  font-weight: 300;
  padding: 0 4rem !important;
  text-transform: none;
  margin-bottom: 2rem !important;
  height: 4rem;
}

.revise-route__map img {
  padding: 2rem;
  height: 100%;
  width: 100%;
}

@media only screen and (min-width: 600px) {
  .revise-route__footer-btn .v-btn {
    margin-bottom: 0 !important;
  }
}

@media only screen and (min-width: 960px) {
  .revise-route__footer-btn .v-btn {
    padding: 0 4rem !important;
  }

  .revise-route__card {
    padding: 4rem;
  }
}

@media only screen and (min-width: 1264px) {
  .revise-route__footer-btn {
    max-width: 80rem;
  }
}
</style>
