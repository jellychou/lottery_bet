<template>
    <div class="flex overflow-y-auto">
        <PlaySidebarVue />
        <div class="display h-full">
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

            <div class="main_play" :style="{ height: rD.checkbox ? 'calc(100dvh - 504px)' : 'calc(100dvh - 371px)' }">
                <p v-if="rD.odds" class="odds t_bc">赔率：{{ rD.rodio ? rD.rodio[rodioIndex].odds : rD.odds }}</p>
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

                <ul v-if="rD.square || (rD.squares && rD.squares[rodioIndex])" :class="['square grid grid-cols-2 gap-2 px-2.5 py-3 relative', rD.odds && 'hasOdd']">
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
                    <div class="grid grid-cols-3 gap-2 px-2.5 pt-1 pb-3">
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
    name: 'Playpk10'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import PlaySidebarVue from '../PlaySidebar.vue';
import { filter, hndleData } from './util';
import { usePlayHook } from '../hooks.js';
import InstructionsButton from '@/components/public/InstructionsButton.vue';
import FilterNumber from '@/components/public/FilterNumber.vue';
import HotColdOmitButton from '@/components/public/HotColdOmitButton.vue';

const { isReset, currentLottery, hleper, storeData, storeRD, play, rodioIndex, hotColdShow, omitShow, hotColdList, omitList, onClickhotCold, onClickOmit } = usePlayHook();
const a = getCurrentInstance();
const { t } = useI18n();
const route = useRoute();

const commonStore = useCommonStore();

const lotteryItems = ref([]);

const lotteryData = computed(() => commonStore.lotteryData);

const rD = computed(() => {
    const agr = rodioIndex.value + hleper.value && play.value && lotteryItems.value && currentLottery.value.parentCode === 'pk10'; // 直接使用 lotteryData 作为依赖项
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

const CalcLen = Chosedata => {
    let finalData = [];
    switch (play.value) {
        case 'kj':
            const checkedArr = rD.value.checkbox.filter(_ => _.choose);
            if (checkedArr.length) {
                checkedArr.forEach(_ => Chosedata.forEach(i => finalData.push(storeData.value[_.value].find(_i => _i.playCode === i.playCode.replace('1', _.value)))));
            } else {
                finalData.err = t('rules.bet_rule'); // '请选择顶部投注类型'
            }
            break;
        default:
            finalData = Chosedata;
            break;
    }
    return finalData;
};

const filterBgColor = val => {
    if (val === 0 || !val) {
        return 'coldBg';
    } else if (val >= 4) {
        return 'hotBg';
    } else {
        return 'normalBg';
    }
};

const filterBorderColor = val => {
    if (val === 0 || !val) {
        return 'coldText';
    } else if (val >= 4) {
        return 'hotText';
    } else {
        return 'normalText';
    }
};

const handleChose = it => {
    it.choose = !it.choose;
    hleper.value = Math.random() + 1;
    commonStore.betData = CalcLen(rD.value.data.filter(_ => _.choose));
};
</script>
<style lang="scss" scoped>
.display {
    width: calc(100% - 82px);
    .play-instructions {
        height: 35px;
        border-bottom: 1px solid #f1f4f9;
    }
    .instructions {
        font-size: 11px;
        line-height: 16px;
        color: #929aa7;
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
            // width: 62px;
            height: 39px;

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
