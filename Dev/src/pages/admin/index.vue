<template>
    <section class="admin-page">
        <div v-if="show" class="set-admin-box">
            <header>
                <h1>WorkMan Admin</h1>
                <p>欢迎使用 WorkMan! 请设置你的系统管理员!</p>
            </header>

            <Form class="form-mod" ref="form" :model="admin" :rules="rulesVal">
                <FormItem label="邮箱" prop="email">
                    <Input v-model="admin.email" placeholder="请输入邮箱"/>
                </FormItem>
                <FormItem label="密码" prop="pass">
                    <Input type="password" v-model="admin.pass" placeholder="请输入密码"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="save">保存</Button>
                    <Button class="reset" @click="reset">重写</Button>
                </FormItem>
            </Form>
        </div>

        <div v-if="!show" class="display-admin-box">
            <header>
                <h1>WorkMan Admin</h1>
                <p>欢迎使用 WorkMan! 以下为系统管理员!</p>
            </header>
            <ul class="display-panel">
                <li v-for="item in list" :key="item.account">
                    <h3>{{item.account}} <span v-if="item.name">({{item.name}})</span></h3>
                    <p>{{item.email}}</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
export default {
    name: 'admin',
    data () {
        return {
            admin: {
                email: '',
                pass: ''
            },
            rulesVal: {
                email: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                ],
                pass: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            list: [],
            show: false
        }
    },
    mounted () {
        this.findAdminList()
    },
    methods: {
        findAdminList () {
            this.$axios({
                url: '/api/v1/findAdminList',
                method: 'get'
            }).then(res => {
                if (res.error || !res.list.length) {
                    this.show = true
                } else {
                    this.list = res.list
                }
            })
        },

        save () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.$axios({
                        url: '/api/v1/saveAdmin',
                        method: 'post',
                        data: this.admin
                    }).then(res => {
                        if (res.success) {
                            this.$Message.success(res.data)
                        } else {
                            this.$Message.error(res.data)
                        }
                    })
                } else {
                    this.$Message.error('请确认表单内容')
                }
            })
        },

        reset () {
            this.$refs.form.resetFields()
        }
    }
}
</script>

<style lang="scss" scoped>
.admin-page {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: rgba(255, 255, 255, .95);

    header {
        text-align: center;
    }

    h1 {
        font-weight: 400;
        color: #333;
    }

    .form-mod {
        margin: 2em 0;
        min-width: 340px;
    }

    .reset {
        margin-left: 10px;
    }

    .display-panel {
        width: 300px;
        margin: 60px 0 100px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 3px;
        overflow: hidden;

        li {
            padding: 5px 10px;
        }
    }
}

@supports (backdrop-filter: blur(5px)) {
    .admin-page {
        background: rgba(255, 255, 255, .8);
        backdrop-filter: blur(10px);
    }  
}
</style>

