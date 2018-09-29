<template>
    <ul class="v-editable-lists">
        <li 
            v-for="(item, index) in iList" 
            :key="item.key"
            :class="item.classes"
            @click="choose(index)"
            @contextmenu="contextmenuEvt(index, item, $event)"
        >
            <input 
                type="text" 
                :value="item.label"
                v-if="!item.readonly"
                v-focus="!item.readonly"
                @keypress="editEvt($event)"
                @blur="blurEvt($event, item)"
            >
            <span v-else>{{item.label}}</span>
        </li>
    </ul>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'VEditableList',
    props: {
        // 用户给定的列表
        list: Array,
        // 默认选择对象
        value: {
            type: Object
        },
        // 右键菜单内容设置
        contextmenu: Array
    },
    data () {
        return {
            current: {},
            iList: [],
            intEl: null,
            formatContextmenu: []
        }
    },
    watch: {
        current: {
            handler (val, old) {
                if (old.classes) old.classes = []
                val.classes = ['current']

                let data = {}

                if (Object.keys(val).length) {
                   data = Object.assign({}, this.value, val)
                }

                this.$emit('input', data)
            },
        },
        list (val) {
            this.iList = val.map(val => {
                return {
                    ...val,
                    readonly: true,
                    classes: []
                }
            })
        }
    },
    methods: {
        ...mapMutations(['setContextmenu']),
        // 确认
        editEvt (evt) {
            if (evt.which === 13 || evt.key === 'Enter') {
                let val = evt.target.value

                this.updateCurrent(val, false)
            }
        },

        blurEvt (evt, item) {
            if (item.key === this.current.key) {
                let val = evt.target.value

                if (val.trim()) {
                    this.updateCurrent(val, true)
                } else {
                    val = this.current.label
                    this.updateCurrent(val, false)
                }

            }
        },

        updateCurrent (label, type) {
            if (label) {
                Object.assign(this.current, {
                    readonly: true,
                    label
                })

                if (type) {
                    this.$emit('updated', this.current)
                    this.$emit('input', this.current)
                }
            } else {
                this.current = {}
                this.iList.shift()
            }
        },

        contextmenuEvt (index, item, evt) {
            evt.preventDefault()

            // 对右键事件扩展
            this.contextmenu.forEach(val => {
                if (!val.hasOwnProperty('oldEvt')) {
                    val.oldEvt = val.evt
                }

                if (val.eventType) {
                    val.evt = () => {
                        this[val.eventType](index, item)
                        this.setContextmenu({show: false})
                    } 
                } else {
                    val.evt = () => {
                        val.evt = val.oldEvt(item, index)
                        this.setContextmenu({show: false})
                    }
                }

            })

            // 显示菜单
            this.setContextmenu({show: true, data: this.contextmenu, evt})
        },

        // 添加
        add () {
            this.current = {
                key: Date.now(),
                label: '',
                readonly: false,
                classes: 'current',
                _type: 'add'
            }

            this.iList.unshift( this.current )
        },

        rename (index, item, cb) {
            this.current = this.iList[index]
            Object.assign(this.current, {
                readonly: false,
                classes: 'current',
                _type: 'rename'
            })
        },

        choose (index) {
            this.current = this.iList[index]
        }
    }
}
</script>

<style lang="scss" scoped>
.v-editable-lists {
    height: 100%;
    width: 100%;
    overflow: auto;

    li {
        width: 100%;
        line-height: 28px;
        font-size: 14px;
        cursor: pointer;

        input {
            width: 100%;
            text-indent: 10px;
            color: #333;
            border: none;
            outline: none;
            background-color: transparent;
            cursor: pointer;
        }

        span {
            display: block;
            padding: 0 10px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        &:hover {
            background-color: rgba(255, 255, 255, .5);
        }

        &.current {
            background: #f65f54;

            input,span {
                color: #fff;
            }
        }

    }
}
</style>

