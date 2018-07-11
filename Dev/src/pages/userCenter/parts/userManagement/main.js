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

            // #### 分页 ####
            total: 0,
            currentPage: 1,
            pageSize: 10,

            // #### 添加用户弹层 ####
            showAddUserModal: false
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
                    query:`query findAllUser($pages: Int, $size: Int){findAllUsers (pages: $pages, size: $size) {success mes list{account name pwd power character} total}}`,
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

        // 分页查询用户
        pageFindAllUser (page) {
            this.currentPage = page
            this.findAllUser()
        },

        // 保存新用户
        saveNewUser () {
            console.log(this.addUserInfo)
        }
    }
}