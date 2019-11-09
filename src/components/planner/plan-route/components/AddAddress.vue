<template>
   <v-text-field
    label="Home MLS Address"
    outline
    v-model="addressTyped"
    @keyup.enter="$emit('pressedEnter')"
    ></v-text-field>
</template>

<script>
export default {
    props: {
        addresses: {
            type: Array,
        },
    },

    data() {
        return {
            addressTyped: '',
        }
    },

    watch: {
        addressTyped: function(val) {
            const home = this.addresses.filter(home => home.Address === val)[0]

            //if (home) this.$emit('sendHome', {val: home})
        },
    },

}
</script>

<style lang="sass" scoped>
.custom
    font-size: 1em !important
    
//GET RID OF UNDERLINE
.custom.v-text-field>.v-input__control>.v-input__slot:before
    border-style: none !important

.custom.v-text-field>.v-input__control>.v-input__slot:after
    border-style: none !important
</style>
