<template>
  <v-layout fill-height justify-left wrap>
    <!-- SELECTED -->
    <v-flex class="text-xs-left" xs12 md6>
      <button
        v-ripple="{ class: 'grey--text', center: true}"
        class="button-upload"
        :class="{'button-complete': isUploaded}"
        @click="uploadLetter"
      >
        <v-icon v-if="isUploaded" class="green--text">
          check
        </v-icon>
        {{ isUploaded | buttonText }}
      </button>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  filters: {
    buttonText(value) {
      if (value) {
        return 'uploaded'
      } else {
        return 'upload letter'
      }
    }
  },
  data() {
    return {
      isUploaded: true
    }
  },
  methods: {
    uploadLetter() {
      console.log('Upload letter clicked')
      this.isUploaded = !this.isUploaded
    }
  }
}
</script>

<style scoped lang='sass'>
*:focus
  outline: none

.button-upload
  height: 3rem
  border: darkgray 1px solid
  box-shadow: #cecece 0px 1px 3px 1px
  background-color: #ffffff
  border-radius: 0.5rem
  text-transform: lowercase
  font-size: $hwayzFont1rem2
  color: #6b6b6b
  padding: 0 1rem
  margin-top: 6rem
  i
    font-size: $hwayzFont1rem2
    color: $hwayzKhaki

.button-complete
  border: $hwayzKhaki 1px solid
  color: $hwayzKhaki

</style>
