import VMacInput from '@/components/VMacInput'

export default {
    name: 'userCenter-addUser',
    components: { VMacInput },
    data () {
        return {
            modalStatus: '添加',
            power: [
                {
                    label: '管理员',
                    value: 'admin'
                },
                {
                    label: '用户',
                    value: 'user'
                }
            ],
            characterList: [
                '设计师',
                '前端开发',
                '后端开发',
                '产品'
            ],
            columns: [
                {
                    title: '邮箱',
                    key: 'user'
                },
                {
                    title: '主机',
                    key: 'host'
                },
                {
                    title: '端口',
                    key: 'port'
                },
                {
                    title: '密码',
                    key: 'pass'
                },
                {
                    title: '设置',
                    key: 'set',
                    render: (h, params) => {
                        return h('div', [
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
                                        this.formValidate = {...params.row}
                                        this.modalStatus = '编辑'
                                        this.showAddUserModal = true
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
                                        this.remove(params)
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }
            ],
            data: [],

            // #### 分页 ####
            total: 0,
            currentPage: 1,
            pageSize: 10,

            // #### 添加用户弹层 ####
            showAddUserModal: false,
            loading: true,

            formValidate: {
                user: '',
                pass: '',
                host: '',
                port: ''
            },
            ruleValid: {
                user: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                ],
                pass: [
                    { required: true, message: '不能为空', trigger: 'blur'},
                ],
                host: [
                    { required: true, message: '不能为空', trigger: 'blur'},
                ],
                port: [
                    { validator: this.validatePort, required: true, trigger: 'blur'}
                ]
            }
        }
    },
    mounted: function () {
        this.findAllUser()
    },
    methods: {
        validatePort (rule, value, cb) {
            if (!value) {
                return cb(new Error('端口不能为空或0'))
            }

            if (!Number.isInteger(value)) {
                return cb(new Error('请输入数字'))
            } else {
                cb()
            }
        },

        save () {
            this.$Message.error('res.mes')
        },

        showModal () {
            this.showAddUserModal = true
            this.modalStatus = '添加'
            this.formValidate = {}
        },

        findAllUser () {
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `query findAllSendEmailUsers($pages: Int!, $size: Int!){findAllSendEmailUsers (pages: $pages, size: $size) {list{user pass host port} total}}`,
                    variables: {
                        pages: this.currentPage -1,
                        size: this.pageSize
                    }
                }
            }).then(res => {
                if ('errors' in res) {
                    console.log(res.errors)
                    this.$Message.error(JSON.stringify(res.errors))
                } else {
                    res = res.data.findAllSendEmailUsers
                    this.data = res.list
                    this.total = res.total
                }
            })
        },

        // 分页查询用户
        pageFindAllUser (page) {
            this.currentPage = page
            this.findAllUser()
        },

        // 保存
        saveData () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.modalStatus === '添加')
                        this.save()
                    else this.update()
                } else {
                    this.$Message.error('表单有错误！')

                    this.loading = false
                    this.$nextTick(() => {
                        this.loading = true
                    })
                }
            })
        },

        save () {
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `mutation saveSendMail(
                        $host: String!, 
                        $port: Int!, 
                        $user: String!, 
                        $pass: String!
                    ) {
                        saveSendMail(
                            user: $user,
                            pass: $pass,
                            host: $host,
                            port: $port
                        ){ success mes }
                    }`,
                    variables: this.formValidate
                }
            }).then(res => {
                if ('errors' in res) {
                    this.holdModalAndShowErr(res.errors)
                } else {
                    this.closeModalAndRefresh(res.data.saveSendMail.mes)
                }
            })
        },

        update () {
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `mutation updateSendMail(
                        $user: String!, 
                        $host: String, 
                        $port: Int, 
                        $pass: String
                    ) {
                        updateSendMail(
                            pass: $pass,
                            host: $host,
                            user: $user,
                            port: $port 
                        )
                    }`,
                    variables: this.formValidate
                }
            }).then(res => {
                if ('errors' in res) {
                    this.holdModalAndShowErr(res.errors)
                } else {
                    this.closeModalAndRefresh(res.data.updateSendMail)
                }
            })
        },

        remove (data) {
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `mutation removeSendMail(
                        $user: String!
                    ) {
                        removeSendMail(user: $user){success mes}
                    }`,
                    variables: {
                        user: data.row.user
                    }
                }
            }).then(res => {
                if ('errors' in res) {
                    this.$Message.error(res.error)
                } else {
                    this.$Message.success(res.data.removeSendMail.mes)
                    this.data.splice(data.index, 1)
                }
            })
        },

        closeModalAndRefresh (mes) {
            this.showAddUserModal = false
            this.$Message.success(mes)

            this.findAllUser()
        },

        holdModalAndShowErr (err) {
            this.$Message.error(err)
            this.loading = false
            this.$nextTick(() => {
                this.loading = true
            })
        }
    }
}