<template>
    <div class="container">
        <div :class="{ layoutOld: isAndroid(), layout: !isAndroid() }">
            <Loading v-if="isLoading" />
            <NoData v-if="data.length === 0 && !isLoading" text="暂无内容" />
            <div v-else class="item px-2.5 mb-2.5" v-for="(item, i) in data" :key="i">
                <div class="flex justify-between items-center pt-2">
                    <div class="lotteryName">
                        {{ item.lotteryName }}
                    </div>
                    <div class="nextOpenTime">
                        <Timer v-model:time="item.nextOpenTime" :callback="updateData" />
                    </div>
                </div>

                <div class="flex justify-between items-center mt-1 mb-1.5">
                    <div class="playTypeName">
                        {{ item.playTypeName }}
                    </div>
                    <div class="prettyRoadName">
                        {{ item.prettyRoadName }}
                    </div>
                </div>
                <div>
                    <CanvasImg :data="item.detail" :isMore="false" imageType="string" class="_pic" />
                </div>

                <div class="flex items-center justify-between pb-3.5 pt-2.5">
                    <div
                        class="btn flex justify-center items-center"
                        v-for="(odds, index) in item.odds"
                        :key="index"
                        :class="{ active: isActive === `${item.parentCode}_${item.lotteryCode}_${odds.playCode}_${item.prettyRoadCode}` }"
                        @click="betLottery(item, odds)"
                    >
                        投
                        <span class="mx-1" :style="{ color: filterColor(item, odds) }">
                            {{ ['大', '双', '龙', '质', '小', '单', '虎', '合', '和'].find(text => odds.playName.includes(text)) }}
                        </span>
                        {{ odds.odds }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div :class="{ holder: isShowBetArea, holderH: !isShowBetArea }"></div>
    <HaoluBetArea :isShowBetArea="isShowBetArea" :itemData="itemData" :issueList="issueList" :isBet="isBet" @update:reset="resetIsBet" :isOneLottery="false" />
</template>

<script setup>
import CanvasImg from '@/components/public/CanvasImg.vue';
import Timer from '@/views/home/Timer.vue';
import { computed, ref, defineEmits, watch } from 'vue';
import NoData from '@/components/public/NoData.vue';
import Loading from '@/components/public/Loading.vue';
import HaoluBetArea from './HaoluBetArea.vue';
import { chaseNumberList } from '@/api/interface';
import { issueDisplay } from '@/util/tools';
import useCommonStore from '@/store/modules/common';
import { showToast } from 'vant';

const props = defineProps({
    data: Array,
    isLoading: Boolean
});

const itemData = ref({});
const issueList = ref([]);
const commonStore = useCommonStore();

const emit = defineEmits(['update:callback']);

const getStyle = (i, triger) => {
    const [a, b] = triger ? ['#F24848', '#40A1FB'] : ['#40A1FB', '#F24848'];
    return i === '和' ? 'rgba(65,180,130,1)' : ['大', '单', '龙'].includes(i) ? b : a;
};

const updateData = () => {
    emit('update:callback');
    isActive.value = '';
    isShowBetArea.value = false;
    showToast('期号已更新');
};

const filterColor = (item, odd) => {
    const blueColor = ['小', '双', '龙', '质'];
    const redColor = ['大', '单', '虎', '合'];
    const greenColor = ['和'];
    const isBlueColor = blueColor.some(text => odd.playName.includes(text));
    const isRedColor = redColor.some(text => odd.playName.includes(text));
    const isGreenColor = greenColor.some(text => odd.playName.includes(text));
    const isWhite = isActive.value === `${item.parentCode}_${item.lotteryCode}_${odd.playCode}_${item.prettyRoadCode}`;
    if (isWhite) {
        return '#ffffff';
    } else {
        if (isBlueColor) {
            return '#1e8ef5';
        } else if (isRedColor) {
            return '#F24848';
        } else if (isGreenColor) {
            return '#17b74c';
        }
    }
};

const isShowBetArea = ref(false);
const isActive = ref([]);
const isBet = ref({});

const betLottery = (item, odd) => {
    isBet.value = [];
    const name = ['大', '双', '龙', '质', '小', '单', '虎', '合', '和'].find(text => odd.playName.includes(text));
    isBet.value.push({
        choose: false,
        playTypeName: `${item.playTypeName}-${name}`,
        odds: odd.odds,
        playCode: odd.playCode,
        playTypeCode: odd.playTypeCode,
        name: odd.playName,
        lotteryCode: item.lotteryCode,
        lotteryName: item.lotteryName,
        nextLotteryNum: item.nextLotteryNum
    });
    isActive.value =
        isActive.value === `${item.parentCode}_${item.lotteryCode}_${odd.playCode}_${item.prettyRoadCode}` ? '' : `${item.parentCode}_${item.lotteryCode}_${odd.playCode}_${item.prettyRoadCode}`;
    itemData.value = item;
    commonStore.analyzeInfo = item;
    if (item.lotteryCode !== commonStore.betData[0]?.lotteryCode) {
        commonStore.cartData = [];
    }
    commonStore.betData = isBet.value;
    getChaseNumberList();
};

const resetIsBet = () => {
    isBet.value = [];
    isActive.value = '';
    isShowBetArea.value = false;
};

const isExist = (item, playCode) => {
    return isBet.value.findIndex(betItem => betItem.playTypeName === item.playTypeName && betItem.playCode === playCode);
};

const getChaseNumberList = () => {
    isShowBetArea.value = isActive.value ? true : false;
    chaseNumberList({ lotteryCode: isBet.value[0].lotteryCode })
        .then(res => {
            issueList.value = res.map(_ => {
                return {
                    ..._,
                    lotteryNumDisplay: issueDisplay(_.lotteryNum)
                };
            });
        })
        .catch(error => {
            console.log(error);
        });
};

const isAndroid = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android/i.test(userAgent);
};

