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
                    <Form 
                        ref="passForm"
                        :model="pwd" 
                        :rules="pwdRule" 
                        :label-width="80"
                    >
                        <FormItem label="密码" prop="first">
                            <Input type="password" v-model="pwd.first" placeholder="请输入密码"/>
                        </FormItem>
                        <FormItem label="确认密码" prop="second">
                            <Input type="password" v-model="pwd.second" placeholder="请确认密码"/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="updatePwd">保存</Button>
                        </FormItem>
                    </Form>
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
            pwd: {
                first: '',
                second: ''
            },
            pwdRule: {
                first: [],
                second: [
                    {
                        validator: this.checkPwd,
                        trigger: 'blur'
                    }
                ]
            },
        }
    },
    methods: {
        checkPwd (rule, val, cb) {
            if (this.pwd.first !== this.pwd.second) {
                return cb(new Error('密码不同'))
            } else {
                cb()
            }
        },

        // 修改密码
        updatePwd () {
            console.log(this)
            this.$refs.passForm.validate(valid => {
                if (valid) {
                    this.$axios.post('/api', {
                        query: `mutation updateUserInfo(
                            $pwd: String
                        ){ updateUserInfo(data:{
                            pwd: $pwd
                        })}`,
                        variables: {pwd: this.pwd.first}
                    }).then(res => {
                        if ('errors' in res) {
                            this.$Message.error('密码修改失败')
                        } else {
                            this.$Message.success('密码修改成功')
                        }
                    })
                } else {
                    this.$Message.error('请先确认好表格内容')
                }
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
