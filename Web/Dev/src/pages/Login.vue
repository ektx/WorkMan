<template>
	<section class="welcome-box">

		<div class="login-box">
			<figure>
				<svg viewBox="0 0 376 320" version="1.1" >
			        <polygon points="188 0 376 320 0 320"></polygon>
				</svg>
			</figure>

			<form id="logo-form" class="logo-form" action="">

				<p v-show="errMsg" class="logo-error">{{errMsg}}!</p>

				<dl>
					<dd>
						<input type="text" placeholder="帐号" v-model.trim="user">
					</dd>
				</dl>

				<dl>
					<dd>
						<input type="password" placeholder="密码" v-model.trim="pawd">
					</dd>
				</dl>

				<dl><button type="submit" @click="loginEvt">登录</button></dl>
			</form>
		</div>

	</section>
</template>

<script>

export default {
	name: 'login',
	data () {
		return {
			user: '',
			pawd: '',
			errMsg: ''
		}
	},
	created: function() {

	},
	methods: {
		loginEvt: function() {

			this.errMsg = '';

			if (!this.user) {
				document.querySelectorAll('input')[0].focus(); 
				return;
			}

			if (!this.pawd) {
				document.querySelectorAll('input')[1].focus(); 
				return;
			}

			fetch('http://localhost:4000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user: this.user,
					pwd: this.pawd
				})
			})
			.then(res => res.json())
			.then( data => {

				if (data.status) {
					localStorage.TOKEN = data.token

					// 跳转主页
					this.$router.push('/')
				} else {
					this.errMsg = data.msg
				}

			})
			.catch(err => {
				console.error(err)
			})	
		}
	}
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.welcome-box {
	height: 100vh;
	width: 100vw;
	padding: 40px 0;
	text-align: center;
	color: #333;
	box-sizing: border-box;

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

.login-box {
	position: fixed;
	left: 50%;
	top: 50%;
	width: 500px;
	height: 400px;
	transform: translate(-50%, -50%);
	z-index: 100;
}

.logo-error {
	opacity: 1;
	font-size: 12px;
	color: red;
	padding: 10px 10px 0;
	transform: opacity .3s ease;
}

.logo-form input {
	display: block;
	width: 85%;
	margin: 1.4em auto 0;
	font-size: 16px;
	line-height: 2.4em;
	color: #FFF;
	text-align: center;
	border: none;
	border-bottom: 2px solid rgba(255, 255, 255, .1);
	background: rgba(255, 255, 255, .05);
	outline: none;
	transition: color .3s ease, border .3s ease;

	&::-webkit-input-placeholder {
		color: #fff;
	}

	&:focus {
		border-bottom-color: rgba(255, 255, 255, .5);
	}
}

.logo-form button {
	width: 85%;
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

</style>
