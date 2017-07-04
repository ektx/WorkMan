/*
	功能函数
	--------------------------------
	@author: zwl
*/


// 重命名类型
function renameType () {
	$('.ready', '#todo-type-list').find('input').removeAttr('readonly').focus().end().click();
	$('.hd-day-inner .inner').hide()
}


/*
	日历显示当前日期
*/
function goToToday (id) {
	let nowTime = new Date();
	
	// 生成日历
	makeCalendar({
		year: nowTime.getFullYear(), 
		month: nowTime.getMonth()+1, 
		day: nowTime.getDate(),
		id: id
	});

	// 更新日历事件
	setCalendarStatus(id, null);

}


/* 
	生成日历
	@year [number] 年
	@month [number] 月
	@date [number] 天
	@id 查询的类型
	@el 日历的容器
*/
function makeCalendar(options) {

	let year = options.year;
	let month = options.month;
	let date = options.day;
	let id = options.id;
	let ele = options.el || $('.calendar-days');

	let dataArr = calendar.str(year, month),
		calendarHTML = '';

	for (let i = 0; i < 42; i++ ) {
		let _d = dataArr[i] || '',
			calendarDayId = '',
			_class = '';

		if (_d) calendarDayId = ' id="calDay-'+_d+'"';

		// 标记当天
		if (_d == date) {
			_class += 'day current ';
		}

		if (_class.length) {
			_class = ' class="'+_class+'"';
		}

		calendarHTML += '<li' + calendarDayId + _class + '><span>'+ _d + '</span></li>';
	}


	ele.html(calendarHTML)
	.data({
		'year': year,
		'month': month,
		'day': date
	})
	.parent().prev().find('span').text(year+'年'+month+'月')

}


/*
	设置日历上状态
	------------------------------------------
	@id [number] 当前列表选择
	@month [data] 想要查询的时间, eg: 2017-04
*/
function setCalendarStatus (id, month) {
	
	let nowTypeID = id || $('.current','#todo-type-list').data().id;
	let eventClaendar = $('#events-calendar-mod').find('.calendar-days');

	if (!month) {
		month = calendarTitleTime().timeStr.substring(0, 7);
	}

	let query = `SELECT time FROM calendarDays WHERE time LIKE '${month}%'`;

	if (nowTypeID > 100) {
		query += ` AND dayType IN (${nowTypeID})`;
	}

	eventClaendar.removeClass();

	// 摘取此分类事件有日期的标识
	webSQLCommon(
		query, 
		[], 
		data => {
			let dayArr = ['calendar-days'];

			for (let i = 0, l = data.rows.length; i < l; i++) {
				dayArr.push( 'day-'+ parseInt(data.rows[i].time.substr(8)) )
			}

			eventClaendar.addClass( dayArr.join(' ') );
				
		}, 
		err => {
			console.log(err)
		}
	)
}

// 生成事件分类列表
// @key 指定选中效果
function generateTodoType (key) {

	let currentID = '';

	let done = function(data) {

		let ulInner = '';

		data = data.rows;

		for (let i = 0,l = data.length; i < l; i++) {
			let _cur = '';
			if (data[i].id == key) {
				_cur = ' class="current"';
				
				currentID = data[i].id;
			}
			ulInner += `<li class="event-rows" ${_cur} data-id="${data[i].id}"><input value="${data[i].name}" readonly /></li>`
		}

		$('#todo-type-list').html( ulInner )
		.find(`[data-id="${key}"]`).click();
	}

	let fail = (err) => {
		console.error(err)
	}

	webSQLCommon(
		'SELECT * FROM todoType',
		[],
		done,
		fail
	)


}


/*
	事件列表标题与日期
	-----------------------------
*/
function updateTitleTime (title, year, month, week) {
	let _html = '';

	if (arguments.length === 4 || year == 1) {
		let _d = new Date();
		let _year = year == 1;

		title = _year ? _d.getDate() : title;
		year  = _year ?  _d.getFullYear() : year;
		month = month || (_d.getMonth()+1);
		week  = week || calendar.week();

		$('.inner', '.hd-day-inner').show()

		_html = `<input class="title day" type="text" placeholder="搜索" value="${title}" readonly/>`;
		_html += `<div class="inner"><p>${week}</p><p>${year}年${month}月</p></div>`;
	} else {
		_html = `<input class="title" type="text" placeholder="搜索" value="${title}" readonly/>`;
		$('.inner', '.hd-day-inner').hide()
	}

	$('.hd-day-inner').html( _html )

}


