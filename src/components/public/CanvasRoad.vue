<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { getCurrentLottery } from '@/util/cach';
import { queryRoadPic } from '@/api/interface';
import _TimerAdapter from '@/util/timerAdapter';
import { throttle } from '@/util/tools';

const { curLztData } = defineProps({
    curLztData: Array
});

const lztData = ref([]);
const gridSize = ref(20);
const width = ref(0);
const slotRef = ref('');
const viewRef = ref('');
const click = ref(0);
const scrollL = ref(0);
const clientX1 = ref(0);
const clientY1 = ref(0);
const timeId = ref(null);
let column = Array.from({ length: 80 }, () => Array(6).fill(''));

const rows = computed(() => {
    const maxPerColumn = 6;
    let x = 0;
    let y = 0;
    let turnAround = false;
    const replaceData = curLztData.map(item => item.split(','));
    const reverseData = replaceData.slice().reverse();

    const checkSafePlace = (myX, myY) => {
        if (column[myX][myY] === '') {
            return myX;
        }
        return checkSafePlace(myX + 1, myY);
    };

    const fill = newValue => {
        if (y === 0 && column[x][y] !== '') {
            x = checkSafePlace(x, y);
        }

        if (column[x][y] === '') {
            column[x][y] = newValue;
        }

        if (column[x][y + 1] === '' && column[x][y + 1] !== undefined && !turnAround) {
            y += 1;
            return;
        }
        x += 1;
        turnAround = true;
    };
    reverseData.forEach((cells, xIndex) => {
        turnAround = false;
        x = xIndex;
        y = 0;
        cells.forEach((cell, yIndex) => {
            fill(cell);
        });
    });

    let filteredArray = column.filter(array => {
        return array.some(element => element !== '');
    });
    filteredArray.push(['', '', '', '', '', ''], ['', '', '', '', '', '']);
    width.value = filteredArray.length * gridSize.value + 40;
    return filteredArray[0].map((col, index) => filteredArray.map(row => row[index])); // 转置数组
});

const mousedown = event => {
    scrollL.value = viewRef.value.scrollLeft;
    click.value = 1;
    clientX1.value = event.changedTouches[0].clientX;
    clientY1.value = event.changedTouches[0].clientY;
    clearInterval(timeId.value);
};
const mousemove = event => {
    console.log(click.value);
    // if (click.value) {
    viewRef.value.scrollLeft = viewRef.value.scrollWidth;
    lastX.value = event.changedTouches[0].clientX;
    // }
};

watch(
    () => curLztData,
    newValue => {
        console.log('newValue', newValue);
    }
);

onMounted(() => {
    // viewRef.value.addEventListener('touchstart', mousedown);
    // viewRef.value.addEventListener('touchmove', throttle(mousemove, 40));
    if (viewRef.value) {
        viewRef.value.scrollLeft = viewRef.value.scrollWidth;
    }
});
</script>

<template>
    <div class="ll-scrollbar">
        <div class="ll-scrollbar__view" ref="viewRef">
            <div class="ll-scrollbar__slot" ref="slotRef">
                <table class="table" :style="{ width: `${width}px` }">
                    <tbody>
                        <tr v-for="row in rows" :key="row">
                            <td v-for="cell in row" :key="cell" :class="{ blue: ['大', '单', '龙'].includes(cell), red: ['小', '双', '虎'].includes(cell) }">
                                {{ cell }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ll-scrollbar {
    position: relative;
    overflow: hidden;
    display: flex;
    display: block 9;
}
.ll-scrollbar:hover .ll-scrollbar__bar,
.ll-scrollbar:active .ll-scrollbar__bar,
.ll-scrollbar:focus .ll-scrollbar__bar {
    opacity: 1;
}
.ll-scrollbar__view {
    flex-grow: 1;
    overflow: scroll;
}
.ll-scrollbar__bar {
    position: absolute;
    user-select: none;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s ease-out;
}
.ll-scrollbar__bar.vertical {
    width: 8px;
    height: 100%;
    top: 0;
    right: 1px;
}
.ll-scrollbar__bar.horizontal {
    width: 100%;
    height: 8px;
    left: 0;
    bottom: 1px;
}
.ll-scrollbar__bar.horizontal .ll-scrollbar__thumb {
    height: 100%;
    width: 0;
}
.ll-scrollbar__bar .ll-scrollbar__thumb {
    user-select: none;
    cursor: pointer;
    background-color: #c1c1c1;
    border-radius: 4px;
}
.ll-scrollbar__bar .ll-scrollbar__thumb:hover {
    background-color: #a8a8a8;
}

._pic {
    width: 100%;
    height: calc(120 + 0.5 * 5);
    border: 0.5px solid #ccc;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.table {
    border-collapse: collapse;
    tr {
        width: 100%;
        height: 20px;
        border-bottom: 0.5px solid #e6e6e6;
        td {
            text-align: center;
            border-left: 0.5px solid #e6e6e6;
            font-size: 12px;
            height: 20px;
            width: 20px;
            padding: 0;
        }

        &:last-child {
            border: none;
        }

        .blue {
            color: #f24848;
        }

        .red {
            color: #40a1fb;
        }
    }
}
</style>
