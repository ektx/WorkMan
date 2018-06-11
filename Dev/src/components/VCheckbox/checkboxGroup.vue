
<template>
	<div class="v-rdaio-group">
		<slot></slot>
	</div>
</template>

<style lang="scss">
</style>

<script >
export default {
	name: 'VCheckboxGroup',
	props: {
		name: {
			type: String
		},
		value: {
			type: Array,
			default: []
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

			if (data.status) {
				this.value.push( data.val )
			} else {
				this.remove( data.val )
			}

			this.$emit('input', this.value)
			this.$emit('change', this.value)
		},

		update () {
			let groupName = new Date().getTime()
			if (this.$children) {
				this.$children.forEach(child => {
					if (child.$options.name === 'VCheckbox') {
						child.innerName = groupName
						child.inGroup = true
						child.checkedStatus = this.value.includes( child.val )
					}
				})
			}
		},

        remove (val) {
            let index = this.value.indexOf( val )
            if (index > -1) {
                this.value.splice(index, 1)
            }
        }
	}
}
</script>