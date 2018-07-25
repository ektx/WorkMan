<template>
    <div class="my-info-form">
        <Form :label-width="80" :model="userInfo" :rules="rules">
            <FormItem label="账号" prop="account">
                <Input v-model="userInfo.account" disabled />
            </FormItem>
            <FormItem label="权限" prop="power">
                <Input v-model="userInfo.power" disabled />
            </FormItem>
            <FormItem label="用户名" prop="name">
                <Input v-model="userInfo.name" />
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <Input v-model="userInfo.email" />
            </FormItem>
            <FormItem>
                <Button @click="updateInfo" long>保存</Button>
            </FormItem>
        </Form>
        
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
    name: 'userCenter-myInfo',
    data () {
        return {
            nameHelp: {},
            rules: {
                account: [],
                power: [],
                email: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    },
                    {
                        type: 'email',
                        trigger: 'blur',
                        message: '邮箱格式不正确'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState({
            userInfo: state => {
                return state.userCenter.user
            }
        })
    },
    methods: {
        ...mapMutations(['Main/setNav', 'Main/setToAlive', 'Main/removeAlive', 'userCenter/setUserInfo']),

        // 更新用户信息
        updateInfo () {
            this.$emit('save', {
                name: this.userInfo.name,
                email: this.userInfo.email
            })
        },
    }
}
</script>
<style lang="less" scoped></style>
