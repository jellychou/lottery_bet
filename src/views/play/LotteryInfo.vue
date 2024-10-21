<template>
    <div>
        <div class="lottery_info">
            <div class="relative">
                <div v-if="videoIcon" class="live absolute right-3 top-2.5 flex items-center" @click="live">
                    直播
                    <img src="./assets/live.png" width="15" class="ml-1" />
                </div>
                <div class="arrow1 absolute right-4 bottom-7 flex items-center z-10" @click="switchOpen">
                    <img src="./assets/arrow1.png" width="9" class="ml-1" :class="showHistory ? 'down' : 'up'" />
                </div>
                <div class="result-wrapper py-2.5 px-3">
                    <div class="result-filter"></div>
                    <router-view name="result"></router-view>
                </div>
                <div v-if="showHistory">
                    <van-popup class="historyResult" v-model:show="isTrueShow" position="top" bind:close="onClose">
                        <HistoryList @close="switchOpen" />
                        <div class="historyInnerFooter flex items-center absolute bottom-0 left-0 right-0">
                            <div class="cancel w-1/2" @click="switchOpen">取消</div>
                            <div class="full-trend w-1/2" @click="goTrend">完整走势</div>
                        </div>
                    </van-popup>
                </div>
            </div>

            <div class="nextLottery-wrapper flex justify-between items-center py-2.5">
                <div class="nextLotteryNum">{{ issueDisplay(openInfo.nextLotteryNum) }}期</div>
                <div class="time flex items-center">
                    <div class="mr-1">距封盘</div>
                    <span v-for="(it, i) in fTime" :key="i">
                        <div v-if="i !== 0" class="colon h-full flex flex-col justify-center items-center">
                            <div />
                            <div />
                        </div>
                        {{ it }}
                    </span>
                </div>
            </div>

            <van-popup :show="showLive" class="lotteryVideoPopup" @click-overlay="closeLotteryVideoPopup">
                <iframe :src="src" frameborder="0" :height="250" width="100%"></iframe>
            </van-popup>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LotteryInfo'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { session } from '@/util/storage';
import { getSiteCode, getToken } from '@/util/cach';
import { issueDisplay } from '@/util/tools';
import HistoryList from './HistoryList.vue';

const { t, locale } = useI18n();
const commonStore = useCommonStore();
const router = useRouter();
const route = useRoute();

const sealTime = ref(0);
const nextStopTime = ref(0);
const showLive = ref(false);
const showHistory = ref(false); //开奖历史

const status = computed(() => commonStore.status);
const currentLottery = computed(() => commonStore.currentLottery);
const openInfo = computed(() => commonStore.openInfo);
const isTrueShow = ref(true);

// 开奖视频
const src = computed(() => {
    const { icode, code, label } = currentLottery.value;
    console.log(currentLottery.value);
    const fcode = code === 'xgpm' || code === 'nxgpm' ? 'sm' : icode;
    const url = import.meta.env.VITE_NODE_ENV === 'production' ? `${location.origin}` : import.meta.env.VITE_APP_LOTTERY_VIDEO_URL;
    const microProps = session.get('microProps');
    console.log(`${import.meta.env.VITE_APP_LOTTERY_VIDEO_URL}?label=${label}&code=${code}&fcode=${fcode}&siteCode=${getSiteCode()}&token=${getToken()}
    &url=${import.meta.env.VITE_APP_LOTTERY_VIDEO_URL}&language=${locale.value}&currency=${microProps.currency}`);
    return `${import.meta.env.VITE_APP_LOTTERY_VIDEO_URL}?label=${label}&code=${code}&fcode=${fcode}&siteCode=${getSiteCode()}&token=${getToken()}
    &url=${import.meta.env.VITE_APP_LOTTERY_VIDEO_URL}&language=${locale.value}`;
});

//是否展示直播按钮
const videoIcon = computed(() => ['ssq', 'klsf', 'ssc', 'xgc', 'pk10', 'ft', 'k3', 'c11x5'].includes(currentLottery.value.parentCode) && !['fflhc'].includes(currentLottery.value.parentCode));

