
const workType = require('./workType')
const calendarEvent = require('./calendarEvent')
const events = require('./events')

module.exports = {
	addWorkType: workType.add,
	removeWorkType: workType.remove,
	updateWorkType: workType.update,

	addCalendarEvent: calendarEvent.add,
	removeCalendarEvent: calendarEvent.remove,
	updateCalendarEvent: calendarEvent.update,

	addTodoListEvent: events.add,
	updateTodoListEvent: events.update,
	removeTodoListEvent: events.remove,
}