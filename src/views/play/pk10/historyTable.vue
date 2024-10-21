<script setup>
import { useI18n } from 'vue-i18n';
import { issueDisplay } from '@/util/tools';

const props = defineProps({
    data: Array
});
</script>

<template>
    <el-table :data="data" stripe height="350" border style="width: 100%" :highlight-current-row="false">
        <el-table-column label="期号" width="110" align="center">
            <template v-slot:default="scope">
                <span>{{ issueDisplay(scope.row.lotteryNum) }}期</span>
            </template>
        </el-table-column>
        <el-table-column label="开奖号码" align="center">
            <template v-slot:default="scope">
                <div class="flex justify-center">
                    <div class="ball mr-2" :class="`_pk${item}`" v-for="item in scope.row.result.split(',').map(item => item.replace(/^0+/, ''))">{{ item }}</div>
                </div>
            </template>
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
.ball {
    background-image: inherit;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-family: 'DIN Alternate';
    font-size: 16px;
    border-radius: 1.67px;
    margin-right: 4px;
    color: #fff;
    font-style: normal;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk1 {
    background: #ffcf26;
}
._pk2 {
    background: #40a1fb;
}
._pk3 {
    background: #434343;
}
._pk4 {
    background: #ff7539;
}
._pk5 {
    background: #0fd7e3;
}
._pk6 {
    background: #4d54ff;
}
._pk7 {
    background: #bebebe;
}
._pk8 {
    background: #ed3737;
}
._pk9 {
    background: #703b2a;
}
._pk10 {
    background: #41c05d;
}
</style>
