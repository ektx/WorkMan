
const {
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

const { saveCalendar_FB } = require('../types')

const db = require('../../../models/todolist/calendarEvent')
const calendar = require('../../../bin/calendar')

/*
	使用示例:
	mutation {
	  removeCalendarEvent(
	    account:"ektx",
	    id: "1504493147795"
	  )
	}
*/
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
	resolve(root, pargs, req) {
		
		pargs.account = req.decoded ? req.decoded.user : pargs.account;

		const remove = new Promise((resolve, reject) => {
			db.remove(
				{
					account: pargs.account,
					eventTypeID: pargs.id
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

/*
	使用示例:
	mutation {
		saveCalendarEvent(
			account: "ektx",
			id: "1504493147795",
			stime: "2017-9-10",
			etime: "2018-9-11",
			type: "del"
		)
	}
*/
const save = {
	type: saveCalendar_FB,
	description: '创建或更新',
	args: {
		account: {
			name: 'account',
			type: new GraphQLNonNull(GraphQLString),
			description: '关联用户'
		},
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: '关联类别值'
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
		},
		type: {
			name: 'type',
			type: GraphQLString,
			description: 'add(加,默认) | del(减)'
		}
	},
	resolve(root, pargs, req) {

		pargs.account = req.decoded ? req.decoded.user : pargs.account;

		// 更新数据库
		return (async function () {
			return await updateDB(pargs)
		}())
	}
}


/*
	options
	-----------------------------
	@account 用户
	@id 更新类别
	@type 'add(加,默认) | del(减)'
	@stime 开始时间
	@etime 结束时间
*/
function updateDB (options) {

	// 设置 type
	options.type = options.type && options.type === 'del' ? -1 : 1;

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
	function loopCalTime (data) {

		let setData = {};

		// 格式化要更新的天数
		data.day.forEach((val, index) => {
			setData[`data.${val}`] = options.type
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
		let backDay = []; // 返回日期
		let result = {}; // 返回结果

		updateCalTime.forEach(val => {
			backDay.push( val )
			updatePromise.push( loopCalTime(val) )
		})

		// 保存信息
		result.save = JSON.stringify( await Promise.all(updatePromise) );

		// 返回天数
		result.time = backDay;

		return result
	}

	return updateDBCalTime()
}


module.exports = {
	remove,
	save,

	updateDB
}

