import { mapMutations, mapState } from 'vuex'
import VMacInput from '../../components/VMacInput'
import AddUser from './parts/addUser'
import AddCharacter from './parts/addCharacter'
import MyInfo from './parts/myInfo'
import G2Q from '@/assets/js/parse2graphQl.js'

export default {
    name: 'userCenter',
    components: { 
        VMacInput,
        AddUser,
        AddCharacter,
        MyInfo
     },
    data () {
        return {
            pwdHelp:{},
            surePwdHelp:{},
            pwd: '',
            pwdError: '',
            surepwd: '',
            surepwdError: '',
            pwdErr: ''
        }
    },
    computed: {
       
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
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()
    },
    mounted: function () {
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()
        // [SYMBOL] 设置缓存应用
        this['Main/setToAlive']({
            title: '用户中心', // app名称
            cache: 'userCenter', // 缓存名
            path: '/userCenter'  // 路由中访问路径
        })
    },
    methods: {
        ...mapMutations(['Main/setNav', 'Main/setToAlive', 'Main/removeAlive', 'userCenter/setUserInfo']),

        
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

        
        // [SYMBOL] exit app
        EXIT_APP () {
            this.$router.push({path: '/'})
            this['Main/removeAlive']('todolist')
        },
        // [SYMBOL] set default nav
        SET_MAIN_NAV () {
            this['Main/setNav']({
                type: 'main',
                data: [
                    {
                        title: '用户中心',
                        children: [
                            {
                                title: '退出',
                                fun: this.EXIT_APP
                            }
                        ]
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
        },

        // 更新用户信息
        updateInfo (data, callback) {
            let send = G2Q(data)
            this.$axios.post('/api', {
                query: `mutation {UserUpdate(data:${send}){success mes}}`
            }).then(res => {
                debugger
                this['userCenter/setUserInfo']( this.userInfo )
            })
        },
    }
}