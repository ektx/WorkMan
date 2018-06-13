// node_modules mod
import Vue from 'vue'
import iView from 'iview'

// localhost mod
import App from './App'
import router from './router'
import store from './store'
import Axios from '@/assets/js/myAxios'
import iziToast from '@/assets/js/myIziToast'
import Quill from 'quill'
import calendar from '../public/js/calendar'

// node_modules css
import 'iview/dist/styles/iview.css'

Vue.use(iView)

window.Quill = Quill
window.calendar = calendar

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

Vue.prototype.$axios = Axios
Vue.prototype.$iziToast= iziToast

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
