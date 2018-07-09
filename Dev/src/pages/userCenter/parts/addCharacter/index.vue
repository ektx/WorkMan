<template>
    <div class="my-info-pass">
        <form action="">
            <VMacInput title="角色名称" v-model="name"/>
            <Input v-model="description" type="textarea" placeholder="角色简介" />

            <div class="btn-box">
                <Button @click="save" long>保存</Button>
            </div>
        </form>
    </div>
</template>

<script>
import VMacInput from '@/components/VMacInput'

export default {
    name: 'userCenter-addCharacter',
    components: { VMacInput },
    data () {
        return {
            name: '',
            description: ''
        }
    },
    methods: {
        save () {
            console.log(this.name, this.description)
        }
    }
}
</script>
<style lang="less" scoped>
.btn-box {
    margin-top: 5em;
}
</style>
