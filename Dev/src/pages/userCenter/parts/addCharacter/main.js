import userTable from '@/modules/userTable'

export default {
    name: 'userCenter-addCharacter',
    components: { userTable },
    data () {
        return {
            // --- 表格 ---
            columns: [
                {
                    title: '名称',
                    key: 'label'
                },
                {
                    title: '描述',
                    key: 'description'
                }
            ],
            // --- 弹层 ---
            character: {
                label: '',
                description: ''
            },
            rule: {
                label: [
                    {required: true, message: '名称不能为空', trigger: 'blur'}
                ],
                description: []
            },
            // 分页内容
            pageSize: 10,
            // 删除确认
            // delConfirmationModal: false,
            ajax: {
                // 通用回调
                // always: () => {
                //     this.findAllCharacter()
                // },
                add: {
                    url: '/api',
                    method: 'post',
                    data: {
                        operationName: 'addCharacter',
                        query: `mutation addCharacter(
                            $label: String!,
                            $description: String
                        ){addCharacter(
                            label: $label,
                            description: $description
                        )}`
                    },
                    // 单个请求的独立回调
                    // cb: () => {}
                },
                update: {
                    url: '/api',
                    data: {
                        operationName: 'updateCharacter',
                        query: `mutation updateCharacter(
                            $label: String!,
                            $description: String
                        ){updateCharacter(
                            label: $label,
                            description: $description
                        )}`
                    }
                },
                delete: {
                    url: '/api',
                    data: {
                        operationName: 'deleteCharacter',
                        query: `mutation deleteCharacter($label: String!){
                            deleteCharacter(label: $label)
                        }`
                    }
                },
                init: {
                    url: '/api',
                    data: {
                        operationName: 'findAllCharacter',
                        query: `query findAllCharacter($pages: Int, $size: Int) { 
                            findAllCharacter(pages: $pages, size: $size) {success mes list { label description} total}}`
                    }
                }
            }
        }
    },
    methods: {
        event (data) {
            switch (data.type) {
                case 'init': 
                    data.cb({pages: 0, size: 10})
                    break;
                case 'add':
                    this.character = {}
                    break;
                case 'edit':
                    this.character = data.data.row
                    break;
            }
        }
    }
}