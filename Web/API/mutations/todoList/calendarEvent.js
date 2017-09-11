
const {
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

const { 
	calendarEvent_TYPE, 
	calendarEvent_INTTYPE 
} = require('../../types/todolist/calendarEvent')

const db = require('../../../models/todolist/calendarEvent')
const calendar = require('../../../bin/calendar')

const add = {
	type: calendarEvent_TYPE,
	description: '添加日历',
	args: {
		data: {
			name: 'data',
			type: calendarEvent_INTTYPE
		}
	},
	resolve(root, postData) {

		const model = new db(postData.data)
		const newData = model.save()

		if (!newData) throw new Error('保存日历事件出错')

		return newData
	}
}

const remove = {
	type: GraphQLString,
	description: '删除日历',
	args: {
		account: {
			name: 'account',
			type: new GraphQLNonNull(GraphQLString),
			description: '删除的用户名'
		},
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: 'eventTypeID 值'
		}
	},
	resolve(root, postData) {
		const remove = new Promise((resolve, reject) => {
			db.remove(
				{
					account: postData.account,
					eventTypeID: postData.id
				},
				(err, data) => {
					if (err) {
						reject(err);
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
	description: '创建或更新',
	args: {
		account: {
			name: 'account',
			type: new GraphQLNonNull(GraphQLString),
			description: '用户'
		},
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: 'eventTypeID 值'
		},
		stime: {
			name: 'stime',
			type: new GraphQLNonNull(GraphQLString),
			description: '开始时间,如: 2017-9-10'
		},
		etime: {
			name: 'etime',
			type: new GraphQLNonNull(GraphQLString),
			description: '结束时间,如: 2017-10-1'
		}
	},
	resolve(root, postData) {

		// 更新数据库
		updateDB(postData)
	}
}


/*
	options
	-----------------------------
	@stime 开始时间
	@etime 结束时间
	@account 用户
	@id 更新类别
*/
function updateDB (options) {

	// 获取2个时间点间的日期与天数
	let updateCalTime = calendar.howMonths(options.stime, options.etime);

	// 更新数据库
	function setCalendarEvent (account, id, time, data) {
		
		return new Promise((resolve, reject) => {
			db.update(
				{
					account: account,
					eventTypeID: id,
					time: time
				},
				{$inc: data},
				// 不存在时添加
				{upsert: true},
				(err, data) => {

					if (err) {
						reject( err )
						return;
					}

					resolve( data )
				}
			)
		})
	}

	// 遍历天
	async function loopCalTime (data) {

		let setData = {};

		// 格式化要更新的天数
		data.day.forEach((val, index) => {
			setData[`data.${val}`] = 1
		});

		// 返回要更新的月份
		return setCalendarEvent(
			options.account,
			options.id,
			data.time,
			setData 
		)
	}

	// 更新
	async function updateDBCalTime() {

		let updatePromise = [];

		updateCalTime.forEach(val => {
			updatePromise.push( loopCalTime(val) )
		})

		const allDay = await Promise.all(updatePromise);
	}

	updateDBCalTime()	
}


module.exports = {
	add,
	remove,
	update
}

