<template>
    <div class="upload-app">
        <Tabs>
            <TabPane label="个人信息">
                <MyInfo @save="updateInfo"/>
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
            
            <TabPane label="密码管理">
                <div class="my-info-pass">
                    <form action="">
                        <VMacInput title="密码" v-model="pwd"  type="password" @blur="verifyPwd" :help="pwdHelp"/>
                        <VMacInput title="确认密码" v-model="surepwd" type="password" @blur="verifyPwdSure" :help="surePwdHelp"/>
                        <Button @click="updatePwd" long>保存</Button>
                    </form>
                </div>
            </TabPane>
            
            <TabPane label="用户管理">
                <AddUser/>
            </TabPane>
            <TabPane label="角色管理">
                <AddCharacter/>
            </TabPane>
           
        </Tabs>
    </div>
</template>

<script src="./main.js"></script>
<style lang="less" scoped src="./layout.less"></style>