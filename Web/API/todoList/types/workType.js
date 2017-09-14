const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList
} = require('graphql/type');

const fieldsObj = {
	id: {
		type: GraphQLString,
		description: 'ID',
	},
	account: {
		type: GraphQLString,
		description: '用户',
	},
	name: {
		type: GraphQLString,
		description: '名称',
	}
}

const workType = new GraphQLObjectType({
	name: 'workType',
	description: '提醒工作分类',
	fields: () => (fieldsObj)
});

exports.workType = workType;


const workTypeIntType = new GraphQLInputObjectType({
	name: 'workTypeIntType',
	fields: () => (fieldsObj)
})
exports.workTypeIntType = workTypeIntType;