/*
	生成当前分类事件清单
	-------------------------------
	@data [Array] 事件清单
	@todoType [Object] 当前分类
*/
function genToDoList (data, todoType) {

	webSQLCommon(
		`SELECT * FROM todoType`,
		[],
		result => {
			let liHTML = '';
			let typeObj = {};

			for (let i = 0, l = result.rows.length; i < l; i++) {
				typeObj[result.rows[i].id] = result.rows[i].name;
			}
			
			if (data.length === 0) {
				let noWorkDiv = document.querySelector('.no-work-plane').classList;
				
				noWorkDiv.remove('fadeOut')
				noWorkDiv.add('show')

			} else {

				document.querySelector('.no-work-plane').classList.remove('show')

			}

			for (let i = 0, l = data.length; i < l; i++) {
				let _data = data[i];
				let _checked = _data.complete ? 'checked':'';

				liHTML += todoListLiTem(_data, _checked, typeObj, todoType);
			}

			$('ul','.todo-list-box').html( liHTML )

			
		},
		err => {
			console.error(err)
		}
	)
}


/*
	生成待办事件列表模板
	-------------------------------
*/
function todoListLiTem (data, checked, todoType, nowType) {

	let _title = data.title || '';
	let	_des = data.description || '';
	let	_id = data.id || 'new';
	let todoTypeStr = '';
	let writeTime = '';	// 创建日期
	let startTime = data.startTime || 0;

	nowType = nowType || {};

	// 如果存在列表集合
	if (todoType) {

		// 如果当前类型和查询的一样
		if (nowType.id != data.parent) {
			todoTypeStr = data.parent ? todoType[data.parent] : '';
			writeTime = data.startTime.substr(0, 10)
		}

	}

	// 对开始时间处理
	if ( startTime ) {
		startTime = startTime.split(' ')[0].split('-');
	}

	// 获取帮助信息
	let helpInfo = function() {
		let result = '';

		// 如果时间为空,那为我们不显示辅助信息
		// if (writeTime) {
			result = `<p class="title-help-info ${localStorage.EVENT_TYPE_ID <= 2?'':'hide'}">
				<span class="et-thi-typeName">${todoTypeStr}</span>
				`;
		// }

		if (localStorage.EVENT_TYPE_ID != 1)
			result += `<span class="et-thi-writeTime">${writeTime}</span>`

		return result + '</p>';
	}

	// 获取更多里面的列表信息
	let getMoreTypeInfo = function() {
		let result = '';

		// 如果当前的列表和自己的分类是一样,那么就在当前列表
		// 在当前列表不用显示自己有所属列表信息
		if (nowType.id && nowType.id != data.parent) {
			result = `<dl class="event-make-col">
				<dt>列表:</dt>
				<dd>
					<span>${todoTypeStr || '无'}</span>
				</dd>
			</dl>`;
		}

		return result;
	}

	return  `<li class="event-rows"
				 data-id="${_id}" 
				 data-parent="${data.parent}" 
				 data-time="${data.startTime}"
			>
				<div class="header">
					<label>
						<input class="is-done" type="checkbox" ${checked}>
					</label>
					<div class="title-box">
						<input class="title" value="${_title}" />
						${helpInfo()}
					</div>
					<span class="li-btns-box">
						<button class="tbtn arrow-ico down-arrow"></button>
					</span>
				</div>
				<ul class="inner">
					${getMoreTypeInfo()}
					<dl class="event-make-col">
						<dt>开始:</dt>
						<dd>
							<ul class="date-select-ui">
								<li class="year">${startTime[0]}</li>
								<li class="month">${startTime[1]}</li>
								<li class="day">${startTime[2]}</li>
							</ul>

							<button class="et-make-btn add-end-time">添加结束时间</button>
						</dd>
					</dl>
					<!--
					<dl class="event-make-col">
						<dt>结束:</dt>
						<dd>
							<ul class="date-select-ui">
								<li class="year">2017</li>
								<li class="month">4</li>
								<li class="day">28</li>
							</ul>
						</dd>
					</dl>
					-->
					<dl>
						<dt>备注:</dt>
						<dd>
							<textarea class="inner-box">${_des}</textarea>
						</dd>
					</dl>
				</ul>
			</li>`;
}


