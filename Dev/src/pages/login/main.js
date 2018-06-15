import VMacInput from '../../components/VMacInput'
export default {
	name: 'login',
	components: { VMacInput },
	data () {
		return {
			user: '',
			pawd: '',
			errMsg: ''
		}
	},
	directives: {
		focus: {
			inserted: function(el, binding) {
				if (!el.value) el.focus()
			}
		}
	},
	// 当DOM结构挂载到指定元素之后调用
	mounted: function() {
		// 如果本地存储中有用户名称在
		// 我们自动添加登录用户名
		if (localStorage.USER) {
			this.user = localStorage.USER
		}
	},
	methods: {
		loginEvt () {
			this.errMsg = '';

			if (!this.user) {
				document.querySelectorAll('input')[0].focus()
				return
			}

			if (!this.pawd) {
				this.errMsg = '请输入密码'
				document.querySelectorAll('input')[1].focus() 
				return
			}
			
			this.$axios.post('/login', {
				user: this.user,
				pwd: this.pawd
			}).then(res => {
				if (res.status) {
					localStorage.TOKEN = res.token
					localStorage.USER = this.user

					this.$router.push({path: '/'})
				} else {
					this.errMsg = res.mes
				}
			}).catch(err => {
				console.error(err)
			})
		}
	}
}
