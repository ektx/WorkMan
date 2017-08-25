const { GraphQLNonNull, GraphQLString } = require('graphql')
const { userType, userIntputType } = require('../../types/user')

const db = require('../../../models/user')

module.exports = {
	type: userType,
	description: '删除用户',
	args: {
		data: {
			name: 'data',
			type: userIntputType
		}
	},
	resolve(root, params) {
		console.log(params.data)

		// let removeUser = db.usrs_m.remove(params.data).exec();

		// if (!removeUser) {
		// 	throw new Error('remove user error!')
		// }
		
		let removeUser = new Promise( (resolve, reject) => {
			db.usrs_m.remove(params.data, (err, data) => {
				console.log(err, 'sss')
				data.result.n ? resolve('remove user!') : reject(err);
			})
		})
	console.log(removeUser, 'sssss')
		return removeUser
	}
}