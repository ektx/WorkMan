<template>
    <div class="v-col" :style="colStyle">
        <slot></slot>
    </div>
</template>

<script>
import main from './main.js'

export default Object.assign({}, main, {name: 'VCol'})
</script>

<style lang="scss" scoped>
.v-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: auto;
}
</style>
