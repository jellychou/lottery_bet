<template>
    <div class="w-full flex flex-col overflow-hidden">
        <div class="topFixed">
            <Header :title="currentLottery.label" hasBg />
            <LotteryInfo />
            <div class="pb-2.5" style="border-bottom: 1px solid #eceff5" ref="tabsContainer">
                <div class="tabs flex items-center mx-3 p-0.5 relative">
                    <div class="tabActive" :style="{ transform: filterTranslate }"></div>
                    <div class="flex justify-center items-center tab" :class="{ active: curTab == 1 }" @click="curTab = 1">双面盘</div>
                    <div v-if="filterShow(currentLottery.parentCode)" class="flex justify-center items-center tab" :class="{ active: curTab == 2 }" @click="curTab = 2">路子图</div>
                    <div v-if="filterShow(currentLottery.parentCode)" class="flex justify-center items-center tab" :class="{ active: curTab == 3 }" @click="curTab = 3">好路</div>
                    <div v-if="filterShow(currentLottery.parentCode)" class="flex justify-center items-center tab" :class="{ active: curTab == 4 }" @click="curTab = 4">长龙</div>
                </div>
            </div>
        </div>
        <div class="holderTop"></div>
        <div class="play-container flex-1">
            <router-view v-if="curTab == 1" name="play" />
            <Lzt v-if="curTab == 2" />
            <Haolu v-if="curTab == 3" @update:callback="reCallData" @update:isShowBetArea="switchHaolu" />
            <Changlong v-if="curTab == 4" @update:isShowBetArea="switchChangeLong" />
            <div :class="{ holder: curTab === 1 || (curTab === 3 && isShowHaolu), holderHeight: curTab === 2 || (curTab === 4 && isShowChangeLong) }"></div>
        </div>

        <BuyCar v-if="cartData.length && curTab == 1" />
        <BetArea v-if="[1, 2].indexOf(curTab) !== -1" :showSelectButton="curTab === 2" />
    </div>
</template>

<script>
export default {
    name: 'Play'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch, onUnmounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { getCurrentLottery } from '@/util/cach';
import LotteryInfo from './LotteryInfo.vue';
import Lzt from './Lzt.vue';
import Haolu from './Haolu.vue';
import Changlong from './Changlong.vue';
import BetArea from './BetArea.vue';
import BuyCar from '../../components/public/BuyCar.vue';

const route = useRoute();

const { t } = useI18n();
const commonStore = useCommonStore();

const status = computed(() => commonStore.status);
const currentLottery = computed(() => commonStore.currentLottery);
const cartData = computed(() => commonStore.cartData);

const plays = computed(() => allPlays[currentLottery.value.parentCode] || [{}]);

const curTab = ref(1);
const tabsContainer = ref(null);
const data = ref([]);
const isLoading = ref(false);
const isShowChangeLong = ref(false);
const isShowHaolu = ref(false);

const filterShow = code => {
    const notShowCodeArr = ['ssl', '3d', 'klc', 'klsf', 'hot'];
    const index = notShowCodeArr.findIndex(item => item === code);
    if (index === -1) {
        return true;
    } else {
        curTab.value = 1;
        return false;
    }
};

const filterTranslate = computed(() => {
    const tabWidth = tabsContainer.value ? Math.floor(tabsContainer.value.offsetWidth / 4) : 0;
    const translateXValue = (curTab.value - 1) * (tabWidth - 7.5);
    return `translateX(${translateXValue}px)`;
});

const getOpenInfo = e => {
    // 查询并设置当前彩种状态 做到与后台实时同步
    _TimerAdapter.fetchLotteryStatus().then(res => {
        currentLottery.value.status = res;
        if (res) {
            // 获取开奖信息
            _TimerAdapter.fetchLotteryResult().then(() => {
                _TimerAdapter.countdown();
            });
        }
    });
};

const setLotteryResultInfo = info => {
    commonStore.openInfo = info;
};

const lotteryChange = () => {
    _TimerAdapter.config(currentLottery.value.code);
    getOpenInfo();
    commonStore.getLotteryData(currentLottery.value.code);
};

const prettyRoadCodeOption = ref([
    { label: '长龙', value: 'LONG_QUEUE', choose: 0 },
    { label: '单跳', value: 'SINGLE_JUMP', choose: 0 },
    { label: '两房两厅', value: 'TWO_HOUSE_TWO_HALL', choose: 0 },
    { label: '两房一厅', value: 'TWO_HOUSE_ONE_HALL', choose: 0 },
    { label: '连续长连', value: 'LONG_CONTINUOUS', choose: 0 },
    { label: '不过三', value: 'NO_PASS_THREE', choose: 0 },
    { label: '常连', value: 'OFTEN_CONTINUOUS', choose: 0 },
    { label: '常跳', value: 'OFTEN_JUMP', choose: 0 }
]);

const getData = () => {
    const currentLottery = getCurrentLottery();

    let l = prettyRoadCodeOption.value.map(_ => _.choose == 1 && _.value);
    getPrettyRoad({
        calculateRate: false,
        limit: 144,
        lotteryInfo: [{ lotteryCode: currentLottery.code, lotteryTypeCode: currentLottery.fcode }],
        prettyRoadCode: l.filter(_ => _)
    }).then(res => {
        data.value = res;
        sessionStorage.setItem(storageKey, JSON.stringify(data.value));
    });
};

const reCallData = boolean => {
    getData(boolean);
};

const switchChangeLong = boolean => {
    isShowChangeLong.value = boolean;
};

const switchHaolu = boolean => {
    isShowHaolu.value = boolean;
};

// 当前彩种变化时 拉取当前彩种信息
watch(
    () => currentLottery.value,
    newValue => {
        lotteryChange();
    },
    { immediate: true }
);

watch(
    () => curTab.value,
    value => {
        if (value === 1) {
            commonStore.getLotteryData(currentLottery.value.code);
        }
    }
);

onMounted(() => {
    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
    commonStore.getLotteryData(currentLottery.value.code);
});

onUnmounted(() => {
    commonStore.betLztData = [];
    window.removeEventListener('focus', getOpenInfo);
});
// currentLottery.value.code && lotterChange(); // 开始时拉取当前彩种信息
window.addEventListener('focus', getOpenInfo); // 页面激活时自动更新开奖信息
_TimerAdapter.listen('setLotteryResultInfo', setLotteryResultInfo);
</script>
<style lang="scss" scoped>
.topFixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background-color: #fff;
}

.holderTop {
    height: 233px;
}

.tabs {
    max-width: 100%;
    height: 38px;
    background: #f4f6fb;
    border-radius: 7px;
    div {
        height: 34px;
        border-radius: 5px;
        font-size: 15px;
        line-height: 18px;
        color: #60697a;
    }

    .tab {
        z-index: 1;
        width: calc(100% / 4);
    }

    .active {
        color: #1e8ef5;
    }

    .tabActive {
        width: calc(100% / 4);
        font-weight: 500;
        background: #ffffff;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);

        position: absolute;
        transition: transform 0.3s ease-out;
    }
}

.play-container {
    height: calc(100% - 232px);
}

.holder {
    height: 103px;
    width: 100%;
}

.holderHeight {
    height: 150px;
    width: 100%;
}
</style>
