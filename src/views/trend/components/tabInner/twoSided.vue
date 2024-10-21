<script setup>
import { computed } from 'vue';
import { issueDisplay } from '@/util/tools';
const { resultHistory } = defineProps({
    resultHistory: {
        type: Array,
        require: true
    }
});
const titlesArray = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];
const secTitlesArray = [
    { label: '单双', value: 'oddEven' },
    { label: '大小', value: 'size' }
];
const tableDisplay = computed(() => {
    return resultHistory.map(item => {
        const sizeList = [];
        const oddEvenList = [];
        const dragonList = [];

        for (let j = 0; j < item.results.length; j++) {
            const result = Number(item.results[j]);
            sizeList.push(result > 5 ? '大' : '小');
            oddEvenList.push(result % 2 === 0 ? '双' : '单');

            // 只有前五個號碼要顯示龍虎
            if (j < 5) {
                dragonList.push(result > Number(item.results[9 - j]) ? '龙' : '虎');
            }
        }

        return {
            lotteryNum: issueDisplay(item.lotteryNum),
            results: item.results,
            twoSum: Number(item.results[0]) + Number(item.results[1]),
            size: sizeList,
            oddEven: oddEvenList,
            dragonTiger: dragonList
        };
    });
});
</script>
<template>
    <el-table class="trendTableHeader" :data="tableDisplay" style="width: 100%" height="100%" stripe>
        <el-table-column prop="lotteryNum" label="期号" width="76" fixed="left" align="center" header-align="center" />
        <el-table-column label="冠亚和" align="center" header-align="center" width="100">
            <el-table-column label="和值" align="center" header-align="center" width="38">
                <template v-slot:default="scope">
                    <span>{{ scope.row.twoSum }}</span>
                </template>
            </el-table-column>
            <el-table-column label="大小" align="center" header-align="center" width="38">
                <template v-slot:default="scope">
                    <span :class="scope.row.results[0] + scope.row.results[1] > 10 ? 'red' : 'purple'">
                        {{ scope.row.results[0] + scope.row.results[1] > 10 ? '大' : '小' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="单双" align="center" header-align="center" width="38">
                <template v-slot:default="scope">
                    <span :class="scope.row.results[0] + (scope.row.results[1] % 2) === 0 ? 'red' : 'purple'">
                        {{ scope.row.results[0] + scope.row.results[1] / 2 === 0 ? '双' : '单' }}
                    </span>
                </template>
            </el-table-column>
        </el-table-column>
        <el-table-column v-for="(item, index) in titlesArray" :key="index" :label="item" align="center" header-align="center" width="100">
            <el-table-column v-for="title in secTitlesArray" :key="title.vale" :label="title.label" align="center" header-align="center" width="38">
                <template v-slot:default="scope">
                    <span :class="['小', '双'].includes(scope.row[title.value][index]) ? 'red' : 'purple'">
                        {{ scope.row[title.value][index] }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column v-if="index < 5" label="龙虎" align="center" header-align="center" width="38">
                <template v-slot:default="scope">
                    <span :class="scope.row.dragonTiger[index] === '龙' ? 'red' : 'purple'">
                        {{ scope.row.dragonTiger[index] }}
                    </span>
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>

<style lang="scss" scoped>
.trendTableHeader {
    :deep(.el-table__inner-wrapper) {
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
