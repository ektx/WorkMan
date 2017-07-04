// 系统能用方法

const {app, Menu, dialog} = nodeRequire('electron').remote;
const ipcRenderer = nodeRequire('electron').ipcRenderer;

// require node modules
const fs = nodeRequire('fs');
const async = nodeRequire('async');

// use browser doc mod
const _doc = document;

// 关闭窗口功能
let closeBtn = _doc.getElementById('close-btn');
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