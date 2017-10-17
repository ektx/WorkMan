// 系统能用方法
const { remote } = nodeRequire('electron');
const { 
	app, 
	Menu, 
	MenuItem, 
	dialog 
} = nodeRequire('electron').remote;
const { ipcRenderer, ipcMain } = nodeRequire('electron');

// require node modules
const fs = nodeRequire('fs');
const async = nodeRequire('async');

// use browser doc mod
const _doc = document;

// 关闭窗口功能
let closeBtn = _doc.getElementById('window-close-btn');
if (closeBtn) {
	closeBtn.addEventListener('click', function() {
	  window.close();
	})
}

// Mac Os Menu
const template = [
	// {
	// 	label: '文件',
	// 	submenu: [
	// 		{
	// 			label: '导入提醒',
	// 			accelerator: 'CmdOrCtrl+O',
	// 			click: () => {
	// 				dialog.showOpenDialog({
	// 					filters: [
	// 						{ name: 'File Type', extensions: ['wdb']}
	// 					],
	// 					properties: ['openFile']
	// 				})
	// 			}
	// 		},
	// 		{
	// 			label: '导出数据',
	// 			submenu: [
	// 				// {
	// 				// 	label: '导出所有数据',
	// 				// 	click: () => {
	// 				// 		exportData(1)
	// 				// 	}
	// 				// },
	// 				{
	// 					label: '导出本周工作',
	// 					click: () => {
	// 						exportData(2)
	// 					}
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	{
		role: 'edit',
		label: '编辑',
		submenu: [
			{
				role: 'undo',
				label: '撤消'
			},
			{
				role: 'redo',
				label: '重做'
			},
			{
				type: 'separator'
			},
			{
				role: 'cut',
				label: '剪切'
			},
			{
				role: 'copy',
				label: '复制'
			},
			{
				role: 'paste',
				label: '粘贴'
			},
			{
				role: 'pasteandmatchstyle',
				label: '粘贴并匹配样式'
			},
			{
				role: 'selectall',
				label: '全选'
			},
			{
				role: 'delete',
				label: '删除'
			}
		]
	},
	{
		role: 'window',
		label: '窗口',
		submenu: [
			{
				role: 'minimize',
				label: '最小化'
			},
			{
				role: 'close',
				label: '关闭'
			}
		]
	},
	{
		role: 'development',
		label: '开发者',
		submenu: [
			{
				label: '控制台',
				click() {
					ipcRenderer.send('show-development-tool', true)
				}
			}
		]
	},
	{
		role: 'help',
		label: '帮助',
		submenu: [
			{
				label: '开发者网站',
				click() {
					nodeRequire('electron').shell.openExternal('https://github.com/ektx')
				}
			}
		]
	}
];

if (process.platform === 'darwin') {
	template.unshift({
		label: app.getName(),
		submenu: [
			{
				role: 'about',
				label: '关于 '+ app.getName()
			},
			{
				type: 'separator'
			},
			{
				role: 'services',
				submenu: [],
				label: '服务'
			},
			{
				type: 'separator'
			},
			{
				role: 'hide',
				label: '隐藏 ' + app.getName()
			},
			{
				role: 'hideothers',
				label: '隐藏其他应用'
			},
			{
				role: 'unhide',
				label: '显示'
			},
			{
				role: 'quit',
				label: '退出'
			}
		]
	})
}

const macmenu = Menu.buildFromTemplate( template );
Menu.setApplicationMenu( macmenu );

// 请求,获取 token
// 用于后面的用户认证
ipcRenderer.send('GET_ISERVER_TOKEN')
ipcRenderer.on('GET_FROM_SERVER_TOKEN', (e, args) => {
	localStorage.setItem('TOKEN', args);
})


// 读取计划列表功能
let todoListHTML = fs.readFileSync('./app/todolist/main.html', 'utf8');
let mainWindows = document.getElementById('os-main-windows');
let scripts = nodeRequire('./app/todolist/config.json').scripts;

mainWindows.innerHTML = todoListHTML;

// 创建添加容器
let jsDOMFragment = document.createDocumentFragment();
for (let i = 0, l = scripts.length; i < l; i++) {
	let script = document.createElement('script');
	script.src = 'app/todolist/' + scripts[i] + '.js';

	jsDOMFragment.appendChild(script)
}
document.body.appendChild( jsDOMFragment )



/*
	封装 APIFetch 请求
	------------------------
	options
	@data 		发送数据
*/
function APIFetch(data) {

	return new Promise((resolve, reject) => {
		fetch('http://localhost:4000/api', {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'x-access-token': localStorage.TOKEN,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( data )
		})
		.then(res => res.json())
		.then(data => {

			if (data.code === 10000 && !data.status) {

				localStorage.removeItem('TOKEN');

				// 通知服务跳转
				ipcRenderer.send('show-login-windows', {
					// 登录成功状态
					status: true
				})
				
				window.close()
			} else {
				resolve(data.data)
			}
		})
		.catch(err => reject(err))
	})
}

// (async function () {
// 	data = {
// 		query: `{ workTypes(account: "baobao") { name }}`
// 	}

// 	const result = await APIFetch(data);

// 	console.log(result)
// })()

// APIFetch({
// 	query: `{ workTypes(account: "baobao") { name }}`
// }).then(resolve => {
// 	console.log(resolve)
// }, reject => {
// 	console.log(reject)
// })


/*
	右键菜单功能
*/
function createMouseRightClickMenu (menuArr) {
	const menu = new Menu();

	for (let i = 0, l = menuArr.length; i < l; i++) {
		menu.append(new MenuItem( menuArr[i] ))
	}
	menu.popup(remote.getCurrentWindow())
}
