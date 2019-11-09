import Vue from 'vue'
import Vuex from 'vuex'

import agent from './module/agent'
import client from './module/client'
import common from './module/common'
import home from './module/home'
import buyer from './module/buyer'
import style from './module/style'
import mobile from './module/mobile'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    agent,
    client,
    common,
    home,
    buyer,
    style,
    mobile
  }
})

export default store
