<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableItems"
    hide-actions
    class="table"
  >
    <template v-slot:items="props">
      <td v-for="(item, index) in props.item" :key="index">
        <div v-if="item.type === 'icon'">
          <v-icon :style="{color: [item.color]}">
            {{ item.text }}
          </v-icon>
        </div>

        <div
          v-else-if="item.type === 'clickable'"
          class="clickable"
          :style="{color: [item.color]}"
          @click.stop="emitClick(item.data)"
        >
          {{ item.text }}
        </div>

        <div v-else-if="item.type === 'clickableIcon'" :style="{color: [item.color]}" @click.stop="emitFullItem(index)">
          <v-btn
            fab
            small
            color="#8e8e8e"
            :class="[item.class, 'fabSmall']"
          >
            <v-icon small color="white">
              {{ item.text }}
            </v-icon>
          </v-btn>
        </div>

        <div v-else-if="item.type === 'image'">
          <img
            :src="[item.text]"
            :alt="[item.text]"
            :class="[item.class]"
          >
        </div>

        <div v-else-if="item.type === 'checkbox'" :class="'isCheckbox'">
          <v-checkbox
            v-model="item.selected"
          />
        </div>

        <div v-else :class="[item.class]">
          {{ item.text }}
        </div>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['tableHeaders', 'tableItems'],

  methods: {
    emitClick(data) {
      if (data) this.$emit('clicked-data', data)
      else this.$emit('clicked', data)
    },
    emitFullItem(data) {
      this.$emit('clicked', this.tableItems[data])
    }
  }
}
</script>

<style lang="sass">
.table
  @extend %plannerTable

.boldRow
  font-weight: map-get($text, boldText)

.textLeft
  text-align: left

.image
  height: auto
  max-width: 12rem
  padding: 1rem 0

.clickable
  cursor: pointer

.isCheckbox
  justify-self: center !important
  position: relative
  top: 50%
  left: 50%
  transform: translate(-5%, -25%)

.fabSmall
  width: 30px !important
  height: 30px !important

</style>
