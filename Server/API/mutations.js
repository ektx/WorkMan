
const user = require('./user/mutations')
const todolist = require('./todolist/mutations')

module.exports = {
	userAdd: user.add,
	userUpdate: user.update,
	removeUser: user.remove,

	// todoList APP
	addTodoListType: todolist.addWorkType,
	removeTodoListType: todolist.removeWorkType,
	updateTodoListType: todolist.updateWorkType,

	// todoList - 日历功能
	saveCalendarEvent: todolist.saveCalendarEvent,
	removeCalendarEvent: todolist.removeCalendarEvent,

	// todoList - 事件功能
	// addTodoListEvent: todolist.addTodoListEvent,
	saveTodoListEvent: todolist.saveTodoListEvent,
	removeTodoListEvent: todolist.removeTodoListEvent,
}