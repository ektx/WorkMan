/*
	VDatePicker
	---------------------------------
	Vue Date Picker(vue 日期选择组件)

	@version: 0.0.1
	@author: ektx <530675800@qq.com>

	使用:
	1. 引用 css

	2. 页面调用
	<v-date-picker 
		default-val="2017-9-5 12:08:26"
		format="YYYY年MM月"
		has-footer="hasfooter"
		v-on:send-date="getWMDatePicker"
	></v-date-picker>

	@default-val 默认时间
	@format 显示格式
	@has-footer 是否要显示底部按钮,以上示例为要,不添加值为不要
	@v-on:send-date 回调函数,返回日期对象
*/

let VDatePickerTem = `
	<div class="vdate-picker-box">
		<header class="vdate-picker-control">
			<button 
				@click="prevBtn"
				class="tbtn"><</button>
			<p>
			<button
				class="tbtn back-btn"
			></button>
				<span 
					@click="chooseYear"
					class="vadate-picker-topbar-time"
				>{{year}}年</span>
				<span 
					@click="chooseMonth"
					class="vadate-picker-topbar-time"
				>{{month}}月</span>
			</p>
			<button 
				@click="nextBtn"
				class="tbtn"
			>></button>
		</header>
		<div class="vdate-picker-body">
			<ul>
				<li>日</li>
				<li>一</li>
				<li>二</li>
				<li>三</li>
				<li>四</li>
				<li>五</li>
				<li>六</li>
			</ul>
			<ul class="vdate-picker-days">
				<li 
					v-for="(day, index) in days"
					:class="{
						today: day.isToday,
						event: day.hasEvent, 
						current: day.isHold
					}"
					@click="selectDayEvt(index)"
				>
					<span>{{day.time}}</span>
				</li>
			</ul>
		</div>
		<footer v-show="hasFooter" class="vdate-picker-btns">
			<button @click="sendDateToParent('cancel')">关闭</button>
			<button @click="sendDateToParent('submit')">确认</button>
		</footer>
	</div>
`;

Vue.component('v-date-picker', {
	props: [ 'defaultVal', 'format', 'hasFooter' ],
	template: VDatePickerTem,
	data: function () {
		return {
			time: '',
			year: '',
			month: '',
			topBarStatus: '',
			// 日历
			days: [],
			// 当前选择索引
			currentIndex: -1
		}
	},
	created: function() {
		this.time = new Date(this.defaultVal);
		this.year = this.time.getFullYear();
		this.month = this.time.getMonth() + 1;
		// 更新日历
		this.updateCalendarAndEvents();
		// 发送时间
		this.sendDateToParent('auto')

	},
	watch: {
		// 跟踪时间变化切换显示与查询功能
		currentIndex: function(val, old) {
			let thisDay = this.days[val];

			if (thisDay.time) {

				if (old > -1)
					this.days[old].isHold = false;
				
				thisDay.isHold = true;

			}
		},

		month: function (val, old) {
			this.updateCalendarAndEvents()
		},

		year: function (val, old) {
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
			this.currentIndex = index;
			this.sendDateToParent('select')
		},

		// 发送数据
		sendDateToParent: function(from) {
			let index = this.currentIndex;
			let date = this.days[index].time;
			let d = new Date(this.year, this.month-1, date);
			let day = d.getDay();
			let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];

			if (index > -1) {
				this.$emit('send-date', {
					year: this.year,
					month: this.month,
					date: date,
					day: day,
					dayFormat: week[day],
					from
				})
			} else {
				this.$emit('send-date', {
					mes: from === 'cancel' ? '关闭' : '请选择一个日期',
					success: false,
					from
				})
			}
		},

		//
		updateTime: function(btnType) {
			this.year = this.time.getFullYear();
			this.month = this.time.getMonth() + 1;
			this.sendDateToParent(btnType)
		},


		// 更新日历与事件
		updateCalendarAndEvents: function () {
			
			// 获取简单的日历
			let calendarDays = calendar.str(this.year, this.month);
			// 今天
			let todayVal = new Date().getDate();

			// 事件与标识
			this.days = calendarDays.map((val, i) => {
				
				let isTodayMes = false;

				if (val === todayVal) {
					this.currentIndex = i;
					isTodayMes = true;
				}
				
				return {
					time: val,
					// 是否是今天
					isToday: isTodayMes,
					// 是否有事件
					hasEvent: false,
					// 是否选中
					isHold: isTodayMes
				}
			});

		} 
	}
});
