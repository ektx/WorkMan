
const express = require('express')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const tokenAuth = require('./bin/tokenAuth')

// 1.连接数据库
// 1.1 连接用户中心
global.USERCENTER_SERVER = mongoose.createConnection('mongodb://localhost/iserver');
// 1.2 连接 workman
global.WORKMAN_SERVER = mongoose.createConnection('mongodb://localhost/workman');
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
getDBStatus([USERCENTER_SERVER, USERCENTER_SERVER]);

// 引用路由
const router = require('./bin/router')

// 使用服务
const app = express();


// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// 解析 application/json
app.use(bodyParser.json())

// 注意 router 要在 bodyParser 之后调用
// 否则无法取到 req.body
app.use(router)

const schema = require('./API/')
// 对外接口
app.use('/api', tokenAuth, graphqlHTTP({
	schema,
	graphiql: true
}))
// 对内测试接口
app.use('/apiTest', graphqlHTTP({
	schema,
	graphiql: true
}))

app.listen(4000, ()=>{
	console.log('Server listening on port 4000')
})