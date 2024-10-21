<template>
    <div class="container" :style="{ height: isShowBetArea ? 'calc(100dvh - 109px)' : 'calc(100dvh - 283px)' }">
        <div class="layout">
            <Loading v-if="isLoading" />
            <NoData v-if="filterData.length === 0 && !isLoading" text="暂无内容" />
            <div
                v-else
                :class="{ active: isActive === item.lotteryLocation, normal: isActive !== item.lotteryLocation }"
                class="item mt-2.5 p-2.5"
                v-for="(item, i) in filterData"
                :key="i"
                @click="selectItem(item)"
            >
                <div class="flex justify-between items-center">
                    <div class="playTypeName">{{ $t(`lottery.${item.play[0].lotteryCode}`) }}</div>
                    <div class="nextOpenTime">
                        <Timer v-model:time="item.nextOpenTime" :callback="getData" />
                    </div>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <div class="playName">{{ item.lotteryLocation }}</div>
                    <div class="continueIssue">
                        连出
                        <span>{{ item.lotteryContinuous }}</span>
                        期
                    </div>
                </div>
            </div>
        </div>
        <div class="footer w-full flex justify-between items-center pl-4 pr-5" @click="continuouslyIssuePopupShow = true">
            <div>
                连出期数:
                <span v-if="sliderValue[1] == 10">≥ {{ sliderValue[0] }}</span>
                <span v-else>{{ sliderValue[0] }} - {{ sliderValue[1] }}</span>
            </div>
            <div>
                <img src="./assets/arrow_down.png" width="9" />
            </div>
        </div>

        <!-- 连出期数设置弹窗 -->
        <van-popup v-model:show="continuouslyIssuePopupShow" class="continuouslyIssuePopup" position="bottom" round>
            <div class="title relative text-center">连出期数设置</div>

            <div class="wrapper pt-5 pb-7 px-2.5">
                <div class="flex justify-between items-center mb-6">
                    <div class="sub-title pl-2">连出期数</div>
                    <div class="value pr-3">{{ sliderValue[0] }} - {{ sliderValue[1] == 10 ? '10' : sliderValue[1] }}</div>
                </div>
                <div class="pl-2 pr-4">
                    <div class="flex justify-between">
                        <div class="scale" v-for="i in 9" :key="i"></div>
                    </div>
                    <van-slider v-model="sliderValue" :min="2" :max="10" range @change="onChange">
                        <template #left-button>
                            <div class="custom-button relative">
                                <div class="custom-button-value">{{ sliderValue[0] }}</div>
                            </div>
                        </template>
                        <template #right-button>
                            <div class="custom-button relative">
                                <div class="custom-button-value transform -left-1/2">{{ sliderValue[1] == 11 ? '10' : sliderValue[1] }}</div>
                            </div>
                        </template>
                    </van-slider>
                </div>
            </div>

            <div class="footer flex items-center justify-center">
                <div class="w-1/2" @click="sliderValue = [4, 10]">恢复默认</div>
                <div class="comfirm w-1/2" @click="onSave">保存设置</div>
            </div>
        </van-popup>
        <ChanglongBetArea
            :filterData="filterData"
            :isShowBetArea="isShowBetArea"
            :itemData="itemData"
            :issueList="issueList"
            :isBet="isBet"
            @update:betDetail="betDetail"
            @update:reset="resetIsBet"
            :isOneLottery="true"
            @update:isShowBetArea="closeShowBetArea"
        />
    </div>
</template>

