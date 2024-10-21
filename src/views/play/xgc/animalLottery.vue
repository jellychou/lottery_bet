<template>
    <div class="scroll-num mr-1" :style="{ '--i': filterAnimal(props.i), '--delay': props.delay, '--percent': props.percent }">
        <ul ref="ulRef" :class="`ul_${filterAnimal(props.i)}`">
            <li class="ballItem relative" v-for="item in zodiac" :key="item">
                <span class="animal">{{ item }}</span>
            </li>
        </ul>
        <svg width="0" height="0">
            <filter id="blur">
                <feGaussianBlur in="SourceGraphic" :stdDeviation="`0 ${props.blur}`" />
            </filter>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'ReboundPk10'
};
</script>

<script setup>
import { unref, onMounted, ref, onBeforeMount, onBeforeUnmount, reactive } from 'vue';

const props = defineProps({
    delay: {
        type: Number,
        default: 1
    },
    blur: {
        type: Number,
        default: 2
    },
    i: {
        type: [Number, String],
        required: false,
        default: 0
    }
});

const ulRef = ref();
const timer = ref(null);
const zodiac = reactive(['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']);

const filterAnimal = animal => {
    switch (animal) {
        case '鼠':
            return 0;
            break;
        case '牛':
            return 1;
            break;
        case '虎':
            return 2;
            break;
        case '兔':
            return 3;
            break;
        case '龙':
            return 4;
            break;
        case '蛇':
            return 5;
            break;
        case '马':
            return 6;
            break;
        case '羊':
            return 7;
            break;
        case '猴':
            return 8;
            break;
        case '鸡':
            return 9;
            break;
        case '狗':
            return 10;
            break;
        case '猪':
            return 11;
            break;
        default:
            return '';
            break;
    }
};

onBeforeMount(() => {
    const ua = navigator.userAgent.toLowerCase();
    const testUA = regexp => regexp.test(ua);
    const isSafari = testUA(/safari/g) && !testUA(/chrome/g);

    // Safari浏览器的兼容代码
    timer.value = setTimeout(() => {
        ulRef.value.setAttribute(
            'style',
            `
        animation: none;
        transform: translateY(calc(var(--i) * -8.3%))
      `
        );
    }, props.delay * 500);
});

onBeforeUnmount(() => {
    clearTimeout(unref(timer));
});
</script>
<style lang="scss" scoped>
.scroll-num {
    width: 31px;
    height: 14px;
    text-align: center;
    overflow: hidden;
    animation: enhance-bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

ul {
    animation: move 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_1 {
    animation: move1 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_2 {
    animation: move2 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_3 {
    animation: move3 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_4 {
    animation: move4 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_5 {
    animation: move5 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_6 {
    animation: move6 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}
.ul_7 {
    animation: move7 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_8 {
    animation: move8 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

.ul_9 {
    animation: move9 0.3s linear infinite, bounce-in-down 1s calc(var(--delay) * 1s) forwards;
}

@keyframes move {
    from {
        transform: translateY(-80%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}
@keyframes move1 {
    from {
        transform: translateY(-60%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move2 {
    from {
        transform: translateY(-40%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move3 {
    from {
        transform: translateY(-60%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move4 {
    from {
        transform: translateY(-70%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move5 {
    from {
        transform: translateY(-40%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move6 {
    from {
        transform: translateY(-70%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move7 {
    from {
        transform: translateY(-50%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move8 {
    from {
        transform: translateY(-30%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes move9 {
    from {
        transform: translateY(-60%);
        filter: url(#blur);
    }

    to {
        transform: translateY(1%);
        filter: url(#blur);
    }
}

@keyframes bounce-in-down {
    from {
        transform: translateY(calc(var() * -8.3 - 7%));
        filter: none;
    }

    25% {
        transform: translateY(calc(var(--i) * -8.3 + 3%));
    }

    50% {
        transform: translateY(calc(var(--i) * -8.3 - 1%));
    }

    70% {
        transform: translateY(calc(var(--i) * -8.3 + 0.6%));
    }

    85% {
        transform: translateY(calc(var(--i) * -8.3 - 0.3%));
    }

    to {
        transform: translateY(calc(var(--i) * -8.3));
    }
}

@keyframes enhance-bounce-in-down {
    25% {
        transform: translateY(8%);
    }

    50% {
        transform: translateY(-4%);
    }

    70% {
        transform: translateY(2%);
    }

    85% {
        transform: translateY(-1%);
    }

    to {
        transform: translateY(0);
    }
}

.ballItem {
    width: 31px;
    height: 29px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    font-family: 'DIN Alternate';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    margin-right: 9px;
    z-index: 0;
}

.ball {
    width: 30px;
    height: 30px;
}

.animal {
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    font-family: 'DIN Alternate';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    position: absolute;
    top: -3px;
    color: #fff;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
</style>
