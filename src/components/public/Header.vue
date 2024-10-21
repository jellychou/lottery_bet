<template>
    <div class="navbar relative" :class="[className, { hasBg: hasBg }]">
        <div v-if="hasBg" class="absolute top-0 left-0 right-0 overflow-hidden" style="height: 120px">
            <img src="./assets/header_bg.png" />
        </div>
        <div v-if="hasBg" class="union absolute top-0 overflow-hidden" style="height: 80px; width: 150px">
            <img src="./assets/header_union.png" />
        </div>
        <NavBar v-if="showLeft" v-bind="$attrs" :border="false" :clickable="false" class="showLeft">
            <template #left>
                <div @click="goHome($attrs)" class="flex items-center">
                    <div class="back mr-3">
                        <img src="./assets/back.png" class="w-full h-full" />
                    </div>
                    <div class="truncate">返回大厅</div>
                </div>
            </template>

            <template #title></template>

            <template #right>
                <slot v-if="$slots.right" name="right" />
                <div v-else class="flex items-center">
                    <img src="./assets/currency.png" class="currency mr-0.5" />
                    <div class="balance mr-2">{{ userInfo.memberBal }}</div>
                    <div class="right-btn flex items-center">
                        <div class="more w-1/2 flex items-center justify-center" @click="showSettingPopup">
                            <div class="one"></div>
                            <div class="two"></div>
                            <div class="three"></div>
                        </div>
                        <div class="line"></div>
                        <div class="close w-1/2 flex justify-center items-center" @click="onClose()">
                            <img src="./assets/close.png" class="w-full h-full" />
                        </div>
                    </div>
                </div>
            </template>
        </NavBar>
        <NavBar v-else v-bind="$attrs" :border="false" :clickable="false">
            <template #left>
                <slot v-if="$slots.left" name="left" />
                <router-link to="/" v-else-if="showLogo">
                    <div class="logo">
                        <img src="./assets/logo.png" class="w-full h-full" />
                    </div>
                </router-link>
                <div v-else @click="onLeft()" class="flex items-center">
                    <div class="back mr-3">
                        <img v-if="hasBg" src="./assets/back_white.png" class="w-full h-full" />
                        <img v-else src="./assets/back.png" class="w-full h-full" />
                    </div>
                    <div class="truncate">{{ $attrs.title }}</div>
                </div>
            </template>

            <template #title></template>

            <template #right>
                <slot v-if="$slots.right" name="right" />
                <div v-else class="flex items-center">
                    <img src="./assets/currency.png" class="currency mr-0.5" />
                    <div class="balance mr-2">{{ userInfo.memberBal }}</div>
                    <div class="right-btn flex items-center">
                        <div class="more w-1/2 flex items-center justify-center" @click="showSettingPopup">
                            <div class="one"></div>
                            <div class="two"></div>
                            <div class="three"></div>
                        </div>
                        <div class="line"></div>
                        <div class="close w-1/2 flex justify-center items-center" @click="onClose()">
                            <img v-if="hasBg" src="./assets/close_white.png" class="w-full h-full" />
                            <img v-else src="./assets/close.png" class="w-full h-full" />
                        </div>
                    </div>
                </div>
            </template>
        </NavBar>
        <van-popup class="overflow-hidden" v-model:show="showLeft" position="left" :style="{ width: '70%', height: '100%' }">
            <div class="holder"></div>
            <div class="tab">
                <div class="tabActive" :class="{ leftActive: tabActive === 0, rightActive: tabActive !== 0 }"></div>
                <div class="tab-item" :class="{ active: tabActive === 0 }" @click="changeTabs(0)">
                    <img :src="tabActive == 0 ? lottery_ac : lottery" />
                    彩票
                </div>
                <div class="tab-item" :class="{ active: tabActive === 1 }" @click="changeTabs(1)">
                    <img :src="tabActive == 1 ? collect_ac : collect" />
                    收藏
                </div>
            </div>
            <div class="menu" v-if="tabActive === 0">
                <van-collapse v-model="activeLottery">
                    <van-collapse-item v-for="(list, index) in lotteryList" :title="list.label" :name="index">
                        <ul v-for="item in list.children" class="listItem">
                            <li @click="goGame(item)">
                                <span>{{ item.label }}</span>
                                <img src="@/views/home/assets/arrow.png" alt="" />
                            </li>
                        </ul>
                    </van-collapse-item>
                </van-collapse>
            </div>
            <div v-else class="collect-container p-2">
                <Loading v-if="isLoading" />
                <NoData v-if="filterLotteryList.length === 0 && !isLoading" text="暂无收藏游戏" />
                <div v-for="item in filterLotteryList" :key="item.lotteryCode" class="collect-item flex items-center justify-between mb-2" @click="goGame(item)">
                    <div>
                        <div class="title flex items-center">
                            <img :src="getImg(item.parentCode + '_l')" class="mr-2" />
                            {{ item.label }}
                            <Collect :parentCode="item.parentCode" :code="item.code" :favorite="true" :collect1="true" :callback="queryCollect" class="collect ml-1" />
                        </div>
                        <div class="sub flex items-center mt-1 pl-2.5">
                            {{ formatIntervalTime(item.intervalTime) }}1期
                            <p class="ml-1.5">
                                距封盘
                                <span class="count-down">
                                    <Timer v-model:time="item.nextStopTime" :callback="queryCollect" />
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <img src="@/views/home/assets/arrow.png" width="7" />
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NavBar } from 'vant';
import useCommonStore from '@/store/modules/common';
import collect from '@/views/home/assets/collect.png';
import collect_ac from '@/views/home/assets/collect_ac.png';
import lottery from '@/views/home/assets/lottery.png';
import lottery_ac from '@/views/home/assets/lottery_ac.png';
import Timer from '@/views/home/Timer.vue';
import Collect from '@/components/public/Collect.vue';
import NoData from '@/components/public/NoData.vue';
import { querySelfCollect } from '@/api/interface';

