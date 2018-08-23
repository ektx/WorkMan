<template>
    <VCol class="main">
        <h1>简单的混合示例</h1>
        <VCol class="demo-box">
            <VRow v-for="i in 5" class="test" :key="i">
                <VCol v-for="x in 5" :key="x">{{x}}</VCol>
            </VRow>
        </VCol>

        <h1>3列布局</h1>
        <VRow class="resizeable-box yellowgreen" height="600px">
            <VCol class="orange" style="max-width: 100px; min-width: 100px">固定 100 px</VCol>
            <VCol class="pink" height="200px" width="200px">固定 200 px</VCol>
            <VCol class="yellow">自动区域</VCol>
        </VRow>

        <br>

        <br>
    </VCol>
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
.main {
    background: #f5f5f5;
}

.test {
    border: 3px solid red;
    background: #f5f5f5;
}

.demo-box {
    display: flex;
    min-width: 600px;
    max-width: 600px;
    min-height: 600px;
    max-height: 600px;
}
.resizeable-box {
    width: 600px;
    height: 600px;
    resize: horizontal;
}

.yellowgreen {
    background-color: yellowgreen;
}
.orange {
    background-color: orange;
}
.pink {
    background-color: pink;
}
.yellow {
    background-color: yellow
}
</style>

