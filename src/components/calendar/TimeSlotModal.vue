<template>
  <v-menu
    :key="eventDetails.date"
    v-model="openModal"
    full-width
    offset-x
    :close-on-content-click="false"
  >
    <div
      slot="activator"
      v-ripple
      class="time-modal__event-container"
      :style="{top: timey(eventDetails.time) + 'px'}"
    >
      {{ eventContent }}
    </div>
    <v-card color="grey lighten-3" class="time-modal__card">
      <div class="time-modal__event-body">
        <div v-if="editContent" class="time-modal__event-details">
          <input
            ref="contentValue"
            type="text"
            :value="eventContent"
            class="time-modal__input-details"
            @keyup.enter="editingDone()"
          >
          <v-btn icon @click="editingDone()">
            <v-icon color="blue darken-3">
              check
            </v-icon>
          </v-btn>
        </div>
        <div v-else class="time-modal__event-details">
          <span>{{ eventContent }}</span>
          <v-btn icon @click="startEditingContent">
            <v-icon small color="blue darken-3">
              edit
            </v-icon>
          </v-btn>
        </div>
      </div>
      <div class="time-modal__btn-container">
        <v-btn
          round
          color="blue lighten-1"
          small
          @click="onSaveClicked"
        >
          Ok
        </v-btn>
        <v-btn
          round
          color="red darken-3"
          small
          @click="closeModal"
        >
          Cancel
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    eventDetails: {
      type: Object,
      required: true
    },
    timey: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      eventContent: this.eventDetails.details || '',
      openModal: this.eventDetails.open || false,
      editContent: false
    }
  },
  methods: {
    startEditingContent() {
      this.editContent = true
      this.$nextTick(() => this.$refs.contentValue.select())
    },
    editingDone() {
      this.editContent = false
      this.eventContent = this.$refs.contentValue.value
    },
    onSaveClicked() {
      this.openModal = false
      this.editContent = false
    },
    closeModal() {
      this.openModal = false
      this.resetData()
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>
<style lang='sass'>
.time-modal__event-container {
  position: absolute;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #66ccff;
  color: #fafafa;
  width: 100%;
  height: 100%;
  font-size: $hwayzFont1rem;
  cursor: pointer;
  left: 0;
  line-height: 2rem;
  height: 2rem !important;
}

.time-modal__card {
  width: 20rem !important;
}

.time-modal__event-body {
  padding: 1rem 2rem !important;
  text-align: left !important;
}

.time-modal__event-details {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.time-modal__event-details span {
  font-size: 1.3rem;
}

.time-modal__input-details {
  width: 100%;
  background: $hwayzBackgroundColor;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  outline: none !important;
  border: none;
  font-size: $hwayzFont1rem3;
}

.time-modal__btn-container {
  text-align: center !important;
  padding-bottom: 1rem;
}

.time-modal__card .time-modal__btn-container .v-btn--small {
  font-size: $hwayzFont1rem1 !important;
  height: 2.4rem !important;
  padding: 0rem !important;
}

@media only screen and (min-width: 600px) {
  .time-modal__card {
    width: 24rem !important;
  }
}

@media only screen and (min-width: 960px) {
  .time-modal__card {
    min-width: 28rem !important;
  }

  .time-modal__card .time-modal__btn-container .v-btn--small {
    font-size: $hwayzFont1rem2 !important;
    height: 2.8rem !important;
  }
}
</style>
