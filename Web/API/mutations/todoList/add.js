const {
	GraphQLString
} = require('graphql')

const DM = require('../../../models/todolist/workType')
const { workType, workTypeIntType } = require('../../types/workType')

module.exports = {
	type: workType,
	description: '添加分类',
	args: {
		data: {
			name: 'data',
			type: workTypeIntType
		}
	},
	resolve(root, parmas) {
		const model = new DM.workType_M(parmas.data)
		const newData = model.save()

		if (!newData) throw new Error('添加提醒分类出错')

		return newData
	}

}