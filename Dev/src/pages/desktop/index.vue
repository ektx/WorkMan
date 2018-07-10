<template>
    <div class="workman-desktop">
        <header>
            <h1>WorkMan</h1>
        </header>
        <ul>
            <li v-for="(item, index) in navs" :key="index">
                <router-link :to="item.to">{{item.title}}</router-link>
            </li>
        </ul>
    </div>
</template>

<script src="./main.js"></script>
<style lang="less" scoped src="./layout.less"></style>
