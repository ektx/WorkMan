<template>
    <section class="admin-page">
        <h1>WorkMan Admin</h1>

    </section>
</template>

<script>
export default {
    name: 'admin',
    data () {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.admin-page {
    width: 100vw;
    height: 100vh;
    padding: 2em;
    background: rgba(255, 255, 255, .95);

    h1 {
        font-weight: 400;
        color: #333;
    }
}

@supports (backdrop-filter: blur(5px)) {
    .admin-page {
        background: rgba(255, 255, 255, .8);
        backdrop-filter: blur(10px);
    }  
}
</style>

