
<template>
	<div :class="['v-search-mod', classes]">
		<input type="text" placeholder="搜索:WorkMan...">
		<button>
			<svg height="14" version="1.1" viewBox="0 0 12 16" width="10">
				<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"></path>
			</svg>
		</button>
	</div>
</template>

<style lang="scss">
.v-search-mod {
	position: relative;
	overflow: hidden;
	font-size: 12px;

	& > input {
		display: block;
		width: 100%;
		padding: .2em .7em .3em;
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
	}
}
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

		}
	}
}
</script>