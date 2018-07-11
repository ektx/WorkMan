import { mapMutations, mapState } from 'vuex'
import G2Q from '@/assets/js/parse2graphQl.js'

export default {
    name: 'userCenter',
    data () {
        return {
        }
    },
    computed: {
        userInfo () {
            return this.$store.state.userCenter.user
        }
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

        // [SYMBOL] exit app
        EXIT_APP () {
            this.$router.push({path: '/'})
            this['Main/removeAlive']('todolist')
        },
        // [SYMBOL] set default nav
        SET_MAIN_NAV () {
            console.log(this.userInfo)
            let nav = [
                {
                    title: '用户中心',
                    children: [
                        {
                            title: '退出',
                            fun: this.EXIT_APP
                        }
                    ]
                },
                {
                    title: ' 基础信息',
                    to: 'base-info'
                }
            ]

            if (this.userInfo.power === 'admin') {
                nav.push({
                    title: '用户管理',
                    to: '/user/user-management'
                }, {
                    title: '角色管理',
                    to: '/user/character'
                }, {
                    title: '服务器邮件设置',
                    to: '/user/send-mail'
                })
            }

            this['Main/setNav']({
                type: 'main',
                data: nav
            })
        },
    }
}