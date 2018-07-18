export default {
    name: 'userCenter-addCharacter',
    data () {
        return {
            name: '',
            description: '',
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
                                        this.modalStatus = false
                                        console.log(params)
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
                                        console.log('remove')
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
            rule: {}
        }
    },
    methods: {
        save () {
            console.log(this.name, this.description)
            this.$axios({
                url: '/api',
                method: 'post',
                data: {
                    query: `mutation addCharacter(
                        $label: String!,
                        $description: String
                    ){addCharacter(
                        label: $label,
                        description: $description
                    )}`,
                    variables: this.character
                }
            }).then(res => {
                console.log(res)
                if ('errors' in res) {
                    this.holdModalAndShowErr(res.errors)
                } else {
                    this.closeModalAndRefresh(res.data.addCharacter)
                }
            })
        },

        showModalEvt (state) {
            this.modalStatus = state
            this.showModal = true
        },

        closeModalAndRefresh (mes) {
            this.showModal = false
            this.$Message.success(mes)
        },

        holdModalAndShowErr (err) {
            this.$Message.error(JSON.stringify(err))
            this.loading = false
            this.$nextTick(() => {
                this.loading = true
            })
        }
    }
}