<template>
    <div class="userCenter-baseInfo-mod">
        <h1>基础信息</h1>
        <Tabs value="focus">
            <TabPane name="focus" label="个人信息">
                <MyInfo @save="updateInfo"/>
            </TabPane>

            <TabPane label="头像管理">
                <form action="http://localhost:9085/upload" method="post" enctype="multipart/form-data">
                    <p><input type="file" name="img" multiple></p>
                    <p><input type="file" name="video"></p>
                    <p><input type="text" name="name"></p>
                    <p><input type="password" name="pswd"></p>
                    <p><input type="submit"></p>
                </form>
            </TabPane>
            
            <TabPane label="密码管理">
                <div class="my-info-pass">
                    <form action="">
                        <VMacInput title="密码" v-model="pwd"  type="password" @blur="verifyPwd" :help="pwdHelp"/>
                        <VMacInput title="确认密码" v-model="surepwd" type="password" @blur="verifyPwdSure" :help="surePwdHelp"/>
                        <Button @click="updatePwd" long>保存</Button>
                    </form>
                </div>
            </TabPane>
            
        </Tabs> 
    </div>  
</template>

<script>
import VMacInput from '@/components/VMacInput'
import MyInfo from '../myInfo'
import AddCharacter from '../addCharacter'

export default {
    name: 'UserCenterBaseInfo',
     components: { 
        VMacInput,
        AddCharacter,
        MyInfo
     },
    data () {
        return {
            pwdHelp:{},
            surePwdHelp:{},
            pwd: '',
            pwdError: '',
            surepwd: '',
            surepwdError: '',
            pwdErr: ''
        }
    },
    methods: {
        // 验证密码
        verifyPwd () {
            if (this.pwd === ''){
                this.pwdHelp = {
                    mes: '此项不能为空',
                    status: 'error'
                }
            } else {
                this.pwdHelp = {
                    mes: '',
                    status: 'success'
                }
            }
        },
        // 验证密码是否相同
        verifyPwdSure () {
            if(this.surepwd === this.pwd){
                this.surePwdHelp = {
                    mes: '',
                    status: 'success'
                }
            }else{
                this.surePwdHelp = {
                    mes: '密码不一致',
                    status: 'error'
                }
            }
        },

        // 修改密码
        updatePwd () {
            this.$axios.post('/api', {
                query: `mutation {UserUpdate(data:{
                    pwd: "${this.pwd}"
                }){success mes}}`
            }).then(res => {
                if (res.data.UserUpdate.success)
                    this.$Message.success('保存成功')
            })
        },

        // 更新用户信息
        updateInfo (data, callback) {
            this.$axios.post('/api', {
                query: `mutation updateUserInfo(
                    $name: String,
                    $email: String
                ){updateUserInfo(data:{
                    name: $name,
                    email: $email
                })}`,
                variables: data
            }).then(res => {
                if ('errors' in res) {
                    this.$Message.success('保存失败')
                } else {
                    this.$Message.success('保存成功')
                    this['userCenter/setUserInfo']( this.userInfo )
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
.userCenter-baseInfo-mod {
    width: 100%;
    padding: 1em 2em;

    h1 {
        font-size: 18px;
        color: #333;
    }

    // 密码管理页面
    .my-info-pass{
        max-width: 400px;
        margin: 0 auto;
    }
}
.ivu-tabs {
    width: 100%;
    box-sizing: border-box;

    .ivu-tabs-bar {
        border-bottom-color: #dcdcdc;
    }
}
// 基础信息表单
.my-info-form {
    max-width: 400px;
    margin: 0 auto;
}
</style>
