
<template>
	<div :class="['v-search-mod', classes]">
		<input 
			type="text" 
			placeholder="搜索:WorkMan..." 
			v-model="searchVal"
			@input="sendVal"
		>
		<button @click="resetInt">
			<svg height="14" version="1.1" viewBox="0 0 12 16" width="10">
				<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
			</svg>
		</button>
	</div>
</template>

<style lang="scss">
	@import './layout.scss'
</style>

<script>
export default {
	name: 'VSearch',
	props: [
		// 可以自定义样式
		'classes'
	],
	data () {
		return {
			searchVal: ''
		}
	},
	methods: {
		resetInt (evt) {
			this.searchVal = ''
			this.$emit('reset', evt)
		},

		sendVal () {
			// console.log(this.searchVal)
			this.$emit('input', this.searchVal)
		}
	}
}
</script>