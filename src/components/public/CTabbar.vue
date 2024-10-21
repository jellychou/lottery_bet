<template>
    <nav class="tabbar grid grid-cols-4 absolute left-0 bottom-0 w-full" :class="{ active: !show }">
        <a v-for="n in nav" :key="n.icon" class="flex flex-col items-center justify-center" @click="pageJump(n.path)">
            <div class="icon">
                <Component class="msg" :is="n.icon" :class="{ active: activeFooter === n.path }" />
            </div>
            <p class="title" :class="{ active: activeFooter === n.path }">{{ n.title }}</p>
        </a>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import homeIcon from './assets/home.png';
import analyzeIcon from './assets/analyze.png';
import trendIcon from './assets/trend.png';
import recordIcon from './assets/record.png';
import IconHome from '@/components/public/assets/home.svg?component';
import IconAnalyze from './assets/analyze.svg?component';
import IconTrend from './assets/trend.svg?component';
import IconRecord from './assets/record.svg?component';

const { push } = useRouter();
const route = useRoute();

const show = ref(true);
const activeFooter = ref(route.path);
const oldScrollTop = ref(0);

const onScroll = () => {
    // 滚动条距文档顶部的距离
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollTop == 0) return (show.value = true);
    // 滚动条滚动的距离
    let scrollStep = scrollTop - oldScrollTop.value;
    // 更新——滚动前，滚动条距文档顶部的距离
    oldScrollTop.value = scrollTop;

    if (scrollStep <= 0) {
        show.value = true;
    } else {
        show.value = false;
    }
};

onMounted(() => {
    if (!window.navigator.standalone) {
        window.addEventListener('scroll', onScroll, true);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll, true);
});

const nav = computed(() => {
    return [
        {
            path: '/home',
            icon: IconHome,
            title: '首页'
        },
        {
            path: '/analyze',
            icon: IconAnalyze,
            title: '分析'
        },
        {
            path: '/trend',
            icon: IconTrend,
            title: '走势图'
        },
        {
            path: '/record',
            icon: IconRecord,
            title: '记录'
        }
    ];
});

const pageJump = url => {
    push(url);
};
</script>

<style scoped lang="scss">
.tabbar {
    min-height: 50px;
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-top: 1px solid #f1f4f9;
    transition: transform 0.3s ease-out;
    transform: translate3d(0px, 0px, 0px);
    padding-bottom: calc(var(--safe-bottom));
    padding-top: calc(var(--safe-bottom) - 25px);
    background-color: #fff;
    &.active {
        transform: translate3d(0px, calc(var(--safe-bottom) + 48px), 0px);
    }
    .icon {
        width: 23px;
        height: 23px;

        .msg {
            width: 23px;
            height: 23px;
            &.active {
                color: #1e8ef5;
            }
        }
    }
    .title {
        font-size: 11px;
        line-height: 15px;
        color: #464c54;
        &.active {
            color: #1e8ef5;
            font-weight: 500;
        }
    }
}
</style>
