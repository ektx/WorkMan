
// Work
const db_schemas = require('../models/user');


/*
	登录功能
	-------------------------------
*/
function login (req, res) {
	console.log(req.body)

	let sendErr = ()=> {
		res.send({
			status: false,
			msg: '没有发现数据!'
		})
	}
	
	db_schemas.usrs_m.findOne(
		{'account': req.body.user},
		{},
		(err, data)=> {
			if (err) {
				res.send({
					status: false,
					msg: '服务器错误!'
				})				
				return;
			}

			if (data) {
				if (data.pwd === req.body.pwd) {
					res.send({
						status: true,
						msg: 'welcome use workMan!'
					})
				} else {
					res.send({
						status: false,
						msg: '密码不正确!'
					})
				}
			} else {
				res.send({
					status: false,
					msg: '用户不存在!'
				})
			}
		}
	)
}

exports.login = login;