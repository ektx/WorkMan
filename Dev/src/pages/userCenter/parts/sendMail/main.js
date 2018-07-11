import VMacInput from '@/components/VMacInput'

export default {
    name: 'userCenter-addUser',
    components: { VMacInput },
    data () {
        return {
            addUserInfo: {
                name: '',
                email: '',
                powerVal: '',
                character: '',
            },
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
                                }
                            }, '编辑')
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
                    { required: true, message: '不能为空', trigger: 'blur'},
                    { type: 'number', message: '请输入数字格式', trigger: 'blur', transform(value) {
                        return Number(value)
                    }}
                ]
            }
        }
    },
    mounted: function () {
        this.findAllUser()
    },
    methods: {
        save () {
            this.$Message.error('res.mes')
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
                res = res.data.findAllSendEmailUsers
                this.data = res.list
                this.total = res.total
            })
        },

        // 分页查询用户
        pageFindAllUser (page) {
            this.currentPage = page
            this.findAllUser()
        },

        // 保存
        saveData () {
            console.log(this.formValidate)

            this.$refs.form.validate(valid => {
                if (valid) {
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
                        if (res.success) {
                            this.$Message.success(res.mes)
                        } else {
                            this.$Message.error(res.errors[0].message)
                            this.loading = false
                            this.$nextTick(() => {
                                this.loading = true
                            })
                        }
                    })
                } else {
                    this.$Message.error('表单有错误！')

                    this.loading = false
                    this.$nextTick(() => {
                        this.loading = true
                    })
                }
            })
        }
    }
}