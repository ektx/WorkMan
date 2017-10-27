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
					<li v-for="user in users">
						<figure class="user-icon">
							<img v-if="user.icon.length" :src="user.icon" alt="">
							<div v-else class="no-user-icon">{{ user.name.slice(0,1) }}</div>
						</figure>
						<dd>
							<dt>{{ user.name }}</dt>
							<dl>{{ user.mood }}</dl>
						</dd>
					</li>
				</ul>
				<p>共有 {{ users.length }} 位联系人</p>
			</div>
		</aside>

		<div class="user-info-mod">
			
		</div>
	</section>
</template>

<script>
	export default {
		name: 'AddressBook',
		data () {
			return {
				users: [
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					},
					{
						name: "Books",
						icon: "contents/img/logo.png",
						mood: '不想工作!'
					},
					{
						name: "Alis",
						icon: "",
						mood: '明天不上班!'
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './layout.scss'
</style>