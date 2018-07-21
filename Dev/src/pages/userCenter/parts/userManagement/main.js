import VMacInput from '@/components/VMacInput'

export default {
    name: 'userCenter-addUser',
    components: { VMacInput },
    data () {
        return {
            user: {
                account: '',
                email: '',
                power: '',
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
            /* --- 角色远程查询 --- */
            selectLoading: false,
            characterList: [],
            columns: [
                {
                    title: '账号',
                    key: 'account'
                },
                {
                    title: '呢称',
                    key: 'name'
                },
                {
                    title: '密码',
                    key: 'pwd'
                },
                {
                    title: '权限',
                    key: 'power'
                },
                {
                    title: '角色',
                    key: 'character'
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
            rule: {
                account: [
                    {required: true, message: '用户名不能为空', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                    {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                ],
                power: [
                    {required: true, message: '权限不能为空', trigger: 'blur'}
                ],
                character: [
                    {required: true, message: '角色不能为空', trigger: 'blur'}
                ]
            },

            // #### 分页 ####
            total: 0,
            currentPage: 1,
            pageSize: 10,

            // #### 添加用户弹层 ####
            showAddUserModal: false,
            modalLoading: true
        }
    },
    mounted: function () {
        console.log('user management pages')
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
                    query: `query findAllUser($pages: Int, $size: Int){findAllUsers (pages: $pages, size: $size) {success mes list{account name pwd power character} total}}`,
                    variables: {
                        pages: this.currentPage -1,
                        size: this.pageSize
                    }
                }
            }).then(res => {
                console.log(res)
                res = res.data.findAllUsers
                if (res.success) {
                    this.data = res.list
                    this.total = res.total
                } else {
                    this.$Message.error(res.mes)
                }
            })
        },

        // 添加新用户
        addNewUser () {
            this.showAddUserModal = true
            this.user = {}
        },

        // 分页查询用户
        pageFindAllUser (page) {
            this.currentPage = page
            this.findAllUser()
        },

        // 保存新用户
        saveNewUser () {
            console.log(this.user)
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$axios({
                        url: '/api',
                        method: 'post',
                        data: {
                            query: `mutation addUser(
                                $account: String!,
                                $email: String,
                                $power: String!,
                                $character: String!
                            ){addUser(
                                account: $account,
                                email: $email,
                                power: $power,
                                character: $character
                            )}`,
                            variables: this.user
                        }
                    }).then(res => {
                        if ('errors' in res) {
                            this.holdModalAndShowErr(res.errors)
                        } else {
                            this.closeModalAndRefresh(res.data.addUser)
                            this.findAllUser()
                        }
                    })
                } else {
                    this.holdModalAndShowErr('请确认表单内容')
                }
            })
        },

        /**
         * 关闭弹层并刷新
         * @param {string} mes 提示信息
         */
        closeModalAndRefresh (mes) {
            this.showAddUserModal = false
            this.$Message.success(mes)
        },

        /**
         * 保持弹层并提示错误
         * @param {object|string} err 错误信息
         */
        holdModalAndShowErr (err) {
            err = typeof err === 'object' ? JSON.stringify(err) : err
            
            this.$Message.error(err)
            this.modalLoading = false
            this.$nextTick(() => {
                this.modalLoading = true
            })
        },

        searchCharacter (key) {
            if (key !== '') {
                this.selectLoading = true

                this.$axios({
                    url: '/api',
                    method: 'post',
                    data: {
                        query: `query findkeyCharacter($label: String, $size: Int) {
                            findkeyCharacter(label: $label, size: $size) {list {label description}}
                        }`,
                        variables: {
                            label: key,
                            size: 5
                        }
                    }
                }).then(res => {
                    this.selectLoading = false
                    if ('errors' in res) {
                        this.characterList = []
                    } else {
                        this.characterList = res.data.findkeyCharacter.list
                    }
                })
            } else {
                this.characterList = []
            }
        }
    }
}