const props = defineProps({
    leftCallback: Function, // 左侧返回按钮回调
    className: String,
    showLogo: Boolean, //是否显示logo
    hasBg: Boolean // 彩种页面有背景
});

const router = useRouter();
const route = useRoute();
const commonStore = useCommonStore();

const userInfo = computed(() => commonStore.userInfo);
const lotteryList = computed(() => commonStore.lotteryList);

const showLeft = ref(false);
const tabList = ref(['彩票', '收藏']); //tab数组
const tabActive = ref(0);
const activeLottery = ref(['1']);
const state = reactive({
    collectList: []
});
const isLoading = ref(false);

const showSettingPopup = () => {
    commonStore.settingPopupShow = true;
};

const changeTabs = val => {
    tabActive.value = val;
    if (val === 1) {
        queryCollect();
    }
};

const getImg = code => {
    return new URL(`../../views/home/assets/${code}.png`, import.meta.url).href;
};

const formatIntervalTime = intervalTime => {
    if (intervalTime / 60 < 60) {
        return intervalTime / 60 + '分钟';
    } else {
        return intervalTime / 3600 + '小时';
    }
};

const queryCollect = () => {
    isLoading.value = true;
    querySelfCollect({}).then(res => {
        const formate = res.filter(e => e.code !== 'tgc');
        formate.forEach(_ =>
            _.children.forEach(i => {
                i.path = _.code + '/' + i.code; // 储存父级的code 用于后台传参
                i.fcode = _.code; // 储存父级的code 用于后台传参
                i.lcode = _.code; // 本地化code 用于添加类名 写样式
                i.icode = _.code; // 前端处理后生成列表的父级code
            })
        );
        state.collectList = formate;
        isLoading.value = false;
    });
};

const goGame = item => {
    commonStore.setCurrentLottery(item);
    commonStore.isInLottery = true;
    router.push(`/play/${item.parentCode}/${item.code}`);
    showLeft.value = false;
};

const onLeft = () => {
    if (route.params.gameCode) {
        showLeft.value = true;
        commonStore.setShowHistory(false);
    } else {
        router.go(-1);
    }
};

const onClose = () => {
    router.go(-1);
};

const goHome = val => {
    if (val.enTitle === 'record') {
        commonStore.tabActive = 0;
    }
    router.push('/');
    commonStore.isInLottery = false;
};

