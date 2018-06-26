<template>
    <div class="my-info-pass">
        <form action="">
            <VMacInput title="名称" v-model="name"/>
            <VMacInput title="字段" v-model="key"/>
            
            <Button @click="save" long>保存</Button>
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
            key: ''
        }
    },
    methods: {
        save () {
            console.log(this.name, this.key)
        }
    }
}
</script>
<style lang="less" scoped></style>
