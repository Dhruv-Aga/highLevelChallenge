import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage
})

const getDefaultState = () => {
  return {
    params: {},
    loader: false,
    snackbar: {
      show: false,
      color: 'primary'
    }
  }
}

export default new Vuex.Store({
  plugins: [vuexStorage.plugin],
  state: getDefaultState(),
  mutations: {
    loader (state, payload) {
      state.loader = payload
    },
    snackbar (state, payload) {
      state.snackbar = payload
    },
    params (state, payload) {
      state.params = payload
    }
  },
  actions: {
    showMsg ({ commit }, msg) {
      commit('snackbar', {
        msg: msg,
        show: true
      })
    },
    showError ({ commit }, error) {
      console.log(error)
      commit('snackbar', {
        msg: error.data.msg,
        show: true
      })
    }
  }
})
