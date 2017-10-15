// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
	// 生产配置
	build: {
		// 使用 config/prod.env.js 中定义的编译环境
		env: require('./prod.env'),
		// 编译的 index.html(多页面可以在些添加)
		index: path.resolve(__dirname, '../dist/index.html'),
		// 编译输出的静态资源路径
		assetsRoot: path.resolve(__dirname, '../dist'),
		// 编译输出二级目录
		assetsSubDirectory: 'contents',
		// 编译输出根目录,可配置为服务器或 CDN 域名
		assetsPublicPath: '',
		// 是否使用 CSSsourceMap
		productionSourceMap: true,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		// 是否开房 gzip
		productionGzip: false,
		// 需要 gzip 压缩的文件扩展名
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	// 开发配置
	dev: {
		// 使用 config/dev.js 中定义的编译环境
		env: require('./dev.env'),
		// 开发版本中端口
		port: 8080,
		autoOpenBrowser: false,
		// 开发版本中静态文件地址
		assetsSubDirectory: 'contents',
		// 测试二级目录
		assetsPublicPath: '/',
		// 添加本地代理
		proxyTable: {
			'/api': {
				// 代理到本地的 mock 文件夹   
				target: 'http://localhost:9000/DataService/Dev/static/mock/',
				changeOrigin: true,
				pathRewrite: {
						// 将 请求替换成本地 mock json
						// /api/demo/helloworld.json => /demo/helloworld.json
						'^/api': ''
				}
			}
		},
		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap: false
	}
}
