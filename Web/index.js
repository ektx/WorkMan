
const express = require('express')
const bodyParser = require('body-parser')

const router = require('./bin/router');
const app = express();


// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// 解析 application/json
app.use(bodyParser.json())

// 注意 router 要在 bodyParser 之后调用
// 否则无法取到 req.body
app.use(router)


app.listen(4000, ()=>{
	console.log('Server listening on port 4000')
})