import userTable from '../userTable'

export default {
    name: 'userCenter-addUser',
    components: { userTable },
    data () {
        return {
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
                }
            ],
            pageSize: 10,
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
            },
            ajax: {
                add: {
                    url: '/api',
                    data: {
                        operationName: 'saveSendMail',
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
                        }`
                    }
                },
                update: {
                    url: '/api',
                    data: {
                        operationName: 'updateSendMail',
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
                        }`
                    }
                },
                delete: {
                    url: '/api',
                    data: {
                        operationName: 'removeSendMail',
                        query: `mutation removeSendMail(
                            $user: String!
                        ) {
                            removeSendMail(user: $user){success mes}
                        }`
                    }
                },
                init: {
                    url: '/api',
                    data: {
                        operationName: 'findAllSendEmailUsers',
                        query: `query findAllSendEmailUsers($pages: Int!, $size: Int!){findAllSendEmailUsers (pages: $pages, size: $size) {list{user pass host port} total}}`
                    }
                }
            }
        }
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

        event (data) {
            switch (data.type) {
                case 'init': 
                    data.cb({pages: 0, size: 10})
                    break;
                case 'add':
                    this.formValidate = {}
                    break;
                case 'edit':
                    this.formValidate = data.data.row
                    break;
            }
        }
    }
}