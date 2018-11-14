// node_modules mod
import Vue from 'vue'
import iView from 'iview'
import Quill from 'quill'
import VContextmenu from '@ektx/v-contextmenu'

// localhost mod
import App from './App'
import router from './router'
import store from './store'
import Axios from '@/assets/js/myAxios'
import iziToast from '@/assets/js/myIziToast'
import calendar from '../public/js/calendar'
import './assets/js/autoComponent'

// node_modules css
import 'iview/dist/styles/iview.css'
import '@ektx/v-contextmenu/dist/vcontextmenu.css'

Vue.use(iView)
Vue.use(VContextmenu)

// 富文本编辑器
window.Quill = Quill
// 
window.calendar = calendar

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

Vue.prototype.$axios = Axios
Vue.prototype.$iziToast= iziToast

Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
