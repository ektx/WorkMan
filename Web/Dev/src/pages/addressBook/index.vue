<template>
	<section class="address-book-app">
		<aside class="address-user-box">

			<header>
				<input type="text" placeholder="通讯录" disabled>
				
				<button @click="addNewType" class="tbtn">
					<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
						<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
					</svg>
				</button>	
			</header>

			<ul class="user-list-box">
				<li v-for="user in users">
					{{ user.name }}
				</li>
			</ul>
		</aside>
	</section>
</template>

<script>
	export default {
		name: 'AddressBook',
		data () {
			return {
				users: [
					{
						name: "Books"
					},
					{
						name: "Alis"
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './layout.scss'
</style>