import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/pages/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
      meta: {
      	requiresAuth: true
      }
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
	console.log(to, from)

	if (to.meta.requiresAuth) {
		if (localStorage.getItem('token')) {
			next()
		}
		else {
			console.log('nnn')
			next({name: 'Login'})
		}
	} else {
		next()
	}

})


export default router