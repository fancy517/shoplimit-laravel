import Header from '../components/agent/Header.vue'
import AgentAccountPage from '../views/agent/AgentAccountPage.vue'
import AgentDashboardPage from '../views/agent/AgentDashboardPage.vue'
import AllClientsContainer from '../views/agent/AllClientsContainer.vue'
import AgentFeedbackPage from '../views/agent/AgentFeedbackPage.vue'
import AgentCommunicationPage from '../views/agent/AgentCommunicationPage.vue'

import PlannerOverview from '../components/planner/PlannerOverview.vue'
import RoutesContainer from '../components/planner/routes/RoutesContainer.vue'
import PlanRouteContainer from '../components/planner/plan-route/PlanRouteContainer.vue'

import PendingRoutes from '../components/planner/routes/PendingRoutes.vue'
import ExpansionReviseRoute from '../components/planner/routes/ExpansionReviseRoute.vue'

import NotFound404 from '../views/common/NotFound404.vue'
import AgentClientDetailPage from '../views/agent/AgentClientDetailPage.vue'

import MobileCalendarHandler from '../components/calendar/MobileCalendarHandler.vue'
import CalendarHandler from '../components/calendar/CalendarHandler.vue'
import PlannerPage from '../views/agent/PlannerPage.vue'
import AgentSearchPage from '../views/agent/AgentSearchPage.vue'
import DetailPropertyView from '../components/search/property_view/DetailPropertyView.vue'

import { agentRequireAuth } from './authorisation'

import common from '../store/module/common'

export default [
  {
    path: 'plan-route',
    name: 'plan-route',
    component: PlanRouteContainer,
    props: true
  },
  {
    path: '/agent',
    component: Header,
    beforeEnter: (to, from, next) => agentRequireAuth(to, from, next),
    // Change the children array to avoid mobile users from visiting urls they shouldn't.
    children: common.state.isMobile ? [
      { path: 'account', name: 'agent-account', component: AgentAccountPage },
      { path: 'home', redirect: 'agent-search', name: 'home' },
      { path: 'client-detail/feedback', component: AgentFeedbackPage, name: 'feedback' },
      { path: 'communication', component: AgentCommunicationPage, name: 'communication' },
      { path: 'calendar', component: MobileCalendarHandler, name: 'calendar' },
      { path: 'client-view', component: AllClientsContainer, name: 'client-view' },
      { path: 'sphere-of-influence', component: NotFound404, name: 'sphere-of-influence' },
      { path: 'search', component: AgentSearchPage, name: 'agent-search' },
      { path: 'search/:homeId', component: DetailPropertyView, props: true }
    ] : [
      { path: 'account', name: 'agent-account', component: AgentAccountPage },
      { path: 'home', redirect: 'dashboard', name: 'home' },
      { path: 'dashboard', component: AgentDashboardPage, name: 'Task-Manager / Task-View' },
      {
        path: 'planner',
        component: PlannerPage,
        name: 'planner'
      },
      {
        path: 'planner/overview',
        component: PlannerOverview,
        name: 'overview'
      },
      {
        path: 'planner/routes',
        component: RoutesContainer,
        name: 'routes',
        children: [
          { path: 'saved', component: ExpansionReviseRoute, name: 'saved' },
          { path: 'pending', component: PendingRoutes, name: 'pending' },
          {
            path: 'confirmed',
            component: ExpansionReviseRoute,
            name: 'confirmed'
          },
          {
            path: 'scheduled',
            component: ExpansionReviseRoute,
            name: 'scheduled'
          },
          {
            path: 'completed',
            component: ExpansionReviseRoute,
            name: 'completed'
          }
        ]
      },
      { path: 'client-detail', component: AgentClientDetailPage, name: 'client-detail' },
      { path: 'client-detail/feedback', component: AgentFeedbackPage, name: 'feedback' },
      { path: 'communication', component: AgentCommunicationPage, name: 'communication' },
      { path: 'calendar', component: CalendarHandler, name: 'calendar' },
      // { path: 'clients', component: AllClientsContainer, name: 'clients' },
      { path: 'client-view', component: AllClientsContainer, name: 'client-view' },
      { path: 'sphere-of-influence', component: NotFound404, name: 'sphere-of-influence' },
      { path: 'search', component: AgentSearchPage, name: 'agent-search', props: true },
      { path: 'search/:homeId', component: DetailPropertyView, props: true }
    ]
  },
  { path: '/agent', redirect: '/agent/dashboard' }
]
