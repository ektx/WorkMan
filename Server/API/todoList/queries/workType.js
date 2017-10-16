const {
	GraphQLString,
	GraphQLList
} = require('graphql')

const db = require('../../../models/todolist/workType')
const { workType } = require('../types/workType')

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
	resolve(root, params, req) {
		// 如果有 token 的解码,证明来自客户端口,非测试
		if (req.decoded) {
			params.account = req.decoded.user
		}

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

