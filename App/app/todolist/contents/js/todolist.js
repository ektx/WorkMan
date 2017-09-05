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
		renameStatus: false
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
	创建事件清单
	-------------------------------
*/
let todoEventsListApp = new Vue({
	el: '#todo-eventsList-app',
	data: {
		events: []
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

		}
	}
})


let eventsCalendarMod = new Vue({
	el: '#events-calendar-mod',
	data: {
		pickTime: {
			month: 7,
			year: 2017
		}
	},
	methods: {
		getWMDatePicker: function(data) {
			console.log(data)
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
	let data = {
		query: `{ todolistEvetns(account: "MY_ACCOUNT", types: "${getFindType}"){id, eventTypeID, title, complete, ctime, mtime, ttime, stime, etime, inner}}`
	}

	// 格式化数据
	let resetTime = (str) => {
		let _result = [];

		if (str) {
			_result = calendar.format('YY年MM月DD日 h:m:s', str)
		}

		return _result;
	}

	// 得到结果
	result = await APIFetch(data);

	// 处理列表时间
	todoEventsListApp.events = result.todolistEvetns.map((val, i) => {
		let inEventsData = result.todolistEvetns[i];

		inEventsData.stimeF = resetTime(val.stime);
		inEventsData.etimeF = resetTime(val.etime);

		return result.todolistEvetns[i];
	})

}

