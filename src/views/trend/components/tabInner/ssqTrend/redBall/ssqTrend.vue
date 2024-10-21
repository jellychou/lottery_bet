<script setup>
import { ref, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue';
import { formatRedBallData } from '../../../../../../util/format';
import { drawTable } from './canvas';
import { issueDisplay } from '@/util/tools';

const props = defineProps({
    resultHistory: Array,
    typeNumber: Number,
    issueTitle: String,
    trendTitle: Array
});

const issueRef = ref(null);
const canvasRef = ref(null);
const data = ref([]);

const syncScroll = target => event => {
    target.scrollTop = event.target.scrollTop;
};

const calculateTotal = num => {
    return data.value.extra[num]?.total;
};

let issueToCanvas, canvasToIssue;

onMounted(() => {
    watchEffect(() => {
        const issueElement = issueRef.value;
        const canvasBoxElement = canvasRef.value?.parentNode;

        if (issueElement && canvasBoxElement) {
            issueToCanvas = syncScroll(canvasBoxElement);
            canvasToIssue = syncScroll(issueElement);
            issueElement.addEventListener('scroll', issueToCanvas);
            canvasBoxElement.addEventListener('scroll', canvasToIssue);
        }
    });

    const newData = formatRedBallData(props.resultHistory);
    data.value = newData;
    const canvas = canvasRef.value;
    drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
});

watch(
    () => props.resultHistory,
    () => {
        const newData = formatRedBallData(props.resultHistory);
        data.value = newData;
        const canvas = canvasRef.value;
        drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    },
    { deep: true }
);
onBeforeUnmount(() => {
    const issueElement = issueRef.value;
    const canvasBoxElement = canvasRef.value?.parentNode;
    if (issueElement && canvasBoxElement) {
        issueElement.removeEventListener('scroll', issueToCanvas);
        canvasBoxElement.removeEventListener('scroll', canvasToIssue);
    }
});
</script>

<template>
    <div class="grid-container">
        <div class="grid">
            <div class="grid-col-left grid-col--fixed-left">
                <div class="grid-item-left grid-item--header">
                    <p>期號</p>
                </div>
                <div class="grid-item-left" v-for="item in data.issue">
                    <p>{{ issueDisplay(item) }}</p>
                </div>
                <div class="grid-item-left blue">
                    <p>出现总次数</p>
                </div>
                <div class="grid-item-left blue">
                    <p>平均遗漏值</p>
                </div>
                <div class="grid-item-left blue">
                    <p>最大遗漏值</p>
                </div>
                <div class="grid-item-left blue">
                    <p>最大连出值</p>
                </div>
            </div>
            <div class="flex">
                <div class="grid-col" v-for="num in 33">
                    <div class="grid-item grid-item--header">
                        <p>{{ num }}</p>
                    </div>
                    <div class="grid-item" v-for="(item, index) in data.issue">
                        <p>{{ data.trendField[num][index] }}</p>
                    </div>
                    <div v-if="data.extra" class="grid-item">
                        <p>{{ data.extra[num]?.total }}</p>
                    </div>
                    <div v-if="data.extra" class="grid-item">
                        <p>{{ data.extra[num]?.averageMissing }}</p>
                    </div>
                    <div v-if="data.extra" class="grid-item">
                        <p>{{ data.extra[num]?.maxMissing }}</p>
                    </div>
                    <div v-if="data.extra" class="grid-item">
                        <p>{{ data.extra[num]?.maxContinuous }}</p>
                    </div>
                </div>
                <canvas class="canvasWidth" ref="canvasRef"></canvas>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grid-container {
    display: grid; /* This is a (hacky) way to make the .grid element size to fit its content */
    overflow: auto;
    height: calc(100dvh - 217px);
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
}
.grid {
    display: flex;
    flex-wrap: nowrap;
}
.grid-col {
    width: 30px;
}

.grid-col-left {
    width: 80px;
}

.grid-item--header {
    height: 50px;
    width: 80px;
    position: sticky;
    position: -webkit-sticky;
    background-color: #f5f5f5;
    top: 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #63666f;
    z-index: 10;
}

.grid-col--fixed-left {
    position: sticky;
    left: 0;
    z-index: 9998;
    background: white;
}
.grid-col--fixed-right {
    position: sticky;
    right: 0;
    z-index: 9998;
    background: white;
}

.grid-item {
    width: 30px;
    height: 30px;
    font-size: 12px;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #63666f;
    background-color: #fff;
    &:nth-child(odd) {
        background-color: #f5f5f5;
    }
}

.grid-item-left {
    width: 80px;
    height: 30px;
    font-size: 12px;
    border-bottom: 1px solid rgba(185, 117, 117, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #63666f;
    background-color: #fff;
    &:nth-child(odd) {
        background-color: #f5f5f5;
    }
}

.blue {
    color: #1e8ef5;
}

.canvasWidth {
    position: absolute;
    left: -18px;
    top: -35px;
    width: 1088px;
}
</style>
