<template>
    <div class="userCenter-setUsers-mod">
        <userTable 
            title="用户管理"
            :columns="columns"
            :pageSize="pageSize"
            :ajaxData="user" 
            :ajax="ajax"
            @event="event"
        >
            <Form slot="add" class="form-mod" ref="form" :model="user" :rules="rule" :label-width="60">
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
</style>
