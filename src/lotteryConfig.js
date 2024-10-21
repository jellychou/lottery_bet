import router from './router';
export default (Vue, Store, Router) => {
    Vue.config.productionTip = false;

    Vue.use(heade);
    Router.addRoutes(router); // 注册彩票路由
};
