<template>
    <div class="relative flex">
        <PlaySidebarVue />
        <div class="display h-full overflow-auto">
            <div v-if="rD.rodio" class="flex items-center mt-2 px-2.5">
                <van-tabs v-model:active="rodioIndex" class="radio" line-height="0" :ellipsis="false">
                    <van-tab v-for="(it, i) in rD.rodio" :key="i" :title="it.name"></van-tab>
                </van-tabs>
                <div class="radio_separate flex-shrink-0 mr-2">
                    <img src="../assets/radio_separate.png" class="h-full w-full" />
                </div>
                <div class="flex-shrink-0 mr-2.5" @click="allRadioPopupShow = true">
                    <img src="../assets/all_radio.png" width="13" />
                </div>
            </div>

            <AllRadioPopup v-model:allRadioPopupShow="allRadioPopupShow" :rD="rD" v-model:rodioIndex="rodioIndex" />

            <div class="play-instructions flex justify-between items-center mx-3">
                <InstructionsButton />
                <FilterNumber v-if="commonStore.play !== 'kj'" @update:hotCold="onClickhotCold" @update:omit="onClickOmit" />
            </div>

            <div v-if="rD.checkbox" class="checkbox grid grid-cols-3 gap-3.5 content-start">
                <div class="flex items-center" v-for="(it, i) in rD.checkbox" :key="i" @click="handleChose(it)">
                    <img v-if="it.choose" src="../assets/checked.png" width="15" class="mr-1.5" />
                    <img v-else src="../assets/check.png" width="15" class="mr-1.5" />

                    {{ isNaN(it.name) ? $t(it.name) : it.name }}
                </div>
            </div>

            <div class="main_play">
                <!-- <p v-if="rD.odds" class="odds t_bc">赔率：{{ rD.rodio ? rD.rodio[rodioIndex].odds : rD.odds }}</p> -->
                <ul v-if="rD.ball || (rD.balls && rD.balls[rodioIndex])" :class="['ball grid grid-cols-4 gap-2 px-2.5 py-3', rD.odds && 'hasOdd']">
                    <li
                        v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])"
                        @click="handleChose(it)"
                        :key="i"
                        :class="[it.choose && 't_b', it.isSquareClass && 'square-ball', 'flex flex-col justify-center items-center relative']"
                    >
                        <HotColdOmitButton :chTimes="it.chTimes" :omTimes="it.omTimes" :omColor="it.omColor" :chColor="it.chColor" :hotColdShow="hotColdShow" :omitShow="omitShow" />

                        <p :class="['f_m _pk' + it.name]">{{ isNaN(it.name) ? $t(it.name) : it.name }}</p>
                        <i>{{ it.odds }}</i>
                    </li>
                </ul>

                <ul v-if="rD.square || (rD.squares && rD.squares[rodioIndex])" :class="['square grid grid-cols-4 gap-2 px-2.5 py-3', rD.odds && 'hasOdd']">
                    <li
                        v-for="(it, i) in rD.square || (rD.squares && rD.squares[rodioIndex])"
                        @click="handleChose(it)"
                        :key="i"
                        class="flex flex-col justify-center items-center relative"
                        :class="[it.choose ? 't_b' : '']"
                    >
                        <HotColdOmitButton :chTimes="it.chTimes" :omTimes="it.omTimes" :omColor="it.omColor" :chColor="it.chColor" :hotColdShow="hotColdShow" :omitShow="omitShow" />

                        <p>{{ isNaN(it.name) ? $t(it.name) : it.name }}</p>
                        <i>{{ it.odds }}</i>
                    </li>
                </ul>
                <ul v-for="(item, i) in rD.sort || (rD.sorts && rD.sorts[rodioIndex]) || []" :key="i" :class="[{ square: item.square, ball: item.ball, 'pt-3': i === 0 }]">
                    <div class="sort_title px-2.5">
                        {{ isNaN(item.title) ? $t(item.title) : item.title }}
                    </div>
                    <div class="grid grid-cols-4 gap-2 px-2.5 pt-1 pb-3">
                        <li v-for="(it, i) in item.square || item.ball" @click="handleChose(it)" :key="i" class="flex flex-col justify-center items-center relative" :class="[it.choose ? 't_b' : '']">
                            <HotColdOmitButton :chTimes="it.chTimes" :omTimes="it.omTimes" :omColor="it.omColor" :chColor="it.chColor" :hotColdShow="hotColdShow" :omitShow="omitShow" />

                            <p>{{ isNaN(it.name) ? $t(it.name) : it.name }}</p>
                            <i>{{ it.odds }}</i>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Playklc'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import PlaySidebarVue from '../PlaySidebar.vue';
