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
			<ul class="title">
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
	import main from './main'
	export default main
</script>

<style lang="scss" scoped>
	@import './layout.scss'
</style>