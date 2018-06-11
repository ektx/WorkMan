import { mapMutations } from 'vuex'

export default {
    name: 'userCenter',
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