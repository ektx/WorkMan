# todolist API

## 事件

### 查询

```shell
# 查询 ektx 类别为 1504493066740 的 在 2017-9-1 到 2017-10-20 的所有事件(默认100条)
{
  todolistEvetns(
    account:"ektx",
    types: "1504493066740",
    stime: "2017-9-1",
    etime: "2017-10-20"
  ) {
    id
  }
}
```

### 添加

```shell
# 为用户 ektx 添加一个事件 1504493147797
mutation {
  saveTodoListEvent(
    id: "1504493147797",
    account: "ektx",
    # 添加的内容
    data: {
      # 分类
      eventTypeID: "1504493147795",
      # 标题
      title: "china",
      # 完成是否
      complete: false,
      # 开始时间
      stime: "2017-9-10",
      # 结束时间
      etime: "2017-9-19",
      # 内容
      inner: ""
    }
  ) {
  	# 要返回生成后的 id
    id,
    # 保存的时间
    addTime {
      time {
        time
        day
      }
    },
    # 保存信息
    save
    # 删除的时间表
    delTime {
      time {
        time
        day
      }
    }
  }
}
```

关于 addTime 和 delTime 可以想看 **日历 保存 api**

### 删除一个事件

```shell
# 删除刚才创建的事件,并返回它涉及的日期
mutation {
  removeTodoListEvent(
    id: "1504493147797_ektx",
    account: "ektx"
  ) {
    save
    time {
      day
    }
  }
}
```

返回信息格式:
```shell
{
  "data": {
    "removeTodoListEvent": {
      # 数据信息
      "save": "[{\"ok\":1,\"nModified\":0,\"n\":1,\"upserted\":[{\"index\":0,\"_id\":\"59bc5a8929e6c847a39ff078\"}]}]",
      # 时间列表
      "time": [
        {
          "day": "10,11,12,13,14,15,16,17,18,19"
        }
      ]
    }
  }
}
```



## 日历

#### 保存

在日历上保存一段时间事件

```shell
mutation {
  saveCalendarEvent(
    # 添加用户
    account: "ektx",
    # 事件 id
    id: "1",
    # 开始时间
    stime: "2017-10-1",
    # 结束时间
    etime: "2019-10-5"
  ) {
    # 返回保存信息
    save,
    # 返回时间信息[数组,以月为单位返回]
    time {
      # 年月
      time
      # 天
      day
    }
  }
}
```

以下为返回demo

```shell
{
  "data": {
    "saveCalendarEvent": {
      "save": "[{\"ok\":1,\"nModified\":1,\"n\":1}]",
      "time": [
        {
          "time": "2017-10",
          "day": "1,2,3,4,5"
        }
      ]
    }
  }
}
```

### 查看日历

```shell
# 查询用户 ektx 类别为 1504493147795 在 2017-9 的日期事件
{ calendarEvent(
  account: "ektx", 
  typeID: "1504493147795", 
  time: "2017-9") {
    time,
    day
  }
}
```

## 事件类别

### 添加

```shell
# 为 ektx 用户 添加类别为 1 名称为 123
mutation {
	addTodoListType(data: {
    id: "1",
    account: "ektx",
    name: "123"
  })
}
```

