let todolistType = new Vue({
	el: '#todo-type-list',
	data: {
		typeList: []
	},
	mounted: function() {
		let url = 'http://localhost:4000/api';
		let method = 'POST';
		let data = {
				query: `{ workTypes(account: "baobao") { id,name }}`
			};

		fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-access-token': localStorage.token
			},
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then(data => {

			this.typeList = data.data.workTypes;
			// console.log(data.data.workTypes)
		})
		.catch(err => {
			console.error(err)
		})
	},
	methods: {
		addNewType: function() {
			console.log(1)
			this.typeList.push({
				name: 'ss',
				id: new Date().toISOString(),
				edit: true,
				hold: 'current'
			})
		}
	}
})