<script>
export default {
    name: 'Trend'
};
</script>

<script setup>
import Timer from '@/views/home/Timer.vue';
import { useRouter } from 'vue-router';
import LotterySelect from './components/lotterySelect.vue';
import CTabbar from '@/components/public/CTabbar.vue';
import { pcLoadKgGameResult, getStatus, getWinningNumbers, getQueryLotteryOdds } from '@/api/interface';
import TabContainer from './components/tabContainer.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { issueDisplay } from '@/util/tools';
import useCommonStore from '@/store/modules/common';
import { showToast } from 'vant';
import { session } from '@/util/storage';
import allPlaysTrend from '@/data/allPlaysTrend'; // 所有大彩种玩法数据

const router = useRouter();
const commonStore = useCommonStore();

const currentLottery = computed(() => commonStore.currentLottery);

// 預設值是極速賽車
const lotteryItem = computed(() => {
    return commonStore.lotteryList.filter(item => item.code === 'pk10')[0].children.filter(item => item.code === 'jspk10')[0];
});

// 從彩種頁面過來的彩種
const trendTarget = computed(() => commonStore.trendTarget);

const selectedTarget = ref(Object.keys(trendTarget.value).length !== 0 ? currentLottery.value : lotteryItem.value);
// 如果彩种状态不是开启 就不show
const isShowBetBar = ref(true);

const goBet = () => {
    commonStore.setCurrentLottery(selectedTarget.value);
    router.push(`/play/${selectedTarget.value.parentCode}/${selectedTarget.value.code}`);
};

const handleUpdate = newTarget => {
    selectedTarget.value = newTarget;
    getResultHistory();
    getNextLotteryNum();
};

const active = ref('开奖号码');
const onChangeTab = value => {
    active.value = value;
    setIsOpenDrawer(false);
};

const tabList = computed(() => {
    return allPlaysTrend[selectedTarget.value.parentCode] || [{}];
});

const filteredNumberTabList = computed(() => {
    return tabList.value.filter(item => typeof item.value !== 'string' || item.value === '0');
});

const filteredStringTabList = computed(() => {
    return tabList.value.filter(item => typeof item.value === 'string' && item.value !== '0');
});

const isDrawerOpen = ref(false);
const setIsOpenDrawer = value => {
    isDrawerOpen.value = value;
};
// 取得下期的开奖结果跟开奖时间
const nextLotteryData = ref({ nextLotteryData: '', nextStopTime: '0' });
const getNextLotteryNum = () => {
    getStatus({ lotteryCode: selectedTarget.value.code }).then(res => {
        // status 1 0 2 启用 禁用 维护
        if (res.status !== 1) {
            showToast('此彩种未启用');
            isShowBetBar.value = false;
            return;
        }
        isShowBetBar.value = true;
        pcLoadKgGameResult({ lotteryCode: selectedTarget.value.code }).then(res => {
            nextLotteryData.value = res;
        });
    });
};

const resultHistory = ref([]);
const loading = ref(false);
const lotteryPlay = ref([]);

const getResultHistory = () => {
    loading.value = true;
    resultHistory.value = [];
    getWinningNumbers({
        lotteryCode: selectedTarget.value.code,
        typeCode: selectedTarget.value.parentCode
    })
        .then(res => {
            loading.value = false;
            resultHistory.value = res.slice(0, 50);
        })
        .catch(error => {
            showToast(error.message ? error.message : '系統錯誤,請聯繫客服');
        })
        .finally(() => {
            loading.value = false;
            showToast('已更新最新开奖结果');
        });
};

const refreshData = () => {
    setTimeout(() => {
        getResultHistory();
    }, 10000);
    getNextLotteryNum();
};

onMounted(() => {
    getResultHistory();
    getNextLotteryNum();
});
</script>
<template>
    <div class="trend relative">
        <Header title="走势图" />
        <LotterySelect :selectedTarget="selectedTarget" @update:selectedTarget="handleUpdate" @update:isDrawerOpen="setIsOpenDrawer" />
        <div class="flex align-baseline justify-between px-3 mb-3">
            <div v-if="isShowBetBar" class="text-[#63666F] text-sm flex">
                <p class="text-sm font-light">第{{ issueDisplay(nextLotteryData.nextLotteryNum) }}期 投注截止</p>
                <Timer class="text-[#1E8EF5] font-semibold text-sm" v-model:time="nextLotteryData.nextStopTime" :callback="refreshData" />
            </div>
            <button class="betBtn" @click="goBet">去投注</button>
        </div>
        <TabContainer
            :loading="loading"
            :resultHistory="resultHistory"
            :active="active"
            @update:active="onChangeTab"
            @update:isDrawerOpen="setIsOpenDrawer"
            :tabList="tabList"
            :selectedTarget="selectedTarget.parentCode"
        />
        <CTabbar />
    </div>
    <Transition name="fade">
        <div class="drawer-mask" @click="setIsOpenDrawer(false)" v-if="isDrawerOpen"></div>
    </Transition>
    <Transition name="slide-fade">
        <div class="typeBox" v-if="isDrawerOpen">
            <div class="text-sm text-[#697281] mb-2">号码</div>
            <div class="flex flex-wrap gap-2">
                <div @click="onChangeTab(item.label)" :class="['btn', active === item.label ? 'active' : 'common']" v-for="item in filteredNumberTabList" :key="item.value">
                    {{ item.label }}
                </div>
            </div>
            <template v-if="filteredStringTabList.length > 0">
                <div class="text-sm text-[#697281] mb-2 mt-4">形态</div>
                <div class="flex flex-wrap gap-2">
                    <div @click="onChangeTab(item.label)" :class="['btn', active === item.label ? 'active' : 'common']" v-for="item in filteredStringTabList" :key="item.value">
                        {{ item.label }}
                    </div>
                </div>
            </template>
        </div>
    </Transition>
</template>
<style lang="scss" scoped>
.trend {
    height: 100%;
    overflow: hidden;
    .betBtn {
        border: 1px solid #1e8ef5;
        border-radius: 4px;
        padding: 2px;
        color: #1e8ef5;
        font-size: 12px;
        word-wrap: none;
    }
}

.typeBox {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 85%;
    height: calc(100% - 130px);
    padding: 12px 16px;
    background-color: #fff;
    z-index: 1000;

    .btn {
        min-width: 84px;
        height: 33px;
        line-height: 33px;
        border-radius: 6px;
        text-align: center;
        font-size: 12px;
        text-wrap: none;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    }

    .common {
        border: 1px solid rgba(60, 93, 157, 0.2);
        color: #484848;
    }

    .active {
        background: #1e8ef5;
        color: #fff;
        box-shadow: none;
    }
}

.drawer-mask {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    height: calc(100% - 130px);
    background-color: rgba(0, 0, 0, 0.6);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(100%);
}
</style>
