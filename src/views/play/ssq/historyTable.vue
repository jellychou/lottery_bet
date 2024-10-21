<script setup>
import { useI18n } from 'vue-i18n';
import { issueDisplay } from '@/util/tools';

const props = defineProps({
    data: Array
});
</script>

<template>
    <el-table :data="data" stripe height="350" border style="width: 100%" :highlight-current-row="false">
        <el-table-column label="期号" width="130" align="center">
            <template v-slot:default="scope">
                <span>{{ issueDisplay(scope.row.lotteryNum) }}期</span>
            </template>
        </el-table-column>
        <el-table-column label="开奖号码" align="center">
            <el-table-column prop="address" label="红球" align="center">
                <template v-slot:default="scope">
                    <div class="flex">
                        <div class="ballWidth textRed" v-for="(item, i) in scope.row.result.split(',').slice(0, 6)" :key="item">{{ item }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="address" width="55" label="蓝球">
                <template v-slot:default="scope">
                    <div class="flex">
                        <div class="ballWidth textBlue">{{ scope.row.result.split(',')[6] }}</div>
                    </div>
                </template>
            </el-table-column>
        </el-table-column>
    </el-table>
</template>
<style lang="scss" scoped>
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
</style>
