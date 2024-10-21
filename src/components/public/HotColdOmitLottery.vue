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
    <div v-if="hotColdShow || omitShow" class="absolute line"></div>
    <div v-if="omitShow" class="absolute omit" :class="{ coldText: omColor === 2, hotText: omColor === 1, normalText: omColor === 0 }">{{ omTimes }}</div>
</template>

<style lang="scss" scoped>
.hotCold {
    left: 4px;
    bottom: -16px;
    height: 12px;
    width: 14px;
    color: #fff;
    font-size: 12px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 4px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hotBg {
    color: #ff736a;
}

.coldBg {
    color: #6aafff;
}

.normalBg {
    color: #929aa7;
}

.omit {
    right: 2px;
    bottom: -16px;
    height: 12px;
    width: 14px;
    color: #fff;
    font-size: 12px;
    border-bottom-left-radius: 4px;
    line-height: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
}

.line {
    right: 19px;
    bottom: -14px;
    color: #929aa7;
    font-size: 12px;
    border-bottom-left-radius: 4px;
    line-height: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
        content: '';
        height: 8px;
        width: 1px;
        background-color: #929aa7;
    }
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
