<template>
  <div class="collapsible__container">
    <button
      class="collapsible__menu-toggler"
      :class="{'menu-expanded' : showMenu}"
      @click="togglePanel"
    >
      <span>{{ menuTitle }}</span>
      <v-icon :class="{'rotate': showMenu}" small color="#111">
        keyboard_arrow_down
      </v-icon>
    </button>
    <div class="collapsible__menu-container">
      <ul>
        <li
          v-for="option in menuOptions"
          :key="option.text"
          class="collapsible__menu-toggler collapsible__menu-option"
          :class="{'collapsible__menu-option--active': currentRoute === option.link}"
          @click="$emit('link-clicked', option.link)"
        >
          <span>{{ option.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentRoute: {
      type: String,
      required: true
    },
    menuTitle: {
      type: String,
      required: true
    },
    menuOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    togglePanel() {
      const currentToggleState = this.showMenu
      this.showMenu = !currentToggleState
    }
  }
}
</script>

<style lang="sass" scoped>
.collapsible__container
  width: 250px;

.collapsible__menu-toggler
  background-color: $hwyzSidebarAgent;
  color: #111;
  text-transform: uppercase;
  font-size: 1.3rem;
  height: 4rem;
  line-height: 4rem;
  font-weight: 400;
  padding: 0rem 1.5rem;
  text-align: right;
  background: none;
  cursor: pointer;
  width: 100%;
  border: none !important;
  outline: none !important;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

.collapsible__menu-toggler span
  height: 2.4rem;
  line-height: 2.4rem;
  display: inline-block;
  width: 100%;

.collapsible__menu-toggler i
  margin-left: 1rem;
  margin-right: 5rem;

.collapsible__menu-toggler i.rotate
  transform: rotate(180deg);
  transition: transform .5s ease;

.menu-expanded,
.collapsible__menu-toggler:hover
  background-color: $hwayzLinkWater;

.collapsible__menu-container
  text-align: center;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  background-color: #fafafa;

.menu-expanded ~ .collapsible__menu-container
  max-height: 30rem;
  transition: max-height 0.3s ease-in;

.collapsible__menu-option
  font-size: 1.2rem !important;
  height: 3.6rem !important;
  line-height: 3.6rem;
  border-top: 0.1rem solid $hwayzLinkWater;

.collapsible__menu-option span
  margin-top: 0.6rem;
  padding-right: 6rem;

/* Ripple Effect for Button Click */
.collapsible__container button:after, .collapsible__menu-container li:after
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;

.collapsible__menu-option--active
  background-color: $hwayzLinkWater !important;

@keyframes ripple
  0%
    transform: scale(0, 0);
    opacity: 1;
  20%
    transform: scale(40, 40);
    opacity: 1;
  100%
    opacity: 0;
    transform: scale(80, 80);

.collapsible__container button:focus:not(:active)::after, .collapsible__menu-container li:focus:not(:active)::after
  animation: ripple 0.5s ease-out;
</style>
