<template>
    <div class="userCenter-addCharacter-mod">
        <header>
            <h1>服务器邮件设置</h1>
            <Button type="primary" @click="showModalEvt(true)">添加</Button>
        </header>

        <Table :columns="columns" :data="data"></Table>

        <Modal
            v-model="showModal"
            :title="modalStatus ? '添加': '编辑'"
            @on-ok="save"
            ok-text="保存"
            :loading="loading"
        >
            <Form ref="form" :model="character" :rules="rule" :label-width="60">
                <FormItem label="名称" prop="label">
                    <Input autofocus v-model="character.label" placeholder="输入名称"/>
                </FormItem>
                <FormItem label="描述" prop="pass">
                    <Input type="textarea" v-model="character.description" placeholder="输入描述"/>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script src="./main.js"></script>
<style lang="scss" scoped>
.userCenter-addCharacter-mod {
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
