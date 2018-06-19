export default {
    namespaced: true,
    state: {
        user: {
            account: '',
            name: '',
            email: '',
            ico: '',
            power: ''
        }
    },
    getters: {
        getInfo: (state) => (key) => {
            return state.user[key]
        }
    },
    mutations: {
        setUserInfo (state, data) {
            state.user = Object.assign({}, state.user, data)
        }
    }
}