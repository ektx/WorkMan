
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
			
		</main>
		
	</section>
</template>

<script>
	import main from './main'

	export default main
</script>

<style lang="scss" scoped>
	@import './layout.scss';
</style>