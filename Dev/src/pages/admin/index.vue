<template>
    <section class="admin-page">
        <header>
            <h1>WorkMan Admin</h1>
            <p>欢迎使用 WorkMan! 请设置你的系统管理员!</p>
        </header>

        <Form class="form-mod" ref="form" :model="admin" :rules="rulesVal">
            <FormItem label="邮箱" prop="email">
                <Input v-model="admin.email" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem label="密码" prop="pass">
                <Input v-model="admin.pass" placeholder="请输入密码"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
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
            }
        }
    },
    methods: {
        save () {
            console.log(this.admin)
        }
    }
}
</script>

<style lang="scss" scoped>
.admin-page {
    width: 100vw;
    height: 100vh;
    padding: 2em;
    background: rgba(255, 255, 255, .95);

    h1 {
        font-weight: 400;
        color: #333;
    }

    .form-mod {
        margin: 2em 0;
        max-width: 400px;
    }
}

@supports (backdrop-filter: blur(5px)) {
    .admin-page {
        background: rgba(255, 255, 255, .8);
        backdrop-filter: blur(10px);
    }  
}
</style>

