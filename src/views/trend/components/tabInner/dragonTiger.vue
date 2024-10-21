<template>
    <el-table class="trendTableHeader" :data="tableDisplay" style="width: 100%" height="100%" stripe>
        <el-table-column prop="lotteryNum" label="期号" width="76" fixed="left" align="center" header-align="center" />
        <el-table-column v-for="(item, index) in titlesArray" :key="index" :label="item" align="center" header-align="center" width="100">
            <el-table-column v-for="title in secTitlesArray" :key="title.vale" :label="title.label" align="center" header-align="center" width="50">
                <template v-slot:default="scope">
                    <span :class="getClass(scope.row[item][title.value])">{{ scope.row[item][title.value] }}</span>
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { issueDisplay } from '@/util/tools';
import { computed } from 'vue';
const { resultHistory } = defineProps({
    resultHistory: {
        type: Array,
        require: true
    }
});
const titlesArray = ['1V10', '2V9', '3V8', '4V7', '5V6'];
const secTitlesArray = [
    { label: '龙', value: 'dragon' },
    { label: '虎', value: 'tiger' }
];

const formatAndTransformData = data => {
    // 总共有五种比较方式 ['1V10', '2V9', '3V8', '4V7', '5V6']
    const compareList = [
        [0, 9],
        [1, 8],
        [2, 7],
        [3, 6],
        [4, 5]
    ];
    // 比较方式又分龙虎
    const trendField = compareList.map(() => ({ dragon: [], tiger: [] }));
    const result = [];

    for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        const obj = { lotteryNum: issueDisplay(entry.lotteryNum) };

        for (let j = 0; j < compareList.length; j++) {
            const [front, back] = compareList[j];
            const frontWinNumber = entry.results[front];
            const backWinNumber = entry.results[back];

            if (frontWinNumber > backWinNumber) {
                trendField[j].dragon.push('龙');
                trendField[j].tiger.push(
                    trendField[j].tiger.length === 0 || trendField[j].tiger[trendField[j].tiger.length - 1] === '虎' ? 1 : trendField[j].tiger[trendField[j].tiger.length - 1] + 1
                );
            } else {
                trendField[j].tiger.push('虎');
                trendField[j].dragon.push(
                    trendField[j].dragon.length === 0 || trendField[j].dragon[trendField[j].dragon.length - 1] === '龙' ? 1 : trendField[j].dragon[trendField[j].dragon.length - 1] + 1
                );
            }
        }

        for (let k = 0; k < compareList.length; k++) {
            const key = `${k + 1}V${11 - (k + 1)}`;
            obj[key] = {
                dragon: trendField[k].dragon[i],
                tiger: trendField[k].tiger[i]
            };
        }

        result.push(obj);
    }

    return result;
};

const getClass = value => {
    if (value === '龙') {
        return 'red';
    } else if (value === '虎') {
        return 'purple';
    }
    return '';
};

const tableDisplay = formatAndTransformData(resultHistory);
</script>

<style lang="scss" scoped>
.trendTableHeader {
    :deep(.el-table__inner-wrapper) {
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
        thead {
            color: #63666f;
            font-weight: 400;

            th,
            .el-table__cell {
                font-weight: 400;
                background: #f5f5f5;
                color: #63666f;
                padding: 4px 0;
            }
        }

        .cell {
            padding: 0 2px;
        }
    }
    :deep(.el-table__body-wrapper) {
        height: calc(100dvh - 283px);
        flex: none;
    }
}
.red {
    color: #d31313;
}
.purple {
    color: #7c46ee;
}
</style>
