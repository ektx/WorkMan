
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

		<div class="todolist-order-mod" >

			<VSearch 
				classes="todolist-search-mod"
				v-on:input="helloTest"
				v-on:reset="helloTest"
			></VSearch>

			<ul class="order-mod" v-show="!eventsHelpBox.show">
				<li 
					v-for="(evt, index) in events" 
					@click="seeEvent(index)"
					@contextmenu.prevent="quickSetEvent(index, $event)"
					:class="{current: index === holdEventIndex}"
				>
					<div class="content">
						<div class="label-box">
							<label v-show="!evt.insert">
								<input class="is-done" type="checkbox" :checked="evt.complete" @click="updateCheck(index, $event)">
							</label>
						</div>
						<div class="inner">
							<h4>{{ evt.title }}</h4>
							<p>{{ evt.stimeF }} - {{ evt.etimeF }}</p>
						</div>
					</div>
				</li>
			</ul>

			<!-- 事件过滤区 -->
			<div v-show="false" class="event-filter-methods">
				<VRadio name="c" val="All" checked v-on:change="helloTest">全部</VRadio>
				<VRadio name="c" val="done" v-on:change="helloTest">已完成</VRadio>
				<VRadio name="c" val="will" v-on:change="helloTest">进行中</VRadio>
			</div>
		</div>

		<main class="todolist-events-mod">
			<header class="todoEvents-day-header">
				<div class="todoEvt-headerDay-inner">
					<input 
						id="event-title" 
						type="text" 
						class="title" 
						:value="holdEvent.title"
						@keyup="insertData('title', $event)"
						@blur="blurTitle"
						@focus="focusEvt"
					>
				</div>
				<div v-show="typeList.length" class="hd-btns-box">
					<button class="tbtn add-todo-event" @click="addOneEvent"  :disabled="createNewEvent">
						<svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="12">
							<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
						</svg>
					</button>
				</div>
			</header>

			<!-- 主题信息 -->
			<section class="todo-list-box">
				<!-- 帮助信息 -->
				<div class="no-work-plane" v-show="eventsHelpBox.show">
					<h3>没有工作安排!</h3>
					<p class="remid-msg">{{ eventsHelpBox.mes }}</p>
				</div>

				<!-- 事件具体操作区 -->
				<div class="todoEvent-setting-box" v-show="!eventsHelpBox.show">
					<dl class="event-make-col">
						<dt>开始:</dt>
						<dd>
							<p class="date-select-ui" @click="changeEventDate('stime', $event)">
								{{holdEvent.stimeF}}
							</p>
						</dd>
					</dl>
						
					<dl v-show="holdEvent.etimeF" class="event-make-col">
						<dt>结束:</dt>
						<dd>
							<p 
								class="date-select-ui"
								@click="changeEventDate('etime', $event)"
							>
								{{holdEvent.etimeF}}
							</p>
						</dd>
					</dl>
					
					<dl class="event-make-col">
						<dt>备注:</dt>
						<dd class="inner-box">
							<textarea 
								@keyup="insertData('inner', $event)" 
								@focus="removeTextAreaAni"
								@blur="resetTextAreaAni"
								:value="holdEvent.inner"
							></textarea>
						</dd>
					</dl>
				</div>

			</section>

		</main>

		<!-- 浮动时间组件 -->
		<transition name="fade-fixed-date">
			<section 
				v-show="pickTimeShow"
				id="fixed-date-mod" 
				class="fixed-date-mod" 
				@click="hideThisLayer"
			>
				<div class="fixed-date-inner" 
					v-bind:style="{
						top: pickTimeRectInfo.top + 'px', 
						left: pickTimeRectInfo.left +'px'
					}"
				>
					<v-date-picker 
						:default-val="pickTimeDefVal"
						format="YYYY-MM"
						:events="pickTimeEvents"
						has-footer="hasfooter"
						v-on:send-date="getUserDatePicker"
					></v-date-picker>
				</div>
			</section> 
		</transition>
		
	</section>
</template>

<script>
	import main from './main'
	export default main
</script>

<style lang="scss" scoped>
	@import './layout.scss';
</style>