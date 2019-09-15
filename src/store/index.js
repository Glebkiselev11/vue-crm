import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null

  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    async fetchCurrency(){
      // берет из файла .env по ключу VUE_APP_FIXER секретный ключ для доступа к бд
      const key = process.env.VUE_APP_FIXER

      // здесь он его подставляет
      const res = await fetch(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB`)
      return await res.json()
    },

    
  },
  getters: {
    error: s => s.error
  },
  
  // здесь те модули которые мы импортировали в данный файл (патерн MVC)
  modules: {
    auth, info, category, record
  }
})
