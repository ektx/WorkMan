
<template>
	<label class="v-radio-label">
		<input 
			type="radio"
			class="v-radio-int" 
			:name="innerName" 
			:value="val"
			:checked="checkedStatus"
			:disabled="disabled"
			@change="change"
		>
		<div class="v-radio-slot">
			<slot></slot>
		</div>
	</label>
</template>

<script >
export default {
	name: 'v-radio',
	props: {
		value: {
			type: [String, Number, Boolean],
			default: ''
		},
		val: {
			type: [String, Number, Boolean],
			default: ''
		},
		name: {
			type: String
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			checkedStatus: this.checked,
			// 默认使用用户输入的 name
			// 在有组的情况下,使用组的
			innerName: this.name
		}
	},
	mounted () {
		if (this.value && this.value === this.val) {
			this.checkedStatus = true
		}
	},
	methods: {
		change (evt) {
			this.checkedStatus = evt.target.checked
			
			if (this.inGroup) {
				if (this.$parent.$options.name === 'VRadioGroup') {
					this.$parent.change(this.val)
				}
			} else {
				this.$emit('input', this.val)
				this.$emit('change', this.val)
			}
			
		}
	}
}
</script>


<style lang="scss">
label.v-radio-label {
	display: inline-block;
	white-space: nowrap;
	justify-content: center;
	align-items: center;

	div.v-radio-slot {
		display: inline-block
	}
	
	input.v-radio-int {
		-webkit-appearance: none;
		width: 14px;
		height: 14px;
		border: 1px solid #f44336;
		border-radius: 100%;
		vertical-align: middle;
		position: relative;
		outline: none;
		cursor: pointer;
		box-sizing: border-box;
		
		&::after {
			content: '';
			display: block;
			width: 8px;
			height: 8px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3D(-50%,-50%,0) scale(0);
			background-color: transparent;
			border-radius: 100%;
			transition: background-color .3s ease, transform .3s ease;
		}
		&:checked::after {
			background-color: #f44336;
			transform: translate3D(-50%,-50%,0) scale(1);
		}
		
		&[disabled] {
			border-color: #bbb;
			cursor: default;

			&:checked::after {
				background-color: #bbb;
			}
		}
	}

	span {
		display: inline-block;
		vertical-align: middle;
	}

}
	
</style>
