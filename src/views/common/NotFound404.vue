<template>
  <div id="pageNotFound">
    <h1>404 Not Found</h1>This page will be custom made at later stage
    <h2>Page Not Found / Not created yet</h2>
    <v-btn color="primary" @click="redirectToProfileDashboard()">
      Go to Home page
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NotFound404',

  computed: {
    ...mapState('common', ['profileStatus', 'isMobile'])
  },

  methods: {
    redirectToProfileDashboard() {
      if (localStorage.getItem('profileStatus')) {
        switch (localStorage.getItem('profileStatus')) {
          case 'client':
            if (this.isMobile) this.$router.push({ name: 'client-schedule' })
            else this.$router.push({ name: 'client-dashboard' })
            break
          default:
            if (this.isMobile) this.$router.push({ name: 'agent-search' })
            else this.$router.push({ name: 'Task-Manager / Task-View' })
            break
        }
      } else {
        this.$router.push({ name: 'login' })
      }
    }
  }
}
</script>

<style>
#pageNotFound {
  padding: 10rem;
}
</style>
