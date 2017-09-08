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
				// 
				console.log('get calendar events')

				getEvents()

				console.log(`get this type event list`, thisVal)
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
		pickTime: {}
	},
	watch: {
		pickTime: function(val, old) {
			// 更新 事件列表的日期
			todoEventsListApp.headerTime = val;

			if (val.from !== 'auto') {
				getEvents();

			}
		}
	},
	methods: {
		getVDatePicker: function(data) {
			this.pickTime = data;
			console.log(data)

		}
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
		saveInsertData: function() {
			// console.log('Save Event', JSON.stringify( ))
			let eventData = this.events[this.currentEventIndex];
			let query;

			let setQueryData = (arr) => {

				let queryData = '';
				for (let key in eventData) {
					if (eventData.hasOwnProperty(key)) {
						// 过滤 insert
						if ( arr.includes(key) ) {

							if (key !== 'complete') {
								queryData += `${key}: "${eventData[key]}",`
							} else {
								queryData += `${key}: ${eventData[key]},`
							}

						}
					}
				}

				return queryData;
			}

			if (!eventData.title.trim()) return;

			if (eventData.insert) {
				let insertQ = setQueryData(['id', 'account', 'eventTypeID', 'title', 'complete', 'inner', 'ctime', 'stime', 'etime']);
				query = `mutation { addTodoListEvent(data: { ${insertQ} }) }`;

			} else {
				let updateQ = setQueryData(['eventTypeID', 'title', 'complete', 'inner', 'stime', 'etime'])
				query = `mutation { updateTodoListEvent(
					id: "${eventData.id}",
					account: "MY_ACCOUNT",
					data: { ${updateQ} }
				) }`
			}

			APIFetch( { query }).then( data => {

				// save
				if (eventData.insert) {
					data = JSON.parse(data.addTodoListEvent);
				} 
				// update
				else {
					data = JSON.parse(data.updateTodoListEvent);
				}

				if (data.success) {

					if (eventData.insert) {
						// 恢复可以新加功能
						this.createNewEvent = false;
						// 删除新建标识
						delete eventData.insert;
					}

				} else {
					console.error( data )
				}

			}, err => {
				console.error(err)
			})
		}
	}
})


/*
	读取具体类型的事件
	----------------------------------
*/
async function getEvents () {
	console.warn('读取事件...')
	let result = [];
	// 获取当前选中类别
	let getFindType = todolistType.typeList[todolistType.holdTypeIndex].id;
	let calendarTime = eventsCalendarMod.pickTime;
	let QStime = `${calendarTime.year} ${calendarTime.month} ${calendarTime.date + 1}`;
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
			_result = calendar.format('YY年MM月DD日 hh:mm:ss', str)
		}

		return _result;
	}

	return obj.map((val, i, arr) => {
		let inEventsData = arr[i];

		// 添加用户方便阅读的时间
		inEventsData.stimeF = resetTime(val.stime);
		inEventsData.etimeF = resetTime(val.etime);

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