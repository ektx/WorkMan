import { mapMutations, mapState } from 'vuex'
import VMacInput from '../../components/VMacInput'

export default {
    name: 'userCenter',
    components: { VMacInput },
    data () {
        return {
            nameHelp: {},
            nameErr: "Something was error!",
            pwd: '12345',
            pwdErr: ''
        }
    },
    computed: {
        ...mapState({
            userInfo: state => {
                return state.userCenter.user
            }
        })
    },
    watch: {
        name (val, old) {
            console.log(val)
            if (val === 'zwl') {
                this.nameHelp = {
                    mes: "Great!!",
                    status: 'success'
                }
            } else if (val === 'err') {
                this.nameHelp = {
                    mes: "Error!!",
                    status: 'error'
                }
            } else if (val === 'warn') {
                this.nameHelp = {
                    mes: "Error!!",
                    status: 'warn'
                }
            } else {
                this.nameHelp = {
                    mes: "用户名默认为：Admin",
                    status: 'info'
                }
            }
        }
    },
    activated: function () {
        this.MutaionMacOSTopbar({
            type: 'main',
            data: [
                {
                    title: '用户中心',
                    to: '/'
                }
            ]
        })

    },
    mounted: function () {
        // this.$axios.post('/api', {
        //     query: `{ findUser { success mes data{ account name email ico power reset} } } `
        // }).then(res => {
        //     console.log(res)
        //     // this.userInfo = res.data.findUser
        //     this['userCenter/setUserInfo']( res.data.findUser.data )
        // })
    },
    methods: {
        ...mapMutations(['MutaionMacOSTopbar', 'userCenter/setUserInfo']),

        say (evt) {
            console.log(evt)
            console.log(this.pwd)

            this.pwd = evt.target.value
        },

        // 更新用户信息
        updateInfo () {
            this.$axios.post('/api', {
                query: `mutation {UserUpdate(data:{
                    name: "${this.userInfo.name}",
                    email: "${this.userInfo.email}"
                }){success mes}}`
            }).then(res => {
                this['userCenter/setUserInfo']( this.userInfo )
            })
        }
    }
}