<template>
    <VRow class="project-page">
        <ProjectType ref="projectType" v-model="currentType"/>
        <ProjectItemList/>
        <VCol class="project-content">
            
        </VCol>
    </VRow>
</template>

<script>
import { mapMutations } from 'vuex'
import ProjectType from './parts/projectType.vue'
import ProjectItemList from './parts/projectItemList.vue'

const pageName = 'Project'

export default {
    name: pageName,
    components: {
        ProjectType,
        ProjectItemList
    },
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
            
            // 当前类型
            currentType: {},
            
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
            this.$refs.projectType.add()
        },

        addNewProject () {
            console.log(this)
        },

        

    },
    destroyed () {
        console.log('退出 项目')
    }
}
</script>

<style lang="scss" scoped>
.project-page {
    background: #f5f5f5;

    .project-list-box {
        border-right: 1px solid #ededed;
    }
}

</style>

