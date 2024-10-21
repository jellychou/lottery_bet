<template>
    <span class="timer">
        {{ formatSeconds(countDownTime) }}
    </span>
</template>
<script>
export default {
    name: 'Home'
};
</script>
<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { formatSeconds } from '@/util/tools';

const props = defineProps({
    time: String,
    callback: Function //倒计时结束回调
});

const emit = defineEmits(['update:time']);

let countDownTime = ref(props.time);

const pageTimer = ref(null);

const openMatchTimer = () => {
    if (props.time > 0) {
        clearInterval(pageTimer.value);
        pageTimer.value = setInterval(() => {
            if (countDownTime.value == 0) {
                clearInterval(pageTimer.value);
                props?.callback?.();
            } else {
                countDownTime.value = countDownTime.value - 1;
                // emit('update:time', countDownTime.value);
            }
        }, 1000);
    }
};

watchEffect(() => {
    countDownTime.value = props.time;
    openMatchTimer();
});

onMounted(() => {
    openMatchTimer();
});

onUnmounted(() => {
    if (pageTimer.value) clearInterval(pageTimer.value);
});

onDeactivated(() => {
    if (pageTimer.value) clearInterval(pageTimer.value);
});

onActivated(() => {
    openMatchTimer();
});
</script>

<style scoped lang="scss">
// .timer {
//     margin-left: 5px;
// }
</style>
