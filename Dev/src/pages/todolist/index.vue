
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
						v-on:blur="saveTodoType(val.id, $event)"
						>
					<span v-else >{{val.name}}</span>
				</li>
			</ul>

			<div id="events-calendar-mod" class="fixed-calendar-mod">
				<RVCalendar
					:attributes="attributes"
					:theme-styles="calendarTheme"
					@dayclick="helloTest"
				></RVCalendar>
				
			</div>
		</aside>

		<div class="todolist-order-mod" >

			<VSearch
				classes="todolist-search-mod"
				:resetBtn="false"
				:delay="500"
				placeholder="搜索:WorkMan..."
				v-model="searchEvtKey"
				v-on:reset="resetSearchKey"
			></VSearch>

			<!-- 事件过滤区 -->

			<VRadioGroup class="event-filter-methods" v-model="filterKey" @change="helloTest">
				<VRadio val="All">全部</VRadio>
				<VRadio val="Done">已完成</VRadio>
				<VRadio val="will">进行中</VRadio>
			</VRadioGroup>

			<ul class="order-mod" v-show="!eventsHelpBox.show">
				<li
					v-for="(evt, index) in displayEvts"
					:key="index"
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
							<p>{{ minTimeFormat(evt.stime) }} - {{ minTimeFormat(evt.etime) }}</p>
						</div>
					</div>
				</li>
			</ul>

		</div>

		<main class="todolist-events-mod">
			<header class="todoEvents-day-header">
				<div class="todoEvt-headerDay-inner">
					<input
						id="event-title"
						type="text"
						class="title"
						v-model="holdEvent.title"
						@blur="blurTitle"
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
						<dt>时间</dt>
						<dd>
							<RVCalendar 
								picker
								mode="range"
								:value="selectedDate"
								@input="selectCalendar"
								show-caps
							></RVCalendar>
						</dd>
					</dl>
					<dl class="event-make-col">
						<dd class="inner-box">
							<TodoArticle :event="holdEvent"/>
						</dd>
					</dl>
				</div>

			</section>

		</main>

	</section>
</template>

<script src="./main.js"></script>
<style src="./layout.scss" lang="scss" scoped></style>
