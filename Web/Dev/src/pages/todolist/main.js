	
import store from '../../assets/js/store'
import APIFetch from '../../assets/js/AFetch'
import VDatePicker from '../../components/VDatePicker'

export default {
	name: 'todolist',
	components: {
		VDatePicker
	},
	data () {
		return {
			// 类别个数
			typeList: [],
			// 默认选择
			holdTypeIndex: -1,
			// holdTypeIndex 相关事件是否要运行
			needChangeHoldIndexEvt: true,
			// 重命名状态
			renameStatus: false,

			/* 日历相关 */
			calendar_pickTime: {},
			calendar_events: [],

			/* 事件功能 */
			evt_HeaderTime: {},
			events: [],
			// 选择事件内容
			holdEvent: {},
			// 选择对象
			holdEventIndex: -1,
			// 当前选择事件
			currentEventIndex: -1,
			// 编辑文件索引 用于确认编辑是那条事件
			editionEvtIndex: -1,

			thisSetTimeoutFun: '',

			createNewEvent: false,
			// 事件帮助显示层
			eventsHelpBox: {
				show: false
			},

			/* pickTime layer */
			pickTimeEvents: [],
			// 默认时间，用于在对事件进行时间选择时使用
			pickTimeDefVal: '',
			pickTimeRectInfo: {
				top: 0,
				left: 0
			},
			// 展示状态
			pickTimeShow: false,
			// 点击的时间
			// pickTimeSaveTimeType: ''
			
		}
	},
	directives: {
		focus: {
			inserted: function (el, binding) {
				if (!binding.value) el.focus()
			}
		}
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
		/* 类别切换监听功能 */
		holdTypeIndex (val, old) {
			
			// 是否要运行以下事件
			if (!this.needChangeHoldIndexEvt) {
				// 恢复可以操作状态
				this.needChangeHoldIndexEvt = true
				return;
			}
			
			let thisVal = this.typeList[val];

			// 如果没有列表
			if (!this.typeList.length) return;
			// 移除之前的选中对象
			if (old >= 0)
				this.$set(this.typeList[old], 'hold', '');
			// 为当前对象添加选中效果
			if (val > -1) {
				this.$set(thisVal, 'hold', 'current');
			}

			// 如果存在 readonly 则是在新建,新建则不要查询他的数据
			if (thisVal && !thisVal.readonly) {
				// 日历标识
				this.getCalendarEvent()

				// 获取事件
				getEvents(this)
			}
		},

		/* 日历事件变化监听功能 */
		calendar_pickTime (val, old) {
			// 更新 事件列表的日期
			this.evt_HeaderTime = val;

			if (val.from !== 'auto') getEvents(this, true);

			if (val.from === 'next' || val.from === 'prev') {
				this.getCalendarEvent()
			}
		},

		/* 事件列表自动监听是否显示帮助小提示 */
		events (val, old) {
			this.$set(this.eventsHelpBox, 'show', !val.length)
		},

		// 当前选择查看事件
		holdEventIndex (val, old) {
			this.$set(this, 'holdEvent', this.events[val])
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

			// 如果没有 名称 我们删除刚才添加的
			if (!name) {
				this.typeList.pop()
				return
			}

			saveData.readonly = false;
			saveData.name = name;

			APIFetch({
				query: this.renameStatus ? updateQuery : saveQuery
			}).then(res => {
				
				this.renameStatus ? this.renameStatus = false : '';

			}, err => console.error(err))
		},

		// 切换类型数据
		findThisTypeIndex: function(index) {
			// 保存当前选中索引
			this.holdTypeIndex = index;
		},

		// 右键效果
		rightClick: function(index, evt) {

			let self = this;

			let rename = function() {

			}

			let delTypeFun = function() {
				APIFetch({
					query: `mutation {
						removeTodoListType(id: "${self.typeList[index].id}", account: "MY_ACCOUNT")
					}`
				}).then(data => {
					// 如果有删除数据
					if (JSON.parse(data.removeTodoListType).n) {
						// 删除小于选中状态自己的
						if (self.holdTypeIndex > index) {
							// 更新选中状态
							self.holdTypeIndex -= 1
							// 但不去运行查询功能
							self.needChangeHoldIndexEvt = false
						}
						// 删除自己时,则不显示选中状态了
						else if (self.holdTypeIndex === index) {
							self.holdTypeIndex = -1
						}

						// 删除数据
						self.typeList.splice(index, 1)

						store.commit('setContextmenu', { show: false })
					}
				}, err => {
					console.error(err)
				})					
			}


			store.commit('setContextmenu', {
				show: true,
				data: [
					{
						title: '重命名',
						evt: function(data) {

							self.$set(self.typeList[index], 'readonly', true)
							self.renameStatus = true
							self.holdTypeIndex = index

							self.$nextTick(function() {
								self.$el.querySelector('input').focus()
							})

							store.commit('setContextmenu', { show: false })
							
						}
					},
					{
						type: 'separator'
					},
					{
						title: '删除',
						evt: delTypeFun
					}
				],
				evt
			})

		},


		/*
			日历相关工作
		*/
		// 从子组件获取内容
		getVDatePicker (data) {
			console.warn(data)
			this.calendar_pickTime = data;
		},

		// 获取日历事件
		getCalendarEvent () {

			let typeID = this.typeList[ this.holdTypeIndex ].id;
			let _pickTime = this.calendar_pickTime;
			let _time = '';

			// 日历没有选择时间时，我们使用现在的时间
			if ('year' in _pickTime) {
				_time = _pickTime.year + '-'+ _pickTime.month
			} else {
				let d = new Date()
				_time = `${d.getFullYear()}-${d.getMonth() + 1}`
			}

			let queryWay = `{ calendarEvent(account: "MY_ACCOUNT", typeID: "${typeID}", time: "${_time}"){day}}`

			APIFetch({
				query: queryWay
			}).then(data => {

				if (data.calendarEvent.day !== '{}') {
					let eventArr = JSON.parse( data.calendarEvent.day );

					if (Object.keys(eventArr)) {
						this.calendar_events = eventArr;
					}
				} else {
					this.calendar_events = {}
				}
				
			}, err => {
				console.error(err)

			})
		},

		// 更新日历
		updateCalendarEvent (addArr, delArr) {

			let add = day => {
				if (!this.calendar_events[day]) {
					this.$set(this.calendar_events, day, 0)
				}

				let num = this.calendar_events[day] + 1;
				this.$set(this.calendar_events, day, num)
			}

			let del = day => {
				if (!this.calendar_events[day]) return;
				
				this.calendar_events[day] -= 1
			}

			addArr.forEach(val => {
				add(val)
			})

			delArr.forEach((val, i, arr) => {
				del(val)
			})
		},

		// 添加事件
		addOneEvent: function() {

			let _pickTime = this.calendar_pickTime
			let	nowTime = new Date()
			let	saveDefTime = nowTime

			// 如果没有在创建就创建
			if (this.createNewEvent) {
				return;
			};

			if (!this.typeList.length) {
				alert('请先创建一个分类')
				return
			}

			if (Object.keys(_pickTime).length > 0) {
				saveDefTime = new Date(
					_pickTime.year,
					_pickTime.month -1,
					_pickTime.date,
					nowTime.getHours(),
					nowTime.getMinutes(),
					nowTime.getSeconds(),
					nowTime.getMilliseconds()
				)
			}

			let insertData = formatEventData([{
				// 新建标志
				insert: true,
				id: nowTime.getTime(),
				title: '',
				complete: false,
				eventTypeID: this.typeList[ this.holdTypeIndex ].id,
				inner: '',
				ctime: saveDefTime,
				stime: saveDefTime,
				etime: saveDefTime
			}])[0];

			
			// 绑定当前事件索引
			this.currentEventIndex = 0
			// 选中当前
			if (this.holdEventIndex === 0)
				this.holdEventIndex = 1

			this.createNewEvent = true

			this.events.unshift( insertData )

			this.$nextTick(function() {
				this.holdEventIndex = 0
				this.$el.querySelector('#event-title').focus()
			})

		},

		// 更新完成情况
		updateCheck: function(index, evt) {

			this.editionEvtIndex = index;
			this.events[index].complete = evt.target.checked;

			this.saveInsertData()
		},

		// 如果新建的标题没有内容,我们就撤消
		blurTitle: function(evt) {
			// 如果没有写标题同时是在新建一条数据时
			if (this.createNewEvent) {
				if (!evt.target.value) {
					// 撤消新数据
					this.events.shift()
					// 恢复可新加
					this.createNewEvent = false

					// 更新显示内容
					this.$set(this, 'holdEvent', this.events[0])

				}
			} else {
				if (!evt.target.value) {
					this.holdEvent.title = evt.target.defaultValue
				}
			}
		},

		focusEvt (evt) {
			if (!this.createNewEvent) {
				evt.target.defaultValue = this.holdEvent.title
			}
		},

		// 移除输入框高度动画
		removeTextAreaAni: function(evt) {
			evt.target.parentElement.parentElement.parentElement.style.transitionDuration = '0s'
		},

		// 恢复输入框高度动画
		resetTextAreaAni: function(evt) {
			evt.target.parentElement.parentElement.parentElement.style.transitionDuration = '0.3s'
		},

		/*
			添加插入数据更新
			----------------------------------
			@type [string] 说明保存的内容
			@evt 事件
		*/
		insertData: function(type, evt) {

			let that = this;
			let _ = evt.target;
			let _innerBox = _.parentElement.parentElement.parentElement;
			let val = evt.target.value;

			// 修改数据索引
			this.editionEvtIndex = this.holdEventIndex

			this.events[this.holdEventIndex][type] = val

			this.holdEvent = this.events[this.holdEventIndex]
			
			clearTimeout(this.thisSetTimeoutFun);

			// 如果没有标题存在，我们不保存数据
			if (type === 'title') {
				if (!val) return;
			}

			this.thisSetTimeoutFun = setTimeout(()=> {
				that.saveInsertData()

				// 保存完成就更改默认值
				_.defaultValue = that.holdEvent.title
			}, 1000)
		},

		// 保存新加数据
		saveInsertData: function(callback) {

			let eventData = this.events[this.editionEvtIndex]
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

					let addTimeArr = filterTimeArr(data.addTime.time, this.calendar_pickTime)
					let delTimeArr = filterTimeArr(data.delTime.time, this.calendar_pickTime)

					// 添加日历
					this.updateCalendarEvent(addTimeArr, delTimeArr)

				} else {
					console.error( data )
				}

				if (callback) callback(data)

			}, err => {
				console.error(err)
			})
		},

		// 右键功能
		quickSetEvent (index, evt) {
			let that = this
			let thisID = that.events[index].id;


			let moveSubMenu = that.typeList.map((val, i) => {
				let isSelf = i === that.holdTypeIndex ? true : false;
				return {
					title: val.name,
					checked: isSelf,
					disabled: isSelf,
					evt: () => {

						that.editionEvtIndex = index;
						let _event = that.events[index];

						_event.eventTypeID = val.id; 

						that.saveInsertData(function(data) {
							data.save = JSON.parse(data.save)
							// 如果移动成功,更新
							if (data.save.ok && data.save.n) {
								that.events.splice(index, 1)
								
								store.commit('setContextmenu', { show: false })

							}
						})
						
					}
				}
			})

			// 生成菜单
			store.commit('setContextmenu', {
				data: [
					{
						title: '设置',
						children: moveSubMenu
					},
					{
						type: 'separator'
					},
					{
						title: '删除',
						evt: function () {
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
									that.events.splice(index, 1)

									// 更新日历
									that.updateCalendarEvent([],data.time[0].day.split(','))
								} 
							}, err => {
								console.error(err)
							})

							store.commit('setContextmenu', { show: false })

						}
					}
				],
				evt
			})


		},


		/*
			时间选择
			@type [start|end] 开始或结束时间
			@evt 事件
		*/
		changeEventDate: function(type, evt) {
			// 设置插件默认时间
			this.pickTimeDefVal = this.holdEvent[type]
			this.editionEvtIndex = this.holdEventIndex
			
			// 获取点击的位置信息
			let evtRect = evt.target.getBoundingClientRect();
			let top = evtRect.top;

			// 250 浮动日历大小
			// 20 时间显示高度
			top = top + 250 + 20 > window.innerHeight ?
				  window.innerHeight - 250 -20:
				  top + 20;

			this.pickTimeRectInfo.top = top
			this.pickTimeRectInfo.left = evtRect.left

			// 输出点击时间的类型
			this.saveTimeType = type;
			// 显示时间插件
			this.pickTimeShow = true;

		},


		// 点击非时间选择区关闭时间选择层
		hideThisLayer (e) {
			if (e.target.matches('#fixed-date-mod')) {
				this.pickTimeShow = false
			}
		},

		// 得到用户选择的时间
		// @time [objetc] 时间组件返回的日历时间对象
		getUserDatePicker (time) {
			// 点击关闭时
			if (time.from === 'submit') {
				//1. 取值
				let _i = this.holdEventIndex;
				let thisEvent = this.events[_i];
				let newTime = new Date(time.year, time.month -1, time.date);
				// 是否要移除
				let needRemove = false;
				// select time
				let _ct = this.calendar_pickTime;
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

				thisEvent.stimeF = calendar.format('YY年MM月DD日', thisEvent.stime)
				thisEvent.etimeF = calendar.format('YY年MM月DD日', thisEvent.etime)

				// 保存时间
				this.saveInsertData();

				// 3. 处理dom显示
				if (needRemove) {
					this.events.splice(_i, 1)
				}
				this.pickTimeShow = false;			
			}

			if (time.from === 'cancel') this.pickTimeShow = false;

			
		},

		seeEvent (index) {
			this.holdEventIndex = index
		}
	
	}
}



