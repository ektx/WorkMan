
<template>
	<div class="v-rdaio-group">
		groupkslaklsa
		<slot></slot>
		{{ this.value }}
	</div>
</template>

<style lang="scss">
</style>

<script >
export default {
	name: 'VRadio',
	props: {
		name: {
			type: String
		}
	},
	data () {
		return {
			value: ''
		}
	},
	mounted () {
		// this.update()
	},
	methods: {
		change (data) {
			console.log(data)
			this.value = data + 1
			console.log(this.value)
		},

		// update () {
			
		// 	let groupName = new Date().getTime()
		// 	if (this.$children) {
		// 		this.$children.forEach(child => {
		// 			if (child.$options.name === 'v-radio') {
		// 				console.log(child.checked, child.val)
		// 				// child.groupName = groupName
		// 				child.inGroup = true
		// 				this.value = child.checked ? child.val : ''
						
		// 			}
		// 		})
		// 	}
		// }
	}
}
</script>