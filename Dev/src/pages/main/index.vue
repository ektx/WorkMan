<template>
	<section class="app-content">
		<header>
			<nav class="app-nav-mod" v-if="mainNav">
				<VMenuBar :nav="mainNav" />
			</nav>

			<div class="header-side-box" v-if="asideNav">
				<VMenuBar :nav="asideNav" direction="end"/>
			</div>
		</header>
		
		<main class="app-body-mod">
			<transition name="os">
				<keep-alive :include="keepAlive">
					<router-view></router-view>
				</keep-alive>
			</transition>
		</main>
	</section>
</template>

<script src="./main.js"></script>
<style lang="less" scoped src="./layout.less"></style>