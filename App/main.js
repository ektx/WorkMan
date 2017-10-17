const electron = require('electron');
const path = require('path');

// 控制应用生命周期模块
const { app, Tray } = electron;
// 创建原生浏览器窗口的模块
const { BrowserWindow } = electron;

let loginStatus = false;

// 登录状态
let SERVER_TOKEN;

const ipcMain = require('electron').ipcMain;

ipcMain.on('asynchronous-message', (event, arg) => {
	console.log(111, arg)
	// 返回消息
	event.sender.send('asynchronous-reply', 'ok');
	mainWindow.setContentSize(600, 800, true);
	mainWindow.setPosition(100,100, true);

	// 创建一个窗口
	createWindow({
		w: 410,
		h: 320,
		bg: '#f5f5f5',
		url: `file://${__dirname}/index2.html`
	})
});

let mainWindow = {};
/*
	创建新的窗口
	------------------------------
	options
	@w: {number} 宽度
	@h: {number} 高度
	@frame: {Boolean} 指定 false 来创建一个 Frameless Window.
	@titleBarStyle {default|hidden|hidden-inset}
	@bg: {string} 背景色或其它什么
	@url: {string} 地址 
*/
function createWindow(name, options) {

	let defOptions = {
		width: options.w, 
		minWidth: options.mw || 100,
		height: options.h,
		minHeight: options.mh || 100, 
		frame: options.frame,
		titleBarStyle: options.titleBarStyle,
		// backgroundColor: options.bg,
		ico: path.join(__dirname, 'contents/bin/img/usr/kings.png'),
		vibrancy: 'light' // dark | light |
	}

	if (options.x) {
		defOptions.x = options.x;
		defOptions.y = options.y;
	}

	mainWindow[name] = new BrowserWindow( defOptions );
	mainWindow[name].url = options.url;
	mainWindow[name].key = name

	mainWindow[name].loadURL(options.url);

	// 默认开启调试工具
	// mainWindow.webContents.openDevTools();

	mainWindow[name].on('close', function(e) {
		console.log('close', this)
		this.status_close = true;
		this.bounds = this.getBounds();
	});

	mainWindow[name].on('closed', ()=> {
		this.statusClosed = true;
	});
}

// 打开登录
function OS_openLoginWin() {
	// 创建一个窗口
	createWindow('login', {
		w: 355,
		h: 420,
		frame: false,
		titleBarStyle: 'dafault',
		url: `file://${__dirname}/welcome.html`
	})
}

app.on('ready', ()=>{

	OS_openLoginWin()
		
});

app.on('window-all-closed', ()=> {
	if (process.flatform !== 'darwin') {
		// app.quit();
	}
});

// 当用户点击 dock 图标时
app.on('activate', () => {
	let winName = 'login';

	if (loginStatus) {
		winName = 'main'
	}

	let winGetBounds = mainWindow[winName].bounds;

	if (mainWindow[winName].status_close) {

		createWindow(winName, {
			x: winGetBounds.x,
			y: winGetBounds.y,
			w: winGetBounds.width,
			mw: 400,
			h: winGetBounds.height,
			mh: 400,
			frame: loginStatus,
			titleBarStyle: loginStatus ? 'hidden' : 'default',
			url: mainWindow[winName].url
		})
	}
});

// 打开控制台
ipcMain.on('show-development-tool', (event, arg)=> {
	console.log(`异步信息为: ${arg}`);
	mainWindow['main'].webContents.openDevTools();
});

// 打开窗口
ipcMain.on('show-main-windows', (event, arg) => {

	createWindow('main', {
		w: 900,
		mw: 400,
		h: 620,
		mh: 400,
		frame: true,
		titleBarStyle: 'hidden',
		url: `file://${__dirname}/index.html`
	})

	// 创建一个窗口
	loginStatus = true;

	SERVER_TOKEN = arg.token;

	// 
	mainWindow['login'] = null;

})


// 打开登录窗口
ipcMain.on('show-login-windows', (event, arg) => {

	OS_openLoginWin()

	// 创建一个窗口
	loginStatus = true;

	SERVER_TOKEN = null;

	// 
	mainWindow['main'] = null;

})


// 发送 TOKEN
ipcMain.on('GET_ISERVER_TOKEN', (event,arg) => {
	console.log('ssss', SERVER_TOKEN)
	event.sender.send('GET_FROM_SERVER_TOKEN', SERVER_TOKEN)
})

// Mac OS dock
// 提醒
// app.dock.setBadge('99+');

