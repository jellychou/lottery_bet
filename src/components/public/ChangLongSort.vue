<template>
    <div class="container">
        <div class="layout display flex-1 overflow-auto px-2.5 pb-2.5">
            <Loading v-if="isLoading" />
            <NoData v-if="data.length === 0 && !isLoading" text="暂无内容" />
            <div
                v-else
                :class="{ active: isActive === `${item.parentCode}_${item.lotteryCode}_${item.typeCode}`, normal: isActive !== `${item.parentCode}_${item.lotteryCode}_${item.typeCode}` }"
                class="item mt-2.5 p-2.5"
                v-for="(item, i) in data"
                :key="i"
                @click="selectItem(item)"
            >
                <div class="flex justify-between items-center">
                    <div class="playTypeName">{{ $t(`lottery.${item.play[0].lotteryCode}`) }}</div>
                    <div class="nextOpenTime">
                        <Timer v-model:time="item.nextOpenTime" :callback="callback" />
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
    </div>
    <div :class="{ holder: isShowBetArea, holderH: !isShowBetArea }"></div>
    <ChanglongBetArea
        :filterData="data"
        :isShowBetArea="isShowBetArea"
        :itemData="itemData"
        :issueList="issueList"
        :isBet="isBet"
        @update:betDetail="betDetail"
        @update:reset="resetIsBet"
        :isOneLottery="false"
    />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import NoData from '@/components/public/NoData.vue';
import Timer from '@/views/home/Timer.vue';
import Loading from '@/components/public/Loading.vue';
import useCommonStore from '@/store/modules/common';
import ChanglongBetArea from '@/components/public/ChanglongBetArea.vue';
import { chaseNumberList } from '@/api/interface';
import { issueDisplay } from '@/util/tools';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    data: Array,
    isLoading: Boolean
});

const { t } = useI18n();

const commonStore = useCommonStore();
const emit = defineEmits(['update:callback']);

const isActive = ref('');
const isShowBetArea = ref(false);
const isBet = ref([]);
const itemData = ref({});
const issueList = ref([]);

const selectItem = item => {
    isActive.value = isActive.value === `${item.parentCode}_${item.lotteryCode}_${item.typeCode}` ? '' : `${item.parentCode}_${item.lotteryCode}_${item.typeCode}`;
    itemData.value = item;
    commonStore.setHaoluChase(item);
    commonStore.analyzeInfo = item;
    isShowBetArea.value = isActive.value ? true : false;
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
        playTypeName: item.lotteryLocation,
        lotteryCode: odd.lotteryCode
    });
    commonStore.betData = isBet.value;
    getChaseNumberList();
};

const callback = () => {
    emit('update:callback');
};

const getChaseNumberList = () => {
    isShowBetArea.value = isActive.value ? true : false;
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

const resetIsBet = () => {
    isActive.value = '';
    commonStore.setHaoluChase({});
    itemData.value = {};
    commonStore.analyzeInfo = {};
    isShowBetArea.value = false;
};

watch(
    () => props.data,
    newValue => {
        const info = newValue.filter(item => item.typeCode === itemData.value.typeCode);
        if (!newValue.length || !info.length) {
            isShowBetArea.value = false;
        }
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
        overflow: scroll;
    }
}
.item {
    height: 60px;
    background: #ffffff;
    border: 1px solid #eceff5;
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

.active {
    border: 1px solid #1e8ef5;
    background-color: #1e8ef51a;
}

.normal {
    border: 1px solid #eceff5;
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
