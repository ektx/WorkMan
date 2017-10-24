
<template>
	<section class="todolist-app">
		<aside class="todolist-type-mod">
			<h1>
				<p>计划目录</p>
				<button @click="addNewType" class="tbtn">
					<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
						<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
					</svg>
				</button>
			</h1>
			<ul>
				<li v-for="(val,index) in typeList"
					:key="val.id" 
					:class="val.hold"
					@click="findThisTypeIndex(index)"
					@contextmenu.prevent="rightClick(index, $event)"
				>
					<input type="text"
						v-if="val.readonly" 
						:value="val.name"
						v-on:keyup.enter="willSaveTodoType"
						v-on:blur="saveTodoType"
						>
					<span v-else >{{val.name}}</span>
				</li>
			</ul>

			<div id="events-calendar-mod" class="fixed-calendar-mod">
				<v-date-picker 
					format="YYYY-MM"
					:events="calendar_events"
					v-on:send-date="getVDatePicker"
				></v-date-picker>
			</div>
		</aside>

		<main class="todolist-events-mod">
			<header class="todoEvents-day-header">
				<div class="todoEvt-headerDay-inner">
					<div class="title">{{ evt_HeaderTime.date }}</div>
					<div class="inner">
						<p>{{ evt_HeaderTime.dayFormat }}</p>
						<p>{{ evt_HeaderTime.year }} 年 {{ evt_HeaderTime.month }} 月</p>
					</div>
				</div>
				<div class="hd-btns-box">
					<button class="tbtn add-todo-event" @click="addOneEvent"  :disabled="createNewEvent">
						<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
							<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
						</svg>
					</button>
				</div>
			</header>

			<section class="todo-list-box">
				<div class="no-work-plane" v-show="eventsHelpBox.show">
					<h3>没有工作安排!</h3>
					<p class="remid-msg">{{ eventsHelpBox.mes }}</p>
				</div>

				<ul>
					<li v-for="(event, index) in events"
						class="event-rows"
						:data-id="event.id" 
						:data-index="index"
						data-parent="${data.parent}" 
						data-time="${data.startTime}"
						@mouseenter="mouseOver"
						@contextmenu.prevent="quickSetEvent"
					>
					<div class="header">
						<label>
							<input class="is-done" type="checkbox" :checked="event.complete" @click="updateCheck(index, $event)">
						</label>
						<div class="title-box">
							<input class="title" 
								placeholder=" 输入你的事件吧 ;)" 
								:value="event.title" 
								@keyup="insertData('title', index, $event)"
								@blur="blurTitle"
								v-focus="event.title"
							/>
						</div>
						<span class="li-btns-box">
							<button 
								@click="showEventsInfo" 
								class="tbtn arrow-ico down-arrow"
								:data-parentIndex="index"
								:data-parentId="event.id"
							></button>
						</span>
					</div>
					<ul class="inner">
						<dl class="event-make-col">
							<dt>开始:</dt>
							<dd>
								<p class="date-select-ui" @click="changeEventDate('stime', index, $event)">
									{{event.stimeF}}
								</p>
							</dd>
						</dl>
						
						<dl v-show="event.etimeF" class="event-make-col">
							<dt>结束:</dt>
							<dd>
								<p 
									class="date-select-ui"
									@click="changeEventDate('etime', index, $event)"
								>
									{{event.etimeF}}
								</p>
							</dd>
						</dl>
						
						<dl>
							<dt>备注:</dt>
							<dd>
								<textarea 
									@keyup="insertData('inner', index, $event)" 
									class="inner-box"
									@focus="removeTextAreaAni"
									@blur="resetTextAreaAni"
								>{{event.inner}}</textarea>
							</dd>
						</dl>
					</ul>
					</li>
				</ul>
			</section>

		</main>

		<!-- 浮动时间组件 -->
		<section 
			v-if="pickTimeShow"
			id="fixed-date-mod" 
			class="fixed-date-mod" 
			@click="hideThisLayer"
		>
			<transition name="fade-fixed-date">
				<div class="fixed-date-inner" 
					v-bind:style="{top: pickTimeRectInfo.top + 20+'px'}"
				>
					<v-date-picker 
						format="YYYY-MM"
						:events="pickTimeEvents"
						has-footer="hasfooter"
						v-on:send-date="getUserDatePicker"
					></v-date-picker>
				</div>
			</transition>
		</section> 
		
	</section>
</template>

<script>
	import main from './main'

	export default main
</script>

<style lang="scss" scoped>
	@import './layout.scss';
</style>