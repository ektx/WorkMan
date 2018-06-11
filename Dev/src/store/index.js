
import Vue from 'vue'
import Vuex from 'vuex'

// 导入右键菜单功能
import VContextmenu from '@ektx/v-contextmenu/store'
// 导入菜单 mutaion
import { MutaionMacOSTopbar } from '@ektx/v-macos'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: { },
	modules: {
		VContextmenu,
		MutaionMacOSTopbar
	}
})