<script setup>
const props = defineProps({
    text: String
});
</script>

<template>
    <div class="flex items-center justify-center flex-col mt-12">
        <img class="noDataImage" src="./assets/noData.png" />
        <div class="noDataText">{{ text }}</div>
    </div>
</template>

<style lang="scss" scoped>
.noDataImage {
    height: 110px;
    width: 110px;
}

.noDataText {
    color: #929aa7;
    font-size: 12px;
    margin-top: 8px;
}
</style>
