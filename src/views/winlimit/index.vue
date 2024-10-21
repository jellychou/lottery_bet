<template>
    <div class="bg h-full">
        <Header title="盈利上限" />

        <div class="wrapper pt-2 pl-3 pr-3 overflow-auto">
            <div class="text px-3">
                <div class="pt-3">同一用户，在同一彩种同一奖期所下注的订单的总盈利（总奖金-总投注）不能超出平台设置的上限，超出部分将直接从奖金里扣除。</div>
                <div class="mt-2.5">
                    举例： 幸运飞艇的单期盈利上限假如为40万；用户A在幸运飞艇001期，投注10万，赢得奖金100万，则该期盈利为90万（100-90），超出盈利上限； 那么用户A在001期可获得的奖金为50万（10+40）。
                </div>
                <div class="title">各彩种的单期盈利上限如下，单位（元）</div>
            </div>

            <div class="item" v-for="item in data" :key="item.typeName">
                <div class="title">{{ item.typeName }}</div>
                <!-- <div class="box grid grid-cols-2"> -->
                <van-grid class="box" :column-num="2" :border="false">
                    <van-grid-item class="subList-item flex flex-col items-center justify-center" v-for="(it, i) in item.subList" :key="i" :class="{ single: item.subList.length % 2 }">
                        <div class="lotteryName">{{ it.lotteryName }}</div>
                        <div class="dailyMaxWinLimit">{{ it.dailyMaxWinLimit }}</div>
                    </van-grid-item>
                </van-grid>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WinLimit'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import { memberDailyWinLimt } from '@/api/interface';

const commonStore = useCommonStore();

const data = ref([]);

memberDailyWinLimt({}).then(res => {
    data.value = res;
});
</script>
<style lang="scss" scoped>
.bg {
    background: #eff2f5;
    .wrapper {
        height: calc(100% - 44px);
    }
    .text {
        margin-bottom: 20px;
        background: #ffffff;
        border-radius: 5px;
        font-size: 13px;
        line-height: 20px;
        color: #565e6a;
        .title {
            height: 40px;
            line-height: 40px;
            color: #929aa7;
        }
    }
    .item {
        .title {
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;

            color: #2f3944;
        }
        .box {
            background: #ffffff;
            border-radius: 5px;
            margin-bottom: 15px;
            // margin-top: 8px;
        }
        .subList-item {
            height: 65px;
            // border: 1px solid black;
            .lotteryName {
                font-size: 15px;
                line-height: 20px;
                color: #565e6a;
            }
            .dailyMaxWinLimit {
                font-weight: 500;
                font-size: 13px;
                line-height: 20px;
                color: #ff7a00;
            }
        }
        .subList-item {
            border-bottom: 0.5px solid #d8dfeb;
        }
        .subList-item:nth-last-child(1),
        .subList-item:nth-last-child(2) {
            border-bottom: none;
        }
        .subList-item:nth-child(2n - 1) {
            border-right: 0.5px solid #d8dfeb;
        }
        .single:nth-last-child(2) {
            border-bottom: 0.5px solid #d8dfeb;
        }
    }
}
</style>
