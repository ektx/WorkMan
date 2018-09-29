<template>
    <VCol class="project-type-box" width="200px">
        <h3>项目类别</h3>
        <VEditableList 
            ref="list" 
            v-model="currentType"
            :list="list" 
            :contextmenu="contextmenu"
            @updated="updatedType"
        />
    </VCol>
</template>

<script>
export default {
    name: 'projectType',
    data () {
        return {
            // 类型列表
            list: [],
            // 当前类型
            currentType: {},

            contextmenu: [
                {
                    title: '重命令',
                    eventType: 'rename'
                }, 
                {
                    title: '删除',
                    evt: this.del
                },
                {
                    type: 'separator'
                },
                {
                    title: '新建列表',
                    evt: this.add
                }
            ]
        }
    },
    mounted () {
        this.$axios.post('/api', {
            query: `{findProjectType {id label}}`
        }).then(res => {
            console.log(res)

            this.list = res.data.findProjectType.map(val => {
                return {
                    ...val,
                    key: val.id
                }
            })
        })
    },
    methods: {
        updatedType (item) {
            switch (item._type) {
                case 'add':
                    console.log('去保存吧')
                    this.save(item)
                    break;
                case 'rename':
                    console.log('更新了名称了')
                    break;
            }
        },

        add () {
            this.$refs.list.add()
        },

        del (item, index) {
            console.log('del', item, index)
            this.list.splice(index, 1)
        },

        rename (item) {
            console.log('rename', item)
        },

        save (item) {
            this.$axios.post('/api', {
                query: `mutation addProjectType(
                    $label: String!
                ) { addProjectType(label: $label) }`,
                variables: item
            }).then(res => {
                console.log(res)
            })
        }

    }
}
</script>

<style lang="scss" scoped>
.project-type-box {
    background: #eee;

    h3 {
        padding: 5px 10px;
        font-size: 16px;
        font-weight: 400;
        color: #666;
    }
}
</style>
