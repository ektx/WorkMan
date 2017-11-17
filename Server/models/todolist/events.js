
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/*
	提醒日历
	======================================
*/
const _ = new Schema({
	// 唯一的区别
	id: {
		type: String,
		require: true,
		unique: true
	},
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
	// 标题
	title: String,
	// 是否完成
	complete: Boolean,
	// 创建时间
	ctime: Date,
	// 修改时间
	mtime: Date,
	// 提醒时间
	ttime: Date,
	// 开始时间
	stime: Date,
	// 结束时间
	etime: Date,
	// 内容
	inner: String

}, {collection: 'todoList_events', versionKey: false});

module.exports = mongoose.model('todoList_events', _);