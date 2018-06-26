import { mapMutations, mapState, mapActions } from 'vuex'
import VContextmenu from '@ektx/v-contextmenu'
import VMenuBar from '@ektx/v-menubar'

export default {
    name: 'Main',
    components: {
        VContextmenu,
        VMenuBar
    },
    data () {
        return {
            userInfo: [
                {
                    title: this.userName,
                    children: [
                        {
                            title: '用户中心',
                            to: '/userCenter'
                        },
                        {
                            ico: '👤',
                            title: '退出',
                            fun: this.loginOut
                        }
                    ]
                }
            ]
        }
    },
    computed: {
        userName () {
            return this.$store.getters['userCenter/getInfo']('name')
            || localStorage.USER 
        },
        ...mapState('Main', {
            mainNav: state => state.mainNav,
            asideNav: state => state.asideNav,
            keepAlive: state => state.alive
        })
    },
    watch: {
        userName (val, old) {
            this.userInfo[0].title = val
        }
    },
    mounted: function () {
        this.$store.dispatch('userCenter/getUserInfo', () => {
            this['Main/setNav']({
                type: 'aside',
                data: this.userInfo
            })
        })
    },
    methods: {
        ...mapMutations(['Main/setNav']),
        ...mapActions(['userCenter/getUserInfo']),
        
        // 退出功能
        loginOut () {
            localStorage.removeItem('TOKEN')
            this.$router.push({path: '/login'})
        }
    }
}