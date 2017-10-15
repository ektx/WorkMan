const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList
} = require('graphql/type');

const userType = new GraphQLObjectType({
	name: 'user',
	description: '用户',
	fields: () => ({
		account: {
		  type: GraphQLString,
		  description: '帐号',
		},
		name: {
		  type: GraphQLString,
		  description: '名称',
		},
		email: {
		  type: GraphQLString,
		  description: '邮箱',
		},
		ico: {
		  type: GraphQLString,
		  description: '图标',
		},
		power: {
		  type: GraphQLString,
		  description: '用户权限',
		},
		reset: {
		  type: GraphQLString,
		  description: '找回密码Code',
		}
	})
});

exports.userType = userType;


const userIntputType = new GraphQLInputObjectType({
	name: 'userIntType',
	fields: () => ({
		account: {
			type: GraphQLString,
			description: '帐号'
		},
		name: {
			type: GraphQLString,
			description: '用户名'
		},
		pwd: {
			type: GraphQLString,
			description: '密码'
		},
		email: {
		  type: GraphQLString,
		  description: '邮箱',
		},
		ico: {
		  type: GraphQLString,
		  description: '图标',
		},
		power: {
		  type: GraphQLString,
		  description: '用户权限',
		},
		reset: {
		  type: GraphQLString,
		  description: '找回密码Code',
		}
	})
})
exports.userIntputType = userIntputType;