/*
	保存数据
	-------------------------------
*/
function saveMyToDoList (_this) {

	let typeId = localStorage.EVENT_TYPE_ID;
	let _title = _this.find('.title');
	let title  = _title.val();
	let isDone = 0;
	let remark = _this.find('.inner-box').val();
	let parent = _this.data().parent || '',
		id     = + new Date(),
		reTime  = calendar.format('YYYY-MM-DD', `${localStorage.EVENT_CALENDAR_YEAR}-${localStorage.EVENT_CALENDAR_MONTH}-${localStorage.EVENT_CALENDAR_DAY}`);

	if ( parseInt(parent) < 100) {
		parent = '';
	}

	// 没有写标题的不算~
	if (!title) {

		// 如果没有添加任何事情,那之前如果有工作的提醒,则显示回来
		let remindTips = document.querySelector('.no-work-plane');
		if (remindTips && !_this.siblings(':visible').length) remindTips.classList.remove('fadeOut');

		_this.remove();
		return;
	}

	let done = function() {
		_this.attr({
			'data-id': id,
			'data-time': reTime
		});

		_this.data().id = id;

		// 在有时间提醒时 处理日历上事件效果
		if (reTime) {
			let _type = 'add';

			setCalendarDayEvent({
				type: _type, 
				time: reTime,
				parent: parent,
				updateType: '+'
			})
		}
	}

	webSQLInsert(
		'todoEvent', 
		'id, title, complete, description, parent, startTime', 
		[id, title, isDone, remark, parent, reTime],
		done,
		err => {
			console.log(err)
		}
	)
}


/*
	获取小日历上的时间
*/
function calendarTitleTime () {

	let calendarDays = $('#events-calendar-days');
	let YYMM = calendarDays.data();
	let year = YYMM.year;
	let month= YYMM.month;
	let day  = YYMM.day;

	let currentDay = calendarDays.find('.current');
	let week = calendar.week(`${year}-${month}-${day}`);
	let events = currentDay.length > 0 ? currentDay[0].matches('.events') : false;

	let time = new Date();
	let hour = time.getHours();
	let min  = time.getMinutes();
	let sed  = time.getSeconds();

	return {
		ele: currentDay,
		year: year,
		month: month,
		day: day,
		week: week,
		hour: hour,
		min: min,
		sed: sed,
		time: time,
		timeStr: `${year}-${month < 10 ? '0'+month: month}-${day<10?'0'+day:day}`,
		hasEvent: events,
		hasSelect: currentDay.length > 0 ? true : false
	}
}


