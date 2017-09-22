const {
	GraphQLString,
	GraphQLNonNull,
	GraphQLInt,
	GraphQLObjectType
} = require('graphql')

const db = require('../../../models/todolist/events')
const { 
	events_INT, 
	evtUpdate_INT,
	evtSave_FB,
	saveCalendar_FB 
} = require('../types')

const calendarEvt = require('./calendarEvent')


const add = {
	type: GraphQLString,
	description: '添加事件',
	args: {
		data: {
			name: 'data',
			type: events_INT
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
	type: saveCalendar_FB,
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

		let removeData = () => {
			return new Promise((resolve, reject) => {
				db.findOneAndRemove(
					{
						id: getArgs.id, 
						account: getArgs.account 
					},
					(err, data) => {
						if (err || !data) {
							reject(err);
							return;
						}

						resolve( data )
					}
				)
			})
		}

		async function removeTime () {
			
			let removeEvt = await removeData();

			removeEvt = await calendarEvt.updateDB({
				account: removeEvt.account,
				id: removeEvt.eventTypeID,
				stime: removeEvt.stime,
				etime: removeEvt.etime,
				type: 'del'
			})

			return removeEvt
		}

		return (async function() {
			return await removeTime();
		}())
	}

}


const save = {
	type: evtSave_FB,
	description: '保存或更新提醒分类',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: '更新 ID'
		},
		account: {
			name: 'account',
			type: GraphQLString,
			description: '更新的用户'
		},
		data: {
			name: 'data',
			type: evtUpdate_INT,
			description: '更新的内容'
		}
	},
	resolve(root, pargs, req) {

		// 更新修改时间
		pargs.data.mtime = new Date().toISOString();
		// 应用用户
		pargs.account = req.decoded ? req.decoded.user : pargs.account;
		
		let ID = pargs.id.endsWith(pargs.account) ? pargs.id : pargs.id +'_'+ pargs.account;

		// 
		function findData() {
			return new Promise((resolve, reject) => {
				db.findOne(
					{
						id: ID,
						account: pargs.account
					},
					(err, data) => {
						if (err) return reject(err);
						resolve(data)
					}
				)
			})
		}


		// 保存数据
		function saveDate () {
			return new Promise((resolve, reject) => {
				db.update(
					{ 
						id: ID, 
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


		return (async function () {

			let findThisData = await findData();

			let result = {
				// 新的id
				id: pargs.id +'_'+ pargs.account,
				delTime: [],
				addTime: []
			};

			// 存在数据 
			if (!!findThisData) {

				// 只有时间有变化才更新日历
				if (+new Date(pargs.data.stime) !== +new Date(findThisData.stime) || 
					+new Date(pargs.data.etime) !== +new Date(findThisData.etime)) {
					result.delTime = await calendarEvt.updateDB({
						account: pargs.account,
						id: pargs.data.eventTypeID,
						stime: findThisData.stime,
						etime: findThisData.etime,
						type: 'del'
					})
					
					result.addTime = await calendarEvt.updateDB({
						account: pargs.account,
						id: pargs.data.eventTypeID,
						stime: pargs.data.stime,
						etime: pargs.data.etime
					})
				}
			}
			// 不存在
			else {
				// 添加日历
				result.addTime = await calendarEvt.updateDB({
					account: pargs.account,
					id: pargs.data.eventTypeID,
					stime: pargs.data.stime,
					etime: pargs.data.etime
				})

			}

			// 保存数据 [string]
			result.save = JSON.stringify( await saveDate() )

			return result
		}())
	}

}

module.exports = {
	add,
	remove,
	save,
}