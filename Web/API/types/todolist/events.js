const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt
} = require('graphql');

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
	name: 'events_',
	description: '提醒事件',
	fields: () => (fieldsObj)
})
exports.events_INTTYPE = events_INTTYPE;
