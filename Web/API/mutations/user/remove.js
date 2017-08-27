const { GraphQLNonNull, GraphQLString } = require('graphql')
const { userIntputType } = require('../../types/user')

const db = require('../../../models/user')

module.exports = {
	// 确定返回数据的类型,这里是返回字符串
	type: GraphQLString,
	description: '删除用户',
	args: {
		data: {
			name: 'data',
			// 用于规定提交数据 
			type: userIntputType
		}
	},
	resolve(root, params) {
		
		let removeUser = new Promise( (resolve, reject) => {
			db.usrs_m.remove(params.data, (err, data) => {
				data.result.n ? resolve('remove user!') : reject(err);
			})
		})

		return removeUser
	}
}