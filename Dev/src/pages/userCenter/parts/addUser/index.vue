<template>
    <div class="my-info-pass">
        <form action="">
            <VMacInput title="用户名" v-model="name"/>
            <VMacInput title="邮箱" v-model="email"/>
            <Select v-model="powerVal">
                <Option v-for="item in power" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="character">
                <Option v-for="item in power" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button @click="save" long>保存</Button>
        </form>
    </div>
</template>

<script>
import VMacInput from '@/components/VMacInput'

export default {
    name: 'userCenter-addUser',
    components: { VMacInput },
    data () {
        return {
            name: '',
            email: '',
            powerVal: '',
            character: '',
            power: [
                {
                    label: '管理员',
                    value: 'admin'
                },
                {
                    label: '用户',
                    value: 'guest'
                }
            ],
            characterList: [
                {
                    label: '设计',
                    value: ''
                }
            ]
        }
    },
    methods: {
        save () {

        }
    }
}
</script>

<style lang="less" scoped>

</style>
