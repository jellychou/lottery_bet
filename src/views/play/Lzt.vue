<template>
    <div class="flex">
        <div class="play-sidebar">
            <van-sidebar v-model="active" @change="onChangeType">
                <van-sidebar-item v-for="(item, i) in sidebarValue" :key="item.code">
                    <template #title>
                        <div class="title flex items-center">
                            <div class="line" v-if="active == i" />
                            <div class="ml-1">{{ item.label }}</div>
                        </div>
                    </template>
                </van-sidebar-item>
            </van-sidebar>
        </div>
        <div class="holder"></div>

        <div class="p-2.5" :class="{ displayOld: isAndroid(), display: !isAndroid() }">
            <Loading v-if="isLoading" />
            <NoData v-if="!isLoading && Object.keys(lztData ?? {}).length === 0" text="暂无内容" :active="active" />
            <van-tabs v-if="!isLoading && Object.keys(lztData ?? {}).length > 0" v-model:active="curPlay" class="tabs mb-2.5" line-height="0" shrink>
                <van-tab v-for="(it, i) in sidebarValue[active].children" :key="i" :title="it.label"></van-tab>
            </van-tabs>
            <div v-if="!isLoading && Object.keys(lztData ?? {}).length > 0">
                <CanvasImg class="_pic picTop" :data="useCurLztData" :isMore="true" imageType="string" :correctValue="correctValue" />
                <div class="flex items-center">
                    <div class="bili flex-1 flex flex-col justify-between pt-1">
                        <div class="relative pl-2">
                            <span class="cF24848 bF24848">{{ filterText[0] }}</span>
                            {{ big }} ({{ big }}%)
                        </div>
                        <div class="relative pl-2">
                            <span class="c40A1FB b40A1FB">{{ filterText[1] }}</span>
                            {{ small }} ({{ small }}%)
                        </div>
                    </div>
                    <div class="wenlu flex flex-col justify-center items-center" :class="{ predictActive: choseIndex === 'big' }" @click="handleChose('big', filterText[0])">
                        <div class="pb-1">
                            下期
                            <span class="cF24848">{{ filterText[0] }}</span>
                        </div>
                        <img src="./assets/wenlu_cF24848.png" width="36" />
                    </div>
                    <div class="wenlu flex flex-col justify-center items-center ml-1" :class="{ predictActive: choseIndex === 'small' }" @click="handleChose('small', filterText[1])">
                        <div class="pb-1">
                            下期
                            <span class="c40A1FB">{{ filterText[1] }}</span>
                        </div>
                        <img src="./assets/wenlu_c40A1FB.png" width="36" />
                    </div>
                </div>
                <CanvasImg class="_pic picTop mb-2" :data="useBigEyeLztData" :isMore="true" imageType="stokeCircle" :active="active" />
                <CanvasImg class="_pic picTop mb-2" :data="useSmallEyeLztData" :isMore="true" imageType="fillCircle" :active="active" />
                <CanvasImg class="_pic picTop mb-2" :data="useCockroachLztData" :isMore="true" imageType="line" :active="active" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Lzt'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, onUnmounted, watchEffect, watch, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { session } from '@/util/storage';
import { getSiteCode, getToken } from '@/util/cach';
import { issueDisplay } from '@/util/tools';
import lzt from '@/data/lzt'; // 所有大彩种玩法数据
import CanvasImg from '@/components/public/CanvasImg.vue';
import PlaySidebarVue from './PlaySidebar.vue';
import { queryRoadPic } from '@/api/interface';
import { getCurrentLottery } from '@/util/cach';
import Loading from '@/components/public/Loading.vue';
import NoData from '@/components/public/NoData.vue';

const { t, locale } = useI18n();
const commonStore = useCommonStore();

const result = ref(Array(4).fill([]));
const disIndex = ref(0);
const preData = ref({});
const active = ref(0); // 左侧侧边栏索引
const curPlay = ref(0); // 玩法索引
const canvasRef = ref('');
const lztData = ref({});
const choseIndex = ref(''); // 0 小, 1大
const tId = ref(null); // 问路闪烁定时器
const originData = ref([]);
const useCurLztData = ref([]);
const useBigEyeLztData = ref([]);
const useSmallEyeLztData = ref([]);
const useCockroachLztData = ref([]);
const isLoading = ref(false);
const isDetailChangeLine = ref('-1'); // 0 不換行, 1 換行 detail使用
const isBigEyeLztChangeLine = ref('-1'); // 0 不換行, 1 換行 bigEye使用
const isSmallEyeLztChangeLine = ref('-1'); // 0 不換行, 1 換行 smallEye使用
const isCockroachLztChangeLine = ref('-1'); // 0 不換行, 1 換行 cockr使用
const isDetailReset = ref(false); // detail使用
const isBigEyeLztReset = ref(false); // bigEye使用
const isSmallEyeLztReset = ref(false); // smallEye使用
const isCockroachLztReset = ref(false); // cockr使用
const correctValue = ref('');
const lztText = ref('');

