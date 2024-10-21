<template>
    <div class="analyzeLayout">
        <div class="topFixed">
            <Header showLogo />
            <div class="tab">
                <div class="tabActive" :class="{ leftActive: tabIndex === 0, rightActive: tabIndex !== 0 }"></div>
                <div class="tab-item" :class="{ active: tabIndex === index }" v-for="(item, index) of tabList" :key="index" @click="changeTabs(index)">{{ item }}</div>
            </div>
        </div>
        <div class="holder"></div>
        <HaoluRecommend v-if="tabIndex === 0" @update:callback="reCallData" :data="data" :isLoading="isLoading" />
        <ChangLongSort v-if="tabIndex === 1" :data="changLongData" @update:callback="reCallDataChangLong" :isLoading="isLoading" />
        <div class="filter" v-if="tabIndex === 0">
            <div class="footerBar">
                <div class="lotteryType" @click="openLottery()">
                    <div>
                        彩种
                        <span class="lotteryLength">{{ lotteryActiveArr.length }}个</span>
                    </div>
                    <img src="./img/arrowUp.png" />
                </div>
                <div class="statusType" @click="openStatus()">
                    <div>形态选择</div>
                    <img src="./img/arrowUp.png" />
                </div>
            </div>
        </div>
        <div class="filter" v-if="tabIndex === 1">
            <div class="footerBar">
                <div class="lotteryType" @click="openLottery()">
                    <div>
                        彩种
                        <span class="lotteryLength">{{ lotteryActiveArr.length }}个</span>
                    </div>
                    <img src="./img/arrowUp.png" />
                </div>
                <div class="statusType" @click="openChangLongStatus()">
                    <div>
                        连出期数
                        <span class="text-sm text-sky-600">{{ filterContinue() }}</span>
                    </div>
                    <img src="./img/arrowUp.png" />
                </div>
            </div>
        </div>
        <div class="lottery">
            <van-popup v-model:show="lotteryPopupShow" class="lotteryPopupShow" position="bottom" round>
                <div class="typeBox">
                    <div class="title">彩种选择</div>
                    <div class="body">
                        <div class="lottery" v-for="itemList in lotteryList.filter(item => item.children.length !== 0)" :key="itemList.code">
                            <div v-if="filterShow(itemList.code)">
                                <div class="lotteryType pl-1">{{ itemList.label }}</div>
                                <div class="flex items-center flex-wrap">
                                    <div
                                        v-for="lottery in itemList.children"
                                        :key="lottery.code"
                                        class="lotteryButton"
                                        :class="{ active: lotteryActiveArr.some(item => item.lotteryCode === lottery.code) }"
                                        @click="getActiveLottery(lottery)"
                                    >
                                        {{ lottery.label }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="popFooter flex items-center justify-between">
                    <div class="w-1/2 flex items-center justify-center resetBtn" @click="onReset('lottery')">重置</div>
                    <div class="w-1/2 flex items-center justify-center saveBtn" @click="onSave('lottery')">保存设置</div>
                </div>
            </van-popup>
        </div>
        <van-popup v-model:show="statusPopupShow" class="statusPopupShow" position="bottom" round>
            <div class="statusBox">
                <div class="title">形态设置</div>
                <div class="body">
                    <div class="flex items-center flex-wrap justify-around">
                        <div v-for="(status, index) in prettyRoadCodeOption" :key="index" class="statusButton" :class="{ active: status.choose }" @click="status.choose = status.choose == 1 ? 0 : 1">
                            {{ status.label }}
                        </div>
                    </div>
                </div>
                <div class="popFooter flex items-center justify-between">
                    <div class="w-1/2 flex items-center justify-center resetBtn" @click="onReset('status')">清空</div>
                    <div class="w-1/2 flex items-center justify-center saveBtn" @click="onSave('status')">保存设置</div>
                </div>
            </div>
        </van-popup>
        <div class="analyze">
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
                                    <div class="custom-button-value transform -left-1/2">{{ sliderValue[1] == 10 ? '10' : sliderValue[1] }}</div>
                                </div>
                            </template>
                        </van-slider>
                    </div>
                </div>

                <div class="footer flex items-center justify-center">
                    <div class="w-1/2" @click="sliderValue = [4, 10]">恢复默认</div>
                    <div class="comfirm w-1/2" @click="onSaveContinuo">保存设置</div>
                </div>
            </van-popup>
        </div>
        <CTabbar />
    </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, onUnmounted, provide, ref, nextTick, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { showSuccessToast, showFailToast } from 'vant';
import CTabbar from '@/components/public/CTabbar.vue';
import HaoluRecommend from '@/components/public/HaoluRecommend.vue';
import useCommonStore from '@/store/modules/common';
import { session } from '@/util/storage';
import { getPrettyRoad, getTwoDrop } from '@/api/interface';
import _TimerAdapter from '@/util/timerAdapter';
import ChangLongSort from '@/components/public/ChangLongSort.vue';
import { getCurrentLottery } from '@/util/cach';

const tabList = ref(['好路推荐', '长龙排行']);
const tabIndex = ref(0);
const type = ref('类型选择');
const lotteryActiveArr = ref([]);
const statusActiveArr = ref([]);
const data = ref([]);
const changLongData = ref([]);
const tId = ref(null); // 问路闪烁定时器
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
const lotteryPopupShow = ref(false);
const statusPopupShow = ref(false);
const continuouslyIssuePopupShow = ref(false);
const sliderValue = ref([4, 10]);
const isLoading = ref(false);

const commonStore = useCommonStore();

const lotteryList = computed(() => commonStore.lotteryList);

const changeTabs = index => {
    tabIndex.value = index;
};

const openLottery = () => {
    lotteryPopupShow.value = true;
};

const openStatus = () => {
    statusPopupShow.value = true;
};

const onSave = type => {
    if (type === 'status') {
        statusPopupShow.value = false;
        session.save({ statusList: [statusActiveArr.value] });
    } else {
        lotteryPopupShow.value = false;
        session.save({ lotteryList: [lotteryActiveArr.value] });
    }
    getData();
    getChangLong();
};

const onReset = type => {
    if (type === 'status') {
        prettyRoadCodeOption.value.forEach(_ => (_.choose = 0));
    } else {
        lotteryActiveArr.value = [];
    }
    getData();
    getChangLong();
};

const getActiveLottery = items => {
    const data = {
        lotteryCode: items.code,
        lotteryTypeCode: items.fcode,
        label: items.label
    };
    const index = lotteryActiveArr.value.findIndex(item => item.lotteryCode === items.code);
    lotteryActiveArr.value.splice(0, 1);
    lotteryActiveArr.value.push(data);
};

const filterShow = code => {
    const notShowCodeArr = ['ssl', '3d', 'klc', 'klsf', 'hot'];
    const index = notShowCodeArr.findIndex(item => item === code);
    if (index === -1) {
        return true;
    } else {
        return false;
    }
};

const isRecall = ref(0);

const reCallData = () => {
    isRecall.value++;
    if (isRecall.value === 1) {
        getData();
    }
};

const isRecallCL = ref(0);

const reCallDataChangLong = () => {
    isRecallCL.value++;
    if (isRecallCL.value === 1) {
        getChangLong();
    }
};

const getActiveStatus = status => {
    const index = statusActiveArr.value.findIndex(item => item === status);
    if (index !== -1) {
        statusActiveArr.value.splice(index, 1);
    } else {
        statusActiveArr.value.push(status);
    }
};

const openChangLongStatus = () => {
    continuouslyIssuePopupShow.value = true;
};

const onSaveContinuo = () => {
    continuouslyIssuePopupShow.value = false;
    session.save({ continuoList: sliderValue.value });
    getData();
    getChangLong();
};

const getChangLong = () => {
    const currentLottery = getCurrentLottery();
    const params = session.get('lotteryList')[0].map(item => item.lotteryCode);
    getTwoDrop({
        lotteryCodes: params,
        continuous: sliderValue.value
    })
        .then(res => {
            changLongData.value = res.winLongRank;
        })
        .finally(() => {
            isRecallCL.value = 0;
        });
};

const getData = () => {
    let l = prettyRoadCodeOption.value.map(_ => _.choose == 1 && _.value);
    getPrettyRoad({
        calculateRate: false,
        limit: 144,
        lotteryInfo: session.get('lotteryList')[0],
        prettyRoadCode: l.filter(_ => _)
    })
        .then(res => {
            data.value = res;
        })
        .finally(() => {
            isRecall.value = 0;
        });
};

const filterContinue = () => {
    if (session.get('continuoList')[1] === 11) {
        return `≥${session.get('continuoList')[0]}`;
    } else if (session.get('continuoList')[0] === 2) {
        return `≤${session.get('continuoList')[0]}`;
    } else {
        return `${session.get('continuoList')[0]}-${session.get('continuoList')[1]}`;
    }
};

onMounted(() => {
    lotteryActiveArr.value = session.get('lotteryList') ? session.get('lotteryList')[0] : [];
    statusActiveArr.value = session.get('statusList') ? session.get('statusList')[0] : [];
    session.save({ continuoList: sliderValue.value });
    if (session.get('lotteryList') !== null) {
        isLoading.value = true;
        getData();
        getChangLong();
        setTimeout(() => {
            isLoading.value = false;
        }, 500);
    }
});

onUnmounted(() => {
    clearInterval(tId.value);
});
</script>
<style lang="scss" scoped>
.analyzeLayout {
    width: 100%;
    height: 100dvh;
    background: #eff2f5;
}
.topFixed {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #fff;
    z-index: 100;
}

.holder {
    height: 85px;
    width: 100%;
}
.tab {
    width: 100%;
    height: 41px;
    display: flex;
    background: #ffffff;
    justify-content: center;
    position: relative;
    .tab-item {
        width: 90px;
        text-align: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 41px;
        color: #63666f;
        position: relative;
    }
    .active {
        font-weight: 600;
        color: #1e8ef5;
        transition: transform 0.15s ease-in;
    }

    .tabActive::after {
        position: absolute;
        content: '';
        background: #1e8ef5;
        bottom: 0;
        left: 50%;
        width: 18px;
        height: 3px;
        border-radius: 3px 3px 0 0;
    }

    .leftActive {
        transform: translateX(36px);
        transition: transform 0.15s ease-in;
    }

    .rightActive {
        transform: translateX(126px);
        transition: transform 0.15s ease-in;
    }
}

.footerBar {
    height: 48px;
    width: 100%;
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: between;
    box-shadow: 0px -4px 8px 0px #0000000d;

    .lotteryType {
        height: 100%;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;

        img {
            height: 10px;
            width: 10px;
            margin-left: 8px;
        }

        .lotteryLength {
            color: #1e8ef5;
        }
    }

    .statusType {
        height: 100%;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;

        img {
            height: 10px;
            width: 10px;
            margin-left: 8px;
        }
    }
}

:deep(.van-popup).lotteryPopupShow {
    background-color: #eff2f5;
    height: 500px;
    overflow: hidden;
}

:deep(.van-popup--bottom) {
    /* bottom: 50px; */
}

.analyze {
    :deep(.van-overlay) {
        bottom: 50px;
        height: 80%;
    }
}

:deep(.van-popup).statusPopupShow {
    background-color: #eff2f5;
    height: 180px;
    overflow: hidden;
}

.typeBox {
    height: 100%;
}

.popFooter {
    height: 48px;
    box-shadow: 0px -4px 8px 0px #0000000d;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    .resetBtn {
        height: 48px;
        position: relative;
        font-size: 16px;
        color: #565f6c;
    }

    .resetBtn::after {
        content: '';
        position: absolute;
        right: 0;
        background-color: #0000001a;
        height: 20px;
        width: 1px;
    }

    .saveBtn {
        height: 48px;
        font-size: 16px;
        color: #1e8ef5;
    }
}

.title {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #0000001a;
    height: 40px;
    color: #575f6c;
}

.body {
    height: calc(100% - 76px);
    overflow: scroll;
    padding: 12px 6px;
    background-color: #eff2f5;

    .lottery {
        margin-bottom: 12px;
    }

    .lotteryType {
        color: #697281;
        font-size: 14px;
    }

    .lotteryButton {
        background-color: #fff;
        width: calc(93% / 3);
        border-radius: 4px;
        padding: 4px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px;
        border: 1px solid #3c5d9d33;
    }

    .statusButton {
        background-color: #fff;
        width: calc(24%);
        border-radius: 4px;
        padding: 4px;
        font-size: 14px;
        text-align: center;
        border: 1px solid #3c5d9d33;
        margin-bottom: 6px;
    }

    .active {
        background-color: #1e8ef5;
        color: #fff;
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

.lottery {
    :deep(.van-overlay) {
        height: 80%;
    }
}

.filter {
    position: fixed;
    bottom: 0px;
    width: 100%;
}
</style>
