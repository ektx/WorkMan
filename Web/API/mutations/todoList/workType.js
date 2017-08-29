
const {
	GraphQLString,
	GraphQLNonNull
} = require('graphql')

const { workType, workTypeIntType } = require('../../types/todolist/workType')
const DM = require('../../../models/todolist/workType')


const add = {
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


const remove = {
	type: GraphQLString,
	description: '删除提醒分类',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: 'id'
		}
	},
	resolve(root, parmas) {
		
		let remove = new Promise((resolve, reject) => {
			DM.workType_M.remove(
				{id: parmas.id },
				(err, data) => {
					if (err) {
						reject(JSON.stringify(err));
						return;
					}

					resolve( JSON.stringify(data.result) )
				}
			)
		})

		return remove
	}

}


const update = {
	type: GraphQLString,
	description: '更新提醒分类',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString),
			description: '更新类型 id'
		},
		name: {
			name: 'name',
			type: GraphQLString,
			description: '重新命名'
		}
	},
	resolve(root, params) {
		
		let remove = new Promise((resolve, reject) => {
			DM.workType_M.update(
				{ id: params.id },
				{name: params.name},
				(err, data) => {

					if (err) {
						reject(JSON.stringify(err));
						return;
					}
					resolve(JSON.stringify(data))
				}
			)
		})

		return remove
	}

}

module.exports = {
	add,
	remove,
	update,
}