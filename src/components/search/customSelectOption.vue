<template>
  <v-select
    :items="selectOptions"
    background-color="white"
    append-icon
    box
    flat
    solo
    dense
    single-line
    :multiple="isMultiple"
    :full-width="isFullWidth"
    :placeholder="placeholder"
    :value="value"
    :menu-props="{offsetY: true, maxHeight: 300, transition: false}"
  >
    <template v-slot:item="data">
      <v-container
        d-flex
        align-center
        justify-start
        class="text-xs-left menu-item"
        :class="{'menu-item-selected': data.tile.props.value}"
      >
        <slot name="select-data" :data="data" />
      </v-container>
    </template>
    <template v-slot:selection="data">
      <slot name="selected-value" :data="data" />
    </template>
  </v-select>
</template>

<script>
export default {
  props: {
    selectOptions: {
      type: Array,
      required: true
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    isFullWidth: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>
.menu-item {
  margin: 0 -5px 0 -5px;
  padding: 2px 5px 2px 5px;
  border: transparent 2px solid;
}

.menu-item-selected {
  border: #000 2px solid !important;
  color: #000;
}
</style>
