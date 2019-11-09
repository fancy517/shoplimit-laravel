<template>
  <v-menu
    id="menu"
    offset-y
    full-width
    nudge-bottom="20px"
    nudge-left="20px"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        id="buttonAccount"
        flat
        color="transparent"
        v-on="on"
      >
        <span class="black--text">{{ agentData ? agentData.name : null }}</span>
        <v-icon right color="#dddddd">
          account_circle
        </v-icon>
      </v-btn>
    </template>
    <v-list id="list" flat dense>
      <v-subheader>{{ agentData ? agentData.email : null }}</v-subheader>
      <v-divider />
      <v-list-tile
        v-for="(item, index) in menuItems"
        :key="index"
        v-ripple
        @click="item.callback"
      >
        <v-list-tile-avatar size="20">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-title>{{ item.text }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      menuItems: [
        {
          text: 'Account',
          icon: 'account_circle',
          callback: () => this.$router.push({ name: 'agent-account' })
        },
        {
          text: 'Log Out',
          icon: 'exit_to_app',
          callback: () => this.profileLogout()
        }
      ]
    }
  },

  computed: {
    ...mapState('agent', ['agentData'])
  },

  methods: {
    /**
     * Mapping logout action to this component
     */
    ...mapActions('common', ['profileLogout'])
  }
}
</script>

<style scoped lang='sass'>
#buttonAccount
  text-transform: none
  padding: 0 0.5rem
  @media only screen and (min-width: 600px)
    padding: 0rem 1rem

#buttonAccount span
  text-transform: capitalize

.v-menu__content
  border-radius: 5px

.v-list
  min-width: 200px

#list >>> .v-list__tile,
.v-subheader
  padding: 0 1rem
  height: 3rem
  font-size: $hwayzFont1rem2

.v-list__tile__title
  margin-left: -2rem

.v-avatar .v-icon
  font-size: $hwayzFont1rem8 !important

.v-divider
  margin: 0

</style>
