<template>
    <VCol class="project-type-box" width="200px">
        <h3>项目类别</h3>
        <VEditableList 
            ref="list" 
            v-model="current"
            :list="list" 
            :contextmenu="contextmenu"
            @updated="updatedType"
        />

        <Modal
            v-model="show"
            title="删除"
            @on-ok="confirmDel"
        >
            <h3>你确认要删除分类及其内容吗？</h3>
            <p>删除后不可恢复！</p>
        </Modal>
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
            current: {},
            // 删除提示层
            show: false,
            // 删除对象
            delItem: null,

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
            // 为对象添加 key 
            this.list = res.data.findProjectType.map(val => {
                return {
                    ...val,
                    key: val.id
                }
            })
        })
    },
    watch: {
        current (val) {
            this.$emit('input', val)
        }
    },
    methods: {
        updatedType (item) {
            switch (item._type) {
                case 'add':
                    this.save(item)
                    break;
                case 'rename':
                    this.update(item)
                    break;
            }
        },

        add () {
            this.$refs.list.add()
        },

        del (item, index) {
            this.show = true
            this.delItem = {item, index}
        },

        confirmDel () {
            this.$axios.post('/api', {
                query: `mutation removeProjectType(
                    $id: String!
                ) {removeProjectType(id: $id)}`,
                variables: this.delItem.item
            }).then(res => {
                if (res.errors) {
                    this.$Message.error('删除失败')
                } else {
                    this.list.splice(this.delItem.index, 1)
                    this.$Message.success('删除成功')
                }

            })
        },

        save (item) {
            this.$axios.post('/api', {
                query: `mutation addProjectType(
                    $label: String!
                ) { addProjectType(label: $label) }`,
                variables: item
            }).then(res => {
                // 添加上 ID 
                Object.assign(item, {id: res.data.addProjectType})
                // 更新最新的列表，确保修改与删除可行
                this.list.unshift(item)
                this.$Message.success('添加成功')
            })
        },

        update (item) {
            this.$axios.post('/api', {
                query: `mutation updateProjectType(
                    $label: String!,
                    $id: String!
                ) {updateProjectType(label: $label, id: $id)}`,
                variables: item
            }).then(res => {
                this.$Message.success('更新成功')
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
        color: #777;
    }
}
</style>
