
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 右键菜单
		contextmenu: {
			show: true,
			data: {},
			evt: null
		}
	},

	mutations: {

		// 设置方法
		setContextmenu (state, data) {
			if (Object.keys(data).length > 1) {
				state.contextmenu = data
			} else {
				state.contextmenu.show = data.show
			}
		}
	}
})