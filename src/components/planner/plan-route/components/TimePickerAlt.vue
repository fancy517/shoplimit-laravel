<template>
  <div class="time-picker-alt">
    <label class="time-picker-label" aria-hidden="true">
      Time: *
    </label>
    <date-picker
      v-model="time"
      lang="en"
      type="time"
      format="h:mm A"
      value-type="format"
      :placeholder="time || 'Select Time'"
      width="100%"
      :editable="false"
      :time-picker-options="timePickerOptions"
      input-class="custom-input"
      @change="timeChanged"
    />
  </div>
</template>

<script>
import moment from 'moment'
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
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
      timePickerOptions: {
        start: this.intervalRoundOff(15, this.minTime),
        step: '00:15',
        end: '21:00'
      }
    }
  },

  computed: {
    getMinTime() {
      return moment(this.intervalRoundOff(15, this.minTime), 'HH:mm').format('hh:mm a')
    }
  },

  watch: {
    minTime(newValue, oldValue) {
      if (newValue) {
        Object.assign(this.timePickerOptions, { start: this.intervalRoundOff(12, newValue) })
      }
    },

    pickerTime(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.time = newValue
      }
    }
  },

  methods: {
    formatTime(time) {
      const formattedTime = moment(time, 'HH:mm').format('h:mm A')
      return formattedTime
    },

    timeChanged(value) {
      const newTime = moment(value, 'h:mm A').format('HH:mm')
      this.$emit('changeTime', newTime)
    },

    intervalRoundOff(interval, time) {
      const momentTime = moment(time, 'HH:mm')
      const roundedMinutes =
        Math.ceil(momentTime.minute() / interval) * interval
      let optimizedTime = momentTime
        .clone()
        .minute(roundedMinutes)
        .second(0)
        .format('HH:mm')
      return optimizedTime
    }
  }
}
</script>

<style lang="sass">
.time-picker-alt
  position: relative

.time-picker-label
  left: 0px
  right: auto
  position: absolute
  color: rgba(0,0,0,.54)
  height: 20px
  line-height: 20px
  max-width: 133%
  transform: translateY(-18px) scale(.75)
  overflow: hidden
  text-overflow: ellipsis
  top: 6px
  -webkit-transform-origin: top left
  transform-origin: top left
  white-space: nowrap
  pointer-events: none
  font-size: $hwayzFont1rem6

.custom-input
  border-bottom: 1px solid rgba(0,0,0,0.42)
  color: rgba(0,0,0,.87)
  max-height: 32px
  line-height: 20px
  padding: 8px 0
  width: 100%
  font-size: $hwayzFont1rem6
  margin-bottom: 8px

</style>
