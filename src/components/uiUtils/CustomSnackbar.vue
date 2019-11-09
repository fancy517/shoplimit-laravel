<template>
  <v-snackbar v-model="snackbar" top>
    {{ snackbarMessage }}
    <v-btn
      :color="snackbarColor"
      flat
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    snackbarMessage: {
      type: String,
      required: true
    },
    snackbarColor: {
      type: String,
      default: 'pink'
    }
  },
  data() {
    return {
      snackbar: false
    }
  }
}
</script>

<style>

</style>
