<template>
    <div class="result">
        <div class="flex items-center">
            <div class="issue">{{ issueDisplay(openInfo.lotteryNum) }}期</div>
            <div v-if="!isLotteryDrawing && lotteryResult && openInfo.resultProperty" class="attach ml-1">[ {{ openInfo.resultProperty.replaceAll(',', '、') }} ]</div>
        </div>
        <div v-if="!isLotteryDrawing && lotteryResult" class="flex">
            <ReboundPk10 v-for="(num, inx) of gameResult" :key="inx" :i="num" :blur="inx" :delay="inx + 1" />
        </div>
        <p v-if="countdownopenTime" class="msg flex items-center">等待开奖{{ formatSeconds(countdownopenTime) }}</p>

        <p v-if="isLotteryDrawing" class="msg flex items-center">
            <img class="rotate-25" src="../assets/loading.png" width="17" />
            {{ openInfo.message || status }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'Result'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { session } from '@/util/storage';
import { issueDisplay, formatSeconds } from '@/util/tools';
import { getSiteCode, getToken } from '@/util/cach';
import { useResultHook } from '../hooks.js';
import ReboundPk10 from '@/components/public/ReboundPk10.vue';
const { status, countdownopenTime, openInfo, lotteryResult, isLotteryDrawing } = useResultHook();

const { t, locale } = useI18n();
const commonStore = useCommonStore();

const currentLottery = computed(() => commonStore.currentLottery);

const gameResult = computed(() => {
    const arr = lotteryResult.value.split(',').map(_ => (_ < 10 ? +_ : _));
    return lotteryResult.value && arr.length === 10 ? arr : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
});
</script>
<style lang="scss" scoped>
.result {
    position: absolute;
    // height: 88px;
    .issue {
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #f9fafb;
    }
    .ball {
    }
    [class^='_pk'] {
        width: 21px;
        height: 21px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        font-family: 'DIN Alternate';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 18px;
        color: #ffffff;
        margin-right: 9px;
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

    .attach {
        font-weight: 500;
        font-size: 12px;
        line-height: 17px;
        color: rgba(249, 250, 251, 0.8);
    }
}

.msg {
    margin-top: 12px;
    margin-left: 4px;
    font-weight: 500;
    font-size: 18px;
    line-height: 25px;
    color: #ffcf26;
    img {
        width: 18px;
        height: 18px;
        margin-right: 4px;
    }
}
</style>
