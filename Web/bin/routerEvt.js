// Module
const mongoose = require('mongoose')

// Work
const Schemas = require('./schemas');

// 1.连接
global.usercenterServer = mongoose.createConnection('mongodb://localhost/iserver');
let iserverApp = mongoose.createConnection('mongodb://localhost/workman');
mongoose.set('debug', true);

// 输出状态方法
function getDBStatus (dbs) {
	for (let i = 0,l=dbs.length; i < l; i++) {

		dbs[i].on('error', console.error.bind(console, `${dbs[i]}connection error:`));

		dbs[i].once('open', ()=>{
			console.log(`${dbs[i].name} Mongodb OK!`)
		})
	}
}

// 调用
getDBStatus([usercenterServer, iserverApp]);

// 2. 检索 model
let ucs_m_usrs = usercenterServer.model('usrs', Schemas.usrs);
let iserver_m_usrs = iserverApp.model('usrs', Schemas.usrs);


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
	
	ucs_m_usrs.findOne(
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