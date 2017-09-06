
const {
	GraphQLString,
	GraphQLNonNull,
	GraphQLInt
} = require('graphql')

const db = require('../../../models/todolist/events')
const { events_TYPE, events_INTTYPE } = require('../../types/todolist/events')

const add = {
	type: GraphQLString,
	description: '添加事件',
	args: {
		data: {
			name: 'data',
			type: events_INTTYPE
		}
	},
	resolve(root, parmas, req) {
		
		// 复杂化id 用于确保不会有相同
		parmas.data.account = (req.decoded ? req.decoded.user : parmas.data.account);
		parmas.data.id = `${parmas.data.id}_${parmas.data.account}`;


		const model = new db(parmas.data)
		const newData = model.save()

		if (!newData) throw new Error('添加事件出错')

		return '{"status": true, "msg": "添加成功"}'
	}

}


const remove = {
	type: GraphQLString,
	description: '删除提醒分类',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: 'id'
		}
	},
	resolve(root, parmas) {
		
		let remove = new Promise((resolve, reject) => {
			db.remove(
				{id: parmas.id  },
				(err, data) => {
					if (err) {
						reject(JSON.stringify(err));
						return;
					}

					resolve( JSON.stringify(data.result) )
				}
			)
		})

		return remove
	}

}


const update = {
	type: GraphQLString,
	description: '更新提醒分类',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLInt),
			description: '更新类型 id'
		},
		account: {
			name: 'account',
			type: GraphQLString,
			description: '更新的用户'
		},
		data: {
			name: 'data',
			type: events_INTTYPE,
			description: '更新的内容'
		}
	},
	resolve(root, params) {

		// 更新修改时间
		params.data.mtime = new Date().toISOString();
		
		let update = new Promise((resolve, reject) => {
			db.update(
				{ id: params.id, account: params.account },
				params.data,
				(err, data) => {

					if (err) {
						reject(JSON.stringify(err));
						return;
					}
					resolve(JSON.stringify(data))
				}
			)
		})

		return update
	}

}

module.exports = {
	add,
	remove,
	update,
}