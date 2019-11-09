<template>
  <v-app>
    <v-toolbar fixed app clipped :style="{'padding-left' : getLeftPadding}">
      <v-layout v-if="!isMobile" justify-end align-center>
        <v-spacer />
        <v-flex xs12 md6 lg4 class="toolbar__search toolbar__content-align">
          <auto-suggestion-input v-if="displayClientSearch()" :header-mode="true" />
        </v-flex>
        <v-flex xs12 md7 lg5 class="text-xs-right">
          <v-dialog
            v-model="inviteBuyerModal"
            persistent
            :width="modal.width"
            :max-width="modal.maxWidth"
          >
            <template v-slot:activator="{ on }">
              <v-btn flat icon v-on="on">
                <v-icon color="#5111ff">
                  people
                </v-icon>
              </v-btn>
            </template>
            <invite-buyer-form @on-modal-close="closeInviteBuyerModal($event)" />
          </v-dialog>
        </v-flex>
        <v-flex shrink>
          <div>
            <v-btn
              flat
              icon
              color="grey"
              class="header-client__envelope"
              @click="openCommunicationTab"
            >
              <span
                v-if="agentUnreadMessages && agentUnreadMessages.length"
                class="header-client__unread-messages-count"
              >{{ agentUnreadMessages.length }}</span>
              <v-icon color="#ffb858">
                email
              </v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex id="buttonAccountMenu" v-ripple shrink>
          <menu-account />
        </v-flex>
        <v-flex shrink class="toolbar__icons">
          <div class="toolbar__toggle">
            <v-toolbar-side-icon
              v-if="getWindowWidth < 1264"
              class="navigation-toggle"
              @click.stop="drawer = !drawer"
            />
          </div>
        </v-flex>
      </v-layout>
      <!-- Mobile layout -->
      <v-layout v-show="isMobile" id="toolbarMobile" align-center justify-start>
        <v-flex shrink @click="handlerMobileBackButton">
          <v-icon v-if="showMobileBackButton" class="black--text">
            chevron_left
          </v-icon>
        </v-flex>
        <v-flex class="text-xs-right">
          <v-toolbar-side-icon
            class="navigation-toggle hwayzHeaderClient"
            @click.stop="drawer = !drawer"
          />
        </v-flex>
      </v-layout>
    </v-toolbar>
    <!------------------->
    <!-- Agent Sidebar -->
    <!------------------->
    <v-navigation-drawer
      id="sidebar"
      v-model="drawer"
      :mini-variant="getWindowWidth >= 1264 ? isMiniSidebar : miniSidebarValue()"
      app
    >
      <!-- Title -->
      <div class="sidebar-title my-3">
        <v-toolbar-side-icon
          v-if="!isMobile"
          class="navigation-toggle--menu"
          @click.stop="getWindowWidth >= 1264 ? isMiniSidebar = !isMiniSidebar : drawer = !drawer"
        />
        <span :class="{ 'opacity-zero' : isMiniSidebar, 'opacity-one' : !isMiniSidebar}">Homewayz</span>
      </div>
      <v-list>
        <template v-for="item in adjustedMenuItems">
          <!-- Standard FIXED sidebar on larger windows -->
          <!-- If there are sub-children present then display the custom menu collapsible panel-->
          <sub-menu-options
            v-if="!isMobile && item.children && !isMiniSidebar"
            :key="item.link"
            :current-route="getCurrentRoute"
            :menu-options="item.children"
            @link-clicked="linkClicked"
          >
            <template v-slot:menu-title>
              <v-list-tile
                :key="item.link"
                ripple
                :to="{name: item.link}"
                class="sidebar-link"
                :class="{'sidebar-active-link': getCurrentRoute === item.link}"
                @click="linkClicked"
              >
                <!-- Icon -->
                <v-list-tile-action v-if="!isMobile && item.icon">
                  <v-icon class="mediumIcon">
                    {{ item.icon }}
                  </v-icon>
                </v-list-tile-action>
                <!-- Text -->
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </sub-menu-options>
          <!-- Mini sidebar -->
          <v-menu v-else-if="item.children && isMiniSidebar" :key="item.children.text" offset-x>
            <v-list-tile
              slot="activator"
              ripple
              class="sidebar-mini-link"
              :class="{'sidebar-active-link': getCurrentRoute === item.link}"
            >
              <v-list-tile-action v-if="item.icon">
                <v-icon class="mediumIcon">
                  {{ item.icon }}
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-card>
              <!-- If the item has children. -->
              <template v-for="child in item.children">
                <!-- If the children have children. -->
                <v-menu
                  v-if="child.children"
                  :key="child.link"
                  open-on-hover
                  class="sidebar-link sidebar-submenu__link"
                  full-width
                  offset-x
                >
                  <v-list-tile slot="activator" ripple>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{ child.text }}
                        <v-icon small color="black" class="ml-5">
                          keyboard_arrow_right
                        </v-icon>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-card>
                    <v-list-tile
                      v-for="subChild in child.children"
                      :key="subChild.text"
                      class="sidebar-link sidebar-submenu__link"
                      :to="{name: subChild.link}"
                      :class="{'sidebar-active-link': getCurrentRoute === subChild.link}"
                      @click="linkClicked"
                    >
                      <v-list-tile-title>{{ subChild.text }}</v-list-tile-title>
                    </v-list-tile>
                  </v-card>
                </v-menu>
                <!-- If the children have no children. -->
                <v-list-tile
                  v-else
                  :key="child.link"
                  class="sidebar-link sidebar-submenu__link"
                  :to="{name: child.link}"
                  :class="{'sidebar-active-link': getCurrentRoute === child.link}"
                  @click="linkClicked"
                >
                  <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                </v-list-tile>
              </template>
            </v-card>
          </v-menu>
          <!-- Temporary sidebar displayed below medium window size. -->
          <v-list-tile
            v-else
            :key="item.text"
            ripple
            :to="{name: item.link}"
            :class="{'sidebar-active-link': getCurrentRoute === item.link, 'sidebar-mini-link': isMiniSidebar, 'sidebar-link': !isMiniSidebar}"
            @click="linkClicked"
          >
            <!-- Hide the icon on mobile. -->
            <v-list-tile-action v-if="!isMobile && item.icon">
              <v-icon class="mediumIcon">
                {{ item.icon }}
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <!-- INVITE BUYER button visible only on mobile. -->
      <v-dialog
        v-model="inviteBuyerModal"
        persistent
        :width="modal.width"
        :max-width="modal.maxWidth"
      >
        <template v-slot:activator="{ on }">
          <v-list-tile
            v-show="isMobile"
            id="menuItemInviteBuyer"
            :class="{'sidebar-active-link': inviteBuyerModal, 'sidebar-mini-link': isMiniSidebar, 'sidebar-link': !isMiniSidebar}"
            ripple
            v-on="on"
          >
            <v-list-tile-content>
              <v-list-tile-title>INVITE BUYER</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <invite-buyer-form @on-modal-close="closeInviteBuyerModal($event)" />
      </v-dialog>
    </v-navigation-drawer>
    <!------------------->
    <!------------------->
    <!-- Agent Content. -->
    <v-content :style="{'padding-left' : getLeftPadding}">
      <template v-if="getCurrentRoute === 'communication'">
        <router-view />
      </template>
      <template v-else>
        <div v-if="getCurrentRoute !== 'agent-search'" class="top-wrapper">
          <div v-if="!isMobile" class="page-name">
            <v-breadcrumbs
              id="breadcrumbs"
              :items="pathInArrayForm"
              divider="/"
            >
              <template v-slot:divider>
                &nbsp;/&nbsp;
              </template>
              <template v-slot:item="props">
                <a
                  to="dashboard"
                  @click="redirectToRouteByPath(props.item.text)"
                >{{ props.item.text }}</a>
              </template>
            </v-breadcrumbs>
          </div>
          <div v-if="validRoute()" class="client-name">
            {{ getActiveClientName() }}
          </div>
        </div>
        <div class="layout-content">
          <router-view />
        </div>
      </template>
    </v-content>
    <v-snackbar v-model="showInviteBuyerSnackbar" :timeout="4000" :top="true">
      {{ inviteBuyerSnackbarMessage }}
      <v-btn flat color="red" @click.stop="closeSnackbar()">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import refreshContent from '../mixins/refreshContent'
