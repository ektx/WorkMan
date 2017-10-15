const { GraphQLNonNull, GraphQLString, GraphQLList } = require('graphql')
const { userType, userIntputType } = require('../types/user')

const db = require('../models/user')

module.exports = {
	// 返回修改后用户信息
	type: userType,
	description: '修改用户信息',
	args: {
		account: {
			name: 'account',
			description: '帐号',
			type: new GraphQLNonNull(GraphQLString)
		},
		data: {
			name: 'data',
			type: userIntputType
		}
	},
	resolve(root, params) {

		let update = new Promise((resolve, reject) => {
			db.usrs_m.findOneAndUpdate(
				{ account: params.account },
				params.data,
				(err, data) => {
					console.log(err);

					if (err) {
						reject(err);
						return;
					}
					resolve(data)
				}
			)
		})
		
		return update;
	}
}