const currentLottery = computed(() => commonStore.currentLottery);

const sidebarValue = computed(() => lzt[currentLottery.value.parentCode] || [{}]);

const playType = computed(() => sidebarValue.value[active.value]?.children?.[curPlay.value]?.value ?? null);

const curLztData = computed(() => {
    if (!lztData.value) return {};
    let data = lztData.value.roadDetails?.find(e => e.playTypCode === playType.value)?.detail || [];
    return (data = data.map(item => item.replace(/,?(big|small)/g, '')).filter(item => item !== ''));
});

const bigEyeLztData = computed(() => {
    if (!lztData.value) return {};
    let data = lztData.value.roadDetails?.find(e => e.playTypCode === playType.value)?.bigEyeDetail || [];
    return (data = data.map(item => item.replace(/,?(big|small)/g, '')).filter(item => item !== ''));
});

const smallEyeLztData = computed(() => {
    if (!lztData.value) return {};
    let data = lztData.value.roadDetails?.find(e => e.playTypCode === playType.value)?.smallRoadDetail || [];
    return (data = data.map(item => item.replace(/,?(big|small)/g, '')).filter(item => item !== ''));
});

const cockroachLztData = computed(() => {
    if (!lztData.value) return {};
    let data = lztData.value.roadDetails?.find(e => e.playTypCode === playType.value)?.cockroachDetail || [];
    return (data = data.map(item => item.replace(/,?(big|small)/g, '')).filter(item => item !== ''));
});

const big = computed(() => {
    const findRate = lztData.value.playRates?.find(e => e.playType == playType.value);
    if (findRate !== undefined) {
        let r = lztData.value.playRates?.find(e => e.playType == playType.value).rates[0]?.rate || 0;
        return Math.round(r * 100) ? Math.round(r * 100) : 0;
    }
    return 0;
});

const small = computed(() => {
    const findRate = lztData.value.playRates?.find(e => e.playType == playType.value);
    if (findRate !== undefined) {
        let r = lztData.value.playRates?.find(e => e.playType == playType.value).rates[1]?.rate || 0;
        return Math.round(r * 100) ? Math.round(r * 100) : 0;
    }
    return 0;
});

const filterText = computed(() => {
    const label = sidebarValue.value[active.value]?.children?.[curPlay.value]?.label ?? '';
    const arr = label.split('');
    if (label.length > 2) {
        return arr.slice(1);
    }
    return arr;
});

const handleChose = async (i, name) => {
    const currentLottery = getCurrentLottery();

    if (choseIndex.value === i) {
        choseIndex.value = '';
        lztData.value = JSON.parse(storedData || '{}');
        isDetailChangeLine.value = '-1';
        isBigEyeLztChangeLine.value = '-1';
        isSmallEyeLztChangeLine.value = '-1';
        isCockroachLztChangeLine.value = '-1';

        isDetailReset.value = false;
        isBigEyeLztReset.value = false;
        isSmallEyeLztReset.value = false;
        isCockroachLztReset.value = false;
        return;
    } else {
        choseIndex.value = i;
        correctValue.value = name;
    }

    let detailChangeLine = false;
    let bigEyeLztChangeLine = false;
    let smallEyeLztChangeLine = false;
    let cockroachLztChangeLine = false;

    if (i !== '') {
        const detailLastItem = curLztData.value[0]?.split(',').pop();
        const bigEyeLztLastItem = bigEyeLztData.value[0]?.split(',').pop();
        const smallEyeLztLastItem = smallEyeLztData.value[0]?.split(',').pop();
        const cockroachLztLastItem = cockroachLztData.value[0]?.split(',').pop();
        if ((i === 'big' && !['大', '单', '龙', '质', 'big'].includes(detailLastItem)) || (i === 'small' && !['小', '双', '虎', '合', 'small'].includes(detailLastItem))) {
            detailChangeLine = true;
        }
        if ((i === 'big' && !['大', '单', '龙', '质', 'big'].includes(bigEyeLztLastItem)) || (i === 'small' && !['小', '双', '虎', '合', 'small'].includes(bigEyeLztLastItem))) {
            bigEyeLztChangeLine = true;
        }
        if ((i === 'big' && !['大', '单', '龙', '质', 'big'].includes(smallEyeLztLastItem)) || (i === 'small' && !['小', '双', '虎', '合', 'small'].includes(smallEyeLztLastItem))) {
            smallEyeLztChangeLine = true;
        }
        if ((i === 'big' && !['大', '单', '龙', '质', 'big'].includes(cockroachLztLastItem)) || (i === 'small' && !['小', '双', '虎', '合', 'small'].includes(cockroachLztLastItem))) {
            cockroachLztChangeLine = true;
        }
    }

    isDetailChangeLine.value = detailChangeLine ? '1' : '0';
    isBigEyeLztChangeLine.value = bigEyeLztChangeLine ? '1' : '0';
    isSmallEyeLztChangeLine.value = smallEyeLztChangeLine ? '1' : '0';
    isCockroachLztChangeLine.value = cockroachLztChangeLine ? '1' : '0';

    isDetailReset.value = false;
    isBigEyeLztReset.value = false;
    isSmallEyeLztReset.value = false;
    isCockroachLztReset.value = false;
};

