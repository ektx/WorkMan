import Axios from '@/assets/js/myAxios'

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
            console.log('US')
            state.user = Object.assign({}, state.user, data)
        }
    },
    actions: {
        getUserInfo ({commit}, callback) {
            console.log('usercenter actions')
            Axios.post('/api', {
                query: `{ findUser { success mes data{ account name email ico power reset} } } `
            }).then(res => {
                commit('setUserInfo', res.data.findUser.data )
                if (callback) callback()
            })
        }
    }
}