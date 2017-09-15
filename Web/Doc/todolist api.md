# todolist API

## 事件添加



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

