import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import moreRoutes from '@/data/moreRoutes'; // 利用此数据生成右侧划出列表路由
import { lotteryList } from '@/store/modules/common';
import { createRouterFunction, mod } from '@/util/tools';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import useCommonStore from '../store/modules/common';

NProgress.configure({ showSpinner: false }); //不要转圈

const modules = import.meta.glob('@/components/more/*.vue');

const routes = [
    {
        path: '/',
        name: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: '/home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue')
    },
    {
        path: '/analyze', //分析
        name: '/analyze',
        component: () => import(/* webpackChunkName: "analyze" */ '@/views/analyze/index.vue')
    },
    {
        path: '/trend', //走势图
        name: '/trend',
        component: () => import(/* webpackChunkName: "trend" */ '@/views/trend/index.vue')
    },
    {
        path: '/record', // 记录
        name: '/record',
        component: () => import(/* webpackChunkName: "record" */ '@/views/record/index.vue')
    },
    {
        path: '/record-details', // 记录
        name: 'recordDetails',
        component: () => import(/* webpackChunkName: "record" */ '@/views/record/recordDetails.vue')
    },
    {
        path: '/trackingDetails', // 追號记录
        name: 'trackingDetails',
        component: () => import(/* webpackChunkName: "record" */ '@/views/record/trackingDetails.vue')
    },
    {
        path: '/winlimit', // 盈利上限
        name: 'winlimit',
        component: () => import(/* webpackChunkName: "winlimit" */ '@/views/winlimit/index.vue')
    },
    {
        path: '/settings', // 设置
        name: '/settings',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/settings/index.vue')
    },
    ...createRouterFunction(lotteryList) // 初始化时用彩种列表生成彩票路由
];

const router = createRouter({
    history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/m/lotteryInner/normal/' : '/'),
    routes
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const commonStore = useCommonStore();
    if (from.path === '/trend') {
        commonStore.setTrendTarget({});
    }
    next();
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
