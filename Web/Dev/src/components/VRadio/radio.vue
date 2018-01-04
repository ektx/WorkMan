
<template>
	<label class="v-radio-label">
		<input 
			type="radio"
			class="v-radio-int" 
			:name="name" 
			:value="val"
			:checked="checkedStatus"
			:disabled="disabled"
			@change="change"
		>
		<span>
			<slot></slot>
		</span>
	</label>
</template>

<style lang="scss">
label.v-radio-label {
	display: inline-block;
	white-space: nowrap;
	justify-content: center;
	align-items: center;

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

<script >
export default {
	name: 'v-radio',
	props: {
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
			checkedStatus: this.checked
		}
	},
	methods: {
		change (evt) {
			this.checkedStatus = evt.target.checked

			this.$emit('change', this.val)
		}
	}
}
</script>