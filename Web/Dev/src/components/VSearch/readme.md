# VSearch 

vue.js search component

## 使用

Js 中调用：

```javascript
import VSearch from '@/components/VSearch'
```

页面中：

```html
<VSearch 
	classes="todolist-search-mod"
    :resetBtn="false"
	v-on:input="helloTest"
	v-on:reset="helloTest"
></VSearch>
```

### 事件

| 方法      | 说明                     |
| ------- | ---------------------- |
| input   | 输入事件，返回用户输入信息          |
| reset   | 清空按钮功能，清空时触发事件         |
| classes | 自定义样式                  |
| :reset  | 是否默认显示清空按钮，默认 true（显示） |

