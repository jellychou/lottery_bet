<template>
    <div class="instructions flex items-center" @click="isOpenInstructionsModal = true">
        玩法说明
        <img src="./assets/instructions.png" width="12" class="ml-0.5" />
    </div>
    <van-popup :show="isOpenInstructionsModal" class="popupShow" position="bottom" round @click-overlay="closeModal">
        <div class="typeBox">
            <div class="flex items-center justify-between p-4">
                <IconArrow class="arrow" @click="closeModal" />
                <div class="title text-sm">玩法说明</div>
                <div class="right"></div>
            </div>
            <div class="flex items-center justify-center border-y py-2" @click="isGameShow = !isGameShow">
                <div class="text-sm gameName">{{ title }}</div>
                <IconFillArrow class="fillArrow" :class="{ isRotate: isGameShow }" />
            </div>
            <div class="infoContent">
                <div class="gameList" v-if="isGameShow">
                    <div v-for="item in lotteryList.filter(item => item.code !== 'hot')" :key="item.code" class="px-2 py-3">
                        <div class="text-sm pl-1 gameType">{{ item.label }}</div>
                        <div class="flex items-center flex-wrap justify-between">
                            <div class="gameButton" :class="{ active: isActive === game.code }" v-for="game in item.children" :key="game.code" @click="setIsActive(game, item.code)">
                                {{ game.label }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else :class="['p-2 content text-xs leading-5', selectedGameCode]">
                    <div v-html="gameRule.lotteryInfo[isActive]"></div>
                    <div v-html="gameRule.gameRule[selectedGameCode]"></div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import IconArrow from './assets/arrowDown.svg?component';
import IconFillArrow from './assets/fillArrowDown.svg?component';
import useCommonStore from '@/store/modules/common';
import gameRule from '../../data/gameRule';
import { computed, ref, onMounted, defineEmits } from 'vue';

const commonStore = useCommonStore();

const lotteryList = computed(() => commonStore.lotteryList);
const currentLottery = computed(() => commonStore.currentLottery.label);

const isActive = ref(null);
const isGameShow = ref(false);
const selectedGameCode = ref(null);
const title = ref(currentLottery.value);
const isOpenInstructionsModal = ref(false);

const setIsActive = (game, itemCode) => {
    isActive.value = game.code;
    selectedGameCode.value = itemCode;
    isGameShow.value = false;
    title.value = game.label;
};

const closeModal = () => {
    isOpenInstructionsModal.value = false;
};

const handleModal = () => {
    isOpenInstructionsModal.value = false;
};

onMounted(() => {
    const pathSegments = window.location.pathname.split('/');
    isActive.value = pathSegments[3];
    const gameCodeIndex = 2;
    if (pathSegments.length > gameCodeIndex) {
        selectedGameCode.value = pathSegments[gameCodeIndex];
    }
});
</script>
<style lang="scss" scoped>
.instructions {
    font-size: 11px;
    line-height: 16px;
    color: #929aa7;
}

.popupShow {
    height: 80vh;
    background-color: #eff2f5;

    .title {
        color: #565f6c;
        text-align: center;
    }

    .arrow {
        height: 20px;
        width: 20px;
    }

    .right {
        width: 20px;
        height: 20px;
    }

    .fillArrow {
        height: 14px;
    }

    .isRotate {
        transform: rotate(180deg);
    }

    .gameName {
        color: #464c54;
    }

    .gameButton {
        background-color: #fff;
        width: calc(95% / 2);
        border-radius: 4px;
        padding: 4px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px;
        color: #697281;
    }

    .active {
        background-color: #1e8ef5;
        color: #fff;
    }

    .gameType {
        color: #464c54;
        margin-bottom: 4px;
    }

    .gameList {
        height: calc(100dvh - 262px);
        overflow: auto;
    }

    .content {
        color: #565e6a;
        margin-bottom: 12px;
    }

    .introTitle {
        color: #2f3944;
        font-weight: 500;
        margin-bottom: 4px;
    }
}
</style>
<style lang="scss">
.infoContent {
    h2 {
        line-height: 22px;
        margin: 22px 0 10px;
        font-size: 16px;
        font-weight: 550;
    }

    h3 {
        margin: 6px 0 4px;
        line-height: 22px;
        font-size: 14px;
        font-weight: 500;
        color: #54b1ff;
    }

    p {
        text-indent: 24px;
    }
}
.xgc,
.ssc {
    li {
        /* margin-bottom: 8px; */
    }

    strong {
        font-weight: 600;
        font-size: 14px;
    }
}

.ssc {
    p {
        text-indent: 0;
        margin-bottom: 8px;
    }

    strong {
        font-weight: 600;
        font-size: 14px;
    }

    table {
        width: 100%;
        line-height: 36px;
        font-size: 14px;
        text-align: center;
        background-color: #ddefff;

        td {
            background-color: #f0f0f0;
        }

        td,
        th {
            &:first-child {
                border-right: 1px solid #fff;
            }
        }
    }
}

.pk10td {
    background-color: #f0f0f0;
    vertical-align: middle;
    border-bottom: 1px solid #fff;
    padding-left: 4px;

    &:first-child {
        border-right: 1px solid #fff;
        width: 28px;
        padding: 22px 5px 22px 8px;
    }
}

.c11x5strong {
    font-weight: 600;
    font-size: 14px;
    display: inline-block;
    margin-top: 10px;
}

.klsf,
.kl8 {
    strong {
        font-weight: 600;
        font-size: 14px;
    }
}

.kl8p {
    margin-top: 10px;
}
</style>
