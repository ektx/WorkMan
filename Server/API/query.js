
const user = require('./user/queries')

const todoList = require('./todoList/queries')

module.exports = {
	user,

	workTypes: todoList.workTypes,
	todolistEvetns: todoList.events,
	calendarEvent: todoList.calendarEvent,
}