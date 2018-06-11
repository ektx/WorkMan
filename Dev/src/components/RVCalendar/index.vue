<template>
    <section>
        <div v-if="picker">
            <DatePicker 
                v-on="$listeners"
                v-bind="$attrs"
                v-bind:value="value"
            ></DatePicker>
        </div>
        <div v-else>
            <Calendar v-on="$listeners" v-bind="$attrs" ></Calendar>
        </div>
    </section>
</template>

<script src="./main.js"></script>
<style src="./layout.scss" lang="scss"></style>
