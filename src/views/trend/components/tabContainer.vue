<script>
export default {
    name: 'tabContainer'
};
</script>
<script setup>
import { ref, computed, markRaw, onMounted, watch } from 'vue';
import WinningNumbers from './tabInner/winningNumbers.vue';
import SizeOddEven from './tabInner/sizeOddEven.vue';
import SumValue from './tabInner/sumValue.vue';
import DragonTiger from './tabInner/dragonTiger.vue';
import TwoSided from './tabInner/twoSided.vue';
import ChampionTrend from './tabInner/championTrend/championTrend.vue';
import SsqBlueBallTrend from './tabInner/SsqTrend/blueBall/ssqTrend.vue';
import SsqRedBallTrend from './tabInner/SsqTrend/redBall/ssqTrend.vue';
import SsqWuxingTrend from './tabInner/SsqTrend/wuxing/ssqTrend.vue';
import SscChampionTrend from './tabInner/sscChampionTrend/SscChampionTrend.vue';
import ElevenBallChampionTrend from './tabInner/elevenBallChampionTrend/ElevenBallChampionTrend.vue';
import SscOpenLottery from './tabInner/sscOpenLottery.vue';
import K3OpenLottery from './tabInner/k3OpenLottery.vue';
import K3TotalLottery from './tabInner/k3TotalLottery.vue';
import XgcOpenLottery from './tabInner/xgcOpenLottery.vue';
import XgcTotalLottery from './tabInner/xgcTotalLottery.vue';
import SsqOpenLottery from './tabInner/ssqOpenLottery.vue';
import ThreeOpenLottery from './tabInner/threeOpenLottery.vue';
import DrawerIcon from './img/drawerBtn.svg';
import { getWinningNumbers } from '@/api/interface';

const { active, resultHistory, tabList, loading, selectedTarget } = defineProps({
    active: {
        type: String,
        default: ''
    },
    resultHistory: {
        type: Array,
        default: []
    },
    tabList: {
        type: Array,
        default: []
    },
    loading: {
        type: Boolean,
        default: false
    },
    selectedTarget: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['update:active', 'update:isDrawerOpen']);
const onTabChange = event => {
    emit('update:active', event.name);
};

const trendTitleList = {
    pk10: {
        title: ['冠军走势', '亚军走势', '第三名走势', '第四名走势', '第五名走势', '第六名走势', '第七名走势', '第八名走势', '第九名走势', '第十名走势']
    },
    ft: {
        title: ['冠军走势', '亚军走势', '第三名走势', '第四名走势', '第五名走势', '第六名走势', '第七名走势', '第八名走势', '第九名走势', '第十名走势']
    },
    ssc: {
        title: ['第一球走势', '第二球走势', '第三球走势', '第四球走势', '第五球走势']
    },
    c11x5: {
        title: ['第一球走势', '第二球走势', '第三球走势', '第四球走势', '第五球走势']
    },
    ssq: {
        title: ['蓝球走势', '红球分布']
    },
    k3: {
        title: []
    },
    xgc: {
        title: []
    },
    '3d': {
        title: ['第一球走势', '第二球走势', '第三球走势']
    }
};

const tabComponentList = {
    pk10: [
        WinningNumbers,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        DragonTiger,
        SizeOddEven,
        SumValue,
        TwoSided
    ],
    ft: [
        WinningNumbers,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        ChampionTrend,
        DragonTiger,
        SizeOddEven,
        SumValue,
        TwoSided
    ],
    ssc: [SscOpenLottery, SscChampionTrend, SscChampionTrend, SscChampionTrend, SscChampionTrend, SscChampionTrend],
    c11x5: [SscOpenLottery, ElevenBallChampionTrend, ElevenBallChampionTrend, ElevenBallChampionTrend, ElevenBallChampionTrend, ElevenBallChampionTrend],
    k3: [K3OpenLottery, K3TotalLottery],
    xgc: [XgcOpenLottery, XgcTotalLottery],
    ssq: [SsqOpenLottery, SsqBlueBallTrend, SsqRedBallTrend, SsqWuxingTrend],
    '3d': [ThreeOpenLottery, SscChampionTrend, SscChampionTrend, SscChampionTrend]
};
</script>

<template>
    <div class="trendTab w-full">
        <div class="w-full relative">
            <div class="tabBox flex-1">
                <van-tabs :active="active" class="tabs" line-height="0" shrink @click-tab="onTabChange">
                    <van-tab v-for="(tab, index) in tabList" :name="tab.label" :key="tab.value" :title="$t(tab.label)">
                        <component
                            :is="tabComponentList[selectedTarget][index]"
                            :resultHistory="resultHistory"
                            :typeNumber="tab.value"
                            issueTitle="期号"
                            :trendTitle="trendTitleList[selectedTarget].title"
                        />
                    </van-tab>
                </van-tabs>
            </div>
            <div class="drawerBtn" @click="$emit('update:isDrawerOpen', true)">
                <component class="drawerIcon" :is="DrawerIcon" />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.trendTab {
    .tabBox {
        /* overflow-y: scroll; */
        :deep(.tabs) {
            .van-tabs__wrap {
                height: 27px;
                margin-bottom: 8px;
                padding: 0 7px;
                width: calc(100% - 24px);

                .van-tabs__nav--complete {
                    padding: 0px;
                    -webkit-overflow-scrolling: touch;
                    touch-action: pan-x;
                }
                .van-tabs__nav {
                    background: #fff;
                    .van-tab {
                        padding: 0px 6px;
                        margin-right: 8px;
                        font-size: 14px;
                        line-height: 19px;
                        color: #697281;
                    }
                    .van-tab--active {
                        font-weight: 600;
                        color: #ffffff;
                        background: #1e8ef5;
                        border-radius: 4px;
                    }
                }
            }
        }
    }

    .drawerBtn {
        position: absolute;
        top: 0;
        right: 0;
        width: 28px;
        height: 25px;
        background-color: #fff;
        padding: 4px 8px;
        box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.5);

        .drawerIcon {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
./tabInner/sscChampionTrend/SscChampionTrend.vue
