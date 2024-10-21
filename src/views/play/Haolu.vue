<template>
    <div class="container" :style="{ height: isShowBetArea ? 'calc(100dvh - 340px)' : 'calc(100dvh - 283px)' }">
        <div :class="{ layoutOld: isAndroid(), layout: !isAndroid() }">
            <NoData v-if="data.length === 0 && !isLoading" text="暂无内容" />
            <Loading v-if="isLoading" />
            <div v-else class="item mb-1 px-2.5" v-for="(item, i) in data" :key="i">
                <div class="flex justify-between items-center pt-2">
                    <div class="lotteryName">
                        {{ item.lotteryName }}
                    </div>
                    <div class="nextOpenTime">
                        <Timer v-model:time="item.nextOpenTime" :callback="getData" />
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
                    <div class="btn flex justify-center items-center" v-for="(odds, index) in item.odds" :key="index" :class="{ active: isActive === odds.playCode }" @click="betLottery(item, odds)">
                        投
                        <span class="mx-1" :style="{ color: filterColor(odds) }">
                            {{ ['大', '双', '龙', '质', '小', '单', '虎', '合', '和'].find(text => odds.playName.includes(text)) }}
                        </span>
                        {{ odds.odds }}
                    </div>
                </div>
            </div>
        </div>
        <div class="footer w-full flex justify-center items-center" @click="prettyRoadCodePopupShow = true">形态设置</div>
        <!-- 形态设置弹窗 -->
        <van-popup v-model:show="prettyRoadCodePopupShow" class="prettyRoadCodePopup" position="bottom" round>
            <div class="title relative text-center">形态设置</div>

            <div class="wrapper grid grid-cols-4 gap-1 pt-4 pb-4 px-2.5">
                <div
                    class="item flex items-center justify-center overflow-hidden"
                    :class="{ active: item.choose }"
                    v-for="(item, index) in prettyRoadCodeOption"
                    :key="index"
                    @click="item.choose = item.choose == 1 ? 0 : 1"
                >
                    {{ item.label }}
                </div>
            </div>
            <div class="footer flex items-center justify-center">
                <div class="w-1/2" @click="reset">清空</div>
                <div class="w-1/2 comfirm" @click="onSave">保存设置</div>
            </div>
        </van-popup>
    </div>
    <HaoluBetArea :isShowBetArea="isShowBetArea" :itemData="itemData" :isBet="isBet" :issueList="issueList" @update:reset="resetIsBet" @update:chase="getChaseNumberList" :isOneLottery="true" />
</template>

<script>
export default {
    name: 'Haolu'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, onUnmounted, watch } from 'vue';
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
import { getPrettyRoad } from '@/api/interface';
import Timer from '@/views/home/Timer.vue';
import NoData from '@/components/public/NoData.vue';
import { getCurrentLottery } from '@/util/cach';
import Loading from '@/components/public/Loading.vue';
import HaoluBetArea from '@/components/public/HaoluBetArea.vue';
import { chaseNumberList } from '@/api/interface';

const { t, locale } = useI18n();
const commonStore = useCommonStore();

const emit = defineEmits(['update:isShowBetArea']);

const currentLottery = computed(() => commonStore.currentLottery);
const lotteryData = computed(() => commonStore.lotteryData);

const prettyRoadCodeOption = ref([
    { label: '长龙', value: 'LONG_QUEUE', choose: 1 },
    { label: '单跳', value: 'SINGLE_JUMP', choose: 0 },
    { label: '两房两厅', value: 'TWO_HOUSE_TWO_HALL', choose: 0 },
    { label: '两房一厅', value: 'TWO_HOUSE_ONE_HALL', choose: 0 },
    { label: '连续长连', value: 'LONG_CONTINUOUS', choose: 0 },
    { label: '不过三', value: 'NO_PASS_THREE', choose: 0 },
    { label: '常连', value: 'OFTEN_CONTINUOUS', choose: 0 },
    { label: '常跳', value: 'OFTEN_JUMP', choose: 0 }
]);

const prettyRoadCodePopupShow = ref(false);
const canvasRef = ref('');
const data = ref([]);
const isLoading = ref(false);

