
const workType = require('./workType')
const calendarEvent = require('./calendarEvent')

module.exports = {
	addWorkType: workType.add,
	removeWorkType: workType.remove,
	updateWorkType: workType.update,

	addCalendarEvent: calendarEvent.add,
	removeCalendarEvent: calendarEvent.remove,
	updateCalendarEvent: calendarEvent.update,
}