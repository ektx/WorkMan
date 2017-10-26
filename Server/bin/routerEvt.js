
const db_schemas = require('../API/user/models/user');

const jwt = require('jsonwebtoken')
const tokenKey = 'expressTokenTest'

/*
	登录功能
	-------------------------------
*/
function PostLogin (req, res) {
	console.log(req.body)

	let sendErr = ()=> {
		res.send({
			status: false,
			msg: '没有发现数据!'
		})
	}

	db_schemas.usrs_m.findOne(
		{'account': req.body.user},
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

					// 添加一个 token
					let token = jwt.sign(req.body, tokenKey, {
						expiresIn: 7200 // 在 2 小时后过期 60 * 60 *2
					})

					res.send({
						status: true,
						msg: 'welcome use workMan!',
						token
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

exports.login = PostLogin;


exports.GetLogin = (req, res) => {
	res.redirect('/')
}