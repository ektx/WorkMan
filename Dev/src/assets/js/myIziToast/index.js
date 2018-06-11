// 提醒插件
// http://izitoast.marcelodolce.com/

import iziToast from './js/iziToast.js'
// 全局引用样式
import './css/iziToast.scss'

iziToast.settings({
    position: 'topRight',
    transitionIn: 'fadeInLeft',
    transitionOut: 'fadeOutRight',
    timeout: 0
})

export default iziToast