const {
	GraphQLObjectType,
	GraphQLSchema
} = require('graphql');

const queries = require('./query')
const mutations = require('./mutations')

// 向外提供接口
module.exports = new GraphQLSchema({
	// 查询接口
	query: new GraphQLObjectType({
		name: 'Query',
		fields: queries
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: mutations
	})
});
