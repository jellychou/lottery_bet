<template>
    <div id="e_l" ref="e_l" class="w-full h-full">
        <router-view v-slot="{ Component }">
            <keep-alive :include="['Home']">
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <WinNotification />
        <SettingPopup />
    </div>
</template>

<script>
export default {
    name: 'App'
};
</script>

<script setup>
import { onMounted, ref, reactive, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import SettingPopup from './components/public/SettingPopup.vue';
import _TimerAdapter from '@/util/timerAdapter';
import { createRouterFunction } from '@/util/tools';
import { session } from '@/util/storage';
import { setCurrentLottery } from '@/util/cach';
import { getLotterySetByMemberId, getUser } from '@/api/interface';
// import { getBeiJinTimeTamp } from '@/util/disposeCode';
import WinNotification from './components/public/WinNotification.vue';

const router = useRouter();
const commonStore = useCommonStore();

const e_l = ref(null);
const tran = ref(0);
const path = ref('null');
const showlsit = ref(0);
let lastTouchEnd = 0;

const scaleStr = event => {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
};

const scaleEnd = event => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
};

const microProps = session.get('microProps');

if (microProps) {
    commonStore.initLottery(microProps).then(list => {
        createRouterFunction(list).forEach(route => {
            router.addRoute(route);
        });
    });
} else {
    showToast('缺少必要信息');
}

// 禁止双击缩放相关
document.addEventListener('touchstart', scaleStr);
lastTouchEnd = 0;
document.addEventListener('touchend', scaleEnd, false);

const getMemberInfo = () => {
    getLotterySetByMemberId({}).then(res => {
        if (res === undefined) {
            return;
        } else {
            commonStore.setMemberSettings(res);
        }
        // const beiJinTime = getBeiJinTimeTamp();
        // session.save({ diffTime: beiJinTime - res.t });
    });
};

const getUserInfo = async () => {
    const res = await getUser();
    commonStore.userInfo = {
        memberBal: res.balance,
        memberAcct: ''
    };
};

onMounted(() => {
    // 处理动画并兼容
    setTimeout(() => {
        showlsit.value = 1;
        setTimeout(() => {
            e_l.value && (e_l.value.style.transition = 'all .38s ease-in-out');
        }, 100);
    }, 500);
    document.title = 'M LOTTERY';
    getMemberInfo();
    getUserInfo()
});

onBeforeUnmount(() => {
    document.removeEventListener('touchstart', scaleStr);
    document.removeEventListener('touchend', scaleEnd);
    _TimerAdapter.destroy();
});
</script>

<style lang="scss">
#app-lottery {
    /* height: 100%; */
    width: 100%;
    background-color: #fff;
    // background-color: #eff2f5;
}

#e_l {
    height: 100%;
    width: 100%;
}
</style>
