<template>
    <div class="userCenter-setUsers-mod">
        <header>
            <h1>服务器邮件设置</h1>
            <Button type="primary" @click="showModal()">添加</Button>
        </header>

        <Table :columns="columns" :data="data"></Table>

        <div class="pages-mod">
            <Page 
                v-show="total" 
                :current="currentPage" 
                :total="total" 
                :page-size="pageSize"
                @on-change="pageFindAllUser" 
                simple
            />
        </div>
        
        <Modal
            v-model="showAddUserModal"
            :title="modalStatus"
            @on-ok="saveData"
            ok-text="保存"
            :loading="loading"
        >
            <Form ref="form" :model="formValidate" :rules="ruleValid" :label-width="60">
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
        </Modal>
    </div>
</template>

<script src="./main.js"></script>
<style lang="less" scoped>
.userCenter-setUsers-mod {
    width: 100%;
    padding: 1em 2em;

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
