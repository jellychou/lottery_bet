<template>
    <div class="scroll-num mt-4 ml-1" :style="{ '--i': props.i, '--delay': props.delay }">
        <ul ref="ulRef" :class="`ul_${props.i}`">
            <li class="_pk10">0</li>
            <li class="_pk1">1</li>
            <li class="_pk2">2</li>
            <li class="_pk3">3</li>
            <li class="_pk4">4</li>
            <li class="_pk5">5</li>
            <li class="_pk6">6</li>
            <li class="_pk7">7</li>
            <li class="_pk8">8</li>
            <li class="_pk9">9</li>
            <li class="_pk10">10</li>
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
import { unref, onMounted, ref, onBeforeMount, onBeforeUnmount } from 'vue';

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
        transform: translateY(calc(var(--i) * -9.09%))
      `
        );
    }, props.delay * 300);
});

onBeforeUnmount(() => {
    clearTimeout(unref(timer));
});
</script>
<style scoped>
.scroll-num {
    width: 20px;
    height: 20px;
    text-align: center;
    overflow: hidden;
    animation: enhance-bounce-in-down 1s calc(var(--delay) * 1s) forwards;
    margin-right: 6px;
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
        transform: translateY(calc(var(--i) * -9.09% - 7%));
        filter: none;
    }

    25% {
        transform: translateY(calc(var(--i) * -9.09% + 3%));
    }

    50% {
        transform: translateY(calc(var(--i) * -9.09% - 1%));
    }

    70% {
        transform: translateY(calc(var(--i) * -9.09% + 0.6%));
    }

    85% {
        transform: translateY(calc(var(--i) * -9.09% - 0.3%));
    }

    to {
        transform: translateY(calc(var(--i) * -9.09%));
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

[class^='_pk'] {
    width: 21px;
    height: 21px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    font-family: 'DIN Alternate';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    color: #ffffff;
    margin-right: 9px;
}
._pk1 {
    background: #ffcf26;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk2 {
    background: #40a1fb;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk3 {
    background: #434343;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk4 {
    background: #ff7539;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk5 {
    background: #0fd7e3;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk6 {
    background: #4d54ff;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk7 {
    background: #bebebe;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk8 {
    background: #ed3737;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk9 {
    background: #703b2a;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
._pk10 {
    background: #41c05d;
    text-shadow: -1px -1px 0 #0000004d, 1px -1px 0 #0000004d, -1px 1px 0 #0000004d, 1px 1px 0 #0000004d;
}
</style>
