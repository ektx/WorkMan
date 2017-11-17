
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
	提醒日历
	======================================


	文档: todoList_calendarEvent
*/
const _ = new Schema({
	// 用户
	account: {
		type: String,
		require: true
	},
	// 事件类型 ID 用于保存分类
	eventTypeID: {
		type: String,
		require: true
	},
	// 时间 格式: 年-月,如:2018-2
	time   : String,
	// 数据 用于保存一组对应天的事件
	data	: Array
}, {collection: 'todoList_calendarEvent', versionKey: false});

module.exports = mongoose.model('todoList_calendarEvent', _);