const getData = () => {
    const typeList = sidebarValue.value[active.value].children.map(item => item.value);
    const currentLottery = getCurrentLottery();

    queryRoadPic({
        limit: 100,
        calculateRate: false,
        lotteryInfo: [
            {
                lotteryCode: currentLottery.code,
                lotteryTypeCode: currentLottery.parentCode
            }
        ],
        playTypes: typeList
    })
        .then(res => {
            lztData.value = res[0];
            originData.value = res[0];
            let lztList = lztData.value.roadDetails?.find(e => e.playTypCode === playType.value) || [];
            commonStore.betLztData = lztList;
        })
        .catch(error => {})
        .finally(() => {
            isLoading.value = false;
        });
};

const onChangeType = () => {
    const typeList = sidebarValue.value[active.value].children.map(item => item.value);
    const currentLottery = getCurrentLottery();
    isLoading.value = true;

    queryRoadPic({
        limit: 100,
        calculateRate: false,
        lotteryInfo: [
            {
                lotteryCode: currentLottery.code,
                lotteryTypeCode: currentLottery.parentCode
            }
        ],
        playTypes: typeList
    })
        .then(res => {
            lztData.value = res[0];
            originData.value = res[0];
            let lztList = lztData.value.roadDetails?.find(e => e.playTypCode === playType.value) || [];
            commonStore.betLztData = lztList;
        })
        .catch(error => {})
        .finally(() => {
            isLoading.value = false;
        });
};

watch(
    () => [active.value, curPlay.value],
    value => {
        choseIndex.value = '';
        isDetailChangeLine.value = '-1';
        isBigEyeLztChangeLine.value = '-1';
        isSmallEyeLztChangeLine.value = '-1';
        isCockroachLztChangeLine.value = '-1';
        isDetailReset.value = false;
        isBigEyeLztReset.value = false;
        isSmallEyeLztReset.value = false;
        isCockroachLztReset.value = false;
    }
);

watchEffect(() => {
    let data = Array.isArray(curLztData.value) ? curLztData.value.slice() : [];
    const firstItemParts = data[0] ? data[0].split(',') : [''];
    if (choseIndex.value === 'big') {
        ['大', '单', '龙', '质', '特大', '特单', '特合大', '特合单', '合大', '合单', '总大', '总单'].some(text => firstItemParts.includes(text))
            ? (isDetailChangeLine.value = '0')
            : (isDetailChangeLine.value = '1');
    } else if (choseIndex.value === 'small') {
        ['小', '双', '虎', '合', '特小', '特双', '特合小', '特合双', '合小', '合双', '总小', '总双'].some(text => firstItemParts.includes(text))
            ? (isDetailChangeLine.value = '0')
            : (isDetailChangeLine.value = '1');
    } else {
        isDetailChangeLine.value = '-1';
    }

    if (isDetailChangeLine.value === '1' && data.length !== 0 && !isDetailReset.value) {
        data.unshift(choseIndex.value);
        isDetailReset.value = true;
    } else if (isDetailChangeLine.value === '0' && data.length !== 0 && !isDetailReset.value) {
        data[0] += `,${choseIndex.value}`;
        isDetailReset.value = true;
    }

    isDetailReset.value = false;
    useCurLztData.value = data;
});

