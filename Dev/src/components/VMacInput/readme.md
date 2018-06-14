# VMacInput
对 input 进行整合包装。

## 使用
HTML
```html
<VMacInput title="用户名" v-model="name" type="search" :help="nameHelp"/>

<VMacInput title="密码" :value="pwd" type="password" @keyup="say($event)"/>
```

JavaScript
```js
import VMacInput from '../../components/VMacInput'

export default {
    components: { VMacInput },
    data () {
        return {
            name: "",
            nameHelp: {
                status: "info",
                mes: "用户名默认为：Admin"
            },
            nameErr: "Something was error!",
            pwd: '12345',
            pwdErr: ''
        }
    }
    ....
}
```


## API
- **title** `string` 显示标题内容
- **type** `HTML Input` hmtl的 input type,具体可以查看 [这里](http://www.w3school.com.cn/html5/html_5_form_input_types.asp)
- **help** `object` 用于辅助显示内容，格式有以下
    - **status** `array` 显示的类型
        - **info** 显示基本信息
        - **success** 显示成功效果
        - **warn** 显示警告效果
        - **error** 显示错误效果
    - **mes** `string` 显示的内容
- **value** `string|number` 值
- **required** `boolean` 是否为必填
- **clearbtn** `boolean` 是否要清空按钮

## event
### v-model 

用于对值的双向绑定操作,以下展示对值的验证操作
```js
export default {
    ...
    watch: {
        name (val, old) {

            if (val === 'zwl') {
                this.nameHelp = {
                    mes: "Great!!",
                    status: 'success'
                }
            } else if (val === 'err') {
                this.nameHelp = {
                    mes: "Error!!",
                    status: 'error'
                }
            } else if (val === 'warn') {
                this.nameHelp = {
                    mes: "Error!!",
                    status: 'warn'
                }
            } else {
                this.nameHelp = {
                    mes: "用户名默认为：Admin",
                    status: 'info'
                }
            }
        }
    }
}
```

### keyup
有时你可能希望自己能够处理到键盘事件，如想要控制到用户的 enter 功能，这时你可以参考以下方法

```js
say (evt) {
    // 输出事件
    console.log(evt)
    // 输出之前的值
    console.log(this.pwd)
    // 赋值
    this.pwd = evt.target.value
}
```