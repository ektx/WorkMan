const {
	GraphQLString,
	GraphQLList,
	GraphQLInt
} = require('graphql')

const db = require('../../../models/todolist/events')
const { events } = require('../types')

module.exports = {
	type: new GraphQLList(events),
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
			description: '查询的事件类别'
		},
		stime: {
			name: 'stime',
			type: GraphQLString,
			description: '查询开始时间'
		},
		etime: {
			name: 'etime',
			type: GraphQLString,
			description: '查询结束时间'
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

		// 查看指定用户的指定列表事件
		// 以修复时间为倒序返回
		let dataPromise = new Promise((resolve, reject) => {
			db.find(
				{
					account: params.account, 
					eventTypeID: params.types,
					stime: {
						'$lte': new Date(params.etime)
					},
					etime: {
						// 查询开始时间
						'$gte': new Date(params.stime),
					}
				},
				null,
				{ 
					skip: params.start, 
					limit: params.limit,
					sort: {
						stime: 1
					}
				},
				(err, data) => {
					err ? reject(err) : resolve(data)
				}
			)
		})

		return dataPromise
	}
}

