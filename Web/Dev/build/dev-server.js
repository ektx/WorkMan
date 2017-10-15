// 检查 Node 和 npm 版本
require('./check-versions')()
// 获取 config/index.js 的默认配置
var config = require('../config')

/*
  如果 node 的环境无法判断当前是 dev / product 环境
  使用 config.dev.env.NODE_ENV
*/
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
// 自动打开浏览器功能
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
// 代理功能
var proxyMiddleware = require('http-proxy-middleware')
// 使用 dev 环境的 webpack 配置
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
// 如果没有指定运行端口,使用 config.dev.port 端口
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
// 自动打开浏览器,如果没有设置则默认为 false
var autoOpenBrowser = !!config.dev.autoOpenBrowser

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 使用 config.dev.proxyTable 的代理配置
var proxyTable = config.dev.proxyTable

var app = express()
// 启动 webpack 编译
var compiler = webpack(webpackConfig)

// 启动 webpack-dev-middleware,将编译后的文件暂存到内存中
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// 启动热加载模块
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})

// 当 html-webpack-plugin 发生变化时,刷新页面
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
// 将 proxyTable 中的配置挂到启动的 express 中
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 绑定 html5 history api
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 将内存中 webpack 编译后的内容挂到 express 服务上
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将 hot-reload 挂到express 服务器上并输出相关的状态 错误
app.use(hotMiddleware)

// serve pure static assets
// 拼接 static 文件夹的静态资源路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 为静态资源提供响应服务
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  // 如果不是测试环境,不用打开浏览器
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