const filterLotteryList = computed(() => {
    const data = [];
    state.collectList.forEach(list => {
        if (list.code !== 'hot') {
            list.children.forEach(item => {
                data.push(item);
            });
        }
    });
    return data;
});
</script>
<style scoped lang="scss">
.navbar {
    :deep(.van-nav-bar__content) {
        height: 44px;
        padding: 0px 12px;
        .van-nav-bar__left,
        .van-nav-bar__right {
            position: unset;
        }
        .van-nav-bar__left {
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: #353d49;
            padding: 0px;
            .back {
                width: 7px;
                height: 14px;
            }
            .logo {
                height: 33px;
                width: 38px;
            }
        }
        .van-nav-bar__title {
            margin: unset;
            color: var(--text-color);
            font-size: 19px;
        }
        .van-nav-bar__right {
            flex: 1 1 0%;
            display: flex;
            justify-content: flex-end;
            padding: 0px;
            .currency {
                width: 13px;
                height: 13px;
            }
            .balance {
                font-family: 'WeChat Sans Std';
                font-style: normal;
                font-weight: 500;
                font-size: 15px;
                line-height: 16px;
                color: #f39035;
            }
            .right-btn {
                width: 81px;
                height: 28px;
                background: rgba(104, 115, 134, 0.1);
                border-radius: 25px;
                .more {
                    .one,
                    .two,
                    .three {
                        background: #242526;
                        border-radius: 50%;
                    }
                    .one,
                    .three {
                        width: 3px;
                        height: 3px;
                    }
                    .two {
                        width: 5px;
                        height: 5px;
                        margin: 0px 3px;
                    }
                }
                .line {
                    width: 1px;
                    height: 16px;
                    background: rgba(0, 0, 0, 0.1);
                }
                .close {
                    img {
                        width: 16px;
                        height: 16px;
                    }
                }
            }
        }
    }
}

.showLeft {
    z-index: 10000;
    background-color: #fff !important;
    .van-nav-bar__right {
        flex: 1 1 0%;
        display: flex;
        justify-content: flex-end;
        padding: 0px;
        .currency {
            width: 13px;
            height: 13px;
        }
        .balance {
            font-family: 'WeChat Sans Std';
            font-style: normal;
            font-weight: 500;
            font-size: 15px;
            line-height: 16px;
            color: #f39035 !important;
        }
        .right-btn {
            width: 81px;
            height: 28px;
            background: rgba(104, 115, 134, 0.1) !important;
            border-radius: 25px;
            .more {
                .one,
                .two,
                .three {
                    background: #242526 !important;
                }
            }
            .line {
                width: 1px;
                height: 16px;
                background: #0000001a !important;
            }
            .close {
                img {
                    width: 16px;
                    height: 16px;
                }
            }
        }
    }

    .truncate {
        color: #353d49;
    }
}

.tab {
    width: 100%;
    height: 41px;
    display: flex;
    background: #ffffff;
    justify-content: flex-start;
    border-bottom: 1px solid #d8dfeb;
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
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 14px;
            height: 14px;
            margin-right: 2px;
        }
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

.holder {
    height: 44px;
}

.menu {
    height: calc(100dvh - 85px);
    overflow-y: auto;
}
.listItem {
    background-color: #eff2f5;
    color: #576170;
    padding-left: 24px;
    padding-right: 18px;
    li {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
            width: 6px;
            height: 10px;
        }
    }
}

.collect-container {
    height: calc(100dvh - 85px);
    background: #eff2f5;
    overflow-y: scroll;
    .collect-item {
        height: 60px;
        background: #ffffff;
        border: 1px solid #eceff5;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        padding-right: 17px;
        .title {
            font-weight: 600;
            font-size: 14px;
            line-height: 19px;

            color: #585e68;
            img {
                height: 15px;
            }
        }
        .sub {
            font-size: 12px;
            line-height: 17px;
            color: #929aa7;
            .count-down {
                color: #ff7a00;
            }
        }
        .collect {
            width: 16px;
            height: 16px;
        }
    }
}

:deep(.van-collapse-item__content) {
    padding: 0;
}

:deep(.van-collapse-item--border:after) {
    display: none;
}

:deep(.van-cell__title) {
    color: #576170;
}
.hasBg {
    .union {
        right: -20px;
    }
    .van-nav-bar {
        background: unset;
    }
    :deep(.van-nav-bar__content) {
        .van-nav-bar__left {
            color: #fff;
        }
        .van-nav-bar__title {
            color: var(--text-color);
        }
        .van-nav-bar__right {
            .balance {
                color: #fff;
            }
            .right-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 0.5px solid rgba(255, 255, 255, 0.1);
                .more {
                    .one,
                    .two,
                    .three {
                        background: #fff;
                    }
                }
                .line {
                    background: rgba(255, 255, 255, 0.2);
                }
            }
        }
    }
}
</style>
