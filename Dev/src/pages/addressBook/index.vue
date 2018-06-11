<template>
	<section class="address-book-app">
		<aside class="address-user-box">

			<header>
				<VSearch
					placeholder="查询:用户名"
					v-model="searchUsrVal"
					v-on:reset="addOneUser"
				/>
			</header>
			
			<div class="users-list-mod">
				<ul class="user-list-box">
					<li v-for="(usr, index) in users" 
						:key="index"
						:class="[index === holdIndex ? 'current' : '']"
						:data-id="usr.id"
						@click="holdThisUsr(index)"
					>
						<figure class="user-icon">
							<img v-if="usr.icon && usr.icon.length" :src="usr.icon" alt="">
							<div v-else class="no-user-icon">{{ usr.friendName.slice(0,1) }}</div>
						</figure>
						<dl>
							<dt>{{ usr.friendName }}</dt>
							<dd>{{ usr.remark }}</dd>
						</dl>
					</li>
				</ul>
				<p>共有 {{ users.length }} 位联系人</p>
			</div>
		</aside>

		<div class="user-info-mod">
			<header>
				<button class="btn" @click="saveAndUpdateContactInfo">{{ isEdit ? '完成':'编辑'}}</button>
			</header>

			<div class="user-info-body">
				<figure>
					<img v-if="user.icon && user.icon.length" :src="user.icon" :alt="[user.friendName + ' 头相']">
					<div 
						v-else-if="user.friendName && user.friendName.length" 
						class="no-user-icon"
					>{{ user.friendName.slice(0,1) }}</div>

				</figure>

				<!-- 姓名 -->
				<h3 v-show="!isEdit"><input type="text" v-model="user.friendName" :readonly="!isEdit" placeholder="姓名"></h3>

				<div class="user-contact-list">
					<div class="user-edit-area-box">
						<dl v-show="isEdit">
							<dt>
								<span>姓名</span>
							</dt>
							<dd>
								<input type="text" v-model="user.friendName">
							</dd>
						</dl>
					</div>
				</div>
				<!--// 姓名 -->

				<!-- 电话 -->
				<VADRList 
					:data="user.tel" 
					:isEdit="isEdit"
				/>
				<!-- // 电话 -->

				<!-- 邮件 -->
				<VADRList
					:data="user.email"
					:isEdit="isEdit"
				/>
				<!-- // 邮件 -->

				<div class="user-contact-list">
					<dl>
						<dt>
							<span>备注</span>
						</dt>
						<dd><textarea v-model="user.remark"></textarea></dd>
					</dl>
				</div>

				<transition name="slide">
					<footer v-show="isEdit">
						<div>
							<button class="btn" @click="addOneData('tel')">添加电话</button>
						</div>
						<div>
							<button class="btn" @click="addOneData('email')">添加邮件</button>
						</div>
						<div>
							<button class="btn err" @click="delUser(user)">删除此人</button>
						</div>
					</footer>
				</transition>
			</div>
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