watchEffect(() => {
    let data = Array.isArray(bigEyeLztData.value) ? bigEyeLztData.value.slice() : [];
    const firstItemParts = data[0] ? data[0].split(',') : [''];

    if (choseIndex.value === 'big') {
        ['大', '单', '龙', '质', '特大', '特单', '特合大', '特合单', '合大', '合单', '总大', '总单'].some(text => firstItemParts.includes(text))
            ? (isBigEyeLztChangeLine.value = '0')
            : (isBigEyeLztChangeLine.value = '1');
    } else if (choseIndex.value === 'small') {
        ['小', '双', '虎', '合', '特小', '特双', '特合小', '特合双', '合小', '合双', '总小', '总双'].some(text => firstItemParts.includes(text))
            ? (isBigEyeLztChangeLine.value = '0')
            : (isBigEyeLztChangeLine.value = '1');
    } else {
        isBigEyeLztChangeLine.value = '-1';
    }
    if (isBigEyeLztChangeLine.value === '1' && data.length !== 0 && !isBigEyeLztReset.value) {
        data.unshift(choseIndex.value);
        isBigEyeLztReset.value = true;
    } else if (isBigEyeLztChangeLine.value === '0' && data.length !== 0 && !isBigEyeLztReset.value) {
        data[0] += `,${choseIndex.value}`;
        isBigEyeLztReset.value = true;
    }

    isBigEyeLztReset.value = false;
    useBigEyeLztData.value = data;
});

watchEffect(() => {
    let data = Array.isArray(smallEyeLztData.value) ? smallEyeLztData.value.slice() : [];
    const firstItemParts = data[0] ? data[0].split(',') : [''];

    if (choseIndex.value === 'big') {
        ['大', '单', '龙', '质', '特大', '特单', '特合大', '特合单', '合大', '合单', '总大', '总单'].some(text => firstItemParts.includes(text))
            ? (isSmallEyeLztChangeLine.value = '0')
            : (isSmallEyeLztChangeLine.value = '1');
    } else if (choseIndex.value === 'small') {
        ['小', '双', '虎', '合', '特小', '特双', '特合小', '特合双', '合小', '合双', '总小', '总双'].some(text => firstItemParts.includes(text))
            ? (isSmallEyeLztChangeLine.value = '0')
            : (isSmallEyeLztChangeLine.value = '1');
    } else {
        isSmallEyeLztChangeLine.value = '-1';
    }

    if (isSmallEyeLztChangeLine.value === '1' && data.length !== 0 && !isSmallEyeLztReset.value) {
        data.unshift(choseIndex.value);
        isSmallEyeLztReset.value = true;
    } else if (isSmallEyeLztChangeLine.value === '0' && data.length !== 0 && !isSmallEyeLztReset.value) {
        data[0] += `,${choseIndex.value}`;
        isSmallEyeLztReset.value = true;
    }

    isSmallEyeLztReset.value = false;
    useSmallEyeLztData.value = data;
});

watchEffect(() => {
    let data = Array.isArray(cockroachLztData.value) ? cockroachLztData.value.slice() : [];
    const firstItemParts = data[0] ? data[0].split(',') : [''];

    if (choseIndex.value === 'big') {
        ['大', '单', '龙', '质', '特大', '特单', '特合大', '特合单', '合大', '合单', '总大', '总单'].some(text => firstItemParts.includes(text))
            ? (isCockroachLztChangeLine.value = '0')
            : (isCockroachLztChangeLine.value = '1');
    } else if (choseIndex.value === 'small') {
        ['小', '双', '虎', '合', '特小', '特双', '特合小', '特合双', '合小', '合双', '总小', '总双'].some(text => firstItemParts.includes(text))
            ? (isCockroachLztChangeLine.value = '0')
            : (isCockroachLztChangeLine.value = '1');
    } else {
        isCockroachLztChangeLine.value = '-1';
    }

    if (isCockroachLztChangeLine.value === '1' && data.length !== 0 && !isCockroachLztReset.value) {
        data.unshift(choseIndex.value);
        isCockroachLztReset.value = true;
    } else if (isCockroachLztChangeLine.value === '0' && data.length !== 0 && !isCockroachLztReset.value) {
        data[0] += `,${choseIndex.value}`;
        isCockroachLztReset.value = true;
    }

    isCockroachLztReset.value = false;
    useCockroachLztData.value = data;
});

