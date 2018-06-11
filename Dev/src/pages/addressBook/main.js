import VSearch from '@/components/VSearch'
import VADRList from '@/components/VADRList'
import { mapMutations } from 'vuex'

export default {
	name: 'AddressBook',
	components: {
		VSearch,
		VADRList
	},
	data () {
		return {
			users: [],
			user: {},
			holdIndex: -1,
			isEdit: false,
			searchUsrVal: '',
			navs: [
                {
                    title: '🏠',
                    to: '/'
                },
                {
                    title: '通讯录',
                    to: '/addressBook'
                },
                {
                    title: 'Apple',
                    children: [
                        {
                            title: 'Mac',
                            children: [
                                {
                                    title: 'Macbook',
                                    href: '#'
                                },
                                {
                                    title: 'Macbook Air',
                                    href: '#'
                                },
                                {
                                    title: 'Macbook Pro',
                                    href: '#'
                                },
                                {
                                    type: 'separator'
                                },
                                {
                                    title: 'iMac',
                                    href: '#'
                                },
                                {
                                    title: 'iMac Pro',
                                    href: '#'
                                },
                                {
                                    title: 'Mac Pro',
                                    href: '#'
                                }
                            ]
                        },
                        {
                            title: 'iPhone',
                            href: '#'
                        },
                        {
                            title: 'iPad',
                            href: '#'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            title: 'help',
                            fun: () => {
                                alert('apple help')
                            }
                        }
                    ]
                },
                {
                    title: 'API',
                    href: '/apiTest',
                    target: '_blank'
                }
            ]
		}
	},
	created() {
		this.getUsers()
	},
	watch: {
		holdIndex (val, old) {
			this.user = this.users[val] || []
		},

		user (val, old) {
			this.users[this.holdIndex] = val
		}
	},
	activited: function() {
		this.MutaionMacOSTopbar({
			type: 'main',
			data: this.navs
		})
	},
	methods: {
		...mapMutations(['MutaionMacOSTopbar']),
		
		getUsers () {
			// debugger
			// let url = 'http://localhost:9000/WorkMan/Web/Dev/static/mock/addressBook/users.json'
			// fetch(url)
			// .then(res => res.json())
			// .then(res => {
			// 	this.users = res
			// 	this.holdIndex = 0
			// })

			// this.$axios.post('/api', {
			// 	query: `{
			// 		myFriends(account: "MY_ACCOUNT") {
			// 			id, account, friendName, tel {label, inner}, email {label, inner}, ctime, mtime, remark
			// 		}
			// 	}`
			// })
			// .then(res => {
			// 	console.log(res.data.data.myFriends)
			// 	this.users = res.data.data.myFriends
			// 	this.holdIndex = 0
			// })
			// .catch(err => {
			// 	console.error(err)
			// })
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

		addOneUser () {

			if (this.isEdit) return

			let data = {
				friendName: '',
				tel: [{
					label: '电话',
					inner: ''
				}],
				email: [{
					label: '邮箱',
					inner: ''
				}],
				remark: ''
			};

			this.users.unshift(data)
			this.user = data
			this.isEdit = true
			this.holdIndex = 0
		},

		addOneData (type) {
			console.log(this.user)
			this.user[type].push({
				label: '',
				inner: ''
			})
			
		},

		saveAndUpdateContactInfo () {
			this.isEdit = !this.isEdit
			let query = ''
			let mutationStr = function(obj) {
				return JSON.stringify(obj).replace(/"(\w+)":/g, '$1:')
			}

			if (!this.isEdit) {
				if (this.user.id) {
					query = `mutation { updateAddress(id: "${this.user.id}",data: {
						account: "MY_ACCOUNT",
						friendName: "${this.user.friendName}",
						tel: ${mutationStr(this.user.tel)},
						email: ${mutationStr(this.user.email)},
						remark: "${this.user.remark}"
					})}`
				} else {
					query = `mutation { addAddress(data: {
						account: "MY_ACCOUNT",
						friendName: "${this.user.friendName}",
						tel: ${mutationStr(this.user.tel)},
						email: ${mutationStr(this.user.email)},
						remark: "${this.user.remark}"
					  }) { id }
				  }`
				}

				this.$axios.post('/api', { query })
				.then(res => {
					console.log(res)
				})
				.catch(err => {
					console.error(err)
				})
			}
		}
	}
}