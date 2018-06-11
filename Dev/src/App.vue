<template>
	<div id="app">
		<VMacOSFrame />
	</div>
</template>

<script>
import './assets/css/scrollBar.css'
import { VMacOSFrame } from '@ektx/v-macos'

export default {
	name: 'app',
	components: { VMacOSFrame }
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
</style>
