const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
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
