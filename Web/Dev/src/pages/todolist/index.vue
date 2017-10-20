
<template>
	<section class="todolist-app">
		<aside class="todolist-type-mod">
			<h1>
				<p>计划目录</p>
				<button @click="addNewType" class="tbtn">
					<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
						<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
					</svg>
				</button>
			</h1>
			<ul>
				<li v-for="(val,index) in typeList"
					:key="val.id" 
					:class="val.hold"
					:data-index="index" 
					@click="findThisTypeIndex"
					@contextmenu.prevent="rightClick"
				>
					<input type="text"
						v-if="val.readonly" 
						:value="val.name"
						v-on:keyup.enter="willSaveTodoType"
						v-on:blur="saveTodoType"
						>
					<span v-else >{{val.name}}</span>
				</li>
			</ul>

			<div id="events-calendar-mod" class="fixed-calendar-mod">
				<v-date-picker 
					format="YYYY-MM"
				></v-date-picker>
			</div>
		</aside>

		<main class="todolist-events-mod">
			
		</main>
		
	</section>
</template>

<script>
	
	import store from '../../assets/js/store'
	import APIFetch from '../../assets/js/AFetch'
	import VDatePicker from '../../components/VDatePicker'

	export default {
		name: 'todolist',
		components: {
			VDatePicker
		},
		data () {
			return {
				// 类别个数
				typeList: [],
				// 默认选择
				holdTypeIndex: -1,
				// 重命名状态
				renameStatus: false
				
			}
		},
		beforeCreate: function() {

			// 设置提醒列表
			(async () => {
				let data = {
					query: `{ workTypes(account: "MY_ACCOUNT") { id,name }}`
				};

				let result = await APIFetch(data);
				this.typeList = result.workTypes;

				console.log(result)

				// 选择第一条
				this.holdTypeIndex = 0;

			})()
		},
		watch: {
			holdTypeIndex: function(val, oldVal) {

				let thisVal = this.typeList[val];

				// 如果没有列表
				if (!this.typeList.length) return;
				// 移除之前的选中对象
				if (oldVal >= 0)
					this.$set(this.typeList[oldVal], 'hold', '');
				// 为当前对象添加选中效果
				if (val > -1)
					this.$set(thisVal, 'hold', 'current');

				// 如果存在 readonly 则是在新建,新建则不要查询他的数据
				if (!thisVal.readonly) {
					// 日历标识
					// eventsCalendarMod.getCalendarEvent()

					// 获取事件
					// getEvents()
				}
			}
		},
		methods: {
			// 添加一个新的分类
			addNewType: function() {
				// 添加一个新内容
				this.typeList.push({
					name: '',
					id: +new Date(),
					hold: 'current',
					readonly: true
				})

				// 切换选中对象
				this.holdTypeIndex = this.typeList.length -1;
				
				// focus 输入框
				this.$nextTick(function() {
					this.$el.querySelector('.current input').focus()
				})

			},

			// 按 enter 确认时
			willSaveTodoType: function(evt) {
				this.typeList[this.holdTypeIndex].readonly = false;
			},

			// 保存分类
			saveTodoType: function(evt) {
				let name = evt.target.value;
				let saveData = this.typeList[this.holdTypeIndex];
				let saveQuery = `mutation { addTodoListType(data: { id: "${saveData.id}", name: "${name}" })}`;
				let updateQuery = `mutation { updateTodoListType(id: "${saveData.id}", name: "${name}")}`;

				saveData.readonly = false;
				saveData.name = name;

				APIFetch({
					query: this.renameStatus ? updateQuery : saveQuery
				}).then(res => {
					console.log(res)
					
					this.renameStatus ? this.renameStatus = false : '';

				}, err => console.error(err))
			},

			// 切换类型数据
			findThisTypeIndex: function(evt) {
				let index = Number(evt.target.dataset.index);
				// 保存当前选中索引
				this.holdTypeIndex = index;
			},

			// 右键效果
			rightClick: function(evt) {

				let index = Number(evt.target.dataset.index)
				let self = this;

				console.log(evt.clientX)

				let rename = function() {

				}

				let delTypeFun = function() {
					APIFetch({
						query: `mutation {
							removeTodoListType(id: "${self.typeList[index].id}", account: "MY_ACCOUNT")
						}`
					}).then(data => {
						// 如果有删除数据
						if (JSON.parse(data.removeTodoListType).n) {
							// 如果删除的是选中效果,移除
							if (self.holdTypeIndex === index) {
								self.holdTypeIndex = -1
							}

							// 删除数据
							self.typeList.splice(index, 1)

							store.commit('setContextmenu', { show: false })
						}
					}, err => {
						console.error(err)
					})					
				}


				store.commit('setContextmenu', {
					show: true,
					data: [
						{
							title: '重命名',
							evt: function(data) {
								console.log('重命名', index)
							}
						},
						{
							type: 'separator'
						},
						{
							title: '删除',
							evt: delTypeFun
						}
					],
					evt
				})

				console.warn('Your click Right!')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './layout.scss';
</style>