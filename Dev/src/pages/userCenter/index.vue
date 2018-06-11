<template>
    <div class="upload-app">
        <form action="http://localhost:9085/upload" method="post" enctype="multipart/form-data">
            <p><input type="file" name="img" multiple></p>
            <p><input type="file" name="video"></p>
            <p><input type="text" name="name"></p>
            <p><input type="password" name="pswd"></p>
            <p><input type="submit"></p>
        </form>
    </div>
</template>

<style lang="less" scoped src="./layout.less"></style>
<script src="./main.js"></script>