<template>
    <div class="userCenter-setUsers-mod">
        <header>
            <h1>用户管理</h1>
            <Button type="primary" @click="showAddUserModal = !showAddUserModal">添加</Button>
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
            title="添加"
            @on-ok="saveNewUser"
            ok-text="保存"
            :loading="true"
        >
            <div class="form-mod">
                <form action="">
                    <VMacInput title="用户名" v-model="addUserInfo.name" required/>
                    <VMacInput title="邮箱" v-model="addUserInfo.email" type="email" required/>
                    <Select v-model="addUserInfo.powerVal" placeholder="请选择权限">
                        <Option v-for="item in power" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="addUserInfo.character" placeholder="请选择角色">
                        <Option v-for="item in characterList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </form>
            </div>
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
