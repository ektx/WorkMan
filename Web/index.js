const express = require('express');
const mongoose = require('mongoose');

const router = require('./bin/router');
const app = express();

const Schemas = require('./bin/schemas');

// 1.连接
global.usercenterServer = mongoose.createConnection('mongodb://localhost/iserver');
let iserverApp = mongoose.createConnection('mongodb://localhost/workman');

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

ucs_m_usrs.find(
	{'account': 'ektx'},
	{},
	(err, data)=> {
		if (err) {
			console.error(err);
			return;
		}

		if (data) {
			console.log(data)
		} else {
			console.log('Not')
		}
	}
)

app.use(router)

app.listen(4000, ()=>{
	console.log('Server listening on port 4000')
})