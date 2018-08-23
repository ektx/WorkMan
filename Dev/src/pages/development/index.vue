<template>
    <VRow class="main">
        <figure>
            <svg class="icon" viewBox="0 0 1024 1024">
                <path d="M904 176H120c-30.9 0-56 25.1-56 56v588c0 15.5 12.5 28 28 28s28-12.5 28-28v-84h784v84c0 15.5 12.5 28 28 28s28-12.5 28-28V232c0-30.9-25.1-56-56-56z m-210 56v112H540V232h154z m-210 0v112H330V232h154z m-364 0h154v112H120V232z m784 448H120V400h784v280zM750 344V232h154v112H750z" ></path>
                <path d="M264.7 471.5l112 168c5.4 8.1 14.3 12.5 23.3 12.5 5.4 0 10.8-1.5 15.5-4.7 12.9-8.6 16.4-26 7.8-38.8l-112-168c-8.6-12.9-26.1-16.3-38.8-7.8-12.9 8.6-16.4 26-7.8 38.8zM544.7 639.5c5.4 8.1 14.3 12.5 23.3 12.5 5.4 0 10.8-1.5 15.5-4.7 12.9-8.6 16.4-26 7.8-38.8l-112-168c-8.6-12.9-26.1-16.3-38.8-7.8-12.9 8.6-16.4 26-7.8 38.8l112 168zM712.7 639.5c5.4 8.1 14.3 12.5 23.3 12.5 5.4 0 10.8-1.5 15.5-4.7 12.9-8.6 16.4-26 7.8-38.8l-112-168c-8.7-12.9-26.1-16.3-38.8-7.8-12.9 8.6-16.4 26-7.8 38.8l112 168z"></path>
            </svg>
            <caption>建设中</caption>
        </figure>
    </VRow>
</template>

<script>
import { mapMutations } from 'vuex'
const pageName = 'Development'

export default {
    name: pageName,
    data () {
        return {
            PAGEINFO: {
                title: '开发者中心',      // 标题
                cache: pageName,   // 名称
                path: '/project'   // 路径
            },
            NAVS: {
                type: 'main',
                data: [{
                    title: '项目名称',
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
        // [SYMBOL] 设置缓存应用
        this['Main/setToAlive'](this.PAGEINFO)
        // [SYMBOL] 设置主菜单
        this.SET_MAIN_NAV()

    },
    activated: function () {
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
        console.log('退出 开发中心')
    }
}
</script>

<style lang="scss" scoped>
.main {
    background: #f5f5f5;
    justify-content: center;
    align-items: center;

    figure {
        svg {
            width: 300px;
            height: 300px;

            path {
                fill: #ddd;
            }
        }
        caption {
            display: block;
            width: 100%;
            font-size: 16px;
            color: #aaa;
        }
    }
}
</style>

