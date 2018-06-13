import { mapMutations } from 'vuex'

export default {
    name: 'mock',
    data () {
        return {
            //how set, see: https://github.com/ektx/v-menubar
            nav: [
                {
                    title: 'Mock',
                    to: '/'
                }
            ]
            // your data
        }
    },
    activated: function () {
        // default menu
        this.MutaionMacOSTopbar({
            type: 'main',
            data: this.nav
        })
    },
    methods: {
        ...mapMutations(['MutaionMacOSTopbar']),
    }
}