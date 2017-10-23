	
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
			// 当前事件
			currentEventIndex: -1,
			// 编辑文件索引 用于确认编辑是那条事件
			editionEvtIndex: -1,

			thisSetTimeoutFun: '',

			createNewEvent: false,
			// 事件帮助显示层
			eventsHelpBox: {
				show: false
			}
			
		}
	},
	directives: {
		focus: {
			inserted: function (el, binding) {
				if (!binding.value)
					el.focus()
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

			console.log(result)

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

			if (val.from !== 'auto') getEvents(this);

			if (val.from === 'next' || val.from === 'prev') {
				this.getCalendarEvent()
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
							console.log('重命名', index)

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

			console.warn('Your click Right!')
		},


		/*
			日历相关工作
		*/
		// 从子组件获取内容
		getVDatePicker (data) {
			this.calendar_pickTime = data;
		},

		// 获取日历事件
		getCalendarEvent () {
			console.log('get calendar events')
			let typeID = this.typeList[ this.holdTypeIndex ].id;
			let _pickTime = this.calendar_pickTime
			let _time = _pickTime.year + '-'+ _pickTime.month
			let queryWay = `{ calendarEvent(account: "MY_ACCOUNT", typeID: "${typeID}", time: "${_time}"){day}}`

			APIFetch({
				query: queryWay
			}).then(data => {
				console.warn(data)

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


		/* 事件功能区 */

		showEventsInfo: function(evt) {
			
			let _ = evt.target;
			let index = _.dataset.parentindex;
			let parentEl = document.querySelector(`[data-id="${_.dataset.parentid}"]`);
			let innerEl  = parentEl.querySelector('.inner')
			let textareaEl = innerEl.querySelector('.inner-box')
			let textareaH = textareaEl.scrollHeight;

			if (this.events[index].showInfo) {
				_.classList.remove('show');
				innerEl.style.height = 0;
				this.events[index].showInfo = false;
			}
			else {
				_.classList.add('show');

				textareaEl.style.height = textareaH + 'px';

				let innerH = innerEl.scrollHeight;

				innerEl.style.height = innerH+'px';

				this.events[index].showInfo = true
			}

		},

		// 添加事件
		addOneEvent: function() {

			let _pickTime = this.calendar_pickTime

			// 如果没有在创建就创建
			if (this.createNewEvent) {
				return;
			};

			let nowTime = new Date()
			let saveDefTime = new Date(
				_pickTime.year,
				_pickTime.month -1,
				_pickTime.date,
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
				eventTypeID: this.typeList[ this.holdTypeIndex ].id,
				inner: '',
				ctime: saveDefTime,
				stime: saveDefTime,
				etime: saveDefTime
			}])[0];

			
			// 绑定当前事件索引
			this.currentEventIndex = this.events.length

			this.createNewEvent = true;

			this.events.push( insertData )

		},


		// 时时跟踪当前事件索引
		mouseOver: function(evt) {
			this.currentEventIndex = evt.target.dataset.index;
		},

		// 更新完成情况
		updateCheck: function(index, evt) {

			this.editionEvtIndex = index;
			this.events[index].complete = evt.target.checked;

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

		// 移除输入框高度动画
		removeTextAreaAni: function(evt) {
			evt.target.parentElement.parentElement.parentElement.style.transitionDuration = '0s'
		},

		// 恢复输入框高度动画
		resetTextAreaAni: function(evt) {
			evt.target.parentElement.parentElement.parentElement.style.transitionDuration = '0.3s'
		},

		// 添加插入数据更新
		/*
			@type [string] 说明保存的内容
			@index [number] 当前数据索引
			@evt 事件
		*/
		insertData: function(type, index, evt) {
			let _ = evt.target;
			let _innerBox = _.parentElement.parentElement.parentElement;
			let val = evt.target.value;

			if (type === 'inner') {
				_innerBox.style.height = 0;
				_.style.height = 0;

				_.style.height = _.scrollHeight + 'px';
				_innerBox.style.height = _innerBox.scrollHeight + 'px'
			}

			this.events[index][type] = val;

			this.editionEvtIndex = index;

			clearTimeout(this.thisSetTimeoutFun);

			this.thisSetTimeoutFun = setTimeout(this.saveInsertData, 1000)
		},

		// 保存新加数据
		saveInsertData: function(callback) {

			let eventData = this.events[this.editionEvtIndex];

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
		quickSetEvent (evt) {

			let that = this
			let index = that.currentEventIndex;
			let thisID = that.events[that.currentEventIndex].id;

			let moveSubMenu = that.typeList.map((val, i) => {
				let isSelf = i === that.holdTypeIndex ? true : false;
				return {
					title: val.name,
					checked: isSelf,
					disabled: isSelf,
					evt: () => {

						let _index = that.currentEventIndex;
						let _event = that.events[_index];

						_event.eventTypeID = val.id; 

						that.saveInsertData(function(data) {
							// 如果移动成功,更新
							if (data.ok && data.n) {
								that.events.splice(_index, 1)
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
			@index [number] 当前数据索引
			@evt 事件
		*/
		changeEventDate: function(type, index, evt) {
			// 设置插件默认时间
			eventChangeDateMod.defVal = this.events[index][type];

			this.editionEvtIndex = index;
			
			// 获取点击的位置信息
			let evtRect = evt.target.getBoundingClientRect();
			let top = evtRect.top;

			top = top + 250 > window.innerHeight ?
				  window.innerHeight - 250 :
				  top;

			eventChangeDateMod.rectInfo.top = top

			// 输出点击时间的类型
			eventChangeDateMod.saveTimeType = type;
			// 显示时间插件
			eventChangeDateMod.show = true;

		}
	
	}
}



/*
	读取具体类型的事件
	----------------------------------
*/
async function getEvents (that) {

	let result = [];
	// 获取当前选中类别
	let getFindType = that.typeList[ that.holdTypeIndex ].id;
	let calendarTime = that.calendar_pickTime;
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
		that.events = []
		that.eventsHelpBox = {
			show: true,
			mes: '小技巧: 你可以点击右上角的加号,自行添加哟!'
		}
		return;
	}

	// 处理列表时间
	that.events = formatEventData(result.todolistEvetns)

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
	let result = [];
	let calendarNowTime = `${pickTime.year}-${pickTime.month}`;

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