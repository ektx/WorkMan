<template>
	<div id="app">
		<div :class="['app-bg-box', {blur: isBlur}]">
		</div>
		
		<div class="app-inner-box">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'app',
		computed: {
			isBlur: function() {
				return /^\/login/i.test(this.$route.fullPath)
			}
		}
	}
</script>

<style lang="scss" scoped>
#app {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	position: relative;

	.app-bg-box {
		position: absolute;
		width: 110%;
		height: 110%;
		margin: -5%;
		background: url(/contents/img/login/bg01.jpg);
		background-size: cover;
		z-index: 1;

		&.blur {
			filter: blur(10px);
		}
	}

	.app-inner-box {
		position: absolute;
		width: 100vw;
		height: 100vh;
		z-index: 100;
	}
}
</style>
