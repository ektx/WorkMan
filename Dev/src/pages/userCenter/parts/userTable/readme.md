# userTable

用于统一表格展示页面。

页面使用：

```html
<userTable 
    title="服务器邮件设置"
    :columns="columns"
    :pageSize="pageSize"
    :ajaxData="formValidate" 
    :ajax="ajax"
    @event="event"
>
    <Form slot="add" ref="form" :model="formValidate" :rules="ruleValid" :label-width="60">
        <FormItem label="邮箱" prop="user">
            <Input autofocus v-model="formValidate.user" placeholder="输入邮箱"/>
        </FormItem>
        <FormItem label="密码" prop="pass">
            <Input type="password" v-model="formValidate.pass" placeholder="输入密码"/>
        </FormItem>
        <FormItem label="主机" prop="host">
            <Input v-model="formValidate.host" placeholder="输入主机"/>
        </FormItem>
        <FormItem label="端口" prop="port">
            <Input v-model="formValidate.port" placeholder="输入端口" number/>
        </FormItem>
    </Form>
</userTable>
```

Js引用

```js
import userTable from '../userTable'

export default {
  components: { userTable }  
}
```



### 参数

| 参数     | 类型     | 说明                                     |
| -------- | -------- | ---------------------------------------- |
| title    | String   | 用于显示标题                             |
| columns  | Array    | 表格头内容，自动添加编辑与删除按钮       |
| pageSize | Number   | 设置每页请求条数                         |
| ajax     | Object   | 请求相关配置                             |
| ajaxData | Object   | 请求时，提供的数据内容，可以动态绑定数据 |
| slot     | vue slot | 具名插槽功能，用于添加与编辑时使用的弹层 |

#### ajax

| 属性   | 类型     | 说明                                 | 默认值 |
| ------ | -------- | ------------------------------------ | ------ |
| always | function | 通用回调                             | -      |
| add    | function | 添加事件                             | -      |
| update | function | 更新事件                             | -      |
| delete | function | 删除事件                             | -      |
| init   | function | 默认回调事件，加载完成后立即运行事件 | -      |

add update delete init 内部参数如下：

| 属性   | 类型                      | 说明                                             | 默认值 |
| ------ | ------------------------- | ------------------------------------------------ | ------ |
| url    | String                    | 请求地址                                         | -      |
| method | ['post', 'get', 'delete'] | 请求类型                                         | post   |
| data   | Object                    | 请求的数据<br/>因使用的是GraphQL这里需要添加内容 | -      |
| cb     | function                  | 回调方法，用于在请求完成后调用                   | -      |

#### slot

| 属性 | 说明             |
| ---- | ---------------- |
| add  | 添加时的弹层插槽 |
|      |                  |

```html
<userTable>
  <div slot="add">你好弹层</div>
</userTable>
```



### 事件

| 参数  | 类型     | 说明                                                         |
| ----- | -------- | ------------------------------------------------------------ |
| event | function | 返回事件，用于父级组件与子组件沟通使用<br/>`add`  `edit` 在返回时会返回当前行的数据<br/>`init` 在调用时可以支持回调传值 |

```javascript
methods: {
    event (data) {
        switch (data.type) {
            case 'init': 
                data.cb({pages: 1, size: 10})
                break;
            case 'add':
                this.character = {}
                break;
            case 'edit':
                this.character = data.data.row
                break;
        }
    }
}
```

