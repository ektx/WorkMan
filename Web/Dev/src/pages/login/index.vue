<template>
	<section class="welcome-box">

		<div class="login-box">
			<figure>
				<svg viewBox="0 0 376 320" version="1.1" >
			        <polygon points="188 0 376 320 0 320"></polygon>
				</svg>
			</figure>

			<form v-on:submit.prevent="loginEvt" id="logo-form" class="logo-form">

				<p v-show="errMsg" class="logo-error">{{errMsg}}</p>

				<dl>
					<dd>
						<input type="text" placeholder="帐号" v-model.trim="user" v-focus>
					</dd>
				</dl>

				<dl>
					<dd>
						<input type="password" placeholder="密码" v-model.trim="pawd" v-focus>
					</dd>
				</dl>

				<dl><button type="submit">{{apply ? '申请' : '登录'}}</button></dl>
			</form>
		</div>
		
		<div class="apply-account-link">
			<a @click.prevent="apply = !apply" href="#">{{ apply ? '登录' : '申请' }}账号</a>
		</div>
	</section>
</template>

<script>
 import main from './main'
export default main
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import './layout.scss'
</style>
