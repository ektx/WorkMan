
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
		</aside>

		<main class="todolist-events-mod">
			
		</main>
	</section>
</template>

<script>
	import APIFetch from '../../assets/js/AFetch';
	export default {
		name: 'todolist',
		data () {
			return {
				// 类别个数
				typeList: [],
				// 默认选择
				holdTypeIndex: -1,
				// 重命名状态
				renameStatus: false,
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

			}
		}
	}
</script>

<style lang="scss" scoped>
.todolist-app {
	flex: 1;
	background: #eee;
}

.todolist-type-mod {
	width: 260px;
	height: 100%;
	background: #f5f5f5;

	h1 {
		font-size: 16px;
		color: #666;
		padding: 10px 15px;

		button {
			float: right;
			fill: #666;
		}

		p {
			display: inline-block;
		}
	}
}
</style>