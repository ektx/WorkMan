
const user = require('./user')
const todolist = require('./todolist')

module.exports = {
	// 用户 API
	addUser: user.add,
	removeUser: user.remove,
	updateUser: user.update,

	// todoList APP
	addTodoListType: todolist.addWorkType,
	removeTodoListType: todolist.removeWorkType,
	updateTodoListType: todolist.updateWorkType,

	// todoList - 日历功能
	saveCalendarEvent: todolist.saveCalendarEvent,
	removeCalendarEvent: todolist.removeCalendarEvent,

	// todoList - 事件功能
	addTodoListEvent: todolist.addTodoListEvent,
	saveTodoListEvent: todolist.saveTodoListEvent,
	removeTodoListEvent: todolist.removeTodoListEvent,
}