import Vue from 'vue'
import Vuetify from 'vuetify'
import Header from '../Header.vue'

describe('Sidebar demo tests', () => {
  beforeEach(() => {
    Vue.use(Vuetify)
  })

  it('Should have correct `data`', () => {
    expect(typeof Header.data).toEqual('function')
  })

  it('Should load menu items', () => {
    expect(Header.data().menuItems.length).toBeGreaterThan(0)
  })
})
