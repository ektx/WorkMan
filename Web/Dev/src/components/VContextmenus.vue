
<template>
	<section 
		v-show="data.state" 
		class="contextmenu-mod" 
		:style="{
			top: data.position.top + 'px', 
			left: data.position.left + 'px'
		}"
		ref="contextMenu"
	>
		<template v-if="data.state">
			<ul>
				<li v-for="(menu, index) in data.inner">
					<div 
						v-if="'title' in menu" 
						:key="index" 
						:class="{noEvt: menu.disabled}" 
						@click="contextmenuFun(index, 'click', $event, menu.evt)"
					>
						{{ menu.title }}

						<i v-if="menu.children"></i>
					</div>
					<div class="separator" :key="index" v-else-if="'type' in menu"></div>

					<template v-if="menu.children">
						<v-contextmenus :data="menu.children">
						</v-contextmenus>
					</template>
				</li>
			</ul>
		</template>
	</section>
</template>

<script>
	export default {
		name: 'v-contextmenus',
		props: ['data'],
		data () {
			return {
				
			}
		},
		methods: {
			contextmenuFun: function(index, type, evt, callback) {
				console.log(index, type, evt, callback)
				if (callback) callback()
			},

			documentClick(e) {
				let el = this.$refs.contextMenu
				let target = e.target

				if (( el !== target) && !el.contains(target)) {
					this.data.state = false
				}
			},

			getPosition(position) {

				this.data.position.top = position.top
				this.data.position.left = position.left

				this.$nextTick(() => {

					let _ = this.$el
					let _H = _.scrollHeight
					let _W = _.scrollWidth

					if (window.innerHeight < position.top + _H) {
						this.data.position.top = window.innerHeight - _H
					}

					if (window.innerWidth < position.left + _W) {
						this.data.position.left = window.innerWidth - _W
					}
					console.log(_.style.height)
				})

			},

			show: function(position) {

				this.getPosition(position)

				// this.data.position.top = _option.top
				// this.data.position.left = _option.left
				this.data.state = true
			} 
		},
		created () {
			document.addEventListener('click', this.documentClick)
		},
		destroyed () {
			document.removeEventListener('click', this.documentClick)
		}
	}
</script>

<style lang="scss" scoped>
.contextmenu-mod {
	position: fixed;
	top: 100px;
	left: 100px;
	padding: 5px 0;
	font-size: 12px;
	line-height: 1.5rem;
	white-space: nowrap;
	background: rgba(255, 255, 255, .9);
	border-radius: 3px;
	box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
	
	li {
		cursor: pointer;
		user-select: none;

		&:hover {
			background: #eee;
		}

		div {
			padding: 0 10px;

			i {
				width: 0em;

				&:after {
					display: inline-block;
					content: '';
					position: relative;
					right: -5px;
					border: .3em solid transparent;
					border-left-color: inherit;
				}
			}
		}

		.noEvt {
			color: #aaa;
			pointer-events: none;
		}

		.separator {
			margin: 2px 0;
			border-bottom: 2px solid #eee;
		}
	}
}	
</style>