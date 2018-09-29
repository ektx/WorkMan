<template>
    <ul class="v-editable-lists">
        <li 
            v-for="(item, index) in iList" 
            :key="item.key"
            :class="item.classes"
            @click="choose(index)"
            @contextmenu="contextmenu(index, item, $event)"
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
export default {
    name: 'VEditableList',
    props: {
        // 用户给定的列表
        list: Array,
        // 默认选择对象
        value: {
            type: Object
        }
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
                let data = {}

                if (Object.keys(val).length) {
                   data = Object.assign({}, this.value, val)
                }

                this.$emit('input', data)
            },
            deep: true
        } 
    },
    mounted: function () {
        this.iList = this.list

        if (this.value) this.presetCurrent()
    },
    methods: {
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

                this.updateCurrent(val, true)
            }
        },

        updateCurrent (label, type) {
            console.log('update', type)
            if (label) {
                Object.assign(this.current, {
                    readonly: true,
                    label
                })

                if (type) this.$emit('enter', this.current)
            } else {
                this.current = {}
                this.iList.shift()
            }
        },

        contextmenu (index, item, evt) {
            evt.preventDefault()
            this.$emit('contextmenu', {index, item, evt})
        },

        // 添加
        add () {
            if (this.current) this.current.classes = ''

            this.current = {
                key: this.list.length,
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

            if (item.key == this.current.key) {
                this.current = {}
            }
        },

        rename (index, item, evt) {
            if (this.current && item.key !== this.current.key) {
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
                if (item.key === this.value.key) {
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
        font-size: 14px;

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

