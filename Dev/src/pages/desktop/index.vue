<template>
    <div class="workman-desktop">
        <header>
            <h1>WorkMan</h1>
        </header>
        <ul>
            <li v-for="(item, index) in navs" :key="index">
                <template v-if="item.to">
                    <router-link :to="item.to">{{item.title}}</router-link>
                </template>
                <a v-else-if="item.href" :href="item.href" :target="item.target">{{item.title}}</a>
            </li>
        </ul>
    </div>
</template>

<script src="./main.js"></script>
<style lang="scss" scoped>
.workman-desktop {
    padding: 2em;
    background: rgba(255, 255, 255, .9);

    ul {
        a {
            font-size: 14px;
        }
    }

    @supports (backdrop-filter: blur(5px)) {
        background: rgba(255, 255, 255, .8);
        backdrop-filter: blur(5px);
    }
}
</style>
