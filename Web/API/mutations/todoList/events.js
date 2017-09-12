
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

		calendarEvt.updateDB({
			account: parmas.data.account,
			id: parmas.data.eventTypeID,
			stime: parmas.data.stime,
			etime: parmas.data.etime
		})

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


const save = {
	type: GraphQLString,
	description: '保存或更新提醒分类',
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
	resolve(root, pargs, req) {

		// 更新修改时间
		pargs.data.mtime = new Date().toISOString();
		// 应用用户
		pargs.account = req.decoded ? req.decoded.user : pargs.account;
		
		// 保存数据
		function saveDate () {
			return new Promise((resolve, reject) => {
				db.update(
					{ 
						id: pargs.id, 
						account: pargs.account 
					},
					pargs.data,
					{upsert: true},
					(err, data) => {

						if (err) {
							reject(JSON.stringify(err));
							return;
						}

						resolve(data)
					}
				)
			})
		}

		async function willSave () {
			// 保存新加事件
			let result = await saveDate()

			// 如果是新建的,添加日历
			if (result.upserted) {
				result = await calendarEvt.updateDB({
					account: pargs.account,
					id: pargs.data.eventTypeID,
					stime: pargs.data.stime,
					etime: pargs.data.etime
				}) 
			}

			return result
		}


		return (async function () {
			return JSON.stringify( await willSave() )
		}())
	}

}

module.exports = {
	add,
	remove,
	save,
}