
let todolistType = new Vue({
	el: '#todo-type-list',
	data: {
		typeList: [],
		holdTypeIndex: 0
	},
	mounted: function() {
		// 设置提醒列表
		(async () => {
			let data = {
				query: `{ workTypes(account: "ektx") { id,name }}`
			};

			let result = await APIFetch(data);
			this.typeList = result.workTypes;
		})()
	},
	methods: {
		addNewType: function() {
			this.typeList.push({
				name: 'ss',
				id: +new Date(),
				hold: 'current'
			})

			this.holdTypeIndex = this.typeList.length -1;
			
			this.$nextTick(function() {
				let int = this.$el.querySelector('.current input');
				int.removeAttribute('readonly')
				int.focus()
			})

		},

		// 保存分类
		saveTodoType: function(evt) {
			let name = evt.target.value;
			let saveData = this.typeList[this.holdTypeIndex];

			console.log(evt.target.value)

			APIFetch({
				query: `mutation {
					addTodoListType(data: {
						id: "${saveData.id}",
						name: "${name}"
					}){id}
				}`
			}).then(res => console.log(res), err => console.error(err))
		}
	}
})

