import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/pages/Login'
import Index from '@/pages'
import TodoList from '@/pages/todolist'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Index,
      meta: {
      	requiresAuth: true
      },
      children: [
        {
          path: '',
          component: TodoList,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'user',
          component: Hello,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
    	path: '/login',
    	name: 'Login',
    	component: Login,
    	meta: {
    		requiresAuth: false
    	}
    }
  ]
})



router.beforeEach((to, from, next) => {

	if (to.meta.requiresAuth) {
		if (localStorage.getItem('TOKEN')) {
			next()
		}
		else {
			next({name: 'Login'})
		}
	} else {
		next()
	}

})


export default router