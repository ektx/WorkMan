const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt
} = require('graphql');

const {
	saveCalendar_feedback
} = require('./calendarEvent')


const fieldsObj = {
	id: {
		type: GraphQLString,
		description: '事件ID'
	},
	account: {
	  type: GraphQLString,
	  description: '用户',
	},
	eventTypeID: {
	  type: GraphQLString,
	  description: '事件类别 ID'
	},
	title: {
		type: GraphQLString,
		description: '标题'
	},
	complete: {
		type: GraphQLBoolean,
		description: '是否完成'
	},
	ctime: {
		type: GraphQLString,
		description: `创建时间, new Date().toISOString() => "2017-08-30T03:04:14.162Z"`
	},
	mtime: {
		type: GraphQLString,
		description: '修改时间, new Date().toISOString() => "2017-08-30T03:04:14.162Z"'
	},
	ttime: {
		type: GraphQLString,
		description: '提醒时间, new Date().toISOString() => "2017-08-30T03:04:14.162Z"'
	},
	stime: {
		type: GraphQLString,
		description: '开始时间, new Date().toISOString() => "2017-08-30T03:04:14.162Z"'
	},
	etime: {
		type: GraphQLString,
		description: '结束时间, new Date().toISOString() => "2017-08-30T03:04:14.162Z"'
	},
	inner: {
		type: GraphQLString,
		description: 'inner'
	}
}


const events_TYPE = new GraphQLObjectType({
	name: 'events',
	description: '--',
	fields: () => (fieldsObj)
});

exports.events_TYPE = events_TYPE;


const events_INTTYPE = new GraphQLInputObjectType({
	name: 'events_add',
	description: '提醒事件',
	fields: () => (fieldsObj)
})
exports.events_INTTYPE = events_INTTYPE;


const updateEvent_INTTYPE = new GraphQLInputObjectType({
	name: 'events_update',
	description: '提醒事件',
	fields: () => ({
		eventTypeID: {
		  type: GraphQLString,
		  description: '事件类别 ID'
		},
		title: {
			type: GraphQLString,
			description: '标题'
		},
		complete: {
			type: GraphQLBoolean,
			description: '是否完成'
		},
		ttime: {
			type: GraphQLString,
			description: '提醒时间'
		},
		stime: {
			type: GraphQLString,
			description: '开始时间'
		},
		etime: {
			type: GraphQLString,
			description: '结束时间'
		},
		inner: {
			type: GraphQLString,
			description: '备注说明'
		}		
	})
})
exports.updateEvent_INTTYPE = updateEvent_INTTYPE;



// 保存返回信息
const saveFeedback = new GraphQLObjectType({
	name: 'saveFeedback',
	description: '保存返回信息',
	fields: () => ({
		id: {
			type: GraphQLString,
			description: '事件 ID'
		},
		addTime: {
			// 时间返回 type
			type: saveCalendar_feedback,
			description: '日历添加时间'
		},
		delTime: {
			// 时间返回 type
			type: saveCalendar_feedback,
			description: '日历删除时间'
		},
		save: {
			type: GraphQLString,
			description: '事件数据保存信息'
		}
	})
})

exports.saveFeedback = saveFeedback;