const electron = require('electron');
const path = require('path');

// 控制应用生命周期模块
const { app, Tray } = electron;
// 创建原生浏览器窗口的模块
const { BrowserWindow } = electron;


let mainWindow , 
	mainWindBounds;

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
function createWindow(options) {

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

	mainWindow = new BrowserWindow( defOptions );

	mainWindow.loadURL(options.url);

	// 默认开启调试工具
	// mainWindow.webContents.openDevTools();

	mainWindow.on('close', (e)=> {
		mainWindBounds = mainWindow.getBounds();
	});

	mainWindow.on('closed', ()=> {
		mainWindow = null;
	});
}

app.on('ready', ()=>{
	// 创建一个窗口
	// createWindow({
	// 	w: 325,
	// 	h: 400,
	//  frame: false,
	//  titleBarStyle: 'dafault',
	// 	url: `file://${__dirname}/welcome.html`
	// })
	
	// const appIcon = new Tray('contents/bin/img/usr/kings.png');

	createWindow({
		w: 900,
		mw: 400,
		h: 620,
		mh: 400,
		frame: true,
		titleBarStyle: 'hidden',
		url: `file://${__dirname}/index.html`
	})
});

app.on('window-all-closed', ()=> {
	if (process.flatform !== 'darwin') {
		// app.quit();
	}
});

// 当用户点击 dock 图标时
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow({
			x: mainWindBounds.x,
			y: mainWindBounds.y,
			w: mainWindBounds.width,
			mw: 400,
			h: mainWindBounds.height,
			mh: 400,
			frame: true,
			titleBarStyle: 'hidden',
			url: `file://${__dirname}/index.html`
		})
	}
});

// 打开控制台
ipcMain.on('show-development-tool', (event, arg)=> {
	console.log(`异步信息为: ${arg}`);
	mainWindow.webContents.openDevTools();
});

// Mac OS dock
// 提醒
// app.dock.setBadge('99+');

