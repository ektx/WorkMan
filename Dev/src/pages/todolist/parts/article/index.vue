<template>
    <quillEditor 
        :options="editorOption" 
        :content="content"
        @change="onChange($event)"
    />
</template>

<script src="./main.js"></script>
<style lang="less" src="./layout.less"></style>
