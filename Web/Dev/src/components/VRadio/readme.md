# VRadio

单选功能

## 使用方式

JavaScript

```javascript
// 具体路径按你存放位置
import VRadio from '@/components/VRadio'

export default {
  components: {
    VRadio
  },
  ...
}
```

HTML

```html
<!-- disabled 取值示例 -->
<VRadio disabled>标签方式</VRadio>
<VRadio :disabled="true">动态布尔值</VRadio>

<!-- checked 取值示例 -->
<VRadio name="checkedStr" >标签方式</VRadio>
<VRadio name="checkedStr" checked>标签方式</VRadio>
<VRadio name="checkedBoolean" :checked="true">动态布尔值</VRadio>
<VRadio name="checkedBoolean" :checked="false">动态布尔值</VRadio>

<!-- change事件 -->
<VRadio name="evt" val="change事件" v-on:change="helloTest">change事件</VRadio>
<!-- 原生事件调用 -->
<VRadio name="evt" val="原生事件调用" v-on:click.native="helloTest(4)">原生事件调用</VRadio>
```

