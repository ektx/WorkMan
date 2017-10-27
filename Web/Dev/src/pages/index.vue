<template>
	<section class="app-content">
		<header>
			<nav class="app-nav-mod">
				<router-link to="/" class="logo-btn">
					<svg viewBox="0 0 376 320" version="1.1" title="WorkMan">
						<polygon points="188 0 376 320 0 320"></polygon>
					</svg>
				</router-link>
				<router-link 
					v-for="(nav, key) in navs" 
					:to="nav.to" 
					:key="nav.to"
					:class="{current: key === navIndex }"
				>
					{{ nav.title }}
				</router-link>
			</nav>
		</header>

		<router-view></router-view>
		
		<!-- 右键菜单 -->
		<VContextmenus></VContextmenus>
	</section>
</template>

<script>
	
	// 右键菜单组件
	import VContextmenus from 'v-contextmenus'

	export default {
		name: 'index',
		components: {
			VContextmenus
		},
		data () {
			return {
				navIndex: 0,
				navs: [
					{
						title: '计划',
						to: '/todoList'
					},
					{
						title: '通讯录',
						to: '/addressBook'
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
		box-sizing: border-box;
		background: rgba(255, 255, 255, .85);
		backdrop-filter: blur(5px);
	}
}

.app-nav-mod {
	flex: 1;
	/*margin-left: 1em;*/
	align-items: center;

	a {
		display: inline-block;
		height: 100%;
		padding: 0 .8em;
		color: #333;
		font-size: 14px;
		line-height: 40px;
		vertical-align: top;

		&.logo-btn {
			display: inline-block;
			width: 18px;
			/*padding: 0;*/
			line-height: 45px;
			
			& > svg {
				width: 18px;
				fill: #f44336;
			}
		}

		&:hover {
			background: rgba(255, 255, 255, .5);
		}

		&.router-link-active {
			color: #f44336
		}
	}
}
</style>