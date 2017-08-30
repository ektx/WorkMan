
const user = require('./user')
const todolist = require('./todolist')

module.exports = {
	addUser: user.add,
	removeUser: user.remove,
	updateUser: user.update,

	// todoList APP
	addTodoListType: todolist.addWorkType,
	removeTodoListType: todolist.removeWorkType,
	updateTodoListType: todolist.updateWorkType,

	addCalendarEvent: todolist.addCalendarEvent,
	removeCalendarEvent: todolist.removeCalendarEvent,
	updateCalendarEvent: todolist.updateCalendarEvent,

	addTodoListEvent: todolist.addTodoListEvent,
	updateTodoListEvent: todolist.updateTodoListEvent,
	removeTodoListEvent: todolist.removeTodoListEvent,
}