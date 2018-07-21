<template>
    <div class="userCenter-setUsers-mod">
        <header>
            <h1>用户管理</h1>
            <Button type="primary" @click="addNewUser">添加</Button>
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
            :loading="modalLoading"
        >
            <Form class="form-mod" ref="form" :model="user" :rules="rule" :label-width="60">
                <FormItem label="用户" prop="account">
                    <Input v-model="user.account" placeholder="用户名"/>
                </FormItem>        
                <FormItem label="邮箱" prop="email">
                    <Input v-model="user.email" placeholder="请输入邮箱"/>
                </FormItem>        
                <FormItem label="权限" prop="power">
                    <Select v-model="user.power" placeholder="请选择权限">
                        <Option v-for="item in power" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色" prop="character">
                    <Select 
                        filterable 
                        remote 
                        :loading="selectLoading" 
                        :remote-method="searchCharacter"
                        v-model="user.character" 
                        placeholder="请选择角色"
                    >
                        <Option v-for="item in characterList" :value="item.label" :label="item.label" :key="item.label">
                            <p>{{ item.label }}</p>
                            <p style="color: #ccc">{{ item.description }}</p>
                        </Option>
                    </Select>
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
</style>
