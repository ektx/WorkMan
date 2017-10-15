const { GraphQLNonNull, GraphQLString } = require('graphql')
const { userType, userIntputType } = require('../types/user')

const db = require('../models/user')

module.exports = {
	type: userType,
	description: '添加用户',
	args: {
		data: {
			name: 'data',
			type: userIntputType
		}
	},
	resolve(root, params) {
		console.log(params, params.data)
		const uModel = new db.usrs_m(params.data)
		const newUser = uModel.save();

		if (!newUser) throw new Error('Error add new user!');

		return newUser;
	}
}