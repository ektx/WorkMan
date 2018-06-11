# VRadio

单选功能

## 使用方式

JavaScript

```javascript
// 具体路径按你存放位置
import { VRadio, VRadioGroup } from '@/components/VRadio'

export default {
  components: {
    VRadio,
    VRadioGroup
  },
  data () {
    return {
      value: '',
      // 默认 all 选中
      groupVal: 'All'
    }
  },
  methods: {
    helloTest (data) {
      console.log(data)
    }
  }
  ...
}
```

### VRadio 使用

```html
<!-- disabled 取值示例 -->
<VRadio disabled>标签方式</VRadio>
<VRadio :disabled="true">动态布尔值</VRadio>
<VRadio :disabled="true" checked>固定值</VRadio>

<!-- checked 取值示例 -->
<VRadio name="checkedStr" >标签方式</VRadio>
<VRadio name="checkedStr" checked>标签方式</VRadio>
<VRadio name="checkedBoolean" :checked="true">动态布尔值</VRadio>
<VRadio name="checkedBoolean" :checked="false">动态布尔值</VRadio>

<!-- change事件 -->
<VRadio name="evt" val="change事件" v-on:change="helloTest">change事件</VRadio>
<!-- 原生事件调用 -->
<VRadio name="evt" val="原生事件调用" v-on:click.native="helloTest('hello')">原生事件调用</VRadio>
<!-- v-model 方法 -->
<VRadio name="cc" val="All" v-model="value" @change="helloTest">全部</VRadio>

```

### VRadioGroup 使用

```html
<VRadioGroup 
  class="your-class" 
  v-model="groupVal" 
  @change="helloTest"
>
  <VRadio val="All">全部</VRadio>
  <VRadio val="Done">已完成</VRadio>
  <VRadio val="will">进行中</VRadio>
</VRadioGroup>
```