import MenuAccount from './MenuAccount.vue'
import AutoSuggestionInput from '../uiUtils/AutoSuggestionInput.vue'
import SubMenuOptions from '../uiUtils/SubMenuOptions.vue'
import InviteBuyerForm from '../input-forms/InviteBuyerForm.vue'
import { routeNamesForClientSearch } from '../../utils/generalConsts'

export default {
  components: { AutoSuggestionInput, MenuAccount, SubMenuOptions, InviteBuyerForm },
  mixins: [refreshContent],
  data: () => ({
    drawer: null,
    isMiniSidebar: false,
    user: {
      email: '',
      password: '',
      verfiyPassword: '',
      isActive: true
    },
    dialog: false,
    inviteBuyerModal: false,
    showInviteBuyerSnackbar: false,
    inviteBuyerSnackbarMessage: null,
    shortMenuItems: [
      { icon: 'search', text: 'SEARCH', link: 'agent-search' },
      { icon: 'calendar_today', text: 'CALENDAR', link: 'calendar' },
      { icon: 'feedback', text: 'FEEDBACK', link: 'feedback' },
      { icon: 'message', text: 'COMMUNICATION', link: 'communication' },
      { icon: 'person', text: 'ACCOUNT', link: 'agent-account' }
    ],
    fullMenuItems: [
      {
        icon: 'home',
        text: 'TASK MANAGER',
        link: 'home',
        children: [
          { text: 'TASK VIEW', link: 'Task-Manager / Task-View' },
          { text: 'CLIENT VIEW', link: 'client-view' }
        ]
      },
      { icon: 'search', text: 'SEARCH', link: 'agent-search' },
      {
        icon: 'access_time',
        text: 'PLANNER',
        link: 'planner'
      },
      { icon: 'calendar_today', text: 'CALENDAR', link: 'calendar' },
      {
        icon: 'person_pin',
        text: 'CLIENT DETAIL',
        link: 'client-detail',
        children: [
          { text: 'FEEDBACK', link: 'feedback' },
          { text: 'COMMUNICATION', link: 'communication' }
        ]
      }
    ]
  }),

  computed: {
    /**
     * Mapping the selected client getter to check if isn't null
     */
    ...mapState('agent', ['selectedClient']),
    ...mapState('home', ['activeRoute']),
    ...mapState('style', ['modal']),
    ...mapState('common', ['isMobile']),
    ...mapGetters('mobile', ['showMobileBackButton']),
    ...mapGetters('agent', ['agentUnreadMessages']),

    getWindowWidth() {
      const windowWidth = this.$store.state.home.windowWidth
      return windowWidth
    },
    getLeftPadding() {
      if (this.$store.state.home.windowWidth >= 1264) {
        if (this.isMiniSidebar) return '80px'
        else return '250px'
      } else {
        return '0px'
      }
    },

    getCurrentRoute() {
      return this.activeRoute
    },

    pathInArrayForm() {
      if (this.$route.name === undefined) {
        return []
      }
      var arr = []
      this.$route.name.split('/').map(val => {
        val = val.replace('-', ' ')
        arr.push({ text: val })
      })
      return arr // remove the initial '/agent/'
    },

    activeClientName() {
      if (this.selectedClient) {
        return 'Selected Client: ' + this.selectedClient.name
      }
      return null
    },

    adjustedMenuItems() {
      if (this.isMobile) {
        return this.shortMenuItems
      } else {
        return this.fullMenuItems
      }
    }
  },

  watch: {
    $route(to, from) {
      if (!to.params.homeId && !to.path.includes('search/')) {
        this.currentLinkHandler(to.path)
      }
    }
  },

  created() {
    this.linkClicked()
    this.getAgentData()
    this.setProfileStatus('agent')
  },

  methods: {
    /**
     * Mapping mutation to set currently active route
     */
    ...mapMutations('home', {
      setActiveRoute: 'SET_ACTIVE_ROUTE'
    }),
    ...mapMutations('common', {
      setProfileStatus: 'SET_PROFILE_STATUS',
      clearRequestedQuery: 'CLEAR_REQUESTED_QUERY'
    }),
    ...mapMutations('mobile', {
      setAllRoutesShowing: 'SET_ALL_ROUTES_SHOWING'
    }),

    linkClicked() {
      let routePath = this.$router.currentRoute
      this.clearRequestedQuery()
      if (!routePath.params.homeId && !routePath.path.includes('search/')) {
        this.currentLinkHandler(routePath.path)
      }
    },

    /**
     * Handles the routing and checks whether they are planner routes
     * Don't open specific route if there's not selected client
     * Instead redirect to planner search component
     */
    currentLinkHandler(routePath) {
      let currentLink = routePath.substring(routePath.lastIndexOf('/') + 1)

      // Redirections will be modified later based on
      // introduction of auth routes along with client routes
      if (currentLink === 'agent' || currentLink === 'dashboard') {
        currentLink = 'Task-Manager / Task-View'
      }

      if (currentLink === 'account' || currentLink === 'search') {
        currentLink = 'agent-' + currentLink
      }

      if (routePath.includes('planner') && !this.selectedClient) {
        currentLink = 'planner'
      }

      this.setActiveRoute(currentLink)
      const routerParam = {
        name: currentLink
      }

      this.$router.push(routerParam)
    },

    redirectToRoute(routeName) {
      this.$router.push({ name: routeName })
    },

    redirectToRouteByPath(pathName) {
      var i = this.pathInArrayForm.findIndex(item => item.text === pathName)
      var fullPath = ''
      for (let j = 0; j <= i; j++) {
        fullPath += this.pathInArrayForm[j].text + '/'
      }
      this.$router.push({ path: fullPath })
    },

    displayClientSearch() {
      const currentRouteName = this.$router.currentRoute.name
      return (
        currentRouteName && routeNamesForClientSearch.includes(currentRouteName)
      )
    },

    miniSidebarValue() {
      this.isMiniSidebar = false
      return false
    },

    closeInviteBuyerModal(data) {
      const { showMessage, message } = data
      if (showMessage) {
        this.showInviteBuyerSnackbar = true
        this.inviteBuyerSnackbarMessage = message
      }
      this.inviteBuyerModal = false
    },

    closeSnackbar() {
      this.showInviteBuyerSnackbar = false
      this.inviteBuyerSnackbarMessage = null
    },

    // Methods to display client name is respective pages
    validRoute() {
      return routeNamesForClientSearch.includes(this.activeRoute)
    },

    getActiveClientName() {
      if (this.selectedClient) {
        return 'Client Name: ' + this.selectedClient.name
      }
      return null
    },

    handlerMobileBackButton() {
      // console.log(this.getCurrentRoute);
      if (this.getCurrentRoute === 'calendar') {
        this.setAllRoutesShowing(true)
      }
    },

    openCommunicationTab() {
      this.$router.push({ name: 'communication' })
    }
  }
}
</script>

