<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { session } from '@/util/storage';
import { getSiteCode, getToken } from '@/util/cach';
import { issueDisplay, throttle } from '@/util/tools';

const props = defineProps({
    data: {
        type: Array,
        default: []
    },
    isMore: Boolean,
    imageType: {
        type: String,
        default: 'string'
    },
    active: Number,
    correctValue: {
        type: String,
        default: ''
    }
});

const { t, locale } = useI18n();

const width = ref(0);
const gridSize = ref(20);
const curLztData = ref([]);
const slotRef = ref('');
const viewRef = ref('');

const getRows = value => {
    const column = Array.from({ length: 80 }, () => Array(6).fill(''));
    const maxPerColumn = 6;
    let x = 0;
    let y = 0;
    let result = '';
    let turnAround = false;
    const reverseData = value
        .map(item => item.split(','))
        .slice()
        .reverse();

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
            if (!isNaN(cell) && typeof cell === 'string') {
                if (Number(cell) > 10) {
                    result = '大';
                } else {
                    result = '小';
                }
            } else {
                result = ['大', '双', '龙', '质', '小', '单', '虎', '合', '和', 'big', 'small'].find(text => cell.includes(text));
            }
            fill(result === undefined ? '' : result);
        });
    });

    let filteredArray = column.filter(array => {
        return array.some(element => element !== '');
    });
    if (props.isMore) {
        filteredArray.push(['', '', '', '', '', ''], ['', '', '', '', '', '']);
    }

    if (filteredArray.length <= 18) {
        const all = 18 - filteredArray.length;
        for (let i = 0; i <= all; i++) {
            filteredArray.push(['', '', '', '', '', '']);
        }
    }
    width.value = props.isMore ? filteredArray.length * gridSize.value + 40 : filteredArray.length * gridSize.value;
    curLztData.value = filteredArray[0].map((col, index) => filteredArray.map(row => row[index])); // 转置数组
};

watch(
    () => props.data,
    newValue => {
        try {
            getRows(newValue);
            if (viewRef.value) {
                viewRef.value.scrollLeft = viewRef.value.scrollWidth;
            }
        } catch (error) {
            console.error('执行 watcher 回调时发生错误:', error);
        }
    },
    { immediate: true, deep: true }
);

onMounted(() => {
    if (viewRef.value) {
        viewRef.value.scrollLeft = viewRef.value.scrollWidth;
    }
});
</script>
<template>
    <div class="ll-scrollbar">
        <div class="ll-scrollbar__view" ref="viewRef">
            <table class="table" :style="{ width: `${width}px` }">
                <tbody>
                    <tr v-for="row in curLztData" :key="row">
                        <td v-for="cell in row" :key="cell" :class="{ isActive: cell === 'big' || cell === 'small' }">
                            <div
                                v-if="imageType === 'string'"
                                :class="{
                                    red: ['大', '单', '龙', '质', 'big'].some(text => cell.includes(text)),
                                    blue: ['小', '双', '虎', '合', 'small'].some(text => cell.includes(text)),
                                    green: ['和'].some(text => cell.includes(text))
                                }"
                            >
                                <span v-if="cell === 'big' || cell === 'small'" :class="{ blinking: cell === 'big' || cell === 'small' }">{{ correctValue }}</span>
                                <span v-else>{{ cell }}</span>
                            </div>
                            <div v-if="imageType === 'stokeCircle'" class="flex align-center justify-center">
                                <div
                                    :class="{
                                        stokeCircleRed: ['大', '单', '龙', '质', 'big'].some(text => cell.includes(text)),
                                        stokeCircleBlue: ['小', '双', '虎', '合', 'small'].some(text => cell.includes(text)),
                                        stokeCircleGreen: ['和'].some(text => cell.includes(text)),
                                        blinking: cell === 'big' || cell === 'small'
                                    }"
                                ></div>
                            </div>
                            <div v-if="imageType === 'fillCircle'" class="flex align-center justify-center">
                                <div
                                    :class="{
                                        fillCircleRed: ['大', '单', '龙', '质', 'big'].some(text => cell.includes(text)),
                                        fillCircleBlue: ['小', '双', '虎', '合', 'small'].some(text => cell.includes(text)),
                                        fillCircleGreen: ['和'].some(text => cell.includes(text)),
                                        blinking: cell === 'big' || cell === 'small'
                                    }"
                                ></div>
                            </div>
                            <div v-if="imageType === 'line'" class="flex align-center justify-center">
                                <div
                                    :class="{
                                        lineRed: ['大', '单', '龙', '质', 'big'].some(text => cell.includes(text)),
                                        lineBlue: ['小', '双', '虎', '合', 'small'].some(text => cell.includes(text)),
                                        lineGreen: ['和'].some(text => cell.includes(text)),
                                        blinking: cell === 'big' || cell === 'small'
                                    }"
                                ></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- </div> -->
        </div>
    </div>
</template>
<style lang="scss" scoped>
.ll-scrollbar {
    /* position: relative; */
    overflow: hidden;
    /* display: flex; */
    /* display: block 9; */
    /* flex-grow: 1; */
}
.ll-scrollbar:hover .ll-scrollbar__bar,
.ll-scrollbar:active .ll-scrollbar__bar,
.ll-scrollbar:focus .ll-scrollbar__bar {
    opacity: 1;
}
.ll-scrollbar__view {
    flex-grow: 1;
    overflow-y: hidden;
    overflow-x: scroll;
    /* -webkit-overflow-scrolling: touch; */
    /* touch-action: pan-x; */
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
    border-spacing: 0 3px;
    overflow-x: scroll;
    tr {
        width: 100%;
        height: 20px;
        border-bottom: 1px solid #e6e6e6;
        td {
            text-align: center;
            border-left: 1px solid #e6e6e6;
            font-size: 12px;
            height: 20px;
            width: 20px;
            padding: 0;
            transform: rotateZ(360deg);
        }

        &:last-child {
            border: none;
        }

        .blue {
            color: #40a1fb;
        }

        .red {
            color: #f24848;
        }

        .green {
            color: #17b74c;
        }
    }
}

.stokeCircleRed {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    border: 3px solid #f24848;
}

.stokeCircleBlue {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    border: 3px solid #40a1fb;
}

.stokeCircleGreen {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    border: 3px solid #17b74c;
}

.fillCircleRed {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #f24848;
}

.fillCircleBlue {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #40a1fb;
}
.fillCircleGreen {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #17b74c;
}

.lineRed {
    height: 12px;
    width: 3px;
    background-color: #f24848;
    border-radius: 4px;
    transform: rotate(45deg);
}

.lineBlue {
    height: 12px;
    width: 3px;
    background-color: #40a1fb;
    border-radius: 4px;
    transform: rotate(45deg);
}
.lineGreen {
    height: 12px;
    width: 3px;
    background-color: #17b74c;
    border-radius: 4px;
    transform: rotate(45deg);
}

.isActive {
    background-color: #ffcf26;
}

@keyframes blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

.blinking {
    animation: blink 1.5s infinite;
}
</style>
