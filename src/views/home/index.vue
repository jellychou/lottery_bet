<template>
    <div class="w-full flex flex-col overflow-hidden">
        <div class="topFixed">
            <Header showLogo />
            <div class="mx-3 mt-2">
                <img src="./assets/banner.png" />
            </div>
            <div class="flex items-center justify-between m-3">
                <template v-if="!searchShow">
                    <div class="tabs flex items-center relative">
                        <div class="tabActive" :style="{ transform: curTab == 1 ? 'translateX(0)' : 'translateX(96px)' }"></div>
                        <div class="w-1/2 flex items-center justify-center tab" :class="{ active: curTab == 1 }" @click="curTab = 1">
                            <img :src="curTab == 1 ? lottery_ac : lottery" />
                            彩票
                        </div>
                        <div class="w-1/2 flex items-center justify-center tab" :class="{ active: curTab == 2 }" @click="onClickCollect">
                            <img :src="curTab == 2 ? collect_ac : collect" />
                            收藏
                        </div>
                    </div>
                    <div v-if="curTab === 2" @click="searchShow = true">
                        <img src="./assets/search.png" width="16" />
                    </div>
                </template>

                <div v-else class="search w-full flex items-center">
                    <div class="relative flex-1">
                        <input class="searchInputLong" type="text" v-model="searchText" placeholder="搜你想玩的" />
                        <img src="./assets/search1.png" width="17" class="absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <div class="cancel mr-1 ml-4" @click="cancel">取消</div>
                </div>
            </div>
        </div>
        <div class="holder"></div>
        <div class="gameList flex-1">
            <div v-if="curTab == 1" class="relative flex">
                <div class="play-slider">
                    <van-sidebar v-model="active">
                        <van-sidebar-item v-for="(item, i) in lotteryList" :key="item.code">
                            <template #title>
                                <div class="title flex items-center">
                                    <img v-if="active == i" :src="getImg(item.code + '_l')" width="3" />
                                    <img v-if="active == i" :src="getImg(item.code + '_ac')" width="19" class="ml-2" />
                                    <img v-if="active !== i" :src="getImg(item.code)" width="19" />
                                    <div class="ml-1">{{ item.label }}</div>
                                </div>
                            </template>
                        </van-sidebar-item>
                    </van-sidebar>
                </div>
                <div class="holderSide"></div>
                <div class="grid grid-cols-2 content-start p-2" style="width: calc(100% - 110px)">
                    <div v-for="item in lotteryList[active]?.children" :key="item.code" class="relative gameCard" @click="choose(item)">
                        <img :src="getImg(item.code)" />
                        <div class="absolute left-4 top-3">
                            <div class="lottery-name">{{ item.label }}</div>
                            <div class="lottery-period mt-0.5">{{ item.intervalTime ? formatIntervalTime(item.intervalTime) : '48-72小時' }}1期</div>
                        </div>
                        <Collect
                            :parentCode="item.parentCode"
                            :code="item.code"
                            :favorite="item.favorite"
                            @update:collect="item.favorite = !item.favorite"
                            :collect1="true"
                            class="collect absolute left-4 bottom-4"
                        />
                    </div>
                </div>
            </div>
            <div v-if="curTab == 2" class="collect-container pt-2.5 px-2.5">
                <Loading v-if="isLoading" />
                <NoData v-if="filterLotteryList.length === 0 && !isLoading" text="暂无收藏游戏" />
                <div v-else v-for="item in filterLotteryList" :key="item.lotteryCode" class="collect-item flex items-center justify-between mb-2.5" @click="goGame(item)">
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
                        <img src="./assets/arrow.png" width="7" />
                    </div>
                </div>
            </div>
        </div>
        <CTabbar />
        <div class="holderBottom"></div>
    </div>
    <van-popup :show="lotteryIntroductionPopupShow" class="lotteryIntroductionPopup" round @click-overlay="closeLotteryIntroductionPopup">
        <div class="title">开奖时间</div>
        <div class="outLine">{{ currentLottery.openTimeInfo }}</div>
        <div class="title mt-5">开奖规则</div>
        <div class="outLine">{{ currentLottery.playRuleInfo }}</div>
    </van-popup>
    <div class="cover" v-if="isCover">
        <van-loading class="wrapper" type="spinner" />
    </div>
