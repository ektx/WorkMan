<template>
	<section class="address-book-app">
		<aside class="address-user-box">

			<header>
				<input type="text" placeholder="Search...">
				
				<button class="tbtn" @click="addAUser">
					<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
						<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
					</svg>
				</button>	
			</header>
			
			<div class="users-list-mod">
				<ul class="user-list-box">
					<li v-for="(usr, index) in users" 
						:class="[index === holdIndex ? 'current' : '']"
						:data-id="usr.id"
						@click="holdThisUsr(index)"
					>
						<figure class="user-icon">
							<img v-if="usr.icon && usr.icon.length" :src="usr.icon" alt="">
							<div v-else class="no-user-icon">{{ usr.name.slice(0,1) }}</div>
						</figure>
						<dd>
							<dt>{{ usr.name }}</dt>
						</dd>
					</li>
				</ul>
				<p>共有 {{ users.length }} 位联系人</p>
			</div>
		</aside>

		<div class="user-info-mod">
			<header>
				<button class="btn" @click="isEdit = !isEdit">{{ isEdit ? '完成':'编辑'}}</button>
			</header>
			<figure>
				<img v-if="user.icon && user.icon.length" :src="user.icon" :alt="[user.name + ' 头相']">
				<div v-else-if="user.name && user.name.length" class="no-user-icon">{{ user.name.slice(0,1) }}</div>

			</figure>
			<h3><input type="text" v-model="user.name" :readonly="!isEdit" placeholder="姓名"></h3>

			<div class="user-contact-list">
				<dl v-for="(val, index) in user.contact">
					<dt>
						<span v-show="!isEdit">{{val.name}}</span>
						<input v-show="isEdit" type="text" :value="val.name" :readonly="!isEdit"></dt>
					<dd>
						<input type="text" :value="val.data" :readonly="!isEdit">
						<button class="del-data" v-show="isEdit"></button>
					</dd>
				</dl>
			</div>

			<div class="user-contact-list" style="display: none">
				<dl>
					<dt>
						<span>备注</span>
					</dt>
					<dd><textarea></textarea></dd>
				</dl>
			</div>

			<transition name="slide">
				<footer v-show="isEdit">
					<button @click="addOneData">添加一条数据</button>
					<button class="err-style" @click="delUser(user)">删除</button>
				</footer>
			</transition>
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