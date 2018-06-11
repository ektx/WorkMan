
<template>
	<div class="v-rdaio-group">
		<slot></slot>
	</div>
</template>

<style lang="scss">
</style>

<script >
export default {
	name: 'VRadioGroup',
	props: {
		name: {
			type: String
		},
		value: {
			type: [String, Number, Boolean],
			default: ''
		}
	},
	mounted () {
		this.update()
	},
	watch: {
		value (newVal, oldVal) {
			this.update()
		}
	},
	methods: {
		change (data) {
			this.$emit('input', data)
			this.$emit('change', data)
		},

		update () {
			let groupName = new Date().getTime()
			if (this.$children) {
				this.$children.forEach(child => {
					if (child.$options.name === 'v-radio') {
						child.innerName = groupName
						child.inGroup = true
						child.checkedStatus = child.val === this.value
					}
				})
			}
		}
	}
}
</script>