</template>

<script>
export default {
    name: 'Home'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import CTabbar from '@/components/public/CTabbar.vue';
import Collect from '@/components/public/Collect.vue';
import Timer from './Timer.vue';
import collect from './assets/collect.png';
import collect_ac from './assets/collect_ac.png';
import lottery from './assets/lottery.png';
import lottery_ac from './assets/lottery_ac.png';
import { querySelfCollect, getGameList } from '@/api/interface';
import NoData from '@/components/public/NoData.vue';
import { setLotteryList } from '@/util/cach';
import allPlays from '@/data/allPlays'; // 所有大彩种玩法数据
import Loading from '@/components/public/Loading.vue';
import { session } from '@/util/storage';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const commonStore = useCommonStore();

commonStore.setCurrentLottery({});
commonStore.cartData = [];
commonStore.betData = [];

const lotteryList = computed(() => commonStore.lotteryList);
const currentLottery = computed(() => commonStore.currentLottery);
const plays = computed(() => allPlays[currentLottery.value.lcode] || [{}]);
const lotteryIntroductionPopupShow = computed(() => commonStore.lotteryIntroductionPopupShow);

const curTab = ref(1);
const searchShow = ref(false); // 是否展示搜索输入框
const searchText = ref(''); // 搜索关键字
const active = ref(0);
const isLoading = ref(false);
const state = reactive({
    collectList: []
});
const isCover = ref(true);

const cancel = () => {
    searchShow.value = false;
    searchText.value = '';
};

const filterLotteryList = computed(() => {
    if (curTab.value == 2) {
        const data = [];
        state.collectList.forEach(list => {
            if (list.code !== 'hot') {
                list.children.forEach(item => {
                    data.push(item);
                });
            }
        });
        return data.filter(_ => _.label.indexOf(searchText.value) !== -1);
    } else {
        return lotteryList.value.map(_ => _.children).flat();
    }
});

const closeLotteryIntroductionPopup = () => {
    commonStore.lotteryIntroductionPopupShow = false;
};

const getImg = code => {
    return new URL(`./assets/${code}.png`, import.meta.url).href;
};

const choose = item => {
    commonStore.setCurrentLottery(item);
    commonStore.isInLottery = true;
    router.push(`/play/${item.parentCode}/${item.code}`);
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
        setLotteryList(formate);
        state.collectList = formate;
        isLoading.value = false;
    });
};

const onClickCollect = () => {
    curTab.value = 2;
    queryCollect();
};

const goGame = item => {
    commonStore.setCurrentLottery(item);
    commonStore.isInLottery = true;
    router.push(`/play/${item.parentCode}/${item.code}`);
};

const formatIntervalTime = intervalTime => {
    if (intervalTime / 60 < 60) {
        return intervalTime / 60 + '分钟';
    } else {
        return intervalTime / 3600 + '小时';
    }
};

if (curTab.value == 2) {
    queryCollect();
}

// http://www.88888888.com:3718/home?lang=zh&gameCode=pk10/jspk10&token=11d086a07f5e43b18d0f22f665925c3b&memberAccount=jelly123&siteCode=jeroa&currency=CNY&is_app=1

