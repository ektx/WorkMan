
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/*
	提醒类别
	======================================

	文档: workType
*/
const _workType = new Schema({
	// id 由时间辍和用户名组成 zwl_126711278728172
	id: {
		type: String,
		require: true,
		unique: true
	},
	// 用户
	account: String,
	// 名称
	name   : String
}, {collection: 'workType', versionKey: false});

exports.workType_M = mongoose.model('workType', _workType);