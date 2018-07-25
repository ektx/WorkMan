<template>
    <div class="userCenter-setUsers-mod">
        <userTable 
            title="服务器邮件设置"
            :columns="columns"
            :pageSize="pageSize"
            :ajaxData="formValidate" 
            :ajax="ajax"
            @event="event"
        >
            <Form slot="add" ref="form" :model="formValidate" :rules="ruleValid" :label-width="60">
                <FormItem label="邮箱" prop="user">
                    <Input autofocus v-model="formValidate.user" placeholder="输入邮箱"/>
                </FormItem>
                <FormItem label="密码" prop="pass">
                    <Input type="password" v-model="formValidate.pass" placeholder="输入密码"/>
                </FormItem>
                <FormItem label="主机" prop="host">
                    <Input v-model="formValidate.host" placeholder="输入主机"/>
                </FormItem>
                <FormItem label="端口" prop="port">
                    <Input v-model="formValidate.port" placeholder="输入端口" number/>
                </FormItem>
            </Form>
        </userTable>
    </div>
</template>

<script src="./main.js"></script>
<style lang="less" scoped>
.userCenter-setUsers-mod {
    header {
        display: flex;
        margin: 10px 0;
        align-items: center;

        h1 {
            flex: 1;
            font-size: 18px;
            color: #333;
        }

    }

    .pages-mod {
        margin: 1em 0 0;
    }

}
.ivu-select {
    margin-bottom: 1.5em;
}
</style>
