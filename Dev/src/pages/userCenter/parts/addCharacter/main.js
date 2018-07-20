export default {
    name: 'userCenter-addCharacter',
    data () {
        return {
            columns: [
                {
                    title: '名称',
                    key: 'label'
                },
                {
                    title: '描述',
                    key: 'description'
                },
                {
                    title: '设置',
                    key: 'set',
                    width: 150,
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
                                        this.modalStatus = false
                                        this.showModal = true
                                        this.character = params.row
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
                                        this.character = params.row
                                        this.deleteCharacter()
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }
            ],
            data: [],
            showModal: false,
            loading: true,
            modalStatus: true, // true = 添加 false = 编辑
            character: {
                label: '',
                description: ''
            },
            rule: {
                label: [
                    {required: true, messagee: '名称不能为空', trigger: 'blur'}
                ],
                description: []
            },
            // 分页内容
            page: {
                pages: 1,
                size: 10,
                total: 0
            }
        }
    },
    mounted: function () {
        this.findAllCharacter()
    },
    methods: {
        saveEvt () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let operationName = this.modalStatus ? 'addCharacter' : 'updateCharacter'

                    this.$axios({
                        url: '/api',
                        method: 'post',
                        data: {
                            query: `mutation ${operationName}(
                                $label: String!,
                                $description: String
                            ){${operationName}(
                                label: $label,
                                description: $description
                            )}`,
                            variables: this.character
                        }
                    }).then(res => {
                        this.done(res, operationName)
                    })
                    
                } else {
                    this.holdModalAndShowErr('表单有错')
                }
            })
        },

        deleteCharacter () {
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `mutation deleteCharacter($label: String!){
                        deleteCharacter(label: $label)
                    }`,
                    variables: this.character
                }
            }).then(res => {
                this.done(res, 'deleteCharacter')
            })
        },

        showModalEvt (state) {
            this.modalStatus = state
            this.showModal = true
            this.character = {}
        },

        closeModalAndRefresh (mes) {
            this.showModal = false
            this.$Message.success(mes)
        },

        holdModalAndShowErr (err) {
            err = typeof err === 'object' ? JSON.stringify(err) : err
            
            this.$Message.error(err)
            this.loading = false
            this.$nextTick(() => {
                this.loading = true
            })
        },

        done (res, operationName) {
            if ('errors' in res) {
                this.holdModalAndShowErr(res.errors)
            } else {
                this.closeModalAndRefresh(res.data[operationName])
                this.findAllCharacter()
            }
        },

        findAllCharacter () {
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `query findAllCharacter($pages: Int, $size: Int) { 
                        findAllCharacter(pages: $pages, size: $size) {success mes list { label description} total}}`,
                    variables: { ...this.page, pages: this.page.pages - 1}
                }
            }).then(res => {
                if ('errors' in res) {
                    this.$Message.error(JSON.stringify(res.errors))
                } else {
                    this.data = res.data.findAllCharacter.list
                    this.page.total = res.data.findAllCharacter.total
                }
            })
        },

        pageChange (page) {
            this.page.pages = page
            this.findAllCharacter()
        }
    }
}