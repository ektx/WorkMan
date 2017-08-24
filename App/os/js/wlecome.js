/*
	welcome 页面功能
	@ektx <530675800@qq.com>
	@2016-11-30
*/

window.addEventListener("DOMContentLoaded", ()=> {
	let d = new Date();
	let welBox = document.querySelector('.welcome-box');
	let dataZH = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];

	let _html = '<header>'+dataZH[d.getDay()]+'</header>';
	_html += '<main><p class="wel-time">' + d.getDate() + '</p></main>';
	_html += '<footer><p class="wel-data">'+ d.getMonth()+' . '+d.getFullYear()+'</p>';
	_html += '<p class="wel-remind">今日安排: <span>18</span>/100</p></footer>';

	welBox.innerHTML = _html
	
}, false)
