<template>
    <VCol class="main">
        <h1>简单的混合示例</h1>
        <VCol class="demo-box">
            <VRow v-for="i in 5" class="test" :key="i">
                <VCol v-for="x in 5" :key="x">{{x}}</VCol>
            </VRow>
        </VCol>

        <h1>3列布局</h1>
        <VRow class="resizeable-box yellowgreen" height="600px">
            <VCol class="orange" style="max-width: 100px; min-width: 100px">固定 100 px</VCol>
            <VCol class="pink" height="200px" width="200px">固定 200 px</VCol>
            <VCol class="yellow">自动区域</VCol>
        </VRow>

        <br>

        <br>
    </VCol>
</template>

<style lang="scss" scoped>
.main {
    background: #f5f5f5;
}

.test {
    border: 3px solid red;
    background: #f5f5f5;
}

.demo-box {
    display: flex;
    min-width: 600px;
    max-width: 600px;
    min-height: 600px;
    max-height: 600px;
}
.resizeable-box {
    width: 600px;
    height: 600px;
    resize: horizontal;
}

.yellowgreen {
    background-color: yellowgreen;
}
.orange {
    background-color: orange;
}
.pink {
    background-color: pink;
}
.yellow {
    background-color: yellow
}
</style>