/*
	更新或添加日历索引
	--------------------------------------------
	@type    add | del
	@time    日历事件时间  eg: 2017-04-01
	@parent  类别

	setCalendarDayEvent({
		type: 'del', 
		time: liData.time,
		parent: liData.parent
	})
*/
function setCalendarDayEvent(obj) {

	let type = obj.type;
	let time = obj.time;
	let parent = obj.parent;

	if (isNaN(parent)) {
		console.warning(`parent 不是数字,无法取得父级内容! -> setCalendarDayEvent`);
		return;
	}

	let done = data => {
		// console.log(data)
	};

	let fail = err => {
		console.error(err)
	}

	// 更新日历状态
	let addRemind = () => {

		let setDayClass = 'day-'+parseInt(time.substr(8));
		let calendarUl  = document.getElementById('events-calendar-days');
		let currentType = document.getElementById('todo-type-list').querySelector('.current').dataset.id;

		if (!calendarUl.matches('.'+setDayClass) && type === 'add' && currentType == parent) {
			calendarUl.classList.add(setDayClass)
		}

		if (type === 'del') {
			// 在所有计划类型时
			if (currentType == 2) {
				webSQLCommon(
					`SELECT * FROM calendarDays WHERE time = ?`,
					[time],
					data => {
						if((data.rows.length ? data.rows[0].sum : 0) == 0) {
							calendarUl.classList.remove(setDayClass)
						}
					},
					fail
				)
			} 
			// 在自己的类别下时
			else if (currentType == parent) {
				calendarUl.classList.remove(setDayClass);
			}
		}
	}

	// 更新数据库状态
	// @set [string] {-|+}
	let updateCalendarDay = set => {
		webSQLCommon(
			`UPDATE calendarDays SET sum = sum${set}1 WHERE time = ? AND dayType = ?`,
			[time, parent], 
			data => {
				webSQLCommon(
					`UPDATE todoEvent SET complete=? WHERE id = ?`, 
					[this.checked ? 1:0, parent],
					done,
					fail
				)
			}, 
			fail
		)
	}

	// 智能分类操作
	let setStatus = (size) => {

		if (type === 'add') {
			// 如果此类型的日期上从来没有数据
			// 我们则创建一个
			if (size === 0) {
				webSQLInsert('calendarDays', 'time, sum, dayType', [time, 1, parent], addRemind, fail);
			} 
			// 反之,我们就递增
			else {
				updateCalendarDay('+')
			}
		} 
		else if (type === 'del') {
			// 如果这个类型的日期上只有一条数据时
			// 些时我们就删除它了
			if (size === 1) {
				webSQLCommon(
					`DELETE FROM calendarDays WHERE time=? AND dayType = ?`,
					[time, parent],
					addRemind,
					fail
				)
			}
			// 数据大于1时,我们就递减 
			else {
				updateCalendarDay('-')
			}
		}
	}

	// 查询基础数据
	webSQLCommon(
		`SELECT * FROM calendarDays WHERE time = ? AND dayType = ?`,
		[time, parseInt(parent)],
		data => {
			setStatus(data.rows.length ? data.rows[0].sum : 0);
		},
		fail
	)

}


/*
	导出功能
	-------------------------------
	@type
*/
function exportData(type) {

	let fileInner = '';
	let nowType = $('#todo-type-list .current');

	let writeFile = (data, fileName)=> {
		let WF = fs.createWriteStream( app.getPath('desktop') + `/${fileName}`, {defaultEncoding: 'utf8'});
		WF.write( data )
	}

	if ( nowType.length > 0 ){

		if (nowType.data().id < 100) {
			alert('今天和所有无法为您导出!');
			return;
		}
	} else {
		alert('请先选择你要导出的类别!然后尝试导出!');
		return;
	}

	switch (type) {
		// 导出所有数据
		case 1:
			fileInner = '导出数据';
			break;

		// 导出周报形式
		case 2:
			fileInner = '周报';
			break;
	}


	webSQLCommon(
		`SELECT * FROM todoEvent`, [],
		data => {

			writeFile( JSON.stringify(data.rows, '', '\t'), 'event.txt' );

		},
		error => {
			console.error(error)
		}
	);

}


