import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/pages/Login'
import Index from '@/pages'
import TodoList from '@/pages/todolist'
import AddressBook from '@/pages/addressBook'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
          path: '/todoList',
          component: TodoList,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/addressBook',
          component: AddressBook,
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