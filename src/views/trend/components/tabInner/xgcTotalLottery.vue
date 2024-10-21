<script setup>
import { computed } from 'vue';
import { issueDisplay } from '@/util/tools';
const { resultHistory } = defineProps({
    resultHistory: {
        type: Array,
        require: true
    }
});
const titlesArray = ['特码尾数'];

const filterActiveColor = val => {
    const red = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'];
    const blue = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'];
    const green = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'];
    const isRed = red.findIndex(item => item === val);
    const isBlue = blue.findIndex(item => item === val);
    const isGreen = green.findIndex(item => item === val);
    let color = '';
    if (isRed !== -1) {
        color = 'redActiveBall';
    } else if (isBlue !== -1) {
        color = 'blueActiveBall';
    } else if (isGreen !== -1) {
        color = 'greenActiveBall';
    }
    return color;
};
</script>
<template>
    <el-table class="trendTableHeader" :data="resultHistory" style="width: 100%" height="100%" stripe>
        <el-table-column prop="lotteryNum" label="期号" fixed="left" width="100" align="center" header-align="center">
            <template v-slot:default="scope">{{ issueDisplay(scope.row.lotteryNum) }}</template>
        </el-table-column>
        <el-table-column label="特码" align="center" header-align="center" width="40">
            <template v-slot:default="scope">
                <div class="ball" :class="filterActiveColor(scope.row.result.split(',')[6])">
                    <div>{{ scope.row.result.split(',')[6] }}</div>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="特码头数" align="center" header-align="center" width="70">
            <template v-slot:default="scope">
                <span>{{ scope.row.result.split(',')[6].split('')[0] }}</span>
            </template>
        </el-table-column>
        <el-table-column label="特码尾数" align="center" header-align="center" width="130">
            <el-table-column label="尾数" align="center" header-align="center" width="65">
                <template v-slot:default="scope">
                    <span>{{ scope.row.result.split(',')[6].split('')[1] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="尾数形态" align="center" header-align="center">
                <template v-slot:default="scope">
                    <div :class="{ red: scope.row.result.split(',')[6].split('')[1] >= 5, purple: scope.row.result.split(',')[6].split('')[0] < 10 }">
                        {{ scope.row.result.split(',')[6].split('')[1] >= 5 ? '大' : '小' }}{{ scope.row.result.split(',')[6].split('')[1] % 2 ? '单' : '双' }}
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
    padding-top: 2px;
}
</style>
