<template>
  <v-app>
    <!------------------->
    <!-- Client Toolbar -->
    <!------------------->
    <v-toolbar
      id="headerClient"
      fixed
      app
      clipped
      :prominent="isMobile"
    >
      <!-- Non Mobile Toolbar -->
      <!-- We use v-show instead of v-if because the reger friend button remains in mobile size for some reason -->
      <v-layout v-show="!isMobile" justify-end align-center fill-height>
        <v-flex shrink>
          <!-- This button opens a modal. -->
          <modal-refer-friend ref="modalReferFriend">
            <template v-slot:button="props">
              <v-btn flat icon color="grey" @click="setReferFriendModalShowing(true)">
                <v-icon color="#5111ff">
                  people
                </v-icon>
              </v-btn>
            </template>
          </modal-refer-friend>
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
                v-if="clientUnreadMessages && clientUnreadMessages.length"
                class="header-client__unread-messages-count"
              >{{ clientUnreadMessages.length }}</span>
              <v-icon color="#ffb858">
                email
              </v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex id="buttonAccountMenu" v-ripple shrink>
          <menu-account />
        </v-flex>
        <v-flex v-if="getWindowWidth < 1264" shrink class="pa-0">
          <v-toolbar-side-icon
            color="$hwyzHeaderClient"
            class="navigation-toggle"
            @click.stop="drawer = !drawer"
          />
        </v-flex>
      </v-layout>
      <!-- Mobile layout -->
      <v-layout v-show="isMobile" id="toolbarMobile" align-center justify-end>
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
    <!------------------------>
    <!-- NAVIGATION SIDEBAR -->
    <!------------------------>
    <v-navigation-drawer
      id="sidebar"
      v-model="drawer"
      :mini-variant="getWindowWidth >= 1264 ? isMiniSidebar : miniSidebarValue()"
      app
    >
      <div class="sidebar-title my-2">
        <v-toolbar-side-icon
          v-if="!isMobile"
          class="navigation-toggle--menu"
          color="black"
          flat
          @click.stop="getWindowWidth >= 1264 ? isMiniSidebar = !isMiniSidebar : drawer = !drawer"
        />
        <span :class="{ 'opacity-zero' : isMiniSidebar, 'opacity-one' : !isMiniSidebar}">HW HomeWayz</span>
      </div>
      <v-list>
        <template v-for="item in adjustedMenuItems">
          <!-- Standard FIXED sidebar on larger windows -->
          <v-list-group
            v-if="item.children && !isMiniSidebar"
            :key="item.text"
            class="sidebar-link"
          >
            <v-list-tile slot="activator">
              <v-list-tile-action v-if="!isMobile && item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <!-- Mini sidebar -->
          <v-menu
            v-else-if="item.children && isMiniSidebar"
            :key="item.children.text"
            offset-x
            nudge-left="70"
          >
            <v-list-tile slot="activator" ripple class="sidebar-mini-link">
              <v-list-tile-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
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
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <div v-if="!isMiniSidebar && associatedAgent" class="sidebar-client__agent-details">
        <h5>Your Agent</h5>
        <h2>{{ associatedAgent.name }}</h2>
        <h4>{{ associatedAgent.phone }}</h4>
      </div>
    </v-navigation-drawer>
    <!-- BREADCRUMBS -->
    <v-content :style="{'padding-left' : getLeftPadding}">
      <template v-if="getCurrentRoute === 'client-communication'">
        <router-view />
      </template>
      <template v-else-if="getCurrentRoute !== 'client-search' && !isMobile">
        <v-breadcrumbs id="breadcrumbs" :items="pathInArrayForm.slice(2)" divider="/">
          <template v-slot:divider>
            &nbsp;/&nbsp;
          </template>
          <template v-slot:item="props">
            <a
              to="client-dashboard"
              @click="redirectToRouteByPath(props.item.text)"
            >{{ props.item.text === 'favorites' ? 'saved favorites' : props.item.text }}</a>
          </template>
        </v-breadcrumbs>
        <div
          class="layout-content"
          :class="{'layout-content--account-page': isCurrentRouteAccount}"
        >
          <router-view />
        </div>
      </template>
      <template v-else>
        <router-view />
      </template>
    </v-content>
  </v-app>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import refreshClientData from '../mixins/refreshClientData'
