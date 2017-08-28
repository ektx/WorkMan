const {
	GraphQLString
} = require('graphql')

const DM = require('../../../models/todolist/workType')

module.exports = {
	type: GraphQLString,
	description: '删除提醒分类',
	args: {
		id: {
			name: 'id',
			type: GraphQLString,
			description: 'id'
		}
	},
	resolve(root, parmas) {
		
		let remove = new Promise((resolve, reject) => {
			DM.workType_M.remove(
				{id: parmas.id },
				(err, data) => {
					if (err) {
						reject(err);
						return;
					}

					resolve( JSON.stringify(data.result) )
				}
			)
		})

		return remove
	}

}