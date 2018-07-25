import VMacInput from '@/components/VMacInput'
import userTable from '../userTable'

export default {
    name: 'userCenter-addUser',
    components: { VMacInput, userTable },
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
                    title: '邮箱',
                    key: 'email'
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
                }
            ],
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

            pageSize: 10,

            ajax: {
                add: {
                    url: '/api',
                    data: {
                        operationName: 'addUser',
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
                        )}`
                    }
                },
                update: {
                    url: '/api',
                    data: {
                        operationName: 'updateUserInfo',
                        query: `mutation updateUserInfo(
                            $account: String,
                            $email: String,
                            $power: String,
                            $character: String
                        ){updateUserInfo(
                            account: $account,
                            data: {
                                email: $email,
                                power: $power,
                                character: $character
                            }
                        )}`
                    }
                },
                delete: {
                    url: '/api',
                    data: {
                        operationName: 'deleteUser',
                        query: `mutation deleteUser(
                            $account: String!
                        ){deleteUser(
                            account: $account
                        )}`
                    }
                },
                init: {
                    url: '/api',
                    data: {
                        operationName: 'findAllUsers',
                        query: `query findAllUsers($pages: Int, $size: Int){findAllUsers (pages: $pages, size: $size) {success mes list{account name email pwd power character} total}}`,
                    }
                }
            }
        }
    },
    methods: {
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
        },

        event (data) {
            switch (data.type) {
                case 'init': 
                    data.cb({pages: 0, size: this.pageSize})
                    break;
                case 'add':
                    this.user = {}
                    break;
                case 'edit':
                    this.user = data.data.row
                    break;
            }
        }
    }
}