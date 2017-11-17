
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

/*
	用户信息
	======================================
	@account: 帐号(不可修改)
	@name: 用户名
	@pwd: 密码
	@email: 邮箱
	@ico: 头像
	@power: 用户权限
	@reset: 找回密码Code

	文档: usrs
*/
const _usrs = new Schema({
	account: {
		type: String,
		require: true,
		unique: true
	},
	name   : String,
	pwd	   : String,
	email  : String,
	ico	   : String,
	power  : String,
	reset  : String
}, {collection: 'usrs', versionKey: false});

exports.usrs_m = mongoose.model('usrs', _usrs);