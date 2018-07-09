<template>
    <div class="userCenter-setUsers-mod">
        <h1>用户管理</h1>
        
        <Table :columns="columns" :data="data"></Table>
        <div class="form-mod">
            <form action="">
                <VMacInput title="用户名" v-model="name"/>
                <VMacInput title="邮箱" v-model="email"/>
                <Select v-model="powerVal" placeholder="请选择权限">
                    <Option v-for="item in power" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="character" placeholder="请选择角色">
                    <Option v-for="item in characterList" :value="item" :key="item">{{ item }}</Option>
                </Select>
                <Button @click="findAllUser" long>保存</Button>
            </form>
        </div>
    </div>
</template>

<script src="./main.js"></script>
<style lang="less" scoped>
.userCenter-setUsers-mod {
    width: 100%;
    padding: 1em 2em;

    h1 {
        font-size: 18px;
        color: #333;
    }
}
.ivu-select {
    margin-bottom: 1.5em;
}
</style>
