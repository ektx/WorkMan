/*
	事件列表
	------------------------------
*/
let todolistType = new Vue({
	el: '#todo-type-list',
	data: {
		// 类别个数
		typeList: [],
		// 默认选择
		holdTypeIndex: -1,
		// 重命名状态
		renameStatus: false,

	},
	beforeCreate: function() {
		// 设置提醒列表
		(async () => {
			let data = {
				query: `{ workTypes(account: "MY_ACCOUNT") { id,name }}`
			};

			let result = await APIFetch(data);
			this.typeList = result.workTypes;

			// 选择第一条
			this.holdTypeIndex = 0;

		})()
	},
	watch: {
		holdTypeIndex: function(val, oldVal) {

			let thisVal = this.typeList[val];

			// 如果没有列表
			if (!this.typeList.length) return;
			// 移除之前的选中对象
			if (oldVal >= 0)
				this.$set(this.typeList[oldVal], 'hold', '');
			// 为当前对象添加选中效果
			if (val > -1)
				this.$set(thisVal, 'hold', 'current');

			// 如果存在 readonly 则是在新建,新建则不要查询他的数据
			if (!thisVal.readonly) {
				// 日历标识
				eventsCalendarMod.getCalendarEvent()

				// 获取事件
				getEvents()
			}
		}
	},
	methods: {
		// 添加一个新的分类
		addNewType: function() {
			// 添加一个新内容
			this.typeList.push({
				name: '',
				id: +new Date(),
				hold: 'current',
				readonly: true
			})

			// 切换选中对象
			this.holdTypeIndex = this.typeList.length -1;
			
			// focus 输入框
			this.$nextTick(function() {
				this.$el.querySelector('.current input').focus()
			})

		},

		// 按 enter 确认时
		willSaveTodoType: function(evt) {
			this.typeList[this.holdTypeIndex].readonly = false;
		},

		// 保存分类
		saveTodoType: function(evt) {
			let name = evt.target.value;
			let saveData = this.typeList[this.holdTypeIndex];
			let saveQuery = `mutation { addTodoListType(data: { id: "${saveData.id}", name: "${name}" })}`;
			let updateQuery = `mutation { updateTodoListType(id: "${saveData.id}", name: "${name}")}`;

			saveData.readonly = false;
			saveData.name = name;

			APIFetch({
				query: this.renameStatus ? updateQuery : saveQuery
			}).then(res => {
				console.log(res)
				
				this.renameStatus ? this.renameStatus = false : '';

			}, err => console.error(err))
		},

		// 切换类型数据
		findThisTypeIndex: function(evt) {
			let index = Number(evt.target.dataset.index);
			// 保存当前选中索引
			this.holdTypeIndex = index;
		},

		// 右键效果
		rightClick: function(evt) {

			let index = Number(evt.target.dataset.index)

			let menuArr = [
				{
					label: '重命名',
					click(menuItem, browserWindow, e) {

						Vue.set(todolistType.typeList[index], 'readonly', true);

						// 设置为 重命名
						todolistType.renameStatus = true;
						todolistType.holdTypeIndex = index;

						// // focus 输入框
						Vue.nextTick(function() {
							todolistType.$el.querySelector('input').focus()
						})
					}
				},
				{
					type: 'separator'
				},
				{
					// 删除类型
					label: '删除',
					click() {
						
						APIFetch({
							query: `mutation {
								removeTodoListType(id: "${todolistType.typeList[index].id}", account: "MY_ACCOUNT")
							}`
						}).then(data => {
							// 如果有删除数据
							if (JSON.parse(data.removeTodoListType).n) {
								// 如果删除的是选中效果,移除
								if (todolistType.holdTypeIndex === index) {
									todolistType.holdTypeIndex = -1
								}

								// 删除数据
								todolistType.typeList.splice(index, 1)
							}
						}, err => {
							console.error(err)
						})
					}
				}
			];

			createMouseRightClickMenu( menuArr );
		}
	}
})


