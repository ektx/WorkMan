
<template>
	<div :class="['v-search-mod', classes]">
		<input 
			type="text" 
			placeholder="搜索:WorkMan..." 
			v-model="searchVal"
			@input="sendVal"
		>
		<button @click="resetInt" :class="{'hide-btn': !btn }">
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
	props: {
		// 可以自定义样式
		'classes': {
			type: String,
			default: ''
		},
		// 清空按钮
		'resetBtn': {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			searchVal: '',
			btn: this.resetBtn
		}
	},
	methods: {
		resetInt (evt) {
			let type = 'reset'

			if (!this.searchVal) {
				type = 'add'
			}

			this.btn = this.resetBtn
			this.searchVal = ''
			this.$emit('reset', { event:evt, type })
		},

		sendVal () {
			this.btn = true
			this.$emit('input', this.searchVal)
		}
	}
}
</script>