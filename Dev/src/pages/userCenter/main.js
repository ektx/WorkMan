import { mapMutations } from 'vuex'
import { Tabs, TabPane } from 'iview'

export default {
    name: 'userCenter',
    components: { Tabs, TabPane },
    data () {
        return {

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
    methods: {
        ...mapMutations(['MutaionMacOSTopbar'])
    }
}