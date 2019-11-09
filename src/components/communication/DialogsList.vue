<template>
  <div>
    <div
      v-for="dialog in dialogs"
      :key="dialog.id"
      class="planner-comm__person"
      :class="{ 'planner-comm__person_active': activeDialog === dialog._id }"
      @click="selectDialog(dialog)"
    >
      <div class="planner-comm__name">
        <v-avatar size="40px" style="margin-right: 15px" :color="colors[dialog.name[0]]">
          <span class="white--text">{{ dialog.name | initials }}</span>
        </v-avatar>
        <span>{{ dialog.name }}</span>
        <span
          v-if="dialog.unreadMessages.length"
          class="planner-comm__unread"
        >{{ dialog.unreadMessages.length }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import avatarColors from '../../utils/avatarColors'

export default {
  filters: {
    initials: function(value) {
      if (!value) return ''
      value = value.split(' ')
      let response = ''
      for (const v of value) {
        response = response + v.charAt(0).toUpperCase()
      }
      return response
    }
  },
  props: {
    dialogs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeDialog: '',
      colors: avatarColors
    }
  },
  methods: {
    selectDialog(dialog) {
      this.activeDialog = dialog._id
      this.$emit('select-dialog', dialog)
    }
  }
}
</script>

<style lang="sass">
  .planner-comm
    &__wrap
      background-color: #fff

    &_content
      padding: 2rem
      text-align: left
      border-radius: 1rem
    &__person
      &_active
        background: #E1E1E1
      &:hover
        background: #E1E1E1
    &__name
      padding: 10px
      display: flex
      align-items: center
    &__unread
      border-radius: 50%
      width: 26px
      height: 26px
      color: white
      text-align: center
      margin-left: auto
      background: $hwayzNavigationTab
      padding-top: 2px
</style>
