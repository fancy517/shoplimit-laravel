const state = {
  windowWidth: window.innerWidth,
  homeSearchHeader: [
    { text: '', value: 'name' },
    { text: 'Saved Homes', value: 'savedHomes' },
    { text: 'Toured Homes', value: 'touredHomes' },
    { text: 'Feedback', value: 'feedback' },
    { text: 'Last Active', value: 'lastActive' }
  ],
  homeSearchData: [
    {
      'id': '0',
      'name': 'Ali M',
      'savedHomes': 'Home 1',
      'touredHomes': 'T Home 1',
      'feedback': '1',
      'lastActive': '22.12.2018.'
    },
    {
      'id': '1',
      'name': 'Damir B',
      'savedHomes': 'Home 2',
      'touredHomes': 'T Home 2',
      'feedback': '2',
      'lastActive': '24.01.2019.'
    },
    {
      'id': '2',
      'name': 'Haris A',
      'savedHomes': 'Home 3',
      'touredHomes': 'T Home 3',
      'feedback': '3',
      'lastActive': '12.01.2019.'
    },
    {
      'id': '3',
      'name': 'Denis S',
      'savedHomes': 'Home 4',
      'touredHomes': 'T Home 4',
      'feedback': '4',
      'lastActive': '14.12.2018.'
    }
  ],
  activeRoute: ''
}

const getters = {
  homeSearchData: state => state.homeSearchData
}

const mutations = {
  SET_WINDOW_WIDTH: (state, payload) => {
    state.windowWidth = payload
  },
  SET_ACTIVE_ROUTE: (state, payload) => {
    // console.log(payload)
    state.activeRoute = payload
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
