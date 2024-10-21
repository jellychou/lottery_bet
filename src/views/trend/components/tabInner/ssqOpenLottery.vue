<script setup>
import { computed } from 'vue';
import { issueDisplay } from '@/util/tools';
const { resultHistory } = defineProps({
    resultHistory: {
        type: Array,
        require: true
    }
});
const titlesArray = ['全部走势'];

console.log(resultHistory);
</script>
<template>
    <el-table class="trendTableHeader" :data="resultHistory" style="width: 100%" height="100%" stripe>
        <el-table-column prop="lotteryNum" label="期号" fixed="left" align="center" header-align="center" />
        <el-table-column label="全部走势" align="center" header-align="center" width="250">
            <el-table-column label="紅球" align="center" header-align="center" width="200">
                <template v-slot:default="scope">
                    <div class="mr-3" v-for="(item, index) in 6" key="item">
                        {{ scope.row.result.split(',')[index] }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="藍球" align="center" header-align="center" width="50">
                <template v-slot:default="scope">
                    <div>
                        {{ scope.row.result.split(',')[6] }}
                    </div>
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

        tbody {
            .cell {
                display: flex;
                align-items: center;
                justify-content: center;
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
.redActiveBall {
    background: linear-gradient(180deg, #ff725f 0%, #f73440 100%) !important;
    color: #fff;
}
.blueActiveBall {
    background: linear-gradient(180deg, #57b8ff 0%, #2d7df5 100%) !important;
    color: #fff;
}
.greenActiveBall {
    background: linear-gradient(180deg, #3ad56f 0%, #17b74c 100%) !important;
    color: #fff;
}

.purple {
    color: #7c46ee;
}

.red {
    color: #d31313;
}

.ball {
    height: 26px;
    width: 26px;
    border-radius: 50%;
}
</style>