watch(
    () => playType.value,
    newType => {
        if (Object.keys(lztData.value ?? {}).length === 0) {
            return;
        }

        const lztList = lztData.value.roadDetails?.find(e => e.playTypCode === newType) || [];
        commonStore.betLztData = lztList;
    }
);

const isAndroid = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android/i.test(userAgent);
};

onMounted(() => {
    isLoading.value = true;
    getData();
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
    _TimerAdapter.listen('lotteryDrawingFinished', getData);
});

onUnmounted(() => {
    clearInterval(tId.value);
    _TimerAdapter.remove('lotteryDrawingFinished', getData);
});
</script>
<style lang="scss" scoped>
.holder {
    width: 80px;
    height: calc(100dvh - 336px);
}
.play-sidebar {
    width: 82px;
    height: calc(100dvh - 336px);
    overflow-y: auto;
    background: #eff2f5;
    position: fixed;
    :deep(.van-sidebar) {
        width: 82px;
        padding: 5px 0px;
        .van-sidebar-item {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0px 0px 0px 0px;
            margin-left: 6px;
            background: #eff2f5;
            overflow: unset;
        }
        .van-sidebar-item__text {
            font-size: 13px;
            color: #576170;
        }
        .van-sidebar-item--select {
            position: relative;
            padding: 0px;
            background: linear-gradient(90deg, #ffffff -1.98%, #ffffff 100%);
            border-radius: 10px 0px 0px 10px;
            .van-sidebar-item__text {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: 600;
                color: #484848;
                .line {
                    position: absolute;
                    left: 0px;
                    top: 16px;
                    width: 3px;
                    height: 18px;
                    background: #1e8ef5;
                    border-radius: 0px 4px 4px 0px;
                }
            }

            .van-sidebar-item__text:before,
            .van-sidebar-item__text:after {
                display: block;
                position: absolute;
                z-index: 99;
                content: '';
                width: 10px;
                height: 10px;
                border-radius: 100%;
                background-color: #eff2f5;
                right: 0px;
                z-index: 3;
            }
            .van-sidebar-item__text:before {
                top: -10px;
            }
            .van-sidebar-item__text:after {
                bottom: -10px;
            }
        }
        .van-sidebar-item--select:before,
        .van-sidebar-item--select:after {
            display: block;
            position: absolute;
            content: '';
            width: 5px;
            height: 5px;
            background-color: #fff;
            right: 0px;
            z-index: 2;
            left: unset;
            transform: unset;
        }

        .van-sidebar-item--select:before {
            top: -5px;
        }

        .van-sidebar-item--select:after {
            bottom: -5px;
        }
    }
}
.display {
    width: calc(100% - 82px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    will-change: transform;
    transform: translateZ(0);
}

.displayOld {
    width: calc(100% - 82px);
    overflow-y: scroll;
}

:deep(.tabs) {
    width: calc(100% - 30px);
    .van-tabs__wrap {
        height: 27px;
        .van-tabs__nav--complete {
            padding: 0px;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-x;
        }
        .van-tabs__nav {
            background: #fff;
            .van-tab {
                padding: 0px 10px;
                margin-right: 4px;
                font-size: 14px;
                line-height: 19px;
                color: #697281;
            }
            .van-tab--active {
                font-weight: 600;
                color: #ffffff;
                background: #1e8ef5;
                border-radius: 2px;
            }
        }
    }
}
.bili {
    height: 40px;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #60697a;
}
.wenlu {
    height: 40px;
    min-width: 84px;
    margin-top: 15px;
    margin-bottom: 10px;
    background: #ffffff;
    border: 1px solid rgba(60, 93, 157, 0.2);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    color: #60697a;
    &.active {
        border: 1px solid #1e8ef5;
    }
}
.cF24848 {
    color: #f24848;
}
.bF24848::before {
    content: '';
    display: block;
    position: absolute;
    left: 0px;
    top: 2.5px;
    background-color: #f24848;
    width: 2px;
    height: 10px;
}
.c40A1FB {
    color: #40a1fb;
}
.b40A1FB::before {
    content: '';
    display: block;
    position: absolute;
    left: 0px;
    top: 2.5px;
    background-color: #40a1fb;
    width: 2px;
    height: 10px;
}

._pic {
    width: 100%;
    height: 120px;
    border: 0.5px solid #ccc;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.predictActive {
    border: 1px solid #1e8ef5 !important;
}
</style>
