const {
	GraphQLString,
	GraphQLList,
	GraphQLInt
} = require('graphql')

const db = require('../../../models/todolist/events')
const { events_TYPE } = require('../../types/todolist/events')

module.exports = {
	type: new GraphQLList(events_TYPE),
	description: '查询事件列表',
	args: {
		account: {
			name: 'account',
			type: GraphQLString,
			description: '查询的用户'
		},
		types: {
			name: 'types',
			type: GraphQLString,
			description: '查询的类别'
		},
		start: {
			name: 'start',
			type: GraphQLInt,
			description: '开始索引'
		},
		limit: {
			name: 'limit',
			type: GraphQLInt,
			description: '查寻数量'
		}
	},
	resolve(root, params, req) {
		
		// 如果有 token 的解码,证明来自客户端口,非测试
		if (req.decoded) {
			params.account = req.decoded.user
		}

		params.start = params.start || 0;
		params.limit = params.limit || 100;

		let dataPromise = new Promise((resolve, reject) => {
			db.find(
				{account: params.account, eventTypeID: params.types},
				null,
				{ skip: params.start, limit: params.limit},
				(err, data) => {
					err ? reject(err) : resolve(data)
				}
			)
		})

		return dataPromise
	}
}

