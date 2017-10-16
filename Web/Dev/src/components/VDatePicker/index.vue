<!--
	VDatePicker
	===========================================
	Vue Date Picker(vue 日期选择组件)

	@version: 0.0.1
	@author: ektx <530675800@qq.com>

	使用:
	1. 引用 css

	2. 页面调用
	<v-date-picker 
		default-val="2017-9-5 12:08:26"
		format="YYYY年MM月"
		:events="events"
		has-footer="hasfooter"
		v-on:send-date="getWMDatePicker"
	></v-date-picker>

	@default-val 默认时间
	@format 显示格式
	@events [array] 事件 [{29:1, 30: 2, 31: 1}]
	@has-footer 是否要显示底部按钮,以上示例为要,不添加值为不要
	@v-on:send-date 回调函数,返回日期对象
-->
<template>
	
	<div class="vdate-picker-box">
		<header class="vdate-picker-control">
			<button 
				@click="prevBtn"
				class="tbtn prev-btn"></button>
			<p>
			<!--button
				class="tbtn back-btn"
			></button-->
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
				class="tbtn next-btn"
			></button>
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
						event: events ? events[day.time] : '', 
						current: day.isHold,
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
</template>


<script>

	export default {
		name: 'v-date-picker',
		props: [ 'defaultVal', 'format', 'events', 'hasFooter' ],
		data () {
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

			this.time = this.defaultVal ? new Date(this.defaultVal): new Date();
			this.year = this.time.getFullYear();
			this.month = this.time.getMonth() + 1;
			// 更新日历
			this.updateCalendarAndEvents();
			// 发送时间
			// this.sendDateToParent('auto')

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
				let maxDayInThisMonth = new Date(this.year, this.month, 0).getDate();
				// 获取默认时间
				let defDate = this.defaultVal ? new Date(this.defaultVal) : new Date();
				// 今天
				let todayVal = defDate.getDate();

				// 如果今天的日期比当前选择的日期大,就用当前月最大的日期
				// 比如在1月30号跳转到2月,2月最大只有28这时2月就是28选中
				todayVal = todayVal > maxDayInThisMonth ? maxDayInThisMonth : todayVal;

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
						// 是否选中
						isHold: isTodayMes
					}
				});

			} 
		}
	}
</script>

<style lang="scss" scoped>
	@import './VDatePicker.css'
</style>