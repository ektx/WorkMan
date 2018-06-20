import { mapMutations, mapState } from 'vuex'
import VMacInput from '../../components/VMacInput'

export default {
    name: 'userCenter',
    components: { 
        VMacInput
     },
    data () {
        return {
            nameHelp: {},
            pwdHelp:{},
            surePwdHelp:{},
            nameErr: "Something was error!",
            pwd: '',
            pwdError: '',
            surepwd: '',
            surepwdError: '',
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
        this.$axios.post('/api', {
            query: `{ findUser { success mes data{ account name email ico power reset} } } `
        }).then(res => {
            console.log(res)
            // this.userInfo = res.data.findUser
            this['userCenter/setUserInfo']( res.data.findUser.data )
        })
    },
    methods: {
        ...mapMutations(['MutaionMacOSTopbar', 'userCenter/setUserInfo']),

        say (evt) {
            console.log(evt)
            console.log(this.pwd)

            this.pwd = evt.target.value
        },
        verifyPwd () {
            console.log(this.pwd)
            let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
            if(this.pwd===''){
                this.pwdHelp = {
                    mes: '此项不能为空',
                    status: 'error'
                }
            }else{
                this.pwdHelp = {
                    mes: '',
                    status: 'success'
                }
            }
        },
        verifyPwdSure () {
            console.log(this.surepwd)
            if(this.surepwd===''){
                this.surePwdHelp = {
                    mes: '此项不能为空',
                    status: 'error'
                }
            }else if(this.surepwd === this.pwd){
                this.surePwdHelp = {
                    mes: '',
                    status: 'success'
                }
            }else{
                this.surePwdHelp = {
                    mes: '密码不一致',
                    status: 'error'
                }
            }
        },

        // 更新用户信息
        updateInfo () {
            this.$axios.post('/api', {
                query: `mutation {UserUpdate(data:{
                    name: "${this.userInfo.name}",
                    email: "${this.userInfo.email}"
                }){success mes}}`
            }).then(res => {
                console.log(res)
            })
        },


        // 修改密码
        updatePwd () {
            this.$axios.post('/api', {
                query: `mutation {UserUpdate(data:{
                    pwd: "${this.pwd}"
                }){success mes}}`
            }).then(res => {
                console.log(res)
            })
        }
    }
}