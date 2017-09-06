const ipcRenderer = require('electron').ipcRenderer;

// 关闭窗口功能
let closeBtn = document.getElementById('window-close-btn')

closeBtn.addEventListener('click', function() {
  window.close();
})

let logoForm = document.getElementById('logo-form');
let errorMsg = document.querySelector('.logo-error');

logoForm.addEventListener('submit', function(e) {
	e.preventDefault();

	let nameInt = this.querySelector('input[type="text"]');
	let pawdInt = this.querySelector('input[type="password"]')
	let pawd = pawdInt.value.trim();
	let name = nameInt.value.trim();

	if (!name) {
		nameInt.focus(); 
		return;
	}

	if (!pawd) {
		pawdInt.focus(); 
		return;
	}

	fetch('http://localhost:4000/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user: name,
			pwd: pawd
		})
	})
	.then(res => res.json())
	.then( data => {

		if (data.status) {
			// 发送用户信息与登录信息
			ipcRenderer.send('show-main-windows', {
				// 登录成功状态
				status: true,
				// 用户登录成功 token
				token: data.token,
				// 用户名
				user: name
			})

			// 关闭登录页面
			closeBtn.click()
		} else {
			errorMsg.classList.add('show')
			errorMsg.innerText = data.msg
		}

	})
	.catch(err => {
		console.error(err)
	})

})
