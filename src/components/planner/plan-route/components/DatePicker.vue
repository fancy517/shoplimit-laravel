<template>
  <v-menu
    ref="menu1"
    v-model="menu1"
    :close-on-content-click="false"
    lazy
    transition="scale-transition"
    full-width
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateFormatted"
        style="width: 40%; display: table-cell"
        :label="pickerLabel"
        persistent-hint
        readonly
        @blur="date = parseDate(dateFormatted)"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" no-title :min="today" @input="menu1 = false" />
  </v-menu>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    pickerLabel: {
      type: String,
      default: 'Date: *'
    },
    pickerDate: {
      type: String,
      default: null
    }
  },

  data: vm => ({
    date: moment().format('YYYY-MM-DD'),
    dateFormatted: vm.formatDate(moment().format('YYYY-MM-DD')),
    menu1: false,
    menu2: false,
    today: moment().format('YYYY-MM-DD')
  }),

  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date)
      this.$emit('changeDate', this.dateFormatted)
    },

    pickerDate(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.dateFormatted = this.formatDate(newValue)
      }
    }
  },

  created() {
    if (this.pickerDate) this.date = this.pickerDate
  },

  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>