<script>
export default {
    name: 'Changlong'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, onUnmounted, watch, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { session } from '@/util/storage';
import { getSiteCode, getToken } from '@/util/cach';
import { issueDisplay } from '@/util/tools';
import lzt from '@/data/lzt'; // 所有大彩种玩法数据
import PlaySidebarVue from './PlaySidebar.vue';
import { getTwoDrop } from '@/api/interface';
import Timer from '@/views/home/Timer.vue';
import NoData from '@/components/public/NoData.vue';
import Loading from '@/components/public/Loading.vue';
import { getCurrentLottery } from '@/util/cach';
import ChanglongBetArea from '@/components/public/ChanglongBetArea.vue';
import { chaseNumberList } from '@/api/interface';

const { t, locale } = useI18n();
const commonStore = useCommonStore();

const currentLottery = computed(() => commonStore.currentLottery);
const lotteryData = computed(() => commonStore.lotteryData);

const continuouslyIssuePopupShow = ref(false);
const sliderValue = ref([4, 10]);
const onChange = value => {
    if (value[1] === 10) {
        showToast(`当前值：${value[0]},10`);
    } else {
        showToast('当前值：' + value);
    }
};

const emit = defineEmits(['update:isShowBetArea']);

const data = ref([]);
const isLoading = ref(false);

const filterData = computed(() => {
    return sliderValue.value[1] > 10 ? data.value : data.value.filter(item => item.lotteryContinuous >= sliderValue.value[0] && item.lotteryContinuous <= sliderValue.value[1]);
});

const getData = () => {
    const currentLottery = getCurrentLottery();

    getTwoDrop({
        lotteryCodes: [currentLottery.code],
        continuous: sliderValue.value
    }).then(res => {
        data.value = res.winLongRank;
        sessionStorage.setItem(storageKey, JSON.stringify(data.value));
    });
};

const onSave = () => {
    continuouslyIssuePopupShow.value = false;
    getData(true);
};

const isActive = ref('');

const isShowBetArea = ref(false);
const isBet = ref([]);
const itemData = ref({});
const issueList = ref([]);

const selectItem = item => {
    isActive.value = isActive.value === item.lotteryLocation ? '' : item.lotteryLocation;
    itemData.value = item;
    commonStore.setHaoluChase(item);
    commonStore.analyzeInfo = item;
    isShowBetArea.value = isActive.value ? true : false;
    emit('update:isShowBetArea', isShowBetArea.value);
    commonStore.setIsActive('');
};

const betDetail = (item, odd) => {
    isBet.value = [];
    isBet.value.push({
        choose: false,
        name: odd.playName,
        odds: odd.odds,
        playCode: odd.playCode,
        playTypeCode: item.typeCode,
        playTypeName: `${item.lotteryLocation.split('-')[0]}-${odd.playName}`,
        lotteryCode: odd.lotteryCode
    });
    commonStore.betData = isBet.value;
    getChaseNumberList();
};

const getChaseNumberList = () => {
    isShowBetArea.value = isActive.value ? true : false;
    emit('update:isShowBetArea', isShowBetArea.value);
    chaseNumberList({ lotteryCode: itemData.value.play[0].lotteryCode })
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

const forceUpdateData = async () => {
    await getData(true);
    if (itemData.value) {
        const item = data.value.filter(item => item.typeCode === itemData.value.typeCode);
        itemData.value = item[0];
        commonStore.setHaoluChase(item[0]);
        commonStore.analyzeInfo = item[0];
    }
};

const resetIsBet = () => {
    isActive.value = '';
    commonStore.setHaoluChase({});
    itemData.value = {};
    commonStore.analyzeInfo = {};
    isShowBetArea.value = false;
    emit('update:isShowBetArea', false);
};

const closeShowBetArea = () => {
    isShowBetArea.value = false;
    emit('update:isShowBetArea', false);
};

watch(
    () => filterData.value,
    newValue => {
        if (!newValue.length) {
            isShowBetArea.value = false;
            emit('update:isShowBetArea', false);
        }
    }
);

watch(
    () => data.value,
    newValue => {
        const storedData = sessionStorage.getItem('storageKey');
        if (storedData) {
            const info = newValue.filter(item => item.typeCode === itemData.value.typeCode);
            if (!info.length) {
                isShowBetArea.value = false;
                emit('update:isShowBetArea', false);
            }
            commonStore.analyzeInfo = info;
        }
    }
);

watch(
    () => itemData.value,
    newValue => {
        if (!data.value.length) {
            isShowBetArea.value = false;
            emit('update:isShowBetArea', false);
        }
    },
    { immediate: true, deep: true }
);

onMounted(() => {
    isLoading.value = true;
    getData();
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
    _TimerAdapter.listen('lotteryDrawingFinished', forceUpdateData);
});
onUnmounted(() => {
    _TimerAdapter.remove('lotteryDrawingFinished', forceUpdateData);
});
</script>
<style lang="scss" scoped>
.container {
    background-color: #fff;
    padding: 0 8px;

    .layout {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        will-change: transform;
        transform: translateZ(0);
    }
    .item {
        height: 60px;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        .playTypeName {
            font-size: 12px;
            line-height: 17px;
            color: #929aa7;
        }
        .nextOpenTime {
            font-family: 'WeChat Sans Std';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 14px;
            color: #929aa7;
        }
        .playName {
            font-size: 13px;
            line-height: 18px;
            color: #464c54;
        }
        .continueIssue {
            font-size: 13px;
            line-height: 18px;
            color: #929aa7;
            span {
                font-family: 'WeChat Sans Std';
                font-style: normal;
                font-weight: 500;
                font-size: 14px;
                line-height: 15px;
                color: #f24848;
            }
        }
    }
}

.footer {
    position: fixed;
    bottom: 0;
    height: 50px;
    background: #ffffff;
    box-shadow: 0px -3px 3px rgba(234, 234, 234, 0.0867843);
    font-size: 14px;
    line-height: 19px;
    color: #464c54;
    span {
        font-size: 14px;
        line-height: 19px;
        color: #1e8ef5;
    }
}

:deep(.continuouslyIssuePopup) {
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
    .sub-title {
        font-size: 13px;
        line-height: 18px;
        color: #929aa7;
    }
    .value {
        font-size: 12px;
        line-height: 17px;
        color: #464c54;
    }
    .wrapper {
        background: #eff2f5;
        .scale {
            width: 1px;
            height: 5px;
            margin-bottom: -1px;
            background: #60697a;
        }
        .van-slider {
            background: #929aa7;
            .van-slider__bar {
                background: #60697a;
            }
            .custom-button {
                width: 10px;
                height: 10px;
                background: #1e8ef5;
                border-radius: 10px;
                .custom-button-value {
                    position: absolute;
                    bottom: 10px;
                    font-size: 12px;
                    line-height: 17px;
                    text-align: center;
                    color: #60697a;
                }
            }
        }
        .van-slider::before {
            content: '2';
            display: block;
            position: absolute;
            left: -2px;
            top: 6px;
            font-size: 10px;
            line-height: 14px;
            color: #60697a;
        }
        .van-slider::after {
            content: '10+';
            display: block;
            position: absolute;
            right: -6px;
            top: 6px;
            font-size: 10px;
            line-height: 14px;
            color: #60697a;
        }

        .van-slider::after {
            content: '10+';
            display: block;
            position: absolute;
            right: -8px;
            top: 6px;
            font-size: 10px;
            line-height: 14px;
            color: #60697a;
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

.active {
    border: 1px solid #1e8ef5;
    background-color: #1e8ef51a;
}

.normal {
    border: 1px solid #eceff5;
}
</style>