watch(
    () => props.data,
    newValue => {
        const info = newValue.filter(item => item.playTypCode === itemData.value.playTypCode && item.prettyRoadCode === itemData.value.prettyRoadCode);
        commonStore.analyzeInfo = info;
    }
);

watch(
    () => itemData.value,
    newValue => {
        if (!props.data.length) {
            isShowBetArea.value = false;
        }
        const info = props.data.filter(item => item.typeCode === newValue.typeCode);
        commonStore.analyzeInfo = info;
    },
    { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.container {
    background-color: #eff2f5;
    .layout {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        will-change: transform;
        transform: translateZ(0);
    }
    .layoutOld {
        height: 100%;
        overflow-y: auto;
    }

    .item {
        background-color: #fff;
    }

    .lotteryName {
        font-weight: 500;
        font-size: 13px;
        line-height: 18px;
        color: #464c54;
    }
    .nextOpenTime {
        height: 18px;
        padding: 0px 6px;
        background: rgba(30, 142, 245, 0.1);
        border-radius: 2px;
        font-family: 'WeChat Sans Std';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 18px;
        color: #1e8ef5;
    }
    .playTypeName {
        font-size: 13px;
        line-height: 18px;

        color: #464c54;
    }
    .prettyRoadName {
        font-size: 13px;
        line-height: 18px;

        color: #1e8ef5;
    }

    .btn {
        height: 35px;
        width: calc(50% - 4px);
        background: #ffffff;
        border: 0.5px solid rgba(60, 93, 157, 0.2);
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        font-weight: 500;
        font-size: 13px;
        line-height: 35px;
        color: #464c54;
    }

    .active {
        background-color: #40a1fb;
        color: #fff;
    }

    .cF24848 {
        color: #f24848;
    }

    .c40A1FB {
        color: #40a1fb;
    }
}

.holder {
    height: 100px;
    width: 100%;
}

.holderH {
    height: 100px;
    width: 100%;
}
</style>
