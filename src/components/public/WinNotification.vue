<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getToken, getSiteCode } from '@/util/cach';
import useCommonStore from '@/store/modules/common';

const commonStore = useCommonStore();

const isOpen = computed(() => commonStore.isOpen);
const memberSettings = computed(() => commonStore.memberSettings);
const router = useRouter();

const goRecordDetail = () => {};

const wsMessages = ref([]);
const isConnected = ref(false);
let ws = null;
let reconnectTimeout = null;
const reconnectInterval = 5000;
const position = ref(30);
const time = ref(5000);
const isStart = ref(false);

let heartBeatInterval = null;
const heartBeatTime = 10000;

const createWebSocket = () => {
    let tokenKey = getToken();
    if (!tokenKey) return;
    tokenKey = tokenKey.replace(/\s/g, '');
    // ws = new WebSocket(`ws://g1-2.ml999888.com/ws/member/websocket?token=${tokenKey}&lang=zh&siteCode=${getSiteCode()}`); // 測試
    ws = new WebSocket(`wss://jeroq.ml-imitest.com/ws/member/websocket?token=${tokenKey}&lang=zh&siteCode=${getSiteCode()}`); // 正式

    ws.onopen = () => {
        isConnected.value = true;
        console.log('WebSocket connected.');
        startHeartBeat();
    };

    ws.onmessage = event => {
        const msgObj = JSON.parse(event.data);
        const newMessage = JSON.parse(msgObj.msg);

        // 设置新消息的初始位置和显示时间
        const lastMessage = wsMessages.value[wsMessages.value.length - 1];
        newMessage.position = lastMessage ? lastMessage.position + 70 : 30;
        newMessage.time = lastMessage ? lastMessage.time + 5000 : 5000;

        // 将新消息添加到消息数组中
        wsMessages.value.push(newMessage);
        console.log(wsMessages.value);

        // 设置定时器，在显示时间结束后移除消息
        setTimeout(() => {
            // 遍历消息数组，更新每条消息的位置
            wsMessages.value.forEach(message => {
                // 只有位置大于-70时才向上移动
                if (message.position > -70) {
                    message.position -= 70; // 向上移动70个像素
                }
            });
            console.log(123);
        }, newMessage.time);
    };

    ws.onerror = error => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        isConnected.value = false;
        console.log('WebSocket disconnected.');
        stopHeartBeat();
        if (!reconnectTimeout) {
            reconnectTimeout = setTimeout(() => {
                createWebSocket();
                reconnectTimeout = null;
            }, reconnectInterval);
        }
    };
};

const startHeartBeat = () => {
    heartBeatInterval = setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
            wsMessages.value = [];
        }
    }, heartBeatTime);
};

const stopHeartBeat = () => {
    if (heartBeatInterval) {
        clearInterval(heartBeatInterval);
        heartBeatInterval = null;
    }
};

const goRecord = () => {
    router.push('/record');
};

watch(
    () => memberSettings.value,
    newValue => {
        if (newValue.winningDialogs && !isStart.value) {
            createWebSocket();
        }
    }
);

onMounted(() => {
    if (memberSettings.value.winningDialogs) {
        createWebSocket();
        isStart.value = true;
    }
});

onBeforeUnmount(() => {
    if (ws) {
        ws.close();
    }
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }
    stopHeartBeat();
});
</script>

<template>
    <div @click="goRecord" class="notification" v-for="(item, index) in wsMessages" :key="index" :style="{ transform: `translateY(${item.position}px)` }">
        <div class="notificationLayout mx-3 px-3 py-2 flex items-center justify-between" @click="goRecordDetail">
            <div class="flex items-center justify-start">
                <div class="imgMask mr-2">
                    <img src="./assets/emo.png" alt="" />
                </div>
                <div>
                    <div class="winTitle">
                        恭喜中奖！ 奖金
                        <span class="winAmount">{{ item.money }}</span>
                    </div>
                    <p class="winInfo">{{ item.lotteryName }} {{ item.lotteryNum }}期 {{ item.count }}个注单</p>
                </div>
            </div>
            <div class="iconMask">
                <img src="./assets/arrowRight.svg" alt="" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.notification {
    position: fixed;
    z-index: 100;
    top: -20px;
    left: 0;
    right: 0;

    .notificationLayout {
        height: 60px;
        border-radius: 12px;
        background: linear-gradient(180deg, #ffeec4 0%, #fff6e0 100%);
        box-shadow: 0px 6px 12px 0px #00000040;
    }

    .imgMask {
        height: 40px;
        width: 40px;
    }

    .winTitle {
        font-size: 14px;
        font-weight: 800;
        color: #464c54;
    }

    .winAmount {
        color: #ff7539;
    }

    .winInfo {
        color: #60697a;
        font-size: 12px;
    }

    .iconMask {
        height: 16px;
        width: 16px;
    }
}
.isOpen {
    transition: transform 1s ease-in-out;
}

.isClose {
    transform: translateY(-100%);
    transition: transform 1s ease-in-out;
}
</style>
