<template>
    <div class="my-info-form">
        <form >
            <VMacInput title="账号" :value="userInfo.account" :help="nameHelp" readonly/>
            <VMacInput title="权限" v-model="userInfo.power"  @keyup="say($event)" readonly/>
            <VMacInput title="用户名" v-model="userInfo.name" :help="nameHelp"/>
            <VMacInput title="邮箱" v-model="userInfo.email"  @keyup="say($event)" required/>

            <Button @click="updateInfo" long>保存</Button>
        </form>
        
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import VMacInput from '@/components/VMacInput'

export default {
    name: 'userCenter-myInfo',
    components: { VMacInput },
    data () {
        return {
            nameHelp: {},
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
        /**
         * 测试功能
         * @param {object} evt 事件
         */
        say (evt) {
            console.log(evt)
            console.log(this.pwd)

            this.pwd = evt.target.value
        }
    }
}
</script>
<style lang="less" scoped></style>
