<template>
  <v-text-field
    v-model="numberTyped"
    label="Home MLS Number"
    outline
    @keyup.enter="$emit('pressedEnter')"
  />
</template>

<script>

export default {
  props: {
    addresses: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      numberTyped: ''
    }
  },

  watch: {
    numberTyped: function(val) {
      const home = this.addresses.filter(home => home.MLSNumber === val)[0]

      if (home) this.$emit('sendHome', { val: home })
    }
  }
}
</script>

<style lang="sass" scoped>
.custom
    font-size: $hwayzFont1rem !important

//GET RID OF UNDERLINE
.custom.v-text-field>.v-input__control>.v-input__slot:before
    border-style: none !important

.custom.v-text-field>.v-input__control>.v-input__slot:after
    border-style: none !important
</style>
