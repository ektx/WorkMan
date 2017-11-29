
export default {
	name: 'login',
	data () {
		return {
			user: '',
			pawd: '',
			errMsg: '',
			apply: false
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
		loginEvt: function() {

			this.errMsg = '';
			let that = this;
			let query;

			if (!this.user) {
				document.querySelectorAll('input')[0].focus(); 
				return;
			}

			if (!this.pawd) {
				document.querySelectorAll('input')[1].focus(); 
				return;
			}

			if (this.apply) {
				query = {query: `mutation { userAdd(data: { account: "${this.user}", pwd: "${this.pawd}"}){account}}`}
			} else {
				query = {
					user: this.user,
					pwd: this.pawd
				}
			}

			fetch(this.apply ? '/api': '/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(query)
			})
			.then(res => res.json())
			.then( data => {

				if (this.apply) {
					if ('errors' in data) {
						this.errMsg = '此用户已经存在!'
					} else {
						this.errMsg = '注册成功!'
						this.apply = false
					}
				} else {
					if (data.status) {
						localStorage.TOKEN = data.token
						localStorage.USER = this.user

						that.$router.push({path: '/'})
					} else {
						this.errMsg = data.msg
					}
				}

			})
			.catch(err => {
				console.error(err)
			})	
		}
	}
}
