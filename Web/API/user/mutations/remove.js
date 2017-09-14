const { GraphQLNonNull, GraphQLString } = require('graphql')
const { userIntputType } = require('../types/user')

const db = require('../models/user')

module.exports = {
	// 确定返回数据的类型,这里是返回字符串
	type: GraphQLString,
	description: '删除用户',
	args: {
		account: {
			name: 'account',
			type: GraphQLString,
			description: '帐号'
		},
		passwd: {
			name: 'passwd',
			type: GraphQLString,
			description: '密码'
		}
	},
	resolve(root, params) {
		
		let removeUser = new Promise( (resolve, reject) => {
			db.usrs_m.remove(
				{account: params.account, pwd: params.passwd}, 
				(err, data) => {
					data.result.n ? resolve('remove user!') : reject(err);
				}
			)
		})

		return removeUser
	}
}