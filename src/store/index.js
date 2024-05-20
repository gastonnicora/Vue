import { createStore } from 'vuex'

export default createStore({
  state: {
    server: '',
    isLoading: false,
    token: '',
    auctions: {},
    session: null
  },
  getters: {},
  mutations: {
    SET_CONNECTION (state) {
      let conn
      const env = process.env.NODE_ENV || 'development'
      if (env === 'development') {
        conn = 'http://localhost:4000/'
      } else {
        conn = '/api/'
      }
      state.connection = conn
    }
  },
  actions: {},
  modules: {}
})
