<script setup>
import { ref, onMounted, watch } from 'vue';
import ChampionTrend from '../tabInner/championTrend/championTrend.vue';
import { formatChampionData } from '../../../../util/format';
import { drawTable } from './championTrend/canvas.js';

const props = defineProps({
    resultHistory: Array,
    typeNumber: Number,
    issueTitle: String,
    trendTitle: Array
});

const canvasRef = ref(null);

onMounted(() => {
    const newData = formatChampionData(props.resultHistory, false, 10);
    const canvas = canvasRef.value;
    drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
});

watch(
    () => props.resultHistory,
    () => {
        const newData = formatChampionData(props.resultHistory, false, 10);
        const canvas = canvasRef.value;
        drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    },
    { deep: true }
);
</script>

<template>
    <div class="canvasBox w-full">
        <canvas class="w-full" ref="canvasRef" width="1240"></canvas>
    </div>
</template>

<style lang="scss" scoped>
.canvasBox {
    height: calc(100dvh - 220px);
    overflow-y: scroll;
}
</style>
