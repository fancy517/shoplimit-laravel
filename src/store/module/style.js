const state = {
  modal: {
    'height': '80%',
    'maxHeight': '200px',
    // Small size
    'small_width': '95%',
    'small_maxWidth': '500px',
    // Medium size
    'maxWidth': '550px',
    'width': '95%',
    // Large size
    'large_maxWidth': '900px',
    'large_width': '95%',
    // XLarge size
    'xlarge_maxWidth': '1600px',
    'xlarge_width': '95%'
  },
  alert: {
    // Medium size
    'maxWidth': '500px',
    'width': '75%',
    // Medium size
    'small_maxWidth': '420px'
  }
}

const getters = {
  // modal: state => state.modal
}

export default {
  namespaced: true,
  state,
  getters
}
