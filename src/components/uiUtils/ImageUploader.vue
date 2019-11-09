<template>
  <div>
    <div @click="launchFilePicker()">
      <slot name="activator" />
    </div>
    <input
      ref="uploadImage"
      type="file"
      style="display:none"
      accept="image/x-png, image/gif, image/jpeg"
      @change="onFileChange($event.target.files)"
    >
    <v-dialog v-model="errorDialog" max-width="300">
      <v-card>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="errorDialog = false">
            Got it!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({
    errorDialog: null,
    errorMessage: ''
  }),

  methods: {
    launchFilePicker() {
      this.$refs.uploadImage.click()
    },

    onFileChange(file) {
      let imageFile = file[0]

      if (file.length > 0) {
        if (!imageFile.type.match('image.*')) {
          this.errorDialog = true
          this.errorMessage = "That isn't an image file"
        } else {
          let imageURL = URL.createObjectURL(imageFile)
          this.$emit('input', { imageFile, imageURL })
        }
      }
    }
  }
}
</script>
