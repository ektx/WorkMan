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
        this.setMainNav()
    },
    mounted: function () {
        this.setMainNav()
    },
    methods: {
        ...mapMutations(['Main/setNav', 'userCenter/setUserInfo']),

        /**
         * 测试功能
         * @param {object} evt 事件
         */
        say (evt) {
            console.log(evt)
            console.log(this.pwd)

            this.pwd = evt.target.value
        },
        // 验证密码
        verifyPwd () {
            if (this.pwd === ''){
                this.pwdHelp = {
                    mes: '此项不能为空',
                    status: 'error'
                }
            } else {
                this.pwdHelp = {
                    mes: '',
                    status: 'success'
                }
            }
        },
        // 验证密码是否相同
        verifyPwdSure () {
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
                this['userCenter/setUserInfo']( this.userInfo )
            })
        },
        // 设置主菜单
        setMainNav () {
            this['Main/setNav']({
                type: 'main',
                data: [
                    {
                        title: '用户中心',
                        to: '/'
                    }
                ]
            })
        },


        // 修改密码
        updatePwd () {
            this.$axios.post('/api', {
                query: `mutation {UserUpdate(data:{
                    pwd: "${this.pwd}"
                }){success mes}}`
            }).then(res => {
                if (res.data.UserUpdate.success)
                    this.$Message.success('保存成功')
            })
        }
    }
}