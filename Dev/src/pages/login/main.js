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
			let inputs = document.querySelectorAll('input')

			if (!this.user) {
				inputs[0].focus()
				return
			}

			if (!this.pawd) {
				this.errMsg = '请输入密码'
				inputs[1].focus() 
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
