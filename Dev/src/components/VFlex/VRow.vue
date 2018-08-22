<template>
    <div class="v-row" :style="colStyle">
        <slot></slot>
    </div>
</template>

<script>
import main from './main.js'



export default Object.assign({}, main, {name: 'VRow'})
</script>

<style lang="scss" scoped>
.v-row {
    flex: 1;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    overflow: auto;
}
</style>
