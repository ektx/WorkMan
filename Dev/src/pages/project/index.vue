<template>
    <VRow class="project-page">
        <VCol class="aside-box" width="200px">
            <h3>列表</h3>
           
            <VEditableList 
                ref="typelist" 
                v-model="currentType"
                :list="typeList" 
                :contextmenu="contextmenu"
                @updated="updatedType"
            />
            <p>{{typeList}}</p>
            {{currentType}}
        </VCol>
        <VCol class="project-list-box" width="300px">固定 200 px</VCol>
        <VCol class="project-content">
            
        </VCol>
    </VRow>
</template>

<script>
import { mapMutations } from 'vuex'
const pageName = 'Project'

export default {
    name: pageName,
    data () {
        return {
            PAGEINFO: {
                title: '项目',      // 标题
                cache: pageName,   // 名称
                path: '/project'   // 路径
            },
            NAVS: {
                type: 'main',
                data: [{
                    title: '项目',
                    children: [{
                        title: '退出',
                        fun: this.EXIT_APP
                    }]
                },
                {
                    title: '文件',
                    children: [{
                        title: '新建项目',
                        fun: this.addNewProject
                    },
                    {
                        title: '新建列表',
                        fun: this.addNewType
                    }]
                }]
            },
            // 类型列表
            typeList: [],
            // 当前类型
            currentType: {},

            contextmenu: [
                {
                    title: '重命令',
                    eventType: 'rename'
                }, {
                    title: '删除',
                    evt: this.delTypeItem
                }
            ]
        }
    },
    mounted () {
        console.log('打开 项目')
        // [SYMBOL] 设置缓存应用
        this.setToAlive(this.PAGEINFO)
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()

    },
    activated () {
        console.log('进入 项目')
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()        
    },
    watch: {
        currentType (val) {
            if (!val._type) return

            // this[val._type](val)
        }
    },
    methods: {
        // 引入对主菜单的控制 设置缓存 移除缓存 功能 
        ...mapMutations('Main', [
            'setNav',
            'setToAlive',
            'removeAlive'
        ]),
        ...mapMutations([
            'setContextmenu'
        ]),

        // 退出时，移除缓存
        EXIT_APP () {
            this.$router.push({path: '/'})
            this.removeAlive(pageName)
        },

        // 设置主菜单内容
        SET_MAIN_NAV () {
            this.setNav(this.NAVS)
        },

        addNewType () {
            this.$refs.typelist.add()
        },

        addNewProject () {
            console.log(this)
        },
        

        delTypeItem (item, index) {
            console.log('del', item, index)
            this.typeList.splice(index, 1)
        },

        renameTypeItem (item) {
            console.log('rename', item)
        },

        updatedType (item) {
            console.log('Updated:', item)

            switch (item._type) {
                case 'add':
                    console.log('去保存吧')
                    break;
                case 'rename':
                    console.log('更新了名称了')
                    break;
            }
        }

    },
    destroyed () {
        console.log('退出 项目')
    }
}
</script>

<style lang="scss" scoped>
.project-page {
    background: #f5f5f5;

    .aside-box {
        background: #eee;
    }

    .project-list-box {
        border-right: 1px solid #ededed;
    }

    .project-content {

    }
}
</style>

