
export default {
	name: 'v-date-picker',
	props: [ 'defaultVal', 'format', 'events', 'hasFooter' ],
	data () {
		return {
			time: null,
			year: 1989,
			month: null,
			topBarStatus: '',
			// 日历
			days: [],
			// 当前选择索引
			currentIndex: -1
		}
	},
	created: function() {
		this.time = this.defaultVal ? new Date(this.defaultVal): new Date()
		this.year = this.time.getFullYear()
		this.month = this.time.getMonth() + 1
		// 更新日历
		this.updateCalendarAndEvents()
		// 发送时间
		this.sendDateToParent('auto')
	},
	watch: {
		// 跟踪时间变化切换显示与查询功能
		currentIndex: function(val, old) {
			let thisDay = this.days[val];

			if (thisDay.time) {

				if (old > -1 && this.days.length > old)
					this.days[old].isHold = false;
				
				thisDay.isHold = true;

			}
		},

		month: function (val, old) {
			console.log(val)
			this.updateCalendarAndEvents()
		},

		year: function (val, old) {
			this.updateCalendarAndEvents()
		},

		// 添加对默认时间跟踪
		defaultVal: function(val, old) {
			this.updateCalendarAndEvents()
		}
	},
	methods: {
		prevBtn: function() {
			if (this.topBarStatus === 'SELECT_YEAR') {
				console.log('选择年')
			} else {
				this.time.setMonth( this.time.getMonth() - 1 )
				this.updateTime('prev');
			}
		},

		nextBtn: function() {
			if (this.topBarStatus === 'SELECT_YEAR') {
				console.log('选择年')
			} else {
				this.time.setMonth( this.time.getMonth() + 1 )
				this.updateTime('next');
			}
		},

		chooseMonth: function() {
			console.log('this.name')
			this.topBarStatus = 'SELECT_MONTH';
		},

		chooseYear: function() {
			console.log('chooseYear');
			this.topBarStatus = 'SELECT_YEAR'
		},

		// 选择日期事件
		selectDayEvt: function(index) {
			// 没有时间的区域不能选择
			if (this.days[index].time) {
				this.currentIndex = index;
				this.sendDateToParent('select')
			}
		},

		// 发送数据
		sendDateToParent (format) {
console.log(11)
			// if (this.currentIndex === -1) return

			// let index = this.currentIndex
			// let date = this.days[index].time
			// let d = new Date(this.year, this.month-1, date);
			// let day = d.getDay()
			// let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']

			// if (index > -1) {
			// 	this.$emit('send-date', {
			// 		year: this.year,
			// 		month: this.month,
			// 		date: date,
			// 		day: day,
			// 		dayFormat: week[day],
			// 		format
			// 	})
			// } else {
			// 	this.$emit('send-date', {
			// 		mes: format === 'cancel' ? '关闭' : '请选择一个日期',
			// 		success: false,
			// 		format
			// 	})
			// }
		},

		//
		updateTime: function(btnType) {
			this.year = this.time.getFullYear();
			this.month = this.time.getMonth() + 1;
			this.sendDateToParent(btnType)
		},


		// 更新日历与事件
		updateCalendarAndEvents () {
			// 获取简单的日历
			let calendarDays = calendar.str(this.year, this.month)
			let maxDayInThisMonth = new Date(this.year, this.month, 0).getDate()
			let nowTime = new Date
			// 今天
			let todayVal = -1
			let isHold = 0
			let isToday = 0

			if (
				nowTime.getFullYear() === this.year &&
				nowTime.getMonth() === this.month -1
			) {
				todayVal = this.time.getDate()
			}

			// 事件与标识
			this.days = calendarDays.map(val => {
				isToday = val === todayVal
				isHold = todayVal > -1 ? 
						 val === todayVal : 
						 val === 1
				return {
					time: val,
					classes: {
						isHold: 1,
						isToday
					}
				}
			})

		} 
	}
}