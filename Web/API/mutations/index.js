
const user = require('./user')
const todolist = require('./todolist')

module.exports = {
	addUser: user.add,
	removeUser: user.remove,
	updateUser: user.update,

	addTodoListType: todolist.add,
	removeTodoListType: todolist.remove
}