
const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLList,
} = require('graphql');

const fieldsObj = {
	account: {
	  type: GraphQLString,
	  description: '用户',
	},
	eventTypeID: {
	  type: GraphQLString,
	  description: '事件类别 ID',
	},
	stime: {
		type: GraphQLString,
		description: '开始时间,如: 2017-9-10'
	},
	etime: {
		type: GraphQLString,
		description: '结束时间,如: 2017-10-1'
	}	
}

const calendarEvent_TYPE = new GraphQLObjectType({
	name: 'calendarEvent',
	description: '日历与事件间的关系',
	fields: () => (fieldsObj)
});

exports.calendarEvent_TYPE = calendarEvent_TYPE;


const calendarEvent_INTTYPE = new GraphQLInputObjectType({
	name: 'calendarEvent_',
	fields: () => (fieldsObj)
})
exports.calendarEvent_INTTYPE = calendarEvent_INTTYPE;


/*
	日历事件添加功能
*/
const time_type_obj =  {
	time: {
		type: GraphQLString,
		description: '年-月'
	},
	day: {
		type: GraphQLString,
		description: '日期'
	}
}
// for saveCalendar_feedback
const saveCalendar_time_type = new GraphQLObjectType({
	name: 'saveCalendar_time_type',
	description: '保存日历的时间信息',
	fields: () => (time_type_obj)
});
exports.saveCalendar_time_type = saveCalendar_time_type;

// for query_feedback
const query_calendarEvent_feedback = new GraphQLObjectType({
	name: 'query_calendarEvent_feedback',
	description: '查询返回日期信息',
	fields: () => (time_type_obj)
})
exports.query_calendarEvent_feedback = query_calendarEvent_feedback;


const saveCalendar_feedback = new GraphQLObjectType({
	name: 'saveCalendar_feedback',
	description: '保存后返回信息',
	fields: () => ({
		save: {
			type: GraphQLString,
			description: '数据保存信息',
		},
		time: {
			type: new GraphQLList(saveCalendar_time_type),
			description: '保存的时间信息'
		}
	})
})
exports.saveCalendar_feedback = saveCalendar_feedback;
