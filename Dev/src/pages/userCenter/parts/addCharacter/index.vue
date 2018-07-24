<template>
    <div class="userCenter-addCharacter-mod">
        <userTable 
            ref="table"
            title="角色管理"
            :columns="columns"
            :pageSize="pageSize"
            :ajax="ajax"
            :ajaxData="character" 
            @event="event"
        >
            <Form slot="add" ref="form" :model="character" :rules="rule" :label-width="60">
                <FormItem label="名称" prop="label">
                    <Input autofocus v-model="character.label" placeholder="输入名称"/>
                </FormItem>
                <FormItem label="描述" prop="pass">
                    <Input type="textarea" v-model="character.description" placeholder="输入描述"/>
                </FormItem>
            </Form>
        </userTable>
    </div>
</template>

<script src="./main.js"></script>
<style lang="scss" scoped>
.userCenter-addCharacter-mod {
    width: 100%;
    padding: 1em 2em;
}
</style>
