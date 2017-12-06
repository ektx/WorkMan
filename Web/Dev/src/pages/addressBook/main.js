
export default {
	name: 'AddressBook',
	data () {
		return {
			users: [],
			user: {},
			holdIndex: -1,
			isEdit: false
		}
	},
	created() {
		this.getUsers()
	},
	watch: {
		holdIndex (val, old) {
			this.user = this.users[val]
		},

		user (val, old) {
			this.users[this.holdIndex] = val
		}
	},
	methods: {
		getUsers () {
			let url = 'http://localhost:9000/WorkMan/Web/Dev/static/mock/addressBook/users.json'
			fetch(url)
			.then(res => res.json())
			.then(res => {
				this.users = res
				this.holdIndex = 0
			})
		},

		// 选中用户效果
		holdThisUsr (index) {

			if (this.isEdit) {
				this.isEdit = false
			}
			
			this.holdIndex = index
		},

		// 删除用户
		delUser (user) {
			console.log(user)
		},

		addAUser () {
			console.log('add a user')

			this.isEdit = true;

			let data = {
				id: 'user' +(+ new Date()),
				name: '',
				contact: [{
					type: 'tel',
					name: '电话',
					data: ''
				}]
			};

			this.users.unshift(data)
			this.user = data

			// this.users.pop()
console.log(this.users)
			
			this.holdIndex = 0;
		},

		addOneData () {
			console.log('new data!')

			this.user.contact.push({
				name: '',
				type: 'text',
				data: ''
			})
		}
	}
}