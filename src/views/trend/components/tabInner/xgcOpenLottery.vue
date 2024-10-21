<script setup>
import { computed } from 'vue';
import { issueDisplay } from '@/util/tools';
const { resultHistory } = defineProps({
    resultHistory: {
        type: Array,
        require: true
    }
});
const titlesArray = ['全部走勢'];

const filterColor = val => {
    const red = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'];
    const blue = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'];
    const green = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'];
    const isRed = red.findIndex(item => item === val);
    const isBlue = blue.findIndex(item => item === val);
    const isGreen = green.findIndex(item => item === val);
    let color = '';
    if (isRed !== -1) {
        color = 'redBall';
    } else if (isBlue !== -1) {
        color = 'blueBall';
    } else if (isGreen !== -1) {
        color = 'greenBall';
    }
    return color;
};

const filterSpecialColor = val => {
    const red = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'];
    const blue = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'];
    const green = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'];
    const isRed = red.findIndex(item => item === val);
    const isBlue = blue.findIndex(item => item === val);
    const isGreen = green.findIndex(item => item === val);
    let color = '';
    if (isRed !== -1) {
        color = 'specialRedBall';
    } else if (isBlue !== -1) {
        color = 'specialBlueBall';
    } else if (isGreen !== -1) {
        color = 'specialGreenBall';
    }
    return color;
};

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
            return {
                rowspan: 2,
                colspan: 1
            };
        } else {
            return {
                rowspan: 0,
                colspan: 0
            };
        }
    }
};
</script>
<template>
    <el-table class="trendTableHeader" :data="resultHistory" style="width: 100%" height="100%" stripe :row-span:method="objectSpanMethod">
        <el-table-column prop="lotteryNum" label="期号" fixed="left" width="100" align="center" header-align="center">
            <template v-slot:default="scope">{{ issueDisplay(scope.row.lotteryNum) }}</template>
        </el-table-column>
        <el-table-column label="全部走势" align="center" header-align="center">
            <el-table-column label="正1" align="center" header-align="center" width="40">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterColor(scope.row.result.split(',')[0])">
                        <span>
                            {{ scope.row.result.split(',')[0] }}
                        </span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[0] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="正2" align="center" header-align="center" width="40">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterColor(scope.row.result.split(',')[1])">
                        <span>{{ scope.row.result.split(',')[1] }}</span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[1] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="正3" align="center" header-align="center" width="40">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterColor(scope.row.result.split(',')[2])">
                        <span>{{ scope.row.result.split(',')[2] }}</span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[2] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="正4" align="center" header-align="center" width="40">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterColor(scope.row.result.split(',')[3])">
                        <span>{{ scope.row.result.split(',')[3] }}</span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[3] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="正5" align="center" header-align="center" width="40">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterColor(scope.row.result.split(',')[4])">
                        <span>{{ scope.row.result.split(',')[4] }}</span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[4] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="正6" align="center" header-align="center" width="40">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterColor(scope.row.result.split(',')[5])">
                        <span>{{ scope.row.result.split(',')[5] }}</span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[5] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="特码" align="center" header-align="center">
                <template v-slot:default="scope">
                    <div class="ball" :class="filterSpecialColor(scope.row.result.split(',')[6])">
                        <span>{{ scope.row.result.split(',')[6] }}</span>
                    </div>
                    <div style="color: #63666f">{{ scope.row.resultProperty.split(',')[6] }}</div>
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

    :deep(.cell) {
        display: flex;
        flex-direction: column;
    }
}
.redBall {
    border: 1px solid #d31313 !important;
    color: #d31313;
}

.blueBall {
    border: 1px solid #4399ff !important;
    color: #4399ff;
}

.greenBall {
    border: 1px solid #3fb84b !important;
    color: #3fb84b;
}

.specialGreenBall {
    color: #fff;
    background-color: #3fb84b;
}
.specialRedBall {
    color: #fff;
    background-color: #d31313;
}
.specialBlueBall {
    color: #fff;
    background-color: #4399ff;
}

.ball {
    height: 26px;
    width: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
