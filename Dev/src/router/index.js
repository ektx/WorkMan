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
            path: '/admin',
            component: loadView('admin')
        },
        {
            path: '/',
            component: Index,
            // 添加各应用功能路径
            children: [
                {
                    path: '/todo',
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
                    path: '/user',
                    component: loadView('userCenter'),
                    children: [
                        {
                            path: 'user-management',
                            component: loadView('userCenter/parts/userManagement')
                        },
                        {
                            path: 'character',
                            component: loadView('userCenter/parts/addCharacter')
                        },
                        {
                            path: 'send-mail',
                            component: loadView('userCenter/parts/sendMail')
                        },
                        {
                            path: '*',
                            component: loadView('userCenter/parts/baseInfo')
                        }
                    ]
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
