import APIFetch from '../../assets/js/AFetch'
import { VRadio, VRadioGroup } from '@/components/VRadio'
import { VCheckbox, VCheckboxGroup } from '@/components/VCheckbox'
import VSearch from '@/components/VSearch'
import RVCalendar from '@/components/RVCalendar'
import { mapMutations } from 'vuex'
import TodoArticle from './parts/article'
import SDK from '../main/SDK'

console.log(SDK)
export default {
    name: 'todolist',
    components: {
        VRadio,
        VRadioGroup,
        VCheckbox,
        VCheckboxGroup,
        VSearch,
        RVCalendar,
        TodoArticle
    },
    data () {
        return {
            // 类别个数
            typeList: [],
            // 默认选择
            holdTypeIndex: -1,
            // holdTypeIndex 相关事件是否要运行
            needChangeHoldIndexEvt: true,
            // 重命名状态
            renameStatus: false,

            /* 日历相关 */
            calendar_pickTime: {},
            calendar_events: [],

            /* 事件功能 */
            evt_HeaderTime: {},
            // 查询到的所有事件
            events: [],
            // 显示的事件
            displayEvts: [],
            // 完成 未完成 全部过滤功能
            filterKey: 'All',
            filterKey2: 'All',
            filterKey3: ['b'],
            // 查询过滤
            searchEvtKey: '',
            // 选择事件内容
            holdEvent: {},
            // 选择对象
            holdEventIndex: -1,
            // 当前选择事件
            currentEventIndex: -1,
            // 编辑文件索引 用于确认编辑是那条事件
            editionEvtIndex: -1,

            // thisSetTimeoutFun: '',

            createNewEvent: false,
            // 事件帮助显示层
            eventsHelpBox: {
                show: false
            },

            /* pickTime layer */
            // 默认时间，用于在对事件进行时间选择时使用
            pickTimeDefVal: '',
            pickTimeRectInfo: {
                top: 0,
                left: 0
            },
            // 展示状态
            pickTimeShow: false,
            selectedDate: {},
            attributes: [
                {
                    contentStyle: {
                        color: 'red'
                    },
                    dates: [
                        new Date(2018, 4, 1)
                    ]
                }
            ],
            calendarTheme: {
                wrapper: {
                    background: 'rgba(255, 255, 255, .1)'
                },
                dayCellNotInMonth: {
                    opacity: 0
                }
            },
            
            // 点击的时间
            // pickTimeSaveTimeType: ''
        }
    },
    directives: {
        focus: {
            inserted: function (el, binding) {
                if (!binding.value) el.focus()
            }
        }
    },
    mounted: function() {
        this.$axios.post('/api/', {
            query: `{ 
                workTypes(account: "MY_ACCOUNT") { id,name }
            }`
        }).then(res => {
            this.typeList = res.data.workTypes
            // 选择第一条
            this.holdTypeIndex = 0
        }).catch(err => {
            console.error(err)
        })

        // 设置缓存应用
        this['Main/setToAlive']('todolist')
        // 设置主菜单
        this.setMainNav()
    },
    activated: function () {
        // 设置主菜单
        this.setMainNav()        
    },
    watch: {
        /* 类别切换监听功能 */
        holdTypeIndex (val, old) {
            // 是否要运行以下事件
            if (!this.needChangeHoldIndexEvt) {
                // 恢复可以操作状态
                this.needChangeHoldIndexEvt = true
                return
            }
            let thisVal = this.typeList[val]

            // 如果没有列表
            if (!this.typeList.length) return
            // 移除之前的选中对象
            if (old >= 0) {
                this.$set(this.typeList[old], 'hold', '')
            }
            // 为当前对象添加选中效果
            if (val > -1) {
                this.$set(thisVal, 'hold', 'current')
            }

            // 如果存在 readonly 则是在新建,新建则不要查询他的数据
            if (thisVal && !thisVal.readonly) {
                // 日历标识
                // this.getCalendarEvent()

                // 获取事件
                this.getAllEvents()
            }
        },

        /* 日历事件变化监听功能 */
        calendar_pickTime (val, old) {
            // 更新 事件列表的日期
            this.evt_HeaderTime = val

            if (val.from !== 'auto') getEvents(this, true)

            if (val.from === 'next' || val.from === 'prev') {
                this.getCalendarEvent()
            }
        },

        /* 事件列表自动监听是否显示帮助小提示 */
        events (val, old) {
            this.$set(this.eventsHelpBox, 'show', !val.length)

            this.displayEvts = val
        },

        // 当前选择查看事件
        holdEventIndex (val, old) {
            this.showHoldEvent()
        },

        /*
            查找功能
        */
        searchEvtKey (val, old) {
            this.filterDisplayEvts(val)
        },

        filterKey (val, old) {
            console.log(val)
        },

        filterKey2 (val, old) {
            console.log(val)
        },

        filterKey3 (val, old) {
            console.log(val)
        }
    },
    methods: {
        ...mapMutations(['Main/setNav', 'Main/setToAlive', 'Main/removeAlive']),

        // 添加一个新的分类
        addNewType: function () {
            // 添加一个新内容
            this.typeList.push({
                name: '',
                hold: 'current',
                readonly: true
            })

            // 切换选中对象
            this.holdTypeIndex = this.typeList.length - 1

            // focus 输入框
            this.$nextTick(function () {
                this.$el.querySelector('.current input').focus()
            })
        },

        // 按 enter 确认时
        willSaveTodoType: function (evt) {
            this.typeList[this.holdTypeIndex].readonly = false
        },

        // 保存分类
        saveTodoType: function (idVal, evt) {
            let name = evt.target.value
            let saveData = this.typeList[this.holdTypeIndex]
            let saveQuery = `mutation {addTodoListType(name: "${name}"){success mes id}}`
            let updateQuery = `mutation {updateTodoListType(id: "${saveData.id}", name: "${name}"){success mes}}`

            // 如果没有 名称 我们删除刚才添加的
            if (!name) {
                this.typeList.pop()
                return
            }

            saveData.readonly = false
            saveData.name = name

            this.$axios.post('/api', {
                query: idVal ? updateQuery : saveQuery
            }).then(res => {
                res = res.data
                // 更新
                if (idVal) {
                    if (res.updateTodoListType.success)
                        alert(res.updateTodoListType.mes)
                    else
                        alert(res.updateTodoListType.mes)
                } 
                // 添加
                else {
                    if (res.addTodoListType.success) {
                        saveData.id = res.addTodoListType.id
                    } else {
                        alert(res.addTodoListType.mes)
                    }
                }
            }).catch(err => {
                console.error(err)
            })
        },

        // 切换类型数据
        findThisTypeIndex (index) {
            this.holdTypeIndex = index
        },

        // 右键效果
        rightClick (index, evt) {
            let self = this

            let delTypeFun = function () {
                APIFetch({
                    query: `mutation {
                        removeTodoListType(id: "${self.typeList[index].id}", account: "MY_ACCOUNT")
                    }`
                }).then(data => {
                    // 如果有删除数据
                    if (JSON.parse(data.removeTodoListType).n) {
                        // 删除小于选中状态自己的
                        if (self.holdTypeIndex > index) {
                            // 更新选中状态
                            self.holdTypeIndex -= 1
                            // 但不去运行查询功能
                            self.needChangeHoldIndexEvt = false
                        } else if (self.holdTypeIndex === index) {
                            // 删除自己时,则不显示选中状态了
                            self.holdTypeIndex = -1
                        }

                        // 删除数据
                        self.typeList.splice(index, 1)

                        this.$store.commit('setContextmenu', { show: false })
                    }
                }, err => {
                    console.error(err)
                })
            }

            this.$store.commit('setContextmenu', {
                show: true,
                data: [
                    {
                        title: '重命名',
                        evt: function (data) {
                            self.$set(self.typeList[index], 'readonly', true)
                            self.renameStatus = true
                            self.holdTypeIndex = index

                            self.$nextTick(function () {
                                self.$el.querySelector('input').focus()
                            })

                            this.$store.commit('setContextmenu', { show: false })
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        title: '删除',
                        evt: delTypeFun
                    }
                ],
                evt
            })
        },

        /*
            日历相关工作
        */


        // 获取日历事件
        getCalendarEvent () {
            let typeID = this.typeList[ this.holdTypeIndex ].id
            let _pickTime = this.calendar_pickTime
            let _time = ''

            // 日历没有选择时间时，我们使用现在的时间
            if ('year' in _pickTime) {
                _time = _pickTime.year + '-' + _pickTime.month
            } else {
                let d = new Date()
                _time = `${d.getFullYear()}-${d.getMonth() + 1}`
            }

            let query = `{ 
                calendarEvent(
                    account: "MY_ACCOUNT", 
                    typeID: "${typeID}", 
                    time: "${_time}"
                ){time days}
            }`
                    
            this.$axios.post('/api', {query})
            .then(data => {
                data = data.data
                if (data.calendarEvent.days !== '{}') {
                    let eventArr = JSON.parse(data.calendarEvent.days)

                    if (Object.keys(eventArr)) {
                        this.calendar_events = eventArr
                    }
                } else {
                    this.calendar_events = {}
                }
            })
            .catch(err => {
                console.log(err)
            })
        },

        // 更新日历
        updateCalendarEvent (addArr, delArr) {
            let add = day => {
                if (!this.calendar_events[day]) {
                    this.$set(this.calendar_events, day, 0)
                }

                let num = this.calendar_events[day] + 1
                this.$set(this.calendar_events, day, num)
            }

            let del = day => {
                if (!this.calendar_events[day]) return
                this.calendar_events[day] -= 1
            }

            addArr.forEach(val => {
                add(val)
            })

            delArr.forEach((val, i, arr) => {
                del(val)
            })
        },

        // 添加事件
        addOneEvent () {
            // 如果没有在创建就创建
            if (this.createNewEvent) return
            
            if (!this.typeList.length) {
                this.$iziToast.warn({
                    title: '请先创建一个分类',
                    timeout: 3000
                })
                return
            }

            let nowTime = new Date()
            let insertData = {
                // 新建标志
                insert: true,
                title: '',
                complete: false,
                eventTypeID: this.typeList[ this.holdTypeIndex ].id,
                inner: '',
                stime: nowTime,
                etime: nowTime
            }

            // 锁定创建一个事件
            this.createNewEvent = true
            // 添加默认事件值
            this.events.unshift(insertData)

            // DOM 操作
            this.$nextTick(() => {
                this.holdEventIndex = 0
                this.showHoldEvent()
                this.$el.querySelector('#event-title').focus()
            })
        },

        // 更新完成情况
        updateCheck: function (index, evt) {
            this.editionEvtIndex = index
            this.events[index].complete = evt.target.checked

            this.saveInsertData()
        },

        // 如果新建的标题没有内容,我们就撤消
        blurTitle (evt) {
            // 如果没有写标题同时是在新建一条数据时
            if (this.createNewEvent) {
                if (!evt.target.value) {
                    // 撤消新数据
                    this.events.shift()
                    // 恢复可新加
                    this.createNewEvent = false

                    // 更新显示内容
                    this.$set(this, 'holdEvent', this.events[0])
                } else {
                    this.saveInsertData()
                }
            } else {
                if (!evt.target.value) {
                    this.holdEvent.title = evt.target.defaultValue
                } else {
                    this.saveInsertData()
                }
            }
        },

        focusEvt (evt) {
            if (!this.createNewEvent) {
                evt.target.defaultValue = this.holdEvent.title
            }
        },

        // 保存新加数据
        saveInsertData (callback) {
            let saveType = `todo_evt_add`
            let eventData = this.holdEvent
            let updateQ = Object.assign({}, {
                title: eventData.title,
                complete: eventData.complete,
                eventTypeID: eventData.eventTypeID,
                stime: eventData.stime,
                etime: eventData.etime
            })

            let query = `mutation { 
                todo_evt_add(
                    usr: "MY_ACCOUNT", 
                    data: ${JSON2Str(updateQ)}
                ) { success mes data }
            }`

            if ( eventData.id ) {
                query = `mutation {
                    todo_evt_update(
                        usr: "MY_ACCOUNT",
                        id: "${eventData.id}"
                        data: ${JSON2Str(updateQ)}
                    ) { success mes }
                }`
                saveType = 'todo_evt_update'
            }

            this.saveEventAjax({query}, data => {
                data = data.data[saveType]

                if (data.success) {
                    if (!eventData.id) {
                        // 删除新建标识
                        delete eventData.insert
                        // 更新 id
                        eventData.id = data.data
                        // 恢复可以新加功能
                        this.createNewEvent = false
                    }
                } else {
                    console.error(data)
                }

                if (callback) callback(data)
            }, err => {
                console.error(err)
            })
        },

        saveEventAjax (query, callback) {
            this.$axios.post('/api', query).then(callback)
        },

        // 右键功能
        quickSetEvent (index, evt) {
            let that = this
            let thisID = that.events[index].id

            let moveSubMenu = that.typeList.map((val, i) => {
                let isSelf = i === that.holdTypeIndex
                return {
                    title: val.name,
                    checked: isSelf,
                    disabled: isSelf,
                    evt: () => {
                        that.editionEvtIndex = index
                        let _event = that.events[index]

                        _event.eventTypeID = val.id

                        that.saveInsertData(function (data) {
                            data.save = JSON.parse(data.save)
                            // 如果移动成功,更新
                            if (data.save.ok && data.save.n) {
                                that.events.splice(index, 1)
                                this.$store.commit('setContextmenu', { show: false })
                            }
                        })
                    }
                }
            })

            let remove = () => {
                console.log(1)
                this.$axios.post('/api/', {
                    query: `mutation {
                        todo_evt_remove(
                            id: "${thisID}", 
                            usr: "MY_ACCOUNT"
                        ) { success mes }
                    }`
                }).then(data => {
                    data = data.data.todo_evt_remove
                    // 如果有删除数据
                    if (data.success) {
                        // 删除数据
                        that.events.splice(index, 1)
                        that.$iziToast.show({
                            title: data.mes,
                            timeout: 3000
                        })

                        // 更新日历
                        // that.updateCalendarEvent([], data.time[0].day.split(','))
                    } else {
                        that.$iziToast.error({
                            title: `删除失败`,
                            message: `原因:${data.mes}`
                        })
                    }
                }, err => {
                    console.error(err)
                })

                this.$store.commit('setContextmenu', { show: false })
            }

            // 生成菜单
            this.$store.commit('setContextmenu', {
                data: [
                    {
                        title: '设置',
                        children: moveSubMenu
                    },
                    {
                        type: 'separator'
                    },
                    {
                        title: '删除',
                        evt: remove
                    }
                ],
                evt
            })
        },

        /*
            时间选择
            @type [start|end] 开始或结束时间
            @evt 事件
        */
        changeEventDate: function (type, evt) {
            // 设置插件默认时间
            this.pickTimeDefVal = this.holdEvent[type]
            this.editionEvtIndex = this.holdEventIndex

            // 获取点击的位置信息
            let evtRect = evt.target.getBoundingClientRect()
            let top = evtRect.top

            // 250 浮动日历大小
            // 20 时间显示高度
            top = top + 250 + 20 > window.innerHeight
                ? window.innerHeight - 250 - 20
                : top + 20

            this.pickTimeRectInfo.top = top
            this.pickTimeRectInfo.left = evtRect.left

            // 输出点击时间的类型
            this.saveTimeType = type
            // 显示时间插件
            this.pickTimeShow = true
        },

        // 点击非时间选择区关闭时间选择层
        hideThisLayer (e) {
            if (e.target.matches('#fixed-date-mod')) {
                this.pickTimeShow = false
            }
        },

        // 得到用户选择的时间
        // @time [objetc] 时间组件返回的日历时间对象
        getUserDatePicker (time) {
            // 点击关闭时
            if (time.from === 'submit') {
                // 1. 取值
                let _i = this.holdEventIndex
                let thisEvent = this.events[_i]
                let newTime = new Date(time.year, time.month - 1, time.date)
                // 是否要移除
                let needRemove = false
                // select time
                let _ct = this.calendar_pickTime
                let selectTime = new Date(_ct.year, _ct.month - 1, _ct.date)

                // 2. 处理逻辑
                // 开始时间大于以前的结束时间
                if (this.saveTimeType === 'stime') {
                    if (newTime > thisEvent.etime) {
                        // 之前的结束时间成了开始时间
                        thisEvent.stime = thisEvent.etime
                        thisEvent.etime = newTime
                    } else {
                        thisEvent.stime = newTime
                    }

                    // 现在结束时间是否大于当前选择的时间
                    if (thisEvent.stime > selectTime) {
                        needRemove = true
                    }
                } else {
                    // 结束时间小于之前的开始时间
                    if (newTime < thisEvent.stime) {
                        // 之前的开始时间成了现在的结束时间
                        thisEvent.etime = thisEvent.stime
                        thisEvent.stime = newTime
                    } else {
                        thisEvent.etime = newTime
                    }

                    // 现在结束时间是否小于当前选择的时间
                    if (thisEvent.etime < selectTime) {
                        needRemove = true
                    }
                }

                thisEvent.stimeF = calendar.format('YY年MM月DD日', thisEvent.stime)
                thisEvent.etimeF = calendar.format('YY年MM月DD日', thisEvent.etime)

                // 保存时间
                this.saveInsertData()

                // 3. 处理dom显示
                if (needRemove) {
                    this.events.splice(_i, 1)
                }
                this.pickTimeShow = false
            }

            if (time.from === 'cancel') this.pickTimeShow = false
        },

        // 清空查询功能
        resetSearchKey (data) {
            // 恢复数据显示
            this.displayEvts = this.events
        },

        seeEvent (index) {
            this.holdEventIndex = index
        },

        helloTest (data) {
            console.warn(data)
        },

        filterDisplayEvts (key) {
            let data = []
            data = this.events.filter(data => {
                return data.title.toLocaleLowerCase().includes(key)
            })
            this.displayEvts = data
        },

        showHoldEvent () {
            let evt = this.events[this.holdEventIndex]

            this.selectedDate = {
                start: new Date(evt.stime),
                end: new Date(evt.etime)
            }
            this.holdEvent = evt
        },

        // 格式化时间
        minTimeFormat (time) {
            return calendar.format('YY年MM月DD日', time)
        },

        async getAllEvents (time) {
            let calendarTime = ''
            let QStime = '1989/12/6'
            let QEtime = ''
        
            // 获取当前选中类别
            let getFindType = this.typeList[ this.holdTypeIndex ].id
        
            if (time) {
                calendarTime = this.calendar_pickTime
                QStime = new Date(`${calendarTime.year}/${calendarTime.month}/${calendarTime.date}`)
                QEtime = new Date(QStime.setDate(QStime.getDate() + 1))
                // 恢复开始时间
                QStime.setDate(QStime.getDate() - 1)
            } else {
                QEtime = new Date(new Date().setFullYear(new Date().getFullYear() + 100))
            }
        
            let data = {
                query: `{ 
                    findTodoEventList(
                        account: "MY_ACCOUNT", 
                        types: "${getFindType}",
                        stime: "${QStime}",
                        etime: "${QEtime}"
                    ){id, eventTypeID, title, complete, ctime, mtime, ttime, stime, etime}}`
            }
        
            // 得到结果
            let result = await this.$axios.post('/api', data)

            result = result.data
        
            if (!result.findTodoEventList.length) {
                this.events = []
        
                this.eventsHelpBox = {
                    show: true,
                    mes: '小技巧: 你可以点击右上角的加号,自行添加哟!'
                }
                return
            }
        
            // 处理列表时间
            this.events = result.findTodoEventList
            this.holdEventIndex = 0            
        },

        // 日历时间选择时
        selectCalendar (val) {
            this.selectedDate = val
            this.holdEvent.stime = val.start
            this.holdEvent.etime = val.end
            this.saveInsertData()
        },

        exit () {
            this.$router.push({path: '/'})
            this['Main/removeAlive']('todolist')
        },

        setMainNav () {
            this['Main/setNav']({
                type: 'main',
                data: [
                    {
                        title: '计划',
                        children: [
                            {
                                title: '退出',
                                fun: this.exit
                            }
                        ]
                    },
                    {
                        title: '文件',
                        children: [
                            {
                                title: '新建事件',
                                fun: this.addOneEvent
                            },
                            {
                                title: '新建类别',
                                fun: this.addNewType
                            }
                        ]
                    }
                ]
            })
        }
    },
    destroyed: function() {
        console.log('sss')
    }
}


/*
    过滤日历,只找到与日历相同的
    -----------------------------------
    eg:
    [
        {
            "time": "2017-9",
            "day": "30"
        }
    ]
    => ['30']
*/
function filterTimeArr (arr, pickTime) {
    let result = []
    let calendarNowTime = null

    if (pickTime.year) {
        calendarNowTime = `${pickTime.year}-${pickTime.month}`
    } else {
        let d = new Date()
        calendarNowTime = `${d.getFullYear()}-${d.getMonth() + 1}`
    }

    if (arr) {
        result = arr.filter(val => {
            // 如果是和日历同月的就显示事件
            if (val.time === calendarNowTime) return val
        })

        result = result[0].day.split(',')
    }

    return result
}

// 将 json 转化成 graphql使用的格式
// {a:"ok",b:false} => `{a:"ok",b:false}`
function JSON2Str(obj) {
    let result = ''
    for (let key in obj) {
        let val = obj[key]
        if (typeof val === 'boolean') {
            result += `${key}:${val} `
        } else {
            result += `${key}:"${val}" `
        }
    }
    return `{${result}}`
}