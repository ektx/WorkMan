# VSearch 

vue.js search component

## 使用

Js 中调用：

```javascript
import VSearch from '@/components/VSearch'
```

页面中：

```html
<!-- 如果想要监听 input 处理事件 -->
<VSearch 
	classes="todolist-search-mod"
    :resetBtn="false"
	v-on:input="helloTest"
	v-on:reset="helloTest"
/>

<!-- 如果想要只改变值 -->
<VSearch 
	classes="todolist-search-mod"
    :resetBtn="false"
	v-model="newKey"
	v-on:reset="helloTest"
/>
```

```javascript
new Vue({
	el: '#box',
	data: {
		// 要取值的对象
		newKey: ''
	},
	methods: {
		helloTest (val) {
			console.log(val)
		}
	}
})
```

### 事件

| 方法      | 说明                     |
| ------- | ---------------------- |
| input   | 输入事件，返回用户输入信息          |
| reset   | 清空按钮功能，清空时触发事件         |

### props

| 方法 | 说明 | 默认值 |
| --- | --- |:---:|
| classes 		| 自定义样式 | - |
| :resetBtn 	| 是否默认显示清空按钮 | false |
| :delay	 	| 设置延迟功能 | - |
| placeholder 	| 占位符信息 | Search... |