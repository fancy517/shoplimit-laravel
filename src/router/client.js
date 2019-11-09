import HeaderClient from '../components/client/HeaderClient.vue'
import ClientSignupPage from '../views/client/ClientSignupPage.vue'
import ClientProfileInfoWizard from '../views/client/ClientProfileInfoWizard.vue'
import ClientDashboard from '../views/client/ClientDashboard.vue'
import ClientCommunication from '../views/client/ClientCommunication.vue'
import ClientSavedFavorites from '../views/client/ClientSavedFavorites.vue'
import CalendarHandler from '../components/calendar/CalendarHandler.vue'
import MobileCalendarHandler from '../components/calendar/MobileCalendarHandler.vue'
import ClientFeedback from '../views/client/ClientFeedback.vue'
import ClientReferFriend from '../views/client/ClientReferFriend.vue'
import ClientAccount from '../views/client/ClientAccount.vue'
import ClientSearchPage from '../views/client/ClientSearchPage.vue'
import DetailPropertyView from '../components/search/property_view/DetailPropertyView.vue'

import { clientRequireAuth } from './authorisation'

import common from '../store/module/common'

export default [
  {
    /* This has to be a separate route because it does not use the HeaderClient.vue component */
    path: '/client-signup',
    component: ClientSignupPage,
    children: [
      //
    ]
  },
  {
    path: '/client/details',
    component: ClientProfileInfoWizard,
    name: 'client-details',
    beforeEnter: (to, from, next) => clientRequireAuth(to, from, next)
  },
  {
    path: '/client',
    component: HeaderClient,
    beforeEnter: (to, from, next) => clientRequireAuth(to, from, next),
    // Change the children array to avoid mobile users from visiting urls they shouldn't.
    children: common.state.isMobile
      ? [
        { path: 'search', component: ClientSearchPage, name: 'client-search' },
        { path: 'favorites', component: ClientSavedFavorites, name: 'client-favorites' },
        { path: 'communication', component: ClientCommunication, name: 'client-communication' },
        { path: 'schedule', component: MobileCalendarHandler, name: 'client-schedule' },
        { path: 'refer-friend', component: ClientReferFriend, name: 'refer-friend' },
        { path: 'account', component: ClientAccount, name: 'client-account' },
        { path: 'search/:homeId', component: DetailPropertyView },
        { path: 'favorites/:homeId', component: DetailPropertyView }
      ]
      : [
        { path: 'dashboard', component: ClientDashboard, name: 'client-dashboard' },
        { path: 'search', component: ClientSearchPage, name: 'client-search' },
        { path: 'favorites', component: ClientSavedFavorites, name: 'client-favorites' },
        { path: 'communication', component: ClientCommunication, name: 'client-communication' },
        { path: 'schedule', component: CalendarHandler, name: 'client-schedule' },
        { path: 'feedback', component: ClientFeedback, name: 'client-feedback' },
        { path: 'refer-friend', component: ClientReferFriend, name: 'refer-friend' },
        { path: 'account', component: ClientAccount, name: 'client-account' },
        { path: 'search/:homeId', component: DetailPropertyView },
        { path: 'favorites/:homeId', component: DetailPropertyView }
      ]
  },
  { path: '/client', redirect: '/client/dashboard' }
]
