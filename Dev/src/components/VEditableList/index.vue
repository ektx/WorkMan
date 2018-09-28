<template>
    <ul class="v-editable-lists">
        <li 
            v-for="(item, index) in iList" 
            :key="item.id"
            :class="item.classes"
            @click="choose(index)"
            @contextmenu="contextmenuEvt(index, item, $event)"
        >
            <input 
                type="text" 
                :value="item.label"
                :readonly="item.readonly"
                v-focus="!item.readonly"
                @keypress="editEvt($event)"
                @blur="blurEvt($event, item)"
            >
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
        contextmenu: Array
    },
    data () {
        return {
            current: {},
            iList: [],
            intEl: null
        }
    },
    watch: {
        current: {
            handler (val) {
                console.log('current:', val)

                let data = {}

                if (Object.keys(val).length) {
                   data = Object.assign({}, this.value, val)
                }

                this.$emit(
                    'input', 
                    data
                )
            },
            deep: true
        } 
    },
    mounted: function () {
        this.iList = this.list

        if (this.value) this.presetCurrent()
    },
    methods: {
        ...mapMutations(['setContextmenu']),
        // 确认
        editEvt (evt) {
            if (evt.which === 13 || evt.key === 'Enter') {
                let val = evt.target.value

                this.updateCurrent(val)
            }
        },

        blurEvt (evt, item) {
            if (item.id === this.current.id) {
                let val = evt.target.value

                this.updateCurrent(val)
            }
        },

        updateCurrent (label) {
            if (label) {
                Object.assign(this.current, {
                    readonly: true,
                    label
                })
            } else {
                this.current = {}
                this.iList.shift()
            }
        },

        contextmenuEvt (index, item, evt) {
            evt.preventDefault()

            this.contextmenu.forEach(val => {
                if (val.hasOwnProperty('evt')) {
                    let evt = val.evt

                    val.evt = null
                    val.evt = () => {
                        evt(item, index)
                        this.setContextmenu({show: false})
                    }
                }
            })

            this.setContextmenu({
                show: true,
                data: this.contextmenu,
                evt
            })
        },

        // 添加
        add () {
            if (this.current) this.current.classes = ''

            this.current = {
                id: Date.now(),
                label: '',
                readonly: false,
                classes: 'current'
            }

            this.iList.unshift( this.current )
        },

        /**
         * 删除列表对象
         * @param {Number} index 索引
         * @param {Object} item 删除对象
         */
        del (index, item) {
            this.iList.splice(index, 1)

            if (item.id == this.current.id) {
                this.current = {}
            }
        },

        rename (index, item, evt) {
            if (this.current && item.id !== this.current.id) {
                this.current.classes = ''
            }

            this.current = this.iList[index]
            Object.assign(this.current, {
                readonly: false,
                classes: 'current'
            })

            this.$nextTick(function () {
                evt.target.focus()
            })
        },

        // 预设当前内容
        presetCurrent () {
            for (let item of this.iList) {
                if (item.id === this.value.id) {
                    Object.assign(item, {
                        classes: 'current',
                        readonly: true
                    })

                    return this.current = item
                }
            }
        },

        choose (index) {
            if (this.current) this.current.classes = ''

            this.current = this.iList[index]
            this.current.classes = 'current'
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

        input {
            width: 100%;
            font-size: 14px;
            text-indent: 10px;
            color: #333;
            border: none;
            outline: none;
            background-color: transparent;
            cursor: pointer;
        }

        &:hover {
            background-color: rgba(255, 255, 255, .5);
        }

        &.current {
            background: #f65f54;

            input {
                color: #fff;
            }
        }

    }
}
</style>

