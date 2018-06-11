import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/main'
import Login from '@/pages/login'

Vue.use(Router)

function loadView (view) {
    return () => import(/* webPackChunkName: "view-[reequest]" */ `@/pages/${view}/index.vue`)
}

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/',
            component: Index,
            // 添加各应用功能路径
            children: [
                {
                    path: '/todoList',
                    component: loadView('todolist')
                },
                {
                    path: '/addressBook',
                    component: loadView('addressBook')
                },
                {
                    path: '/mock',
                    component: loadView('mock')
                },
                {
                    path: '/userCenter',
                    component: loadView('userCenter')
                },
                // 默认桌面功能，类似404
                {
                    path: '*',
                    component: loadView('desktop')
                }
            ]
        }
    ]
})
