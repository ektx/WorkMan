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

				<dl><button type="submit">登录</button></dl>
			</form>
		</div>
	</section>
</template>

<script src="./main.js"></script>
<style lang="less" scoped src="./layout.less"></style>
