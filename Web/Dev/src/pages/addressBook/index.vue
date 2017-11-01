<template>
	<section class="address-book-app">
		<aside class="address-user-box">

			<header>
				<input type="text" placeholder="通讯录" disabled>
				
				<button class="tbtn">
					<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
						<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
					</svg>
				</button>	
			</header>
			
			<div class="users-list-mod">
				<ul class="user-list-box">
					<li v-for="(usr, key) in users" 
						:class="[key === holdIndex ? 'current' : '']"
						:data-id="usr.id"
						@click="holdThisUsr(key)"
					>
						<figure class="user-icon">
							<img v-if="usr.icon.length" :src="usr.icon" alt="">
							<div v-else class="no-user-icon">{{ usr.name.slice(0,1) }}</div>
						</figure>
						<dd>
							<dt>{{ usr.name }}</dt>
							<dl>{{ usr.mood }}</dl>
						</dd>
					</li>
				</ul>
				<p>共有 {{ users.length }} 位联系人</p>
			</div>
		</aside>

		<div class="user-info-mod">
			<figure>
				<img v-if="user.icon && user.icon.length" :src="user.icon" :alt="[user.name + ' 头相']">
				<div v-else-if="user.name && user.name.length" class="no-user-icon">{{ user.name.slice(0,1) }}</div>

			</figure>
			<h3>{{ user.name }}</h3>
			<h5>{{ user.mood }}</h5>

			<ul class="user-contact-list" v-for="val in user.contact">
				<li>
					{{val}}
				</li>
			</ul>
		</div>
	</section>
</template>

<script>
	import main from './main'

	export default main
</script>

<style lang="scss" scoped>
	@import './layout.scss'
</style>