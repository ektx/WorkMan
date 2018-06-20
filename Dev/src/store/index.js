
import Vue from 'vue'
import Vuex from 'vuex'

// 导入右键菜单功能
import VContextmenu from '@ektx/v-contextmenu/store'
// 导入菜单 mutaion
import Main from '../pages/main/store'
// 用户中心数据
import userCenter from '../pages/userCenter/store'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: { },
	modules: {
		VContextmenu,
		Main,
		userCenter
	}
})