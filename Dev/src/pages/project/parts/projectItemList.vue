<template>
    <VCol class="project-list-box" width="300px">
        <VSearch
            classes="search-box"
        />
        <VRow class="project-item-list">
            <div v-for="item in list" :key="item.id" class="item-box">
                <h4>{{item.label}}</h4>
                <p>{{item[like]}}</p>
            </div>
        </VRow>
    </VCol>
</template>

<script>
export default {
    name: "ProjectItemList",
    data () {
        return {
            like: 'product',
            list: [
                {
                    id: 'project20181001',
                    label: '雪亮标品-可视指挥',
                    priority: 'S',
                    priorityVal: 999,
                    progress: .5,
                    onlineTime: '2018/9/30',
                    frontEndTime: '2018/9/26',
                    iterate: true,
                    product: [
                        {
                            name: '王迎新',
                            account: 1000
                        }
                    ],
                    design: [
                        {
                            label: '阮宗宇',
                            account: 1001
                        }
                    ],
                    frontEnd: [
                        {
                            label: '石家臣',
                            account: 1002
                        },
                        {
                            label: '焦胜志',
                            account: 1003
                        }
                    ],
                    javaDeveelopment: [
                        {
                            label: '王晓鹏',
                            account: 1004
                        },
                        {
                            label: '王继东',
                            account: 1005
                        }
                    ],
                    test: [
                        {
                            label: '周静雯',
                            account: 1006
                        }
                    ]
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.project-list-box {
    .search-box {
        padding: 5px 10px;
    }
    .project-item-list {
        background: yellowgreen;
    }
}
</style>
