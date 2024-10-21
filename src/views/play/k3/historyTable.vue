<script setup>
import { useI18n } from 'vue-i18n';
import { issueDisplay } from '@/util/tools';

const props = defineProps({
    data: Array
});
</script>

<template>
    <el-table :data="data" stripe height="350" border style="width: 100%" :highlight-current-row="false">
        <el-table-column label="期号" width="120" align="center">
            <template v-slot:default="scope">
                <span>{{ issueDisplay(scope.row.lotteryNum) }}期</span>
            </template>
        </el-table-column>
        <el-table-column label="开奖号码" width="120" align="center">
            <template v-slot:default="scope">
                <div class="flex justify-center">
                    <div class="ball mr-2" v-for="item in scope.row.result.split(',')">{{ item }}</div>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="和值/大小/单双" align="center">
            <template v-slot:default="scope">
                <div class="flex justify-center">
                    <div v-for="(item, i) in scope.row.resultProperty.split(',').slice(0, 3)">
                        <span>{{ item }}</span>
                        <span v-if="i < 2">/</span>
                    </div>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>
<style lang="scss" scoped>
.ball {
    line-height: 24px;
    width: 24px;
    font-size: 15px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    background-image: radial-gradient(12px at 4px 4px, #fff 6%, #0092ff 86%);
}
.textRed {
    color: #ed3a45;
}

.textBlue {
    color: #1e8ef5;
}

.ssqResult {
    width: 20px;
}

.ballWidth {
    width: 30px;
    text-align: center;
}

.blueBallWidth {
    width: 30px;
}

.greenBall {
    background: linear-gradient(180deg, #3ad56f 0%, #17b74c 100%);
}
</style>
