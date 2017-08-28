const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList
} = require('graphql/type');

const workType = new GraphQLObjectType({
	name: 'workType',
	description: '提醒工作分类',
	fields: () => ({
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
		},
		ctime: {
		  type: GraphQLString,
		  description: '创建时间',
		},
		mtime: {
		  type: GraphQLString,
		  description: '修改时间',
		}
	})
});

exports.workType = workType;


const workTypeIntType = new GraphQLInputObjectType({
	name: 'workTypeIntType',
	fields: () => ({
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
		},
		ctime: {
		  type: GraphQLString,
		  description: '创建时间',
		},
		mtime: {
		  type: GraphQLString,
		  description: '修改时间',
		}
	})
})
exports.workTypeIntType = workTypeIntType;
