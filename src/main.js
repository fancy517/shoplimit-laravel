import Vue from 'vue'
import Vuetify from 'vuetify'
import * as VueGoogleMaps from 'vue2-google-maps'
import router from './router/index'
import VueScrollTo from 'vue-scrollto'
import VueLazyLoad from 'vue-lazyload'
import VueTouch from 'vue-touch'

import store from './store'
import App from './App.vue'
import SvgIcon from 'vue-svgicon'

import 'vuetify/dist/vuetify.min.css'
import 'vue-image-lightbox/dist/vue-image-lightbox.min.css'
import colors from './scss/_colors.scss'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueLazyLoad)
Vue.use(SvgIcon, {
  tagName: 'svg-icon'
})

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD_kc4SaC47DMdkGGGE_CqJ2IY6Fu70nkg',
    libraries: 'places, directions' // necessary for places input
  }
})

Vue.use(VueScrollTo)

/**
 * Defining a global prototype variable for blue buttons for now
 * A global data mixin can also be used here, will be looking for requirements
 */
Vue.prototype.$btnHwayzBlue = colors.hwayzBlue

Vue.directive('custom-outside-click', {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
