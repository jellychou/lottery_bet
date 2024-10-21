<script setup>
import { usePlayHook } from '@/views/play/hooks.js';
import { defineEmits, ref, computed } from 'vue';
import NormalModal from '@/components/public/NormalModal.vue';
import useCommonStore from '@/store/modules/common';

const { hotColdShow, omitShow, onClickhotCold, onClickOmit } = usePlayHook();

const commonStore = useCommonStore();

const emit = defineEmits(['update:hotCold', 'update:omit']);
const memberSettings = computed(() => commonStore.memberSettings);

const contentHot = ref(`<div>指选择的期数内，号码或形态的出现次数。出现最多的用<span class="text-red-600">红色</span>显示，最少的用<span class="text-sky-600">蓝色</span>显示</div>`);
const contentLoss = ref(
    `<div>即当前遗漏，指该号码或形态，从上次开出至当前的间隔期数。同一位置，最大的遗漏数值用<span class="text-red-600">红色</span>显示；最小的用<span class="text-sky-600">蓝色</span>显示</div>`
);
const hotCold = ref(false);
const omit = ref(false);

const openHotCold = () => {
    if (!memberSettings.value.coldHotDesc) {
        hotCold.value = false;
    } else {
        if (!hotColdShow.value) {
            hotCold.value = true;
        }
    }
    emit('update:hotCold');
    onClickhotCold();
};

const openOmit = () => {
    if (!memberSettings.value.omitDesc) {
        omit.value = false;
    } else {
        if (!omitShow.value) {
            omit.value = true;
        }
    }
    emit('update:omit');
    onClickOmit();
};

const handleModal = () => {
    onClickhotCold();
    onClickOmit();
};

const closeModal = () => {
    hotCold.value = false;
    omit.value = false;
};
</script>

<template>
    <div class="hot-cold-omit flex items-center">
        <div :class="{ active: hotColdShow }" @click="openHotCold">冷热</div>
        <div class="ml-1" :class="{ active: omitShow }" @click="openOmit">遗漏</div>
    </div>
    <NormalModal :isOpenModal="hotCold" @update:isOpenModal="handleModal" @update:confirmModal="closeModal" title="冷热说明" :content="contentHot" :confirmBtn="true" :closeBtn="false" />
    <NormalModal :isOpenModal="omit" @update:isOpenModal="handleModal" @update:confirmModal="closeModal" title="遗漏说明" :content="contentLoss" :confirmBtn="true" :closeBtn="false" />
</template>

<style lang="scss" scoped>
.hot-cold-omit {
    div {
        height: 23px;
        font-size: 12px;
        line-height: 21px;
        padding: 0px 6px;
        color: #697281;
        border: 1px solid #d8dfeb;
        border-radius: 2px;
        &.active {
            border: 1px solid #0982fe;
            color: #0982fe;
        }
    }
}
</style>