<style lang="sass" scoped>
// @Toolbar style
.button-toolbar
  font-size: 1.3rem !important
  height: 3.5rem
  margin: 0
  margin-right: 1rem
  i
    color: #fff !important

.toolbar__search
  padding: 0 2rem

.toolbar__button-group
  .v-btn
    @media only screen and (max-width: 760px)
      font-size: $hwayzFont1rem1 !important
      padding: 0px 10px

.toolbar__icons
  display: flex
  justify-content: space-between
  align-items: center
  @media only screen and (min-width: 760px)
    justify-content: flex-end
    .v-icon
      margin: 0 1rem

.navigation-toggle
  .v-btn__content
    i
      color: $hwayzBlack !important

// @Sidebar content
#sidebar
  font-weight: 300
  background-color: $hwyzSidebarAgent !important
  box-shadow: 3px 1px 5px rgba(0, 0, 0, 0.2)
  max-width: 250px !important

.v-list
  padding-bottom: 0 !important

.sidebar-title
  font-family: "Montserrat", sans-serif
  font-size: 2.8rem
  font-weight: 500
  letter-spacing: 1px
  color: $hwayzWhite
  transition: all 0.5s ease
  height: 10rem

.navigation-toggle--menu
  .v-btn__content
    i
      color: $hwayzWhite !important

