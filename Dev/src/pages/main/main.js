import { VMacOSDesktop } from '@ektx/v-macos'
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
    name: 'index',
    components: {
        VMacOSDesktop
    },
    data () {
        return {
            userInfo: [
                {
                    title: this.$store.getters['userCenter/getInfo']('name'),
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
        }
    },
    watch: {
        userName (val, old) {
            this.userInfo[0].title = val
        }
    },
    mounted: function () {
        this.$store.dispatch('userCenter/getUserInfo', () => {
            this.MutaionMacOSTopbar({
                type: 'aside',
                data: this.userInfo
            })
        })
    },
    methods: {
        ...mapMutations(['MutaionMacOSTopbar']),
        ...mapActions(['userCenter/getUserInfo']),
        
        // 退出功能
        loginOut () {
            localStorage.removeItem('TOKEN')
            this.$router.push({path: '/login'})
        }
    }
}