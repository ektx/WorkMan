
export default {
	name: 'AddressBook',
	data () {
		return {
			users: [],
			user: {},
			holdIndex: -1
		}
	},
	created() {
		this.getUsers()
	},
	watch: {
		holdIndex (val, old) {
			this.user = this.users[val]

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
			this.holdIndex = index
		}
	}
}