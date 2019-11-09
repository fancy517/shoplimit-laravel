<template>
  <v-container>
    <div class="logo-container">
      <img src="/img/logo.png" alt="Homewayz-Logo">
    </div>
    <v-layout wrap>
      <v-flex
        xs12
        sm10
        offset-sm1
        md8
        offset-md2
        lg6
        offset-lg3
      >
        <router-view :key="currentPath" :auth-route="currentPath" />
        <v-snackbar v-model="showAlert" :timeout="6000" :top="true">
          {{ authError }}
          <v-btn flat color="pink" @click="showAlert = false">
            Close
          </v-btn>
        </v-snackbar>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    showAlert: false,
    currentPath: '',
    formTitle: ''
  }),

  computed: {
    authError() {
      return this.$store.getters.authError
    }
  },

  watch: {
    '$route'(to, from) {
      this.currentPath = to.name
    }
  },

  mounted() {
    this.currentPath = this.$router.currentRoute.name
  }
}
</script>

<style lang='sass'>
.logo-container
  margin-top: 5rem
  margin-bottom: 5rem

@media only screen and (max-width: 1280px)
  .logo-container
    margin-top: 0rem !important
    margin-bottom: 0rem !important

.logo-container img
  width: 20rem
  height: auto

.auth-card
  border-radius: 1.5rem !important
  padding: 1rem 3rem
  max-width: 80rem

.btn-link span
  color: $hwayzLink !important
  text-transform: uppercase

.btn-link
  margin-top: 3rem !important
  font-size: $hwayzFont1rem4

@media only screen and (min-width: 960px)
  .auth-card
    padding: 2rem 5rem

</style>
