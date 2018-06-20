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
            if(this.pwd.length<6||this.pwd.length>16){
                this.pwdHelp = {
                    mes: '密码长度为6-16个字符',
                    status: 'error'
                }
            }else if(!reg.test(this.pwd)) {
                this.pwdHelp = {
                    mes: '密码应为数字和字母的组合',
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
            if(this.surepwd === this.pwd){
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
        }
    }
}