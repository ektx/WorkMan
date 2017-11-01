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

			<div class="header-side-box">
				<div class="header-nav-box">
					<header>{{ user }}</header>
					<ul>
						<li>退出</li>
					</ul>
				</div>
			</div>
		</header>
		
		<main class="app-body-mod">
			<router-view></router-view>
		</main>
		
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
				user: localStorage.USER,
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
		position: absolute;
		top: 0;
		left: 0;
		height: 40px;
		width: 100%;
		padding: 0 1rem;
		box-sizing: border-box;
		background: rgba(255, 255, 255, .85);
		backdrop-filter: blur(5px);
		z-index: 10000;
	}
}

.app-nav-mod {
	flex: 1;
	align-items: center;

	a {
		display: inline-block;
		height: 100%;
		padding: 0 .8em;
		color: #333;
		font-size: 1.2rem;
		line-height: 40px;
		vertical-align: top;

		&.logo-btn {
			display: inline-block;
			width: 18px;
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
.app-body-mod {
	position: absolute;
	top: 40px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
	display: flex;
}
.header-side-box {
	float: right;
	font-size: 1.2rem;
	line-height: 40px;

	& .header-nav-box:last-child {
		ul {
			right: 0;
		}
	}
}
.header-nav-box {

	ul {
		visibility: hidden;
		position: absolute;
		min-width: 70px;
		padding: 2px 0;
		background: #fff;
		white-space: nowrap;
		z-index: 1000;

		li {
			padding: 3px 5px;
			line-height: 2rem;
			cursor: pointer;

			&:hover {
				background: #f5f5f5;
			}
		}
	}

	&:hover ul {
		visibility: visible;
	}
}
</style>