// 格式化时间 方便页面展示
const fTime = computed(() => {
    const time = sealTime.value > 0 ? sealTime.value : 0;
    const sec = time % 60;
    const hou = Math.floor(time / 3600);
    const min = (time - hou * 3600 - sec) / 60;
    const re = handleTime(hou ? [hou, min, sec] : [min, sec]);
    commonStore.sealTime = re;
    return re;
});

const countdownTime = time => {
    sealTime.value = time;
};

const setLotteryStatus = statusText => {
    commonStore.status = statusText;
};

const formatTime = time => {
    return time < 10 ? '0' + time : time;
};

const handleTime = times => {
    return times.map(_ => formatTime(_));
};

const live = () => {
    if ([t('betting.NoSales'), t('betting.Closed1')].includes(status.value)) return showToast(t('tip.TheColor') + status.value + '！');
    showLive.value = true;
};
const closeLotteryVideoPopup = () => {
    showLive.value = false;
};

const goTrend = () => {
    commonStore.setTrendTarget(route.path);
    router.push('/trend');
};

const switchOpen = () => {
    showHistory.value = !showHistory.value;
};

onMounted(() => {
    _TimerAdapter.listen('countdownTime', countdownTime);
    _TimerAdapter.listen('setStatusText', setLotteryStatus);
});
</script>
<style lang="scss" scoped>
.lottery_info {
    .result-wrapper {
        position: relative;
    }

    .result-filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 90px;
        border-radius: 10px;
        background: rgba(92, 105, 122, 0.5);
        box-shadow: 0px 4px 16px rgba(143, 154, 171, 0.25), inset 0px 1px 0px rgba(175, 194, 223, 0.15), inset 0px -8px 20px rgba(86, 101, 122, 0.5);
        backdrop-filter: blur(30px);
    }
    .live {
        font-size: 13px;
        line-height: 18px;
        color: #a0a8b6;
        z-index: 1;
    }
    .arrow1 {
        position: absolute;
        bottom: -44px;
        .down {
            transition: all 0.3s;
            transform: rotate(-180deg);
        }
        .up {
            transition: all 0.3s;
        }
    }
    .nextLotteryNum {
        height: 30px;
        width: 203px;
        padding-left: 18px;
        font-weight: 600;
        font-size: 14px;
        line-height: 30px;
        color: #464c54;
        background: url('./assets/next_num_bg.png') no-repeat;
        background-size: 100%;
    }
    .time {
        font-size: 12px;
        line-height: 30px;
        color: #929aa7;
        span {
            display: inline-block;
            position: relative;
            width: 31px;
            height: 27px;
            margin-right: 11px;
            line-height: 25px;
            text-align: center;
            background: linear-gradient(180deg, #fff1e8 0%, rgba(255, 241, 232, 0) 100%);
            border: 1px solid #f8dac7;
            border-radius: 2px;
            font-family: 'WeChat Sans Std';
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 27px;
            color: #e9555e;
            .colon {
                position: absolute;
                left: -8px;
                color: #0f1828;
                font-style: normal;
                div {
                    width: 2px;
                    height: 2px;
                    background: #0f1828;
                    margin: 2px 0px;
                }
            }
        }
    }

    :deep(.van-overlay) {
        height: calc(100dvh - 134px);
        top: 134px;
        z-index: 10;
    }

    :deep(.historyResult) {
        height: 400px;
        top: 134px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;

        .historyInnerFooter {
            height: 50px;
            background-color: #fff;
        }
        .full-trend {
            height: 25px;
            font-weight: 500;
            font-size: 15px;
            line-height: 25px;
            text-align: center;
            color: #1e8ef5;
            border-left: 1px solid rgba(0, 0, 0, 0.1);
        }
        .cancel {
            font-weight: 500;
            font-size: 15px;
            line-height: 25px;
            text-align: center;
            color: #464c54;
        }
    }
}

.nextLottery-wrapper {
    padding-top: 80px;
}

.lotteryVideoPopup {
    background: #ffffff;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
}

:deep(.van-popup--center) {
    width: 100%;
    max-width: 100vw !important;
}
</style>