/*
	日历
	---------------------------------
*/
let eventsCalendarMod = new Vue({
	el: '#events-calendar-mod',
	data: {
		pickTime: {},
		events: [],
	},
	watch: {
		pickTime: function(val, old) {
			// 更新 事件列表的日期
			todoEventsListApp.headerTime = val;

			if (val.from !== 'auto') getEvents();

			if (val.from === 'next' || val.from === 'prev') {
				this.getCalendarEvent()
			}
		}
	},
	methods: {
		// 从子组件获取内容
		getVDatePicker: function(data) {
			this.pickTime = data;
		},

		// 获取日历事件
		getCalendarEvent: function() {
			console.log('get calendar events')
			console.log(this.pickTime)
			let typeID = todolistType.typeList[todolistType.holdTypeIndex].id;
			let _time = this.pickTime.year + '-'+ this.pickTime.month;
			let queryWay = `{ calendarEvent(account: "MY_ACCOUNT", typeID: "${typeID}", time: "${_time}"){day}}`;

			APIFetch({
				query: queryWay
			}).then(data => {
				console.warn(data)

				if (data.calendarEvent.day !== '{}') {
					let eventArr = JSON.parse( data.calendarEvent.day );

					if (Object.keys(eventArr)) {
						this.events = eventArr;
					}
				} else {
					this.events = {}
				}
				
			}, err => {
				console.error(err)
			})
		},

		// 更新日历
		updateCalendarEvent: function(addArr, delArr) {

			let add = day => {
				if (!this.events[day]) {
					this.$set(this.events, day, 0)
				}

				let num = this.events[day] + 1;
				this.$set(this.events, day, num)
			}

			let del = day => {
				if (!this.events[day]) return;
				
				this.events[day] -= 1
			}

			addArr.forEach(val => {
				add(val)
			})

			delArr.forEach((val, i, arr) => {
				del(val)
			})
		},
	}
})



