const {
	GraphQLNonNull,
	GraphQLString
} = require('graphql')

const db = require('../../../models/todolist/calendarEvent')
const { query_calendarEvent_FB } = require('../types')

/*
	示例:
	{ 
		calendarEvent(
			account: "ektx", 
			typeID: "1504493147795", 
			time: "2017-9"
		) { time,day }
	}
*/
module.exports = {
	type: query_calendarEvent_FB,
	description: '查询某月提醒事件列表',
	args: {
		account: {
			name: 'account',
			type: new GraphQLNonNull(GraphQLString),
			description: '查询的用户'
		},
		typeID: {
			name: 'typeID',
			type: GraphQLString,
			description: '查询类别'
		},
		time: {
			name: 'name',
			type: GraphQLString,
			description: '查询时间: "2018-8"'
		}
	},
	resolve(root, qargs, req) {

		qargs.account = req.decoded ? req.decoded.user : qargs.account;

		let dataPromise = new Promise((resolve, reject) => {
			db.findOne(
				{
					account: qargs.account, 
					eventTypeID: qargs.typeID,
					time: qargs.time
				},
				{data: 1, time: 1, _id: 0},
				(err, data) => {
					
					if (err) {
						return reject(err);
					}

					// 如果没有找到数据,为 null
					if (!data) {
						data = {
							time: qargs.time,
							data: [{}]
						}
					}

					resolve({
						time: data.time,
						day: JSON.stringify( data.data[0] )
					})
				}
			)
		})

		return dataPromise
	}
}

