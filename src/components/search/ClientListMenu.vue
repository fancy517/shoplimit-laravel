<template>
  <v-dialog
    v-model="showModal"
    :width="modal.small_width"
    :max-width="modal.small_maxWidth"
    persistent
  >
    <v-card id="clientListMenu">
      <v-icon
        id="clientListMenuClose"
        class="refer-friend__close"
        @click.stop="$emit('close-modal')"
      >
        close
      </v-icon>
      <template v-if="selectedProperty">
        <div class="client-list-menu__title">
          Add property
          <strong>{{ selectedProperty['Address'] }}</strong> to a client
        </div>
        <template v-if="associatedClients">
          <v-list>
            <v-list-tile
              v-for="client in associatedClients"
              :key="client._id"
              class="client-list-menu__list"
              :class="{'disabled': isAllocated(client)}"
              @click="$emit('assign-client-to-property', client)"
            >
              <v-list-tile-title>{{ client.name }} {{ isAllocated(client) ? '&nbsp;(already added)' : '' }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </template>
        <template v-else>
          <div>No clients have been invited by you</div>
        </template>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    selectedProperty: {
      type: Object,
      default: () => {
        return null
      }
    },
    associatedClients: {
      type: Array,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('style', ['modal'])
  },

  methods: {
    /**
     * Check if the client has already requested this property
     * Disable client's name if it's true else setting the property to requested homes is enabled
     */
    isAllocated(clientObject) {
      const isClientAssigned = clientObject.homes.some(
        property =>
          property.propertyId === this.selectedProperty._id
          // property.requestTour === true
      )
      return isClientAssigned
    }
  }
}
</script>

<style lang="sass" scoped>
#clientListMenu
  padding: 3rem 2rem 2rem;

#clientListMenu .disabled
  pointer-events: none;
  user-select: none;
  opacity: 0.7;

#clientListMenuClose
  @extend %modal__button-close, %disable-selection

.client-list-menu__title
  margin-top: 4rem;
  text-align: left;
  border-bottom: 1px solid #acacac
  padding-bottom: 1rem
  margin-bottom: 0

.client-list-menu__list
  border-bottom: 0.1rem solid #ececec;

.client-list-menu__list:hover
  background: #ccc;
</style>
