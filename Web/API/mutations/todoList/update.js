const {
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

const DM = require('../../../models/todolist/workType')
const { workType, workTypeIntType } = require('../../types/workType')

module.exports = {
	type: workType,
	description: '更新提醒分类',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: 'id'
		},
		name: {
			name: 'name',
			type: GraphQLString,
			description: '重新命名'
		}
	},
	resolve(root, params) {
		
		let remove = new Promise((resolve, reject) => {
			DM.workType_M.findOneAndUpdate(
				{ id: params.id },
				{name: params.name},
				(err, data) => {
					console.log(err);

					if (err) {
						reject(err);
						return;
					}
					resolve(data)
				}
			)
		})

		return remove
	}

}