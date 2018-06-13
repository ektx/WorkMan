<template>
    <div class="upload-app">
        {{ name }}
        <Tabs>
            <TabPane label="基础信息">
                <div class="my-info-form">
                    <VMacInput title="用户名" v-model="name" type="search"/>
                    <div class="row">
                        <span class="title">权限</span>
                        <span class="inner">
                            <Input placeholder="ss" />
                        </span>
                    </div>
                </div>
            </TabPane>

            <TabPane label="头像管理">
                <form action="http://localhost:9085/upload" method="post" enctype="multipart/form-data">
                    <p><input type="file" name="img" multiple></p>
                    <p><input type="file" name="video"></p>
                    <p><input type="text" name="name"></p>
                    <p><input type="password" name="pswd"></p>
                    <p><input type="submit"></p>
                </form>
            </TabPane>
            
            <TabPane label="密码管理">B</TabPane>
        </Tabs>
    </div>
</template>

<style lang="less" scoped src="./layout.less"></style>
<script src="./main.js"></script>