/*
	读取具体类型的事件
	----------------------------------
	@that vue this obj
	@time 是否指定查询的时间
*/
async function getEvents (that, time) {

	let result = [];
	let calendarTime = '';
	let QStime = '1989/12/6';
	let QEtime = '';

	// 获取当前选中类别
	let getFindType = that.typeList[ that.holdTypeIndex ].id;

	if (time) {
		calendarTime = that.calendar_pickTime
		QStime = new Date(`${calendarTime.year}/${calendarTime.month}/${calendarTime.date}`)
		QEtime = new Date(QStime.setDate(QStime.getDate()+1))
		// 恢复开始时间
		QStime.setDate(QStime.getDate()-1)
	} else {
		QEtime = new Date(new Date().setFullYear(new Date().getFullYear() + 100))
	}

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
		that.events = []
		that.holdEvent = { 
			title: '',
			stimeF: '',
			etimeF: ''
		}
		that.eventsHelpBox = {
			show: true,
			mes: '小技巧: 你可以点击右上角的加号,自行添加哟!'
		}
		return;
	}

	// 处理列表时间
	that.events = formatEventData(result.todolistEvetns)
	that.holdEventIndex = 0
	that.holdEvent = that.events[0]
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

/*
	过滤日历,只找到与日历相同的
	-----------------------------------
	eg:
	[
		{
			"time": "2017-9",
			"day": "30"
		}
	]
	=> ['30']
*/
function filterTimeArr (arr, pickTime) {
	let result = []
	let calendarNowTime = null
	
	if (pickTime.year) {
		calendarNowTime = `${pickTime.year}-${pickTime.month}`;
	} else {
		let d = new Date()
		calendarNowTime = `${d.getFullYear()}-${d.getMonth() +1}`
	}

	if (arr) {
		result = arr.filter(val => {
			// 如果是和日历同月的就显示事件
			if (val.time === calendarNowTime) 
			return val
		})

		result = result[0].day.split(',');
	}
	
	return result;
}