<template>
  <v-menu
    ref="menu"
    v-model="menu2"
    :close-on-content-click="false"
    :return-value.sync="time"
    lazy
    transition="scale-transition"
    offset-y
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field v-model="displayTime" label="Time: *" readonly v-on="on" />
    </template>
    <v-time-picker
      v-if="menu2"
      v-model="time"
      full-width
      scrollable
      :min="minTime"
      max="21:00"
      @click:minute="$refs.menu.save(time)"
    />
  </v-menu>
</template>

<script>
export default {
  props: {
    minTime: {
      type: String,
      default: '6:00'
    },
    pickerTime: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      time: this.pickerTime,
      displayTime: this.formatTime(this.pickerTime),
      menu2: false,
      modal2: false
    }
  },
  watch: {
    time(val) {
      this.displayTime = this.formatTime(val)
      this.$emit('changeTime', val)
    },
    pickerTime(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.time = newValue
      }
    }
  },

  methods: {
    formatTime(time) {
      if (!time) return null

      const [hour, minute] = time.split(':')
      return hour <= 12 ? `${time} AM` : `${hour - 12}:${minute} PM`
    }
  }
}
</script>
