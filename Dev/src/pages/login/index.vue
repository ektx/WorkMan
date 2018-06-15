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

				<VMacInput class="light" title="帐号" v-model.trim="user" clearbtn/>
				<VMacInput class="light" title="密码" type="password" v-model.trim="pawd"/>
				
				<dl><button type="submit">登录</button></dl>
			</form>
		</div>
	</section>
</template>

<script src="./main.js"></script>
<style lang="less" scoped src="./layout.less"></style>