import MenuAccount from './MenuAccount.vue'
import modalReferFriend from './modals/ModalReferFriend.vue'
import { isEmpty } from '../../utils/generalUtils'
import { genericPutRequestToApi } from '../../utils/genericRequests'
import { CreateRetrieveBraAgreementUrl } from '../../utils/clientUrls'

export default {
  components: { MenuAccount, modalReferFriend },
  mixins: [refreshClientData],
  data: () => ({
    drawer: null,
    isMiniSidebar: false,
    user: {
      email: '',
      password: '',
      verfiyPassword: '',
      isActive: true
    },
    openAgreementModal: false,
    dialog: false,
    inviteBuyerModal: false,
    tempMenuItems: [
      { text: 'SAVED', link: 'saved' },
      { text: 'PENDING', link: 'pending' },
      { text: 'CONFIRMED', link: 'confirmed' },
      { text: 'SCHEDULED', link: 'scheduled' },
      { text: 'COMPLETED', link: 'completed' }
    ],
    shortMenuItems: [
      { icon: 'search', text: 'SEARCH', link: 'client-search' },
      { icon: 'favorite', text: 'SAVED FAVORITES', link: 'client-favorites' },
      { icon: 'message', text: 'COMMUNICATION', link: 'client-communication' },
      { icon: 'calendar_today', text: 'SCHEDULE', link: 'client-schedule' },
      { icon: 'folder_shared', text: 'REFER A FRIEND', link: 'refer-friend' },
      { icon: 'person', text: 'ACCOUNT', link: 'client-account' }
    ],
    fullMenuItems: [
      { icon: 'home', text: 'DASHBOARD', link: 'client-dashboard' },
      { icon: 'search', text: 'SEARCH', link: 'client-search' },
      { icon: 'favorite', text: 'SAVED FAVORITES', link: 'client-favorites' },
      { icon: 'message', text: 'COMMUNICATION', link: 'client-communication' },
      { icon: 'calendar_today', text: 'SCHEDULE', link: 'client-schedule' },
      { icon: 'feedback', text: 'FEEDBACK', link: 'client-feedback' },
      { icon: 'folder_shared', text: 'REFER A FRIEND', link: 'refer-friend' }
    ]
  }),

  computed: {
    ...mapState('client', ['associatedAgent']),
    ...mapState('common', ['isMobile']),
    ...mapGetters('mobile', ['showMobileBackButton']),
    ...mapGetters('client', ['clientUnreadMessages']),

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
      return this.$store.state.home.activeRoute
    },

    pathInArrayForm() {
      var arr = []
      this.$route.path.split('/').map(val => {
        val = val.replace('-', ' ')
        arr.push({ text: val })
      })
      return arr
    },

    isCurrentRouteAccount() {
      return this.getCurrentRoute === 'account'
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
      if (
        !to.params.homeId &&
        !to.path.includes('favorites/') &&
        !to.path.includes('search/')
      ) {
        this.currentLinkHandler(to.path)
      }
    },

    clientData(newValue, oldValue) {
      if (!isEmpty(newValue) && !newValue.current_agentid) {
        // Open the Agreement modal

        // For now I'm setting the BRA agreement to true by default
        if (newValue.agents.length > 0) {
          const agentId = newValue.agents[newValue.agents.length - 1]['_id']
          genericPutRequestToApi(CreateRetrieveBraAgreementUrl(agentId))
        }
      }
    }
  },

  created() {
    this.linkClicked()
    this.getClientData(true)
    this.setProfileStatus('client')
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
      if (
        !routePath.params.homeId &&
        !routePath.path.includes('favorites/') &&
        !routePath.path.includes('search/')
      ) {
        this.currentLinkHandler(routePath.path)
      }
    },

    /**
     * Handles the routing and checks whether they are planner routes
     * Don't open specific route if there's not selected client
     * Instead redirect to planner search component
     */
    currentLinkHandler(routePath) {
      // This concept of routing is the be improved later
      // once all the routes have been decided for the whole application
      let currentLink = routePath.substring(routePath.lastIndexOf('/') + 1)
      if (currentLink === 'client' || currentLink === 'dashboard') {
        currentLink = 'client-dashboard'
      } else if (currentLink !== 'refer-friend') {
        currentLink = 'client-' + currentLink
      }

      this.setActiveRoute(currentLink)
      this.$router.push({ name: currentLink })
    },

    redirectToRouteByPath(pathName) {
      var i = this.pathInArrayForm.findIndex(item => item.text === pathName)
      var fullPath = ''
      for (let j = 0; j <= i; j++) {
        fullPath += this.pathInArrayForm[j].text + '/'
      }
      this.$router.push({ path: fullPath })
    },

    miniSidebarValue() {
      this.isMiniSidebar = false
      return false
    },

    setReferFriendModalShowing(val) {
      this.$refs.modalReferFriend.setModalShowing(val)
    },

    handlerMobileBackButton() {
      // console.log(this.getCurrentRoute);
      if (this.getCurrentRoute === 'client-schedule') {
        this.setAllRoutesShowing(true)
      }
    },

    openCommunicationTab() {
      this.$router.push({ name: 'client-communication' })
    }
  }
}
</script>