#toolbarMobile
  i
    font-size: 3.5rem

.sidebar-link .v-list__tile__action, .v-list__tile__avatar
  min-width: 40px !important

.sidebar-submenu__link div
  width: 100%

.sub-menu-options__navigation-link
  margin-left: -25px !important

.sidebar-active-link
  background: $hwayzLinkWater !important

.sidebar-inactive-link
  background: $hwyzSidebarAgent !important

.opacity-zero
  opacity: 0

.opacity-one
  opacity: 1
  transition: all 0.5s ease

// @Content style
.top-wrapper
  display: grid
  width: 100%
  grid-template-areas: "page-name client-name ..."
  grid-template-columns: 1fr 1fr 1fr
  grid-gap: 2%
  text-transform: capitalize

.page-name, .client-name
  background: transparent
  color: #3e3e3e
  padding-top: 25px !important

#breadcrumbs
  padding-left: 20px !important
  margin-bottom: 20px !important

.hwayzSun
  background-color: $hwayzSun !important
.hwayzTeal
  background-color: $hwayzTeal !important

.layout-content
  padding: 1.5rem 0.5rem !important
  @media only screen and (min-width: 600px)
    padding: 2rem 0.5rem !important
  @media only screen and (min-width: 960px)
    padding: 2rem 1rem !important

header-client__envelope
  position: relative

.header-client__unread-messages-count
  position: absolute
  background: $hwayzNavigationTab
  color: white
  border-radius: 50%
  width: 15px
  font-size: 10px
  display: block
  text-align: center
  height: 15px
  padding-top: 0px
  top: -4px
  right: 2px
</style>