/*
	创建事件清单
	-------------------------------
*/
let todoEventsListApp = new Vue({
	el: '#todoList-main-app',
	data: {
		events: [],
		headerTime: {},
		// 当前事件
		currentEventIndex: -1,

		thisSetTimeoutFun: '',

		createNewEvent: false

	},
	created: function() {
		this.headerTime = eventsCalendarMod.pickTime;
	},
	methods: {
		showEventsInfo: function(evt) {
			
			let _ = evt.target;
			let index = _.dataset.parentindex;
			let parentEl = document.querySelector(`[data-id="${_.dataset.parentid}"]`);
			let innerEl  = parentEl.querySelector('.inner')
			let innerH = innerEl.scrollHeight;

			if (this.events[index].showInfo) {
				_.classList.remove('show');
				innerEl.style.height = 0;
				this.events[index].showInfo = false;
			}
			else {
				_.classList.add('show');
				innerEl.style.height = innerH+'px';

				this.events[index].showInfo = true
			}

		},

		// 添加事件
		addOneEvent: function() {
			console.log('add one event', eventsCalendarMod.pickTime)

			// 如果没有在创建就创建
			if (this.createNewEvent) {
				return;
			};

			let nowTime = new Date();
			let saveDefTime = new Date(
				eventsCalendarMod.pickTime.year,
				eventsCalendarMod.pickTime.month -1,
				eventsCalendarMod.pickTime.date,
				nowTime.getHours(),
				nowTime.getMinutes(),
				nowTime.getSeconds(),
				nowTime.getMilliseconds()
			);
			let insertData = formatEventData([{
				insert: true,
				id: nowTime.getTime(),
				title: '',
				complete: false,
				eventTypeID: todolistType.typeList[todolistType.holdTypeIndex].id,
				inner: '',
				ctime: saveDefTime,
				stime: saveDefTime,
				etime: saveDefTime
			}])[0];

			
			// 绑定当前事件索引
			this.currentEventIndex = this.events.length

			this.createNewEvent = true;

			this.events.push( insertData );

			this.$nextTick(function() {
				this.$el.querySelector('li:last-child').querySelector('input.title').focus()
			})
		},


		// 时时跟踪当前事件索引
		mouseOver: function(evt) {
			this.currentEventIndex = evt.target.dataset.index;
		},

		// 更新完成情况
		updateCheck: function(evt) {
			this.events[this.currentEventIndex].complete =evt.target.checked;

			this.saveInsertData()
		},

		// 如果新建的标题没有内容,我们就撤消
		blurTitle: function(evt) {

			if (!evt.target.value && this.createNewEvent) {
			console.log(evt.target.value);
				// 撤消新数据
				this.events.pop();
				// 恢复可新加
				this.createNewEvent = false;
			}
		},

		// 添加插入数据更新
		insertData: function(type, evt) {
			let _ = evt.target;
			let val = evt.target.value;

			this.events[this.currentEventIndex][type] = val;

			clearTimeout(this.thisSetTimeoutFun);

			this.thisSetTimeoutFun = setTimeout(this.saveInsertData, 1000)
		},

		// 保存新加数据
		saveInsertData: function(callback) {

			let eventData = this.events[this.currentEventIndex];

			let setQueryData = (arr) => {

				let queryData = [];
				for (let key in eventData) {
					if (eventData.hasOwnProperty(key)) {
						// 过滤 insert
						if ( arr.includes(key) ) {

							let _inner = '';

							switch (key) {
								case 'complete':
									_inner = eventData[key];
									break;

								case 'inner':
									_inner = eventData[key].replace(/\n|\r/ig,'\\n');
									_inner = `"${_inner}"`

									break;

								default:
									_inner = `"${eventData[key]}"`;
							}
							queryData.push( `${key}:${_inner}` )

						}
					}
				}

				return queryData.join(',');
			}

			if (!eventData.title.trim()) return;

			let updateQ = setQueryData(['eventTypeID', 'title', 'complete', 'inner', 'stime', 'etime'])

			let query = `mutation { 
				saveTodoListEvent(
					id: "${eventData.id}", 
					account: "MY_ACCOUNT", 
					data: { ${updateQ} }
				) { id, addTime { time {time,day} }, delTime { time{time,day} }, save }
			}`

			APIFetch({ query }).then( data => {
				
				data = data.saveTodoListEvent;
				let saveInfo = JSON.parse(data.save)

				if (saveInfo.ok && saveInfo.n) {

					// 新建情况
					if (saveInfo.upserted) {
						// 删除新建标识
						delete eventData.insert;

						// 更新 id
						eventData.id = data.id
					}

					// 恢复可以新加功能
					this.createNewEvent = false;

					let addTimeArr = filterTimeArr(data.addTime.time);
					let delTimeArr = filterTimeArr(data.delTime.time);

					// 添加日历
					eventsCalendarMod.updateCalendarEvent(addTimeArr,delTimeArr)

				} else {
					console.error( data )
				}

				if (callback) callback(data)

			}, err => {
				console.error(err)
			})
		},

		// 右键功能
		quickSetEvent: function() {

			let index = this.currentEventIndex;
			let thisID = this.events[this.currentEventIndex].id;

			let moveSubMenu = todolistType.typeList.map((val, i) => {
				let isSelf = i === todolistType.holdTypeIndex ? true : false;
				return {
					label: val.name,
					type: 'checkbox',
					checked: isSelf,
					enabled: !isSelf,
					click() {

						let _index = todoEventsListApp.currentEventIndex;
						let _event = todoEventsListApp.events[_index];

						_event.eventTypeID = val.id; 

						todoEventsListApp.saveInsertData(function(data) {
							// 如果移动成功,更新
							if (data.ok && data.n) {
								todoEventsListApp.events.splice(_index, 1)
							}
						})
						
					}
				}
			})

			let menuArr = [
				{
					label: '设置',
					submenu: moveSubMenu
				},
				{
					type: 'separator'
				},
				{
					// 删除类型
					label: '删除',
					click() {
						
						APIFetch({
							query: `mutation {
								removeTodoListEvent(id: "${thisID}", account: "MY_ACCOUNT") {save, time {day, time}}
							}`
						}).then(data => {
							data = data.removeTodoListEvent;
							let saveInfo = JSON.parse(data.save)[0]

							// 如果有删除数据
							if (saveInfo.n && saveInfo.ok) {
								// 删除数据
								todoEventsListApp.events.splice(index, 1)

								// 更新日历
								eventsCalendarMod.updateCalendarEvent([],data.time[0].day.split(','))
							} 
						}, err => {
							console.error(err)
						})
					}
				}
			];

			// 生成菜单
			createMouseRightClickMenu( menuArr );
		},


		// 时间选择
		// @type [start|end] 开始或结束时间
		changeEventDate: function(type, evt) {
			// 设置插件默认时间
			eventChangeDateMod.defVal = this.events[this.currentEventIndex][type];
			// 获取点击的位置信息
			eventChangeDateMod.rectInfo = evt.target.getBoundingClientRect();
			// 输出点击时间的类型
			eventChangeDateMod.saveTimeType = type;
			// 显示时间插件
			eventChangeDateMod.show = true;

		}
	}
});


