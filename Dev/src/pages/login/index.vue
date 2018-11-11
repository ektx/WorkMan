<template>
	<section class="welcome-box">
		<div class="login-box">
			<figure>
				<svg viewBox="0 0 376 320" version="1.1" >
			        <polygon points="188 0 376 320 0 320"></polygon>
				</svg>
			</figure>

			<form v-on:submit.prevent="loginEvt" id="logo-form" class="logo-form">
				<VMacInput class="light" title="账号" v-model.trim="user" clearbtn/>
				<VMacInput class="light" title="密码" type="password" v-model.trim="pawd"/>
				
				<dl><button type="submit">登录</button></dl>
			</form>
		</div>
	</section>
</template>

<script>
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
</script>

<style lang="scss" scoped>
.welcome-box {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, .7);

	@supports (backdrop-filter: blur(5px)) {
		backdrop-filter: blur(1em);
		background: rgba(0, 0, 0, .2)
	}
}
.login-box {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 500px;
	height: 400px;
	transform: translate(-50%, -50%);
	z-index: 100;

	figure {
		width: 80px;
		height: 80px;
		margin: 10px auto 0;

		svg {
			width: 100%;
			fill: rgba(255, 255, 255, .5);
		}
	}
}

.logo-error {
	opacity: 1;
	font-size: 12px;
	text-align: center;
	color: white;
	padding: 10px 10px 0;
	transform: opacity .3s ease;
}


.logo-form {
	width: 400px;
	margin: 40px auto 0;

	button {
		display: block;
		width: 100%;
		margin: 25px auto 0;
		font-size: 18px;
		line-height: 2.2em;
		color: #fff;
		border: none;
		border-radius: 5px;
		background-color: rgba(255, 255, 255, .1);
		cursor: pointer;
		outline: none;
		transition: background-color .3s ease;

		&:hover {
			background-color: rgba(255, 255, 255, .2);
		}

		&[disabled] {
			background-color: rgba(255, 255, 255, .1);
			color: rgba(255, 255, 255, .2);
			pointer-events: none;
		}
	}
}

</style>
