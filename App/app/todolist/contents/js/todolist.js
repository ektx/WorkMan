
let todolistType = new Vue({
	el: '#todo-type-list',
	data: {
		typeList: []
	},
	mounted: function() {
		// 设置提醒列表
		(async () => {
			let data = {
				query: `{ workTypes(account: "baobao") { id,name }}`
			};

			let result = await APIFetch(data);
			this.typeList = result.workTypes;
			console.log(result.workTypes)
		})()
		// setWorkWorkType()
	},
	methods: {
		addNewType: function() {
			this.typeList.push({
				name: 'ss',
				id: new Date().toISOString(),
				hold: 'current'
			})
			
			this.$nextTick(function() {
				let int = this.$el.querySelector('.current input');
				int.removeAttribute('readonly')
				int.focus()
			})

		},

		// 保存分类
		saveTodoType: function(evt) {
			let name = evt.target.value;

			console.log(evt.target.value)
		}
	}
})

