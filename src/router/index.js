import Vue from 'vue'
import Router from 'vue-router'

// Importing components
import AuthContainer from '../components/auth/AuthContainer.vue'
import AuthForm from '../components/auth/AuthForm.vue'
import AgentRegister from '../components/auth/AgentRegister.vue'
import NotFound404 from '../views/common/NotFound404.vue'

// Importing route modules
import agentRoutes from './agent'
import clientRoutes from './client'

// import TestingComponent from '../testing/TestingComponent.vue'

Vue.use(Router)

// Base routes that don't require a separate module
const baseRoutes = [
  {
    path: '/account',
    component: AuthContainer,
    props: true,
    children: [
      { path: 'login', name: 'login', component: AuthForm },
      { path: 'signup', name: 'signup', component: AgentRegister }
    ]
  },
  // Keeping this test component to check API endpoint responses
  // for development purposes only - will be removed later
  // { path: '/testing', component: TestingComponent, name: 'testing' },

  { path: '/agent/home', redirect: '/agent' },
  { path: '/client/home', redirect: '/agent' },
  { path: '/not-found', component: NotFound404, name: 'not-found' },
  // This is temporary redirecting to agent account
  { path: '/', redirect: '/account/login' },
  { path: '/*', redirect: '/not-found' }
]

// Append the route module to the baseRoutes
const routes = [...clientRoutes, ...agentRoutes, ...baseRoutes]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})
