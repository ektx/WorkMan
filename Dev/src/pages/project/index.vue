<template>
    <VRow class="project-page">
        <VCol class="aside-box" width="200px">
            
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
                        title: '新建事件',
                        fun: this.addOneEvent
                    },
                    {
                        title: '新建类别',
                        fun: this.addNewType
                    }]
                }]
            }
        }
    },
    mounted: function() {
        console.log('打开 项目')
        // [SYMBOL] 设置缓存应用
        this['Main/setToAlive'](this.PAGEINFO)
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()

    },
    activated: function () {
        console.log('进入 项目')
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()        
    },
    methods: {
        // 引入对主菜单的控制 设置缓存 移除缓存 功能 
        ...mapMutations(['Main/setNav', 'Main/setToAlive', 'Main/removeAlive']),

        // 退出时，移除缓存
        EXIT_APP () {
            this.$router.push({path: '/'})
            this['Main/removeAlive'](pageName)
        },

        // 设置主菜单内容
        SET_MAIN_NAV () {
            this['Main/setNav'](this.NAVS)
        },
    },
    destroyed: function() {
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