import AllRadioPopup from '../AllRadioPopup.vue';
import { usePlayHook } from '../hooks.js';
import InstructionsButton from '@/components/public/InstructionsButton.vue';
import FilterNumber from '@/components/public/FilterNumber.vue';
import HotColdOmitButton from '@/components/public/HotColdOmitButton.vue';
const { isReset, currentLottery, hleper, storeData, storeRD, play, rodioIndex, hotColdShow, omitShow, hotColdList, omitList, onClickhotCold, onClickOmit } = usePlayHook();

import { filter, hndleData } from './util';
import { getColor } from '@/util/tools';

const { t } = useI18n();
const route = useRoute();

const commonStore = useCommonStore();
const allRadioPopupShow = ref(false); //所有单选玩法选择弹窗

const lotteryItems = ref([]);

const lotteryData = computed(() => commonStore.lotteryData);

const rD = computed(() => {
    const agr = rodioIndex.value + hleper.value && play.value && lotteryItems.value && currentLottery.value.parentCode === 'klc'; // 直接使用 lotteryData 作为依赖项
    let result = {};
    if (agr) {
        try {
            result = storeRD.value || hndleData(storeData, storeRD, rodioIndex, storeData.value || filter(lotteryItems.value), play.value);
        } catch (e) {
            setTimeout(() => (hleper.value = Math.random() + 1), 500);
        }
    }
    return result;
});

watch(
    () => lotteryData.value,
    value => {
        lotteryItems.value = value;
    },
    { immediate: true, deep: true }
);

const handleChose = it => {
    it.choose = !it.choose;
    const Chosedata = rD.value.data.filter(_ => _.choose);
    if (Chosedata.filter(_ => _.playTypeCode === 'tm-bs').length > 3) {
        it.choose = !it.choose;
        showToast('特码包三只能选择3个号码!');
    }
    hleper.value = Math.random() + 1;
    commonStore.betData = CalcLen(rD.value.data.filter(_ => _.choose));
};
const CalcLen = Chosedata => {
    let finalData = [];
    switch (play.value) {
        case 'sb':
            const bsl = Chosedata.filter(_ => _.playTypeCode === 'tm-bs');
            const fsb = Chosedata.filter(_ => _.playTypeCode !== 'tm-bs');
            if (bsl.length && bsl.length !== 3 && !fsb.length) finalData.err = '特码包三需要选择3个号码!';
            else if (bsl.length === 3) {
                const name = bsl.map(_ => _.name).join(',');
                const playCode = bsl.map(_ => _.playCode).join('@');
                finalData = [...fsb, { ...bsl[0], name, ruleName: name, playCode }];
            } else finalData = fsb;
            break;
        default:
            finalData = Chosedata;
            break;
    }
    return finalData;
};
</script>
<style lang="scss" scoped>
.display {
    width: calc(100% - 82px);
    :deep(.radio) {
        width: calc(100% - 30px);
        .van-tabs__wrap {
            height: 27px;
            .van-tabs__nav--complete {
                padding: 0px;
            }
            .van-tabs__nav {
                background: #fff;
                .van-tab {
                    padding: 0px 10px;
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

    .radio_separate {
        width: 7px;
        height: 20px;
    }

    .play-instructions {
        height: 35px;
        border-bottom: 1px solid #f1f4f9;
    }
    .instructions {
        font-size: 11px;
        line-height: 16px;
        color: #929aa7;
    }

    .hot-cold-omit {
        div {
            height: 23px;
            font-size: 12px;
            line-height: 21px;
            padding: 0px 6px;
            color: #697281;
            border: 1px solid #d8dfeb;
            border-radius: 2px;
            &.active {
                border: 1px solid #0982fe;
                color: #0982fe;
            }
        }
    }
    .checkbox {
        font-weight: 500;
        font-size: 13px;
        line-height: 15px;
        color: #464c54;
        margin: 0px 15px;
        padding: 15px 0px;
        border-bottom: 1px solid #eceff5;
    }
    .main_play {
        /* height: calc(100% - 80px); */
        /* overflow-y: scroll; */
        .sort_title {
            font-size: 12px;
            line-height: 17px;
            color: #697281;
        }

        li {
            height: 40px;

            background: #ffffff;
            border: 1px solid rgba(60, 93, 157, 0.2);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
            p {
                font-weight: 500;
                font-size: 13px;
                line-height: 15px;

                color: #464c54;
            }
            i {
                font-style: normal;
                font-weight: 600;
                font-size: 12px;
                line-height: 12px;
                color: #5e86c8;
            }
        }
        .t_b {
            background: #1e8ef5;
            p {
                color: #ffffff;
            }
            i {
                color: #ffffff;
            }
        }
    }
}
</style>
