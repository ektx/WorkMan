<template>
    <div class="table-mod">
        <header>
            <h1>{{title}}</h1>
            <Button type="primary" @click="add">添加</Button>
        </header>

        <Table :columns="icolumns" :data="tableData"></Table>
        
        <div class="pages-mod">
            <Page 
                v-show="pagesTotal" 
                :current="currentPage" 
                :total="pagesTotal" 
                :page-size="pageSize"
                @on-change="pageChange" 
                simple
            />
        </div>

        <Modal
            v-model="showModal"
            :title="evtType"
            @on-ok="modalOk"
            ok-text="保存"
            :loading="loading"
        >
            <slot name="add"></slot>
        </Modal>

        <Modal
            v-model="deleteModal"
            title="删除"
            ok-text="删除"
            @on-ok="ajaxEvt"
        >
            <p>你确认要删除吗？</p>
            <p>删除不可恢复</p>
        </Modal>
    </div>
</template>

<script>
export default {
    name: 'UserCenterTableTem',
    props: {
        title: {
            type: String,
            default: ''
        },
        // 表头
        columns: {
            type: Array,
            defalt: function () {
                return []
            }
        },
        ajax: Object,
        ajaxData: [Object],
        // 分页
        pageSize: Number
    },
    data () {
        return {
            evtType: '',
            showModal: false,
            tableData: [],
            currentPage: 1,
            pagesTotal: 0,
            // 弹层
            loading: true,
            icolumns: this.columns,
            deleteModal: false,

            variables: this.ajaxData
        }
    },
    watch: {
        columns: {
            handler: function(val) {

                this.icolumns = [...val, {
                    title: '设置',
                    key: 'set',
                    render: (h, params) => {
                        return h('div',[
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.edit(params)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.deleteModal = true
                                        this.variables = params.row
                                        this.evtType = '删除'
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }]
            },
            immediate: true
        },
        ajaxData: {
            handler (val) {
                this.variables = val
            },
            immediate: true
        }
    },
    mounted: function () {
        this.evtType = 'init'

        this.$emit('event', {
            type: 'init',
            cb: data => {
                this.variables = data
                this.ajaxEvt()
            }
        })
    },
    methods: {
        add () {
            this.evtType = '添加'
            this.showModal = true

            this.$emit('event', {
                type: 'add'
            })
        },

        edit (data) {
            this.evtType = '编辑'
            this.showModal = true

            this.$emit('event', {
                type: 'edit', 
                data
            })
        },

        pageChange (pages) {
            this.currentPage = pages
            this.evtType = 'init'
            this.variables = {pages: pages-1, size: this.pageSize}
            this.ajaxEvt()
        },

        modalOk () {
            this.$slots.add[0].componentInstance.validate(valid => {
                if (valid) {
                    this.ajaxEvt()
                } else {
                    this.holdModal('请确认表单信息')
                }
            })
            this.$emit('modal-ok', this.evtType)
        },

        ajaxEvt () {
            let type = ''

            switch (this.evtType) {
                case '添加': type = 'add'; break;
                case '编辑': type = 'update'; break;
                case '删除': type = 'delete'; break;
                case 'init': type = 'init'; break;
            }

            let option = this.ajax[type]
            if (!option) return this.holdModal('没有发现对应的请求')

            option.data.variables = this.variables

            if (!option.url) return this.holdModal('没有请求地址')

            option.method = option.method || 'post'

            this.$axios(option).then(res => {
                if ('errors' in res) {
                    this.holdModal(res.errors)
                } else {
                    let data = res.data[option.data.operationName]
                    
                    if (type === 'init') {
                        this.tableData = data.list
                        this.pagesTotal = data.total
                    } else {
                        this.closeModal(data)

                        // 更新表格
                        this.evtType = 'init'
                        this.variables = {
                            pages: this.currentPage -1, 
                            size: this.pageSize
                        }
                        this.ajaxEvt()
    
                        // 运行回调
                        if ('cb' in option) option.cb()
    
                        // 通用回调
                        if ('always' in this.ajax) this.ajax.always()
                    }
                }
            })
        },
        
        /**
         * 关闭弹层并刷新
         * @param {string} mes 提示信息
         */
        closeModal (mes) {
            this.showModal = false

            if (mes) this.$Message.success(mes)
        },

        /**
         * 保持弹层并提示错误
         * @param {object|string} err 错误信息
         */
        holdModal (err) {
            err = typeof err === 'object' ? JSON.stringify(err) : err
            
            this.$Message.error(err)
            this.loading = false
            this.$nextTick(() => {
                this.loading = true
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.table-mod {
    header {
        display: flex;
        margin: 10px 0;
        align-items: center;

        h1 {
            flex: 1;
            font-size: 18px;
            color: #333;
        }

    }

    .pages-mod {
        margin: 1em 0 0;
    }
}
</style>
