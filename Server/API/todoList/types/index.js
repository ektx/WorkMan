const calendarEvt = require('./calendarEvent');
const evt = require('./events');
const W = require('./workType');

module.exports = {
	// 事件查询
	events: evt.events_TYPE,
	// 事件创建
	events_INT: evt.events_INTTYPE,
	// 事件更新
	evtUpdate_INT: evt.updateEvent_INTTYPE,
	// 保存返回信息格式
	evtSave_FB: evt.saveFeedback,

	query_calendarEvent_FB: calendarEvt.query_calendarEvent_feedback,

	// 保存日历返回信息
	saveCalendar_FB: calendarEvt.saveCalendar_feedback,

	// 查询分类
	workType: W.workType,
	// 添加修改分类
	workType_INT: W.workTypeIntType,
}