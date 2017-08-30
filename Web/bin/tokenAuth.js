
/*
	用于验证用户的 token 是否合法
	--------------------------------
*/

const jwt = require('jsonwebtoken')
const tokenKey = 'expressTokenTest'

function authToken(req, res, next) {
	
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {

		jwt.verify(token, tokenKey, (err, decoded) => {
			if (err) {
				return res.send({
					status: false,
					message: "token认证失败"
				})
			} else {
				req.decoded = decoded;
				next()
			}
		})
	} else {
		return res.status(403).send({
			status: false,
			message: '没有发现token'
		})
	}
}

module.exports = authToken;