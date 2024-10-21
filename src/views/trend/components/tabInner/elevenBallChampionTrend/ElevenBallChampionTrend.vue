<script setup>
import { ref, onMounted, watch } from 'vue';
import { formatElevenBallChampionData } from '../../../../../util/format';
import { drawTable } from './canvas';

const props = defineProps({
    resultHistory: Array,
    typeNumber: Number,
    issueTitle: String,
    trendTitle: Array
});

const canvasRef = ref(null);

onMounted(() => {
    const newData = formatElevenBallChampionData(props.resultHistory);
    const canvas = canvasRef.value;
    drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
});

watch(
    () => props.resultHistory,
    () => {
        const newData = formatElevenBallChampionData(props.resultHistory);
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
