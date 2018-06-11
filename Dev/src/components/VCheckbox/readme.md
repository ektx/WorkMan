# VCheckbox

单选功能

## 使用方式

JavaScript

```javascript
// 具体路径按你存放位置
import { VCheckbox, VCheckboxGroup } from '@/components/VCheckbox'

export default {
  components: {
    VCheckbox,
    VCheckboxGroup
  },
  data () {
    return {
      value: '',
      // 默认 all 选中
      filterKey3: ['c']
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
<VCheckbox val="All">全部</VCheckbox>
<VCheckbox val="All" checked>全部</VCheckbox>
<VCheckbox val="All" disabled>全部</VCheckbox>
<VCheckbox val="All" disabled checked>全部</VCheckbox>

<VCheckbox 
    name="cc" 
    val="All" 
    v-model="filterKey2" 
    @change="helloTest"
>全部</VCheckbox>

```

### VRadioGroup 使用

```html
<VCheckboxGroup v-model="filterKey3">
    <VCheckbox val="a">a</VCheckbox>
    <VCheckbox val="b">b</VCheckbox>
    <VCheckbox val="c">c</VCheckbox>
</VCheckboxGroup>

<VCheckboxGroup @change="helloTest">
    <VCheckbox val="a">a</VCheckbox>
    <VCheckbox val="b">b</VCheckbox>
    <VCheckbox val="c">c</VCheckbox>
</VCheckboxGroup>
```