/*
	事件时间选择功能
	--------------------------------------
*/
let eventChangeDateMod = new Vue({
	el: '#fixed-date-mod',
	data: {
		events: [],
		defVal: '2017-12-6',
		rectInfo: {
			top: 0,
			left: 0
		},
		show: false,
		// 点击的时间
		saveTimeType: ''
	},
	methods: {
		// 点击非时间选择区关闭时间选择层
		hideThisLayer: function(e) {
			if (e.target.matches('#fixed-date-mod')) {
				this.show = false
			}
		},

		// 得到用户选择的时间
		getUserDatePicker: function(time) {
			console.log(time, this.saveTimeType)
			// 点击关闭时
			if (time.from === 'submit') {
				//1. 取值
				let _i = todoEventsListApp.currentEventIndex;
				let thisEvent = todoEventsListApp.events[_i];
				let newTime = new Date(time.year, time.month -1, time.date);
				// 是否要移除
				let needRemove = false;
				// select time
				let _ct = eventsCalendarMod.pickTime;
				let selectTime = new Date(_ct.year, _ct.month-1, _ct.date)

				//2. 处理逻辑
				// 开始时间大于以前的结束时间
				if (this.saveTimeType === 'stime') {
					if (newTime > thisEvent.etime) {
						// 之前的结束时间成了开始时间
						thisEvent.stime = thisEvent.etime;
						thisEvent.etime = newTime;
					} else {
						thisEvent.stime = newTime
					}

					// 现在结束时间是否大于当前选择的时间
					if (thisEvent.stime > selectTime) {
						needRemove = true
					}
				} 
				else {
					// 结束时间小于之前的开始时间
					if (newTime < thisEvent.stime) {
						// 之前的开始时间成了现在的结束时间
						thisEvent.etime = thisEvent.stime;
						thisEvent.stime = newTime;

					} else {
						thisEvent.etime = newTime
					}

					// 现在结束时间是否小于当前选择的时间
					if (thisEvent.etime < selectTime) {
						needRemove = true
					}
				}

				thisEvent.stimeF = calendar.format('YY年MM月DD日 hh:mm:ss', thisEvent.stime)
				thisEvent.etimeF = calendar.format('YY年MM月DD日 hh:mm:ss', thisEvent.etime)

				// 保存时间
				todoEventsListApp.saveInsertData();

				// 3. 处理dom显示
				if (needRemove) {
					todoEventsListApp.events.splice(_i, 1)
				}
				this.show = false;			
			}

			if (time.from === 'cancel') this.show = false;

			
		}
	}
})


/*
	读取具体类型的事件
	----------------------------------
*/
async function getEvents () {
	let result = [];
	// 获取当前选中类别
	let getFindType = todolistType.typeList[todolistType.holdTypeIndex].id;
	let calendarTime = eventsCalendarMod.pickTime;
	let QStime = `${calendarTime.year} ${calendarTime.month} ${calendarTime.date  + 1}`;
	let QEtime = `${calendarTime.year} ${calendarTime.month} ${calendarTime.date}`;
	let data = {
		query: `{ 
			todolistEvetns(
				account: "MY_ACCOUNT", 
				types: "${getFindType}",
				stime: "${QStime}",
				etime: "${QEtime}"
			){id, eventTypeID, title, complete, ctime, mtime, ttime, stime, etime, inner}}`
	}

	// 得到结果
	result = await APIFetch(data);

	if (!result.todolistEvetns.length) {
		console.error('Error! 没有发现数据!!');
		todoEventsListApp.events = []
		return;
	}

	// 处理列表时间
	todoEventsListApp.events = formatEventData(result.todolistEvetns)

}


/*
	对日期的数据进行格式化
	---------------------------------
	@obj [array] 要处理的数据
*/
function formatEventData(obj) {
	// 格式化数据
	let resetTime = (str) => {
		let _result = [];

		if (str) {
			_result = calendar.format('YY年MM月DD日', str)
		}

		return _result;
	}

	return obj.map((val, i, arr) => {
		let inEventsData = arr[i];

		// 添加用户方便阅读的时间
		inEventsData.stimeF = resetTime(val.stime);
		inEventsData.etimeF = resetTime(val.etime);
		// 将字符串变成时间
		val.stime = new Date(val.stime);
		val.etime = new Date(val.etime);

		return arr[i];
	})
}



function getParents(el, parentSelector) {
	if (parentSelector === undefined) {
    	parentSelector = document;
    }

    var parents = [];
    var p = el.parentNode;
    
    while (p !== parentSelector) {
        var o = p;
        parents.push(o);
        p = o.parentNode;
    }
    parents.push(parentSelector); // Push that parentSelector you wanted to stop at
    
    return parents;
}