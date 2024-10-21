<script setup>
const props = defineProps({
    chTimes: Number,
    omTimes: Number,
    hotColdShow: Boolean,
    omitShow: Boolean,
    omColor: Number,
    chColor: Number
});
</script>

<template>
    <div v-if="hotColdShow" class="absolute hotCold" :class="{ coldBg: chColor === 2, hotBg: chColor === 1, normalBg: chColor === 0 }">{{ chTimes }}</div>
    <div v-if="omitShow" class="absolute omit" :class="{ coldText: omColor === 2, hotText: omColor === 1, normalText: omColor === 0 }">{{ omTimes }}</div>
</template>

<style lang="scss" scoped>
.hotCold {
    left: 0;
    top: 0;
    height: 12px;
    width: 14px;
    color: #fff;
    font-size: 10px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 4px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hotBg {
    background-color: #ff736a;
}

.coldBg {
    background-color: #6aafff;
}

.normalBg {
    background-color: #929aa7;
}

.omit {
    right: 0;
    top: 0;
    height: 12px;
    width: 14px;
    color: #fff;
    font-size: 10px;
    border-bottom-left-radius: 4px;
    line-height: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #d8dfeb;
    border-bottom: 1px solid #d8dfeb;
}

.hotText {
    color: #ff736a;
}

.coldText {
    color: #6aafff;
}

.normalText {
    color: #929aa7;
}
</style>