const filterColor = item => {
    const blueColor = ['大', '双', '龙', '质'];
    const redColor = ['小', '单', '虎', '合'];
    const greenColor = ['和'];
    const isBlueColor = blueColor.some(text => item.playName.includes(text));
    const isRedColor = redColor.some(text => item.playName.includes(text));
    const isGreenColor = greenColor.some(text => item.playName.includes(text));
    const isWhite = isActive.value === item.playCode;
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

const isActive = ref('');
const isShowBetArea = ref(false);
const isBet = ref([]);
const itemData = ref({});
const issueList = ref([]);

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
        nextLotteryNum: item.nextLotteryNum
    });

    isActive.value = isActive.value === odd.playCode ? '' : odd.playCode;
    itemData.value = item;
    commonStore.setHaoluChase(item);
    commonStore.analyzeInfo = item;
    if (item.lotteryCode !== commonStore.betData[0]?.lotteryCode) {
        commonStore.cartData = [];
    }
    commonStore.betData = isBet.value;
    isShowBetArea.value = true;
    emit('update:isShowBetArea', isShowBetArea.value);
    getChaseNumberList();
};

const resetIsBet = () => {
    isShowBetArea.value = false;
    emit('update:isShowBetArea', false);
    isBet.value = [];
    isActive.value = '';
    commonStore.setHaoluChase({});
};

const getChaseNumberList = () => {
    isShowBetArea.value = isActive.value ? true : false;
    emit('update:isShowBetArea', isShowBetArea.value);
    chaseNumberList({ lotteryCode: itemData.value.lotteryCode })
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

const getData = () => {
    let l = prettyRoadCodeOption.value.map(_ => _.choose == 1 && _.value);
    getPrettyRoad({
        calculateRate: false,
        limit: 144,
        lotteryInfo: [{ lotteryCode: currentLottery.code, lotteryTypeCode: currentLottery.fcode }],
        prettyRoadCode: l.filter(_ => _)
    }).then(res => {
        data.value = res;
    });
};

const onSave = () => {
    prettyRoadCodePopupShow.value = false;
    getData();
};

const reset = () => {
    prettyRoadCodeOption.value.forEach(_ => (_.choose = 0));
    getData();
};

watch(
    () => itemData.value,
    newValue => {
        if (!data.value.length) {
            isShowBetArea.value = false;
            emit('update:isShowBetArea', false);
        }
        const info = data.value.filter(item => item.playTypCode === newValue.playTypCode && item.prettyRoadCode === newValue.prettyRoadCode);
        commonStore.analyzeInfo = info;
    },
    { immediate: true, deep: true }
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
    _TimerAdapter.remove('lotteryDrawingFinished', getData);
});
</script>
<style lang="scss" scoped>
.container {
    background-color: #fff;
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
        background: #ffffff;
        box-shadow: 0px 6px 8px #f3f4f6;
        border-radius: 6px;
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
    }
}

.footer {
    height: 50px;
    background: #ffffff;
    box-shadow: 0px -3px 3px rgba(234, 234, 234, 0.0867843);
    font-weight: 500;
    font-size: 15px;
    color: #1e8ef5;
    border: 1px solid #f1f4f9;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

:deep(.prettyRoadCodePopup) {
    height: 197px;
    .title {
        height: 45px;
        line-height: 45px;
        font-weight: 500;
        font-size: 16px;
        color: #565f6c;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: #eff2f5;
        span {
            font-weight: 400;
            font-size: 15px;
            color: #60697a;
        }
    }
    .wrapper {
        background: #eff2f5;
        .item {
            height: 33px;
            background: #ffffff;
            border: 1px solid rgba(60, 93, 157, 0.2);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
            font-weight: 500;
            font-size: 13px;
            line-height: 33px;
            color: #60697a;
            &.active {
                background: #1e8ef5;
                color: #ffffff;
            }
        }
        .del1 {
            width: 35px;
            border-left: 1px solid rgba(60, 93, 157, 0.2);
        }
    }
    .footer {
        height: 50px;
        font-weight: 500;
        font-size: 16px;
        // line-height: 45px;
        text-align: center;
        color: #565f6c;
        .comfirm {
            height: 25px;
            border-left: 1px solid rgba(0, 0, 0, 0.1);
            color: #1e8ef5;
        }
    }
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
</style>
