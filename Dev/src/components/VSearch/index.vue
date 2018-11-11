<template>
	<div :class="['v-search-mod', classes]">
		<div class="v-search-inner">
			<input
				type="text"
				:placeholder="placeholder"
				v-model="searchVal"
				@input="sendVal"
			>
			<button @click="resetInt" :class="{'hide-btn': !btn }">
				<svg height="14" version="1.1" viewBox="0 0 12 16" width="10">
					<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
				</svg>
			</button>
		</div>
	</div>
</template>

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
			default: false
		},
		'delay': {
			type: Number,
			default: 0
		},
		'placeholder': {
			type: String,
			default: 'Search...'
		}
	},
	data () {
		return {
			searchVal: '',
			btn: this.resetBtn,
			delayEvt: null
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
            if (this.searchVal.length > 0) {
                this.btn = true
            } else {
                this.btn = this.resetBtn
            }

			if (this.delay > 0) {
				
				clearTimeout(this.delayEvt)

				this.delayEvt = setTimeout(()=> {
					this.$emit('input', this.searchVal)
				}, this.delay)
			} else {
				this.$emit('input', this.searchVal)
			}
		}
	}
}
</script>

<style lang="scss">
.v-search-inner {
	position: relative;
	overflow: hidden;
	font-size: 12px;

	& > button {
		position: absolute;
		right: 2px;
		top: 50%;
		display: flex;
		width: 1.8em;
		height: 1.8em;
		vertical-align: top;
		justify-content: center;
		border: none;
		outline: none;
		background: transparent;
		border-radius: 100%;
		cursor: pointer;
		transition: background-color .3s ease;
		transform: translate(0%, -52%);

		&:hover {
			background-color: rgba(0, 0, 0, .05);
		}

		&:active {
			background-color: rgba(0, 0, 0, 0);
			transition: background-color 0s ease;
		}

		svg {
			fill: rgba(0, 0, 0, .2);
			transform: rotate(135deg);
			transition: transform .3s ease;

			&:hover {
				fill: rgba(0, 0, 0, .4)
			}
		}

		&.hide-btn {
			visibility: hidden
		}
	}
	
	& > input {
		display: block;
		width: 100%;
		padding: .3em .7em .2em;
		color: #333;
		background: rgba(255, 255, 255, .3);
		outline: none;
		border: 1px solid rgba(0, 0, 0, .1);
		border-radius: 20px;
		box-sizing: border-box;
		transition: border .3s ease;

		&::placeholder {
			color: #999;
		}

		&:focus {
			border-color: rgba(0, 0, 0, .3);
			background-color: rgba(255, 255, 255, .9);
		}

		&:hover {
			border-color: rgba(0, 0, 0, .2)
		}

		&:placeholder-shown + button svg {
			transform: rotate(0deg);
		}
	}

}
</style>