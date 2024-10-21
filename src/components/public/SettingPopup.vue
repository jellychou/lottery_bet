<template>
    <van-popup :show="settingPopupShow" class="settingPopup" position="bottom" round z-index="5000" @click-overlay="onClickOverlay">
        <div class="title flex items-center px-3 pt-4 pb-3">
            <img src="./assets/logo.png" class="logo mr-2.5" />
            <div>
                <div class="memberAccount">{{ microProps.memberAccount }}</div>
                <div class="flex items-center mt-1">
                    <img src="./assets/currency.png" width="13" class="currency mr-0.5" />
                    <div class="balance mr-2">{{ userInfo.memberBal }}</div>
                </div>
            </div>
        </div>

        <div class="wrapper flex items-center" :class="isInLottery ? ' justify-around' : ''">
            <div v-if="isInLottery" class="item" @click="onClickItem(1)">
                <div class="img flex justify-center items-center">
                    <img src="./assets/introduce.png" width="25" />
                </div>
                <div>彩种介绍</div>
            </div>
            <div v-if="isInLottery" class="item" @click="onClickItem(2)">
                <div class="img flex justify-center items-center">
                    <img src="./assets/full_trend.png" width="25" />
                </div>
                <div>完整走势</div>
            </div>
            <div v-if="isInLottery" class="item" @click="onClickItem(3)">
                <div class="img flex justify-center items-center">
                    <img src="./assets/profit_ceiling.png" width="25" />
                </div>
                <div>盈利上限</div>
            </div>
            <div class="item" @click="onClickItem(4)">
                <div class="img flex justify-center items-center">
                    <img src="./assets/refresh.png" width="25" />
                </div>
                <div>刷新</div>
            </div>
            <div class="item mr-5" @click="onClickItem(5)">
                <div class="img flex justify-center items-center">
                    <img src="./assets/setting.png" width="25" />
                </div>
                <div>设置</div>
            </div>
        </div>
        <div class="footer flex justify-center items-center" @click="cancel">取消</div>
    </van-popup>
</template>

<script>
export default {
    name: 'SettingPopup'
};
</script>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCommonStore from '@/store/modules/common';
import { session } from '@/util/storage';

const route = useRoute();
const router = useRouter();
const commonStore = useCommonStore();
const microProps = session.get('microProps');

const userInfo = computed(() => commonStore.userInfo);
const currentLottery = computed(() => commonStore.currentLottery);
const settingPopupShow = computed(() => commonStore.settingPopupShow);
const isInLottery = computed(() => commonStore.isInLottery);

const onClickOverlay = () => {
    commonStore.settingPopupShow = false;
};

const cancel = () => {
    commonStore.settingPopupShow = false;
};

const onClickItem = i => {
    if (i == 1) {
        commonStore.lotteryIntroductionPopupShow = true;
    } else if (i == 3) {
        router.push('/winlimit');
    } else if (i == 4) {
        setTimeout(() => {
            router.go(0);
        }, 300);
    } else if (i == 5) {
        router.push('/settings');
    } else if (i === 2) {
        commonStore.setTrendTarget(route.path);
        router.push('/trend');
    }
    commonStore.settingPopupShow = false;
};
</script>

<style lang="scss" scoped></style>
