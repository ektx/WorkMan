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
				<div @click="showHeaderNav" :class="['header-nav-box', {closeBox: showHeaderMenu}]">
					<header>👤 {{ user }}</header>
					<ul v-show="showHeaderMenu">
						<li @click="loginOut">❌ 退出</li>
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
				],
				showHeaderMenu: false
			}
		},
		methods: {
			// 顶部用户菜单
			showHeaderNav () {
				this.showHeaderMenu = !this.showHeaderMenu
			},

			// 退出功能
			loginOut () {
				localStorage.removeItem('TOKEN')
				this.$router.push({path: '/login'})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import './layout.scss'
</style>