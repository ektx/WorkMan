import VMacInput from '@/components/VMacInput'
import { mapMutations } from 'vuex'

export default {
	name: 'login',
	components: { VMacInput },
	data () {
		return {
			user: '',
			pawd: ''
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
		...mapMutations(['userCenter/setUserInfo']),

		loginEvt () {
			let inputs = document.querySelectorAll('input')

			if (!this.user) {
				this.$Message.warning('请输入账号')
				inputs[0].focus()
				return
			}

			if (!this.pawd) {
				this.$Message.warning('请输入密码')
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

					this['userCenter/setUserInfo'](res.data)
					this.$router.push({path: '/'})
				} else {
					this.$Message.error(res.mes)
				}
			}).catch(err => {
				this.$Message.error(err)
			})
		}
	}
}
