<script setup>
import { ref, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue';
import { formatWuxData } from '@/util/format';
import { drawTable, drawTable1, drawTable2, drawTable3, drawTable4, drawTable5, drawTable6 } from './canvas';
import { issueDisplay } from '@/util/tools';

const props = defineProps({
    resultHistory: Array,
    typeNumber: Number,
    issueTitle: String,
    trendTitle: Array
});

const issueRef = ref(null);
const canvasRef = ref(null);
const canvasRef1 = ref(null);
const canvasRef2 = ref(null);
const canvasRef3 = ref(null);
const canvasRef4 = ref(null);
const canvasRef5 = ref(null);
const canvasRef6 = ref(null);
const data = ref([]);
const tableHead = ref(null);
const tableBody = ref(null);

const syncScroll = target => event => {
    target.scrollTop = event.target.scrollTop;
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

    const newData = formatWuxData(props.resultHistory);
    const canvas = canvasRef.value;
    const canvas1 = canvasRef1.value;
    const canvas2 = canvasRef2.value;
    const canvas3 = canvasRef3.value;
    const canvas4 = canvasRef4.value;
    const canvas5 = canvasRef5.value;
    const canvas6 = canvasRef6.value;
    data.value = newData;
    drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    drawTable1(canvas1, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    drawTable2(canvas2, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    drawTable3(canvas3, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    drawTable4(canvas4, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    drawTable5(canvas5, newData, props.typeNumber, props.issueTitle, props.trendTitle);
    drawTable6(canvas6, newData, props.typeNumber, props.issueTitle, props.trendTitle);
});

const handleScroll = () => {
    const scrollLeft = tableBody.value.scrollLeft;

    tableHead.value.style.left = `-${scrollLeft}px`;
    const thElements = tableHead.value.querySelectorAll('th:nth-child(1)');
    const tdElements = tableBody.value.querySelectorAll('td:nth-child(1)');

    thElements.forEach(th => {
        th.style.left = `${scrollLeft}px`;
    });

    tdElements.forEach(td => {
        td.style.left = `${scrollLeft}px`;
    });
};

const getNotWinColor = (arr, index) => {
    const firstNegativeOneIndex = arr.findIndex(value => value === -1);
    if (firstNegativeOneIndex > index) {
        return true;
    }
};

watch(
    () => props.resultHistory,
    () => {
        const newData = formatWuxData(props.resultHistory);
        const canvas = canvasRef.value;
        const canvas1 = canvasRef1.value;
        const canvas2 = canvasRef2.value;
        const canvas3 = canvasRef3.value;
        const canvas4 = canvasRef4.value;
        const canvas5 = canvasRef5.value;
        const canvas6 = canvasRef6.value;
        data.value = newData;
        drawTable(canvas, newData, props.typeNumber, props.issueTitle, props.trendTitle);
        drawTable1(canvas1, newData, props.typeNumber, props.issueTitle, props.trendTitle);
        drawTable2(canvas2, newData, props.typeNumber, props.issueTitle, props.trendTitle);
        drawTable3(canvas3, newData, props.typeNumber, props.issueTitle, props.trendTitle);
        drawTable4(canvas4, newData, props.typeNumber, props.issueTitle, props.trendTitle);
        drawTable5(canvas5, newData, props.typeNumber, props.issueTitle, props.trendTitle);
        drawTable6(canvas6, newData, props.typeNumber, props.issueTitle, props.trendTitle);
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
    <table class="trend-table">
        <thead ref="tableHead">
            <tr>
                <th class="qihao"><span class="firstMenu">期号</span></th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">第一位红球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">第二位红球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">第三位红球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">第四位红球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">第五位红球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">第六位红球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
                <th class="yiwuxingHeader">
                    <span class="secondMenu">
                        <span class="secondMenu-first">蓝球五行走势</span>
                        <span class="secondMenu-second">
                            <i>金</i>
                            <i>木</i>
                            <i>水</i>
                            <i>火</i>
                            <i>土</i>
                        </span>
                    </span>
                </th>
            </tr>
        </thead>
        <tbody ref="tableBody" @scroll="handleScroll">
            <tr v-for="(item, index) in data.issue">
                <td class="qihao">
                    {{ item.slice(-5) }}
                </td>
                <td class="yiwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[0]['金'], index) }">
                        {{ data.trendField[0]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[0]['木'], index) }">
                        {{ data.trendField[0]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[0]['水'], index) }">
                        {{ data.trendField[0]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[0]['火'], index) }">
                        {{ data.trendField[0]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[0]['土'], index) }">
                        {{ data.trendField[0]['土'][index] }}
                    </span>
                </td>
                <td class="erwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[1]['金'], index) }">
                        {{ data.trendField[1]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[1]['木'], index) }">
                        {{ data.trendField[1]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[1]['水'], index) }">
                        {{ data.trendField[1]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[1]['火'], index) }">
                        {{ data.trendField[1]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[1]['土'], index) }">
                        {{ data.trendField[1]['土'][index] }}
                    </span>
                </td>
                <td class="sanwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[2]['金'], index) }">
                        {{ data.trendField[2]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[2]['木'], index) }">
                        {{ data.trendField[2]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[2]['水'], index) }">
                        {{ data.trendField[2]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[2]['火'], index) }">
                        {{ data.trendField[2]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[2]['土'], index) }">
                        {{ data.trendField[2]['土'][index] }}
                    </span>
                </td>
                <td class="siwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[3]['金'], index) }">
                        {{ data.trendField[3]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[3]['木'], index) }">
                        {{ data.trendField[3]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[3]['水'], index) }">
                        {{ data.trendField[3]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[3]['火'], index) }">
                        {{ data.trendField[3]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[3]['土'], index) }">
                        {{ data.trendField[3]['土'][index] }}
                    </span>
                </td>
                <td class="wuwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[4]['金'], index) }">
                        {{ data.trendField[4]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[4]['木'], index) }">
                        {{ data.trendField[4]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[4]['水'], index) }">
                        {{ data.trendField[4]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[4]['火'], index) }">
                        {{ data.trendField[4]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[4]['土'], index) }">
                        {{ data.trendField[4]['土'][index] }}
                    </span>
                </td>
                <td class="liuwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[5]['金'], index) }">
                        {{ data.trendField[5]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[5]['木'], index) }">
                        {{ data.trendField[5]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[5]['水'], index) }">
                        {{ data.trendField[5]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[5]['火'], index) }">
                        {{ data.trendField[5]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[5]['土'], index) }">
                        {{ data.trendField[5]['土'][index] }}
                    </span>
                </td>
                <td class="qiwuxing">
                    <span :class="{ notWin: getNotWinColor(data.trendField[6]['金'], index) }">
                        {{ data.trendField[6]['金'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[6]['木'], index) }">
                        {{ data.trendField[6]['木'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[6]['水'], index) }">
                        {{ data.trendField[6]['水'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[6]['火'], index) }">
                        {{ data.trendField[6]['火'][index] }}
                    </span>
                    <span :class="{ notWin: getNotWinColor(data.trendField[6]['土'], index) }">
                        {{ data.trendField[6]['土'][index] }}
                    </span>
                </td>
            </tr>
            <canvas class="canvasWidth" ref="canvasRef"></canvas>
            <canvas class="canvasWidth1" ref="canvasRef1"></canvas>
            <canvas class="canvasWidth2" ref="canvasRef2"></canvas>
            <canvas class="canvasWidth3" ref="canvasRef3"></canvas>
            <canvas class="canvasWidth4" ref="canvasRef4"></canvas>
            <canvas class="canvasWidth5" ref="canvasRef5"></canvas>
            <canvas class="canvasWidth6" ref="canvasRef6"></canvas>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
table {
    position: relative;
    height: calc(100dvh - 212px);
    background-color: #fff;
    overflow: hidden;
    border-collapse: collapse;
}

/*thead*/
thead {
    position: relative;
    display: block; /*seperates the header from the body allowing it to be positioned*/
    width: 100vh !important;
    overflow: visible;
}

thead th {
    background-color: #f5f5f5;
    min-width: 150px;
    height: 30px;
    font-weight: 400;
    font-size: 14px;
    color: #63666f;
    border-right: 1px solid #0000001a;
    border-bottom: 1px solid #0000001a;
    line-height: 30px;
    flex: 1;
}

thead th:nth-child(1) {
    /*first cell in the header*/
    position: relative;
    display: flex; /*seperates the first cell in the header from the header*/
    background-color: #fff;
    min-width: 100px;
    height: 60px;
    font-size: 14px;
    font-weight: 400;
    border-right: 1px solid #0000001a;
    border-bottom: none !important;
}

thead th:nth-child(odd) {
    background-color: #f5f5f5;
}

/*tbody*/
tbody {
    position: relative;
    display: block; /*seperates the tbody from the header*/
    width: 100vw;
    height: 100%;
    overflow: scroll;
    color: #63666f;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
}

tbody tr {
    display: flex;
    border-collapse: collapse;
}

tbody td {
    background-color: #fff;
    min-width: 150px;
    font-size: 12px;
    font-weight: 400;
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-right: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    border-collapse: collapse;
}

tbody tr td:nth-child(1) {
    /*the first cell in each tr*/
    position: relative;
    display: flex; /*seperates the first column from the tbody*/
    align-items: center;
    justify-content: center;
    height: 30px;
    min-width: 100px;
    background-color: #f5f5f5;
    font-size: 12px;
    font-weight: 400;
    border-right: 1px solid #0000001a;
    border-bottom: 1px solid #0000001a;
}

tbody tr:nth-child(odd) {
    td {
        background-color: #fff;
    }
}

tbody tr:nth-child(even) {
    td {
        background-color: #f5f5f5;
    }
}

.yiwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}

.erwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}
.sanwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}
.siwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}
.wuwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}
.liuwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}
.qiwuxing {
    flex: none;
    width: 150px;
    padding: 0;

    span {
        flex: 1;
        border-right: 1px solid #0000001a;
        text-align: center;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #0000001a;
        &:nth-child(5) {
            border-right: none;
        }
    }
}

.yiwuxingHeader {
    flex: none;
    width: 150px;
    height: 100%;
    padding: 0;

    .secondMenu {
        height: 60px;
        display: flex;
        flex-direction: column;

        span {
            height: 30px;
            line-height: 30px;
        }

        .secondMenu-first {
            display: block;
            border-bottom: 1px solid #e4e3e3;
        }

        .secondMenu-second {
            display: flex;

            i {
                font-size: 13px;
                flex: 1;
                border-right: 1px solid #e4e3e3;

                &:nth-child(5) {
                    border-right: none;
                }
            }
        }
    }
}

.qihao {
    width: 100px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: #f5f5f5;
}

.notWin {
    background-color: #e7e7e7;
}

.canvasWidth {
    position: absolute;
    top: -61px;
    left: 27px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}
.canvasWidth1 {
    position: absolute;
    top: -61px;
    left: 178px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}

.canvasWidth2 {
    position: absolute;
    top: -61px;
    left: 328px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}

.canvasWidth3 {
    position: absolute;
    top: -61px;
    left: 477px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}

.canvasWidth4 {
    position: absolute;
    top: -61px;
    left: 627px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}

.canvasWidth5 {
    position: absolute;
    top: -61px;
    left: 778px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}

.canvasWidth6 {
    position: absolute;
    top: -61px;
    left: 928px;
    bottom: 0;
    transform: scale(0.3);
    transform-origin: top left;
}
</style>
