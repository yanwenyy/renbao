export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    loginName:'',
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateLoginName (state, name) {
      state.loginName = name
    }
  }
}
