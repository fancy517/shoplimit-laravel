<template>
  <div class="save-confirm__card">
    <div class="save-confirm__title">
      homewayz
    </div>
    <v-icon class="save-confirm__icon" color="pink darken-2" size="100px">
      map
    </v-icon>
    <div class="save-confirm__message">
      {{ currentName }} is saved !
    </div>
    <div class="d-flex">
      <v-btn
        class="save-confirm__button"
        color="pink lighten-1"
        @click.stop.native="$emit('redirect-to-overview')"
      >
        Go to Overview
      </v-btn>
      <v-btn
        class="save-confirm__button"
        color="pink lighten-1"
        @click.stop.native="$emit('redirect-to-saved-route')"
      >
        Go to Saved Routes
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentName: {
      type: String,
      required: true
    }
  },
  data: () => ({
    routeName: ''
  }),
  methods: {
    submitName() {
      this.$emit('save-confirm-entered', this.routeName)
    }
  }
}
</script>

<style>
.save-confirm__card {
  background: $hwayzfb;
  border-radius: 1.5rem;
  box-shadow: 0.1rem 0.1rem 0.5rem rgba(0, 0, 0, 0.2);
  padding: 5rem;
}

.save-confirm__title {
  font-family: "Montserrat", sans-serif;
  text-transform: uppercase;
  font-weight: 300;
  margin-bottom: 6rem;
  color: $hwayz9;
  letter-spacing: 1px;
  font-size: $hwayzFont1rem4;
}

.save-confirm__icon {
  border: 1px solid $hwayzec;
  padding: 4rem;
  border-radius: 50%;
  margin-bottom: 3rem;
}

.save-confirm__message {
  font-size: $hwayzFont2rem;
  margin-bottom: 8rem;
  margin-top: 3rem;
}

.save-confirm__card .v-btn {
  border-radius: 2rem;
  min-width: 7rem;
  height: 6rem;
}

.save-confirm__card .v-btn__content {
  text-transform: none;
  padding: 0;
}
</style>