<style lang="sass" scoped>
// @Toolbar style
#headerClient
  background-color: $hwyzHeaderClient
  @media only screen and (max-width: 600px)
    background-color: darkgray

#buttonAccountMenu
  height: 100%
  display: flex
  align-items: center
  &:hover
    @extend %on-hover

.navigation-toggle
  .v-btn__content
    i
      color: #000 !important
  button:hover
    @extend %on-hover

#toolbarMobile
  i
    font-size: 3.5rem

#sidebar
  font-weight: 300
  display: flex
  flex-flow: column nowrap
  background-color: $hwyzSidebarClient !important
  box-shadow: 3px 1px 5px rgba(0, 0, 0, 0.2)
  max-width: 250px !important

.sidebar-title
  font-family: "Montserrat", sans-serif
  font-size: 2rem
  font-weight: 500
  letter-spacing: 1px
  color: #000
  transition: all 0.5s ease
  height: 10rem
  @media only screen and (max-width: 600px)
    margin-top: 2rem !important

.opacity-zero
  opacity: 0

.opacity-one
  opacity: 1
  transition: all 0.5s ease

.sidebar-active-link
  background: $hwayzLinkWater !important
  i
    color: $hwayzBlack !important

.sidebar-client__agent-details
  margin-bottom: 2rem
  margin-left: 2rem
  margin-top: auto
  text-align: left
  h5
    font-size: 1.6rem
    color: grey
    margin-bottom: 1rem
    font-weight: 400
  h2
    margin-bottom: 0.5rem
    font-size: 1.6rem
    font-weight: 600
  i
    vertical-align: middle
  h4
    font-size: 1.6rem

// @Content style
#breadcrumbs
  text-transform: capitalize
  color: $hwayzBlack
  padding-left: 20px !important
  padding-top: 25px !important
  padding-bottom: 20px !important

.hwyzHeaderClient
  background-color: $hwyzHeaderClient !important
.hwayzSun
  color: $hwayzSun !important

.layout-content
  padding: 1.5rem 0.5rem
  @media only screen and (min-width: 600px)
    padding: 2rem 0.5rem
  @media only screen and (min-width: 960px)
    padding: 2rem 1rem

.layout-content--account-page
  padding: 0rem 0rem !important
  background-color: $hwyzHeaderClient
  height: 100%

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
