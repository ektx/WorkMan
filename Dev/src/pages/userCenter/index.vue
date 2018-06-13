<template>
    <div class="upload-app">
        <Tabs>
            <TabPane label="头像管理">
                <form action="http://localhost:9085/upload" method="post" enctype="multipart/form-data">
                    <p><input type="file" name="img" multiple></p>
                    <p><input type="file" name="video"></p>
                    <p><input type="text" name="name"></p>
                    <p><input type="password" name="pswd"></p>
                    <p><input type="submit"></p>
                </form>
            </TabPane>

            <TabPane label="基础信息">
                <div>
                    <MdInput />
                </div>
            </TabPane>
            <TabPane label="密码管理">B</TabPane>
        </Tabs>
    </div>
</template>

<style lang="less" scoped src="./layout.less"></style>
<script src="./main.js"></script>