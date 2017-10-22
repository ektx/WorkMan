	
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
			calendar_events: []
			
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
			// todoEventsListApp.headerTime = val;

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

