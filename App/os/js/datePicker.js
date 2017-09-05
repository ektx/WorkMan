let WMDatePickerTem = `
	<div class="calendar-box">
		<header class="calendar-control">
			<button 
				@click="prevBtn"
				class="tbtn"><</button>
			<p>
				<span 
					@click="chooseYear"
					class="calendar-topbar-time"
				>{{topBarYear}}年</span>
				<span 
					@click="chooseMonth"
					class="calendar-topbar-time"
				>{{topBarMonth}}月</span>
			</p>
			<button 
				@click="nextBtn"
				class="tbtn"
			>></button>
		</header>
		<div class="calendar-body">
			<ul>
				<li>日</li>
				<li>一</li>
				<li>二</li>
				<li>三</li>
				<li>四</li>
				<li>五</li>
				<li>六</li>
			</ul>
			<ul class="calendar-days">
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
		<footer class="calendar-btns">
			<button>关闭</button>
			<button @click="sendDateToParent('submit')">确认</button>
		</footer>
	</div>
`;

Vue.component('wm-date-picker', {
	props: [ 'defaultVal', 'format' ],
	template: WMDatePickerTem,
	data: function () {
		return {
			topBarTime: '',
			topBarYear: '',
			topBarMonth: '',
			topBarStatus: '',
			// 日历
			days: [],
			// 当前选择索引
			currentIndex: -1
		}
	},
	created: function() {
		this.topBarTime = new Date(this.defaultVal);
		this.topBarYear = this.topBarTime.getFullYear();
		this.topBarMonth = this.topBarTime.getMonth() + 1;

		// 获取简单的日历
		let calendarDays = calendar.str(this.topBarYear, this.topBarMonth);
		// 今天
		let todayVal = new Date().getDate()

		// 事件与标识
		this.days = calendarDays.map(function(val, i) {
			return {
				time: val,
				// 是否是今天
				isToday: val == todayVal ? true : false,
				// 是否有事件
				hasEvent: false,
				// 是否选中
				isHold: false
			}
		})
	},
	watch: {
		// 跟踪时间变化切换显示与查询功能
		currentIndex: function(val, old) {
			let thisDay = this.days[val];

			if (thisDay.time) {

				if (old > -1)
					this.days[old].isHold = false;
				
				thisDay.isHold = true;

				this.sendDateToParent('li')
			}
		}
	},
	methods: {
		prevBtn: function() {
			console.log('prev')

			if (this.topBarStatus === 'SELECT_YEAR') {
				console.log('选择年')
			} else {
				console.log('选择月')
				this.topBarTime.setMonth( this.topBarTime.getMonth() - 1 )
				this.updateTime();
			}
		},

		nextBtn: function() {
			console.log('next');

			if (this.topBarStatus === 'SELECT_YEAR') {
				console.log('选择年')
			} else {
				console.log('选择月')
				this.topBarTime.setMonth( this.topBarTime.getMonth() + 1 )
				this.updateTime();
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
			this.currentIndex = index
		},

		// 发送数据
		sendDateToParent: function(from) {
			this.$emit('send-date', {
				year: this.topBarYear,
				month: this.topBarMonth,
				day: this.days[this.currentIndex].time,
				from
			})
		},

		//
		updateTime: function() {
			this.topBarYear = this.topBarTime.getFullYear();
			this.topBarMonth = this.topBarTime.getMonth() + 1;
		}
	}
});
