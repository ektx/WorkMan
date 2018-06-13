import { mapMutations } from 'vuex'
import VMacInput from '../../components/VMacInput'

export default {
    name: 'userCenter',
    components: { VMacInput },
    data () {
        return {
            name: "zwl"
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
        ...mapMutations(['MutaionMacOSTopbar']),
    }
}