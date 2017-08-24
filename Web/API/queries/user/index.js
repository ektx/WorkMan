const { 
	GraphQLID, 
	GraphQLNonNull, 
	GraphQLList, 
	GraphQLString,
	GraphQLObjectType
} = require('graphql/type');

const getProjection = require('../../getProjection');
const db = require('../../../models/user')

const { userType } = require('../../types/user')

module.exports = {
	type: new GraphQLList(userType),
	args: {
		// 帐号
		account: {
			name: 'account',
			type: GraphQLString,
			description: '帐号'
		},
		// 用户名
		name: {
			name: 'name',
			type: GraphQLString,
			description: '用户名'
		} 
	},
	resolve(root, {account, name}, source, fieldASTs) {
		// 处理要获取的信息
		let projections = getProjection(fieldASTs);
		// 回调
	    let foundItems = new Promise((resolve, reject) => {
	    	// mongoose 查询方式
	    	// 查询用户名或帐号
			db.usrs_m.find(
			{ $or: [ {account}, {name} ] }, 
			projections,
			(err, data) => {
				err ? reject(err) : resolve(data)
			})
		})

		return foundItems 
	}
}