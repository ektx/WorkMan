
const {
	GraphQLString,
	GraphQLNonNull,
	GraphQLInt
} = require('graphql')

const db = require('../../../models/todolist/events')
const { events_TYPE, events_INTTYPE, updateEvent_INTTYPE } = require('../../types/todolist/events')
const calendarEvt = require('./calendarEvent')

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

		console.log('xxx', calendar.howMonths(parmas.data.stime, parmas.data.etime))

		const model = new db(parmas.data)
		const newData = model.save()

		if (!newData) throw new Error('添加事件出错')

		return `{"success": true, "msg": "添加成功", "id": "${parmas.data.id}"}`
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
		},
		account: {
			name: 'account',
			type: GraphQLString,
			description: '用户'
		}
	},
	resolve(root, getArgs, req) {
		
		getArgs.account = req.decoded ? req.decoded.user : getArgs.account;

		let remove = new Promise((resolve, reject) => {
			db.remove(
				{id: getArgs.id , account: getArgs.account },
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
			type: new GraphQLNonNull(GraphQLString),
			description: '更新类型 id'
		},
		account: {
			name: 'account',
			type: GraphQLString,
			description: '更新的用户'
		},
		data: {
			name: 'data',
			type: updateEvent_INTTYPE,
			description: '更新的内容'
		}
	},
	resolve(root, getArgs, req) {

		// 更新修改时间
		getArgs.data.mtime = new Date().toISOString();
		
		getArgs.account = (req.decoded ? req.decoded.user : getArgs.account);

		let update = new Promise((resolve, reject) => {
			db.update(
				{ id: getArgs.id, account: getArgs.account },
				getArgs.data,
				(err, data) => {

					if (err) {
						reject(JSON.stringify(err));
						return;
					}

					if (data.n) {
						resolve(`{"success": true, "msg": "更新成功"}`)
					} else {
						resolve(`{"success": false, "msg": "没有更新内容"}`)
					}
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