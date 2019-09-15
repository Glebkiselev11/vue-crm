import firebase from 'firebase/app'

export default {
  state: {
    info: {}
  },
  mutations: {
    setInfo(state, info) {
      state.info = info
    },
    // clearInfo нужно чтобы фронтенд не кишировал что ли бо в стейте когда мы будем выходить с сайта (Logout)
    // для того чтобы сессии пользователей если мы будем заходить в разные аккаунты не пересекались
    clearInfo(state) {
      state.info = {}
    }
  },
  actions: {
    async updateInfo({dispatch, commit, getters}, toUpdate) {
      try {
        const uid = await dispatch('getUid')
        const updateData = {...getters.info, ...toUpdate}
        await firebase.database().ref(`/users/${uid}/info`).update(updateData)
        
        // обновляем данные на фронтенде
        commit('setInfo', updateData)
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async fetchInfo({dispatch, commit}) {
      try {
        const uid = await dispatch('getUid')
        const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val()
        commit('setInfo', info)
      } catch (e) {
        commit('setError', e)
        throw e
      }
      
    }
  },
  getters: {
    info: s => s.info
  }
}