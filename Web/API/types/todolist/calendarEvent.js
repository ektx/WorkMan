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
	time: {
		type: GraphQLString,
		description: '保存时间'
	},
	data: {
		type: GraphQLString,
		description: '数据 用于保存一组对应天的事件'
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
