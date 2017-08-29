
const mongoose = require('mongoose')
mongoose.Promise = Promise;

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
	name   : String,
	// 创建时间
	ctime	: Date,
	// 修改时间
	mtime	: Date

}, {collection: 'workType', versionKey: false});

exports.workType_M = WORKMAN_SERVER.model('workType', _workType);