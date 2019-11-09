<template>
  <div id="communicationWidget" class="panel-container__wrap">
    <div class="panel-container__title" @click="openCommunicationDetails">
      <v-icon color="white">
        message
      </v-icon>
      <span>Communication (dummy)</span>
    </div>
    <div class="panel-container__content">
      <v-data-table :headers="tableHeaders" :items="messages" hide-actions>
        <template v-slot:items="props">
          <td>{{ props.item.date }}</td>
          <td>{{ props.item.subject }}</td>
          <td>{{ props.item.type }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tableHeaders: [
        { text: 'Date', value: 'date', sortable: false },
        { text: 'Subject', value: 'subject', sortable: false, align: 'left' },
        { text: 'Type', value: 'type', sortable: false }
      ]
    }
  },
  methods: {
    openCommunicationDetails() {
      this.$router.push({ name: 'communication' })
      this.$store.commit('home/SET_ACTIVE_ROUTE', 'communication')
    }
  }
}
</script>

<style lang="sass" scoped>
.panel-container__wrap
  margin: 2rem

.panel-container__content
  position: relative
  padding: 3rem 2rem

.panel-container__title
  @extend %disable-selection
  background-color: $hwayzNavigationTab
  position: absolute
  text-transform: capitalize
  display: flex
  align-items: center
  margin-top: 0rem
  border-radius: 0.5rem
  padding: 1rem 2rem
  min-width: 30rem
  text-align: left
  color: $hwayzWhite
  z-index: 2
  cursor: pointer

.panel-container__title i
  font-size: $hwayzFont3rem

.panel-container__title span
  color: $hwayzWhite
  padding-left: 1rem
  font-size: 1.4rem
</style>
