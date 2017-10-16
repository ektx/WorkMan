<template>
	<section class="app-content">
		<header>
			<img src="/contents/img/logo.png" alt="workman">

			<nav class="app-nav-mod">
				<router-link v-for="nav in navs" :to="nav.to" :key="nav.to">{{ nav.title }}</router-link>
			</nav>
		</header>

		<router-view></router-view>
	</section>
</template>

<script>
	export default {
		name: 'index',
		data () {
			return {
				navs: [
					{
						title: '计划',
						to: ''
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
.app-content {
	display: flex;
	height: 100%;
	width: 100%;
	flex-direction: column;

	& > header {
		display: flex;
		height: 40px;
		width: 100%;
		padding: 0 1rem;
		border-bottom: 1px solid #eee;

		& > img {
			height: 100%;
		}
	}
}

.app-nav-mod {
	flex: 1;
	align-items: center;

	a {
		display: inline-block;
		height: 100%;
		padding: 0 15px;
		color: #333;
		font-size: 14px;
		line-height: 40px;
	}
}
</style>