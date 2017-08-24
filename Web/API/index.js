const {
	GraphQLObjectType,
	GraphQLSchema
} = require('graphql');

const queries = require('./queries')

// 向外提供接口
module.exports = new GraphQLSchema({
	// 查询接口
	query: new GraphQLObjectType({
		name: 'Query2',
		fields: queries
	})
});