const getLotteryList = async () => {
    await getGameList().then(res => {
        if (Array.isArray(res)) {
            const formate = res.filter(e => e.code !== 'tgc');
            formate.forEach(_ =>
                _.children.forEach(i => {
                    i.path = _.code + '/' + i.code; // 储存父级的code 用于后台传参
                    i.fcode = _.code; // 储存父级的code 用于后台传参
                    i.lcode = _.code; // 本地化code 用于添加类名 写样式
                    i.icode = _.code; // 前端处理后生成列表的父级code
                })
            );
            const parentCode = route.query.gameCode?.split('/')[0];
            const gameCode = route.query.gameCode?.split('/')[1];
            const gameType = formate.filter(item => item.code === parentCode);
            const item = gameType[0]?.children.filter(item => item.code === gameCode);
            if (item === undefined) {
                router.push('/');
                isCover.value = false;
                return;
            }
            if (item.length === 0) {
                showToast('该彩种已停售');
                isCover.value = false;
            } else {
                commonStore.setCurrentLottery(item[0]);
                commonStore.isInLottery = true;
                router.push(`/play/${item[0].parentCode}/${item[0].code}`);
                setTimeout(() => {
                    isCover.value = false;
                }, 2000);
            }
        } else {
            showToast('网络异常');
            return [];
        }
    });
};

onMounted(() => {
    isCover.value = true;
    getLotteryList();
});
</script>
<style lang="scss" scoped>
.topFixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    background-color: #fff;
}

.holder {
    height: 166px;
    width: 100%;
}

.holderBottom {
    height: 49px;
    width: 100%;
}

.tabs {
    width: 200px;
    height: 40px;
    font-size: 15px;
    line-height: 40px;
    text-align: center;
    color: #929aa7;
    background: #eff2f5;
    padding: 2px;
    border-radius: 6px;
    .tabActive {
        height: 36px;
        width: 50%;
        background: #ffffff;
        border-radius: 5px;
        position: absolute;
        transition: transform 0.3s ease-out;
    }

    .active {
        color: #0186ea;
    }

    .tab {
        z-index: 1;
    }

    img {
        width: 14px;
        height: 14px;
    }
}

.search {
    input {
        width: 100%;
        height: 40px;
        padding-left: 8px;
        background: #eff2f5;
        border-radius: 6px;
    }
    .cancel {
        font-size: 15px;
        line-height: 18px;
        color: #60697a;
    }
}

.gameList {
    height: calc(100% - 232px);
}

.play-slider {
    width: 110px;
    border-top: 1px solid #eceff5;
    height: calc(100dvh - 216px);
    overflow-y: auto;
    background: #eff2f5;
    position: fixed;

    :deep(.van-sidebar) {
        width: 110px;
        padding: 5px 0px;
        .van-sidebar-item {
            height: 50px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0px 0px 0px 11px;
            margin-left: 9px;
            background: #eff2f5;
            overflow: unset;
        }
        .van-sidebar-item__text {
            font-size: 14px;
            // line-height: 39px;
            color: #565e6a;
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
                // justify-content: center;
                align-items: center;
                font-weight: 600;
                color: #484848;
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
        // .van-sidebar-item--select:before {
        //     content: unset;
        // }
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

.lottery-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #4f5866;
}
.lottery-period {
    font-size: 10px;
    line-height: 14px;
    color: #929aa7;
}
.collect {
    width: 16px;
    height: 16px;
}

.collect-container {
    height: calc(100dvh - 216px);
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

.gameCard {
    aspect-ratio: 25 / 22;
}

.searchInputShort {
    width: 0;
}

.searchInputLong {
    width: 100%;
    transition: transform 0.15s ease-in;
    font-size: 14px;
}

.searchInputLong::placeholder {
    color: #999; /* 设置占位符颜色 */
    font-size: 12px;
}

.cover {
    background-color: #fff;
    height: 100dvh;
    width: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lotteryIntroductionPopup {
    width: 80%;
    padding: 15px;
    background: #ffffff;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    .title {
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #2f3944;
    }
    .outLine {
        font-size: 13px;
        line-height: 20px;
        color: #565e6a;
    }
}

.holderSide {
    width: 110px;
    height: calc(100dvh - 215px);
}
</style>
