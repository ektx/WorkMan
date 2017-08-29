
const {
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

const { 
	calendarEvent_TYPE, 
	calendarEvent_INTTYPE 
} = require('../../types/todolist/calendarEvent')

const db = require('../../../models/todolist/calendarEvent')

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
		time: {
			name: 'time',
			type: new GraphQLNonNull(GraphQLString),
			description: '时间 格式: 年-月,如:2018-2'
		},
		data: {
			name: 'data',
			type: new GraphQLNonNull(GraphQLString),
			description: '数据 用于保存一组对应天的事件,数组'
		}
	},
	resolve(root, postData) {

		let find = () => {
			return new Promise((resolve, reject) => {
				db.findOne(
					{
						account: postData.account,
						eventTypeID: postData.id,
						time: postData.time
					},
					(err, data) => {
						if (err) {
							reject(err);
							return;
						}
	console.log(data, '.......');
						resolve(data)
					}
				)
			})
		}

		let update = new Promise((resolve, reject) => {
			db.update(
				{
					account: postData.account,
					eventTypeID: postData.id,
					time: postData.time
				},
				{
					data: postData.data
				},
				(err, data) => {
					if (err) {
						reject(JSON.stringify(err))
						return;
					}
					resolve(JSON.stringify(data) )
				}
			)
		})

		async function getFindInfo () {
			let a = await find();
			
			if (a) {
				// update
			} else {
				
			}
			console.log('xxx', a)
		}

getFindInfo()

		return update
	}
}

module.exports = {
	add,
	remove,
	update
}