const {
	GraphQLString,
	GraphQLList
} = require('graphql')

const db = require('../../../models/todolist/workType')
const { workType } = require('../../types/todolist/workType')

module.exports = {
	type: new GraphQLList(workType),
	description: '查询提醒事件列表',
	args: {
		account: {
			name: 'account',
			type: GraphQLString,
			description: '查询的用户'
		}
	},
	resolve(root, params) {

		let dataPromise = new Promise((resolve, reject) => {
			db.workType_M.find(
				{account: params.account},
				(err, data) => {
					err ? reject(err) : resolve(data)
				}
			)
		})

		return dataPromise
	}
}

