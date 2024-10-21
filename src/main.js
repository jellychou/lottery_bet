import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import store from './store';
import i18n from './lang';
import ant from './util/ant';
// import 'amfe-flexible';
import 'vant/lib/index.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/style/reset.scss'; //覆盖父应用样式
import './assets/style/index.scss';
import 'tailwindcss/tailwind.css';
import '@/util/rem';
import { Lazyload } from 'vant';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

import { session } from '@/util/storage';

import Header from './components/public/Header.vue';
import Loading from './components//public/Loading.vue';

let instance = null;

if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    console.log(import.meta.env.BASE_URL);
    console.log(qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__);
}

const render = (props = {}) => {
    console.log('props', props);
    instance = createApp(App);
    instance.use(i18n);
    instance.use(router);
    instance.use(store);
    instance.use(ant);
    instance.use(ElementPlus);
    instance.use(Lazyload);
    instance.component('Header', Header);
    instance.component('Loading', Loading);

    // 内嵌
    if ('container' in props) {
        const { lang, channelCode, gameCode, token, siteCode, memberAccount, currency } = props;

        session.save({ microProps: { lang, channelCode, gameCode, token, siteCode, memberAccount, currency } });
        console.log(instance);

        // 全局内嵌状态值用于某些开关判断
        instance.config.globalProperties.$inner = true;
    } else {
        const params = new URLSearchParams(window.location.search); //历史模式
        if (params.get('token')) {
            session.save({
                microProps: {
                    lang: params.get('lang'),
                    gameCode: params.get('gameCode'),
                    token: params.get('token'),
                    siteCode: params.get('siteCode'),
                    memberAccount: params.get('memberAccount'),
                    isApp: params.get('is_app'),
                    currency: params.get('currency')
                }
            });
        }

        // 储存必要的数据
        Array.from(params.entries()).forEach(e => {
            const [key, val] = e;
            localStorage.setItem(key, val);
        });
    }

    instance.mount(props.container ? props.container.querySelector('#app-lottery') : '#app-lottery');
};

renderWithQiankun({
    mount(props) {
        render(props);
    },
    bootstrap() {
        console.log('bootstrap');
    },
    unmount() {
        console.log('unmount');
        // const store = useUserStore();
        // store.$reset();
        instance.unmount();
        instance._container.innerHTML = '';
        instance = null;
    },
    update() {
        console.log('update');
    }
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render({});
}
