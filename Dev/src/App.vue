<template>
	<div id="app">
		<div class="v-macOS-lay">
			<div class="app-bg-box"></div>
			
			<div class="app-inner-box">
				<transition name="os">
					<router-view/>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import './assets/css/scrollBar.css'

export default {
	name: 'app'
}
</script>

<style lang="less">
#app {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	position: relative;

	.app-bg-box {
		background-image: url('/img/login/bg01.jpg');
	}
}
/* app 切换动画 */
.os-enter-active,
.os-leave-active {
	transition: transform .5s, opacity .5s;
}
.os-enter {
	transform: scale(.8);
	opacity: 0;
}
.os-leave-to {
	transform: scale(1.2);
	opacity: 0;
}

.v-macOS-lay {
    position: fixed;
    top: 0;
    left: 0;
	height: 100vh;
	width: 100vw;
    overflow: hidden;
    z-index: 1;

	.app-bg-box {
		position: absolute;
		width: 110%;
		height: 110%;
		margin: -5%;
		background-size: cover;
		z-index: 1;
	}

	.app-inner-box {
		position: absolute;
		width: 100vw;
		height: 100vh;
		z-index: 100;
	}
}
</style>