/*
	删除列表功能
	-----------------------
	@ele: 指定要删除的列表区域
	@table: 数据库表
*/
function delListDom (ele, table) {

	let li = $('.ready', ele);

	let fail = function() {
		console.error('del fail!')
	}

	if (ele === '.todo-list-box') {

		// 
		let liData = li.data();

		// 对于有时间的事件
		if (liData.time) {
			setCalendarDayEvent({
				type: 'del', 
				time: liData.time,
				parent: liData.parent
			})
		}

		// 删除当前数据
		webSQLCommon(
			`DELETE FROM todoEvent WHERE id=?`,
			[liData.id],
			data => {
				console.log(data);
				// 判断是否显示提醒
				if (!li.siblings(':visible').length) {
					let noWorkDivCss = document.querySelector('.no-work-plane').classList;
					noWorkDivCss.add('show');
					noWorkDivCss.remove('fadeOut');
				}

				// 删除行 remove 方法因chrome 56对position sticky的支持问题无法正常使用
				li.hide(400);
			},
			err => {
				console.error(err)
			}
		)

	} else {
		let liData = li.data();

		let fail = (err, query) => {
			console.error(err, query)
		}

		let updateAppInfo = ()=> {
			// 4.去除 appInfo currentType
			let removeStatus = ()=>{
				li.remove();
			}

			if (li.hasClass('current')) {
				document.querySelector('[data-id="1"]').click();
				removeStatus()
			} else {
				removeStatus()
			}
		}

		let removeType = ()=> {
			// 3.去除 todoType id
			webSQLCommon(
				`DELETE FROM todoType WHERE id in (?)`,
				[liData.id],
				updateAppInfo,
				fail
			)
		}

		let removeEvent = ()=> {
			// 2.去除 todoEvent parent
			webSQLCommon(
				`DELETE FROM todoEvent WHERE parent IN (?)`,
				[liData.id],
				removeType,
				fail
			)
		}

		let removeCalendarType = ()=> {
			// 1.去除 calendarDays dayType
			webSQLCommon(
				`DELETE FROM calendarDays WHERE dayType in (?)`,
				[liData.id],
				removeEvent,
				fail
			)
		}

		webSQLCommon(
			`SELECT * FROM todoEvent where parent in (?)`,
			[liData.id],
			done=> {

				if (done.rows.length > 0) {
					dialog.showMessageBox({
						type: 'warning',
						title: '确认删除',
						buttons: ['确认','取消'],
						message: '删除提醒:',
						detail: `你的分类中存在 ${done.rows.length} 条记录,你确定删除非空分类吗?`,
						cancelId: 999
					}, res=> {
						if (!res) removeCalendarType();
					})
				} else {
					removeCalendarType()
				}
			},
			fail
		)
	}

}


/*

	---------------------------------------------------
	@liDataset    	{object}   	当前事件上的数据
	@toSaveParent 	{id}       	保存到的新类型
	@toSaveName 	{string}    保存到的新类型名称
	@callback     	{function}	回调函数
*/
function moveToOtherType (liDataset, toSaveParent, toSaveName, callback) {


	// 修改日历标识
	async.parallel([
		callback => {
			// 移动类型
			webSQLCommon(
				`UPDATE todoEvent SET parent = ? WHERE id= ? `,
				[toSaveParent, parseInt(liDataset.id)],
				done => {
					callback(null, done)
				}
			);
		},
		callback => {
			if (liDataset.parentId) {
				setCalendarDayEvent({
					type: 'del',
					time: liDataset.time,
					parent: parseInt(liDataset.parent)
				})
			}
			callback(null)
		},
		callback => {
			setCalendarDayEvent({
				type: 'add', 
				time: liDataset.time, 
				parent: toSaveParent
			})
			callback(null)
		}
	], (err, result) => {
		if (err) return console.log(err);

		if (callback) callback(toSaveName)

	})


}

/*
	更新事件上的日期
	------------------------------
*/
function updateEventData(parentId, eventId, key, oldTime, newTime, callback) {

	eventId = parseInt(eventId);

	async.parallel([
		callback => {
			// 更新时间
			webSQLCommon(
				`UPDATE todoEvent SET ${key} = ? WHERE id = ?`,
				[newTime, eventId],
				done => callback(null, done)
			)
		},
		callback => {
			// 删除之前日历索引
			setCalendarDayEvent({
				type: 'del', 
				time: oldTime,
				parent: parseInt(parentId)
			});
			callback(null)

		},
		callback => {
			// 添加新的日期索引
			setCalendarDayEvent({
				type: 'add', 
				time: newTime, 
				parent: parseInt(parentId)
			})
			callback(null)
		}
	], (err, result) => {
		if (err) return console.log(err);

		if (callback) callback(result);
	})
}

/*
	更新事件选择的日期修改功能
	------------------------------------------
	@timeArr 时间数组,内容格式:[year, month, day] 
	@ele 更新的 ul
*/
function updateEventSelectTime(ele, timeArr) {
	ele.find('li', '.date-select-ui').each(function(i, n) {
		let txt = this.innerText;

		if (txt != timeArr[i]) {
			this.innerText = timeArr[i]
		}
	})
}















