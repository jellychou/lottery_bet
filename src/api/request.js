import axios from 'axios';
import md5 from 'md5';
import { showConfirmDialog, showToast } from 'vant';
import { getQueryString } from '../util/tools';
import { session } from '@/util/storage';
import { enCode, getBeiJinTimeTamp } from '../util/disposeCode';

const request = axios.create({
    baseURL: '/api',
    timeout: 150000,
    headers: {
        post: {
            'Content-Type': 'application/json',
            i18n: window.location.href.indexOf('lang') > -1 ? getQueryString('lang') : 'zh'
        }
    }
});

request.interceptors.request.use(
    config => {
        const requestConfig = session.get('microProps') || {};

        config.headers = {
            ...config.headers,
            ...requestConfig,
            'Accept-Language': requestConfig.lang,
            FrontAuthorization: requestConfig.token
        };

        const { data } = config;
        // console.log('data=', data)
        // 如果有参数, 就请求头加Sign
        if (typeof data == 'object') {
            if (Object.values(data).length > 0) {
                let arr = [];
                for (let d in data) {
                    if (data[d] !== '' && typeof data[d] !== 'undefined' && data[d] !== 'null') {
                        //把非空的参数添加到数组
                        if (typeof data[d] == 'string') {
                            arr.push(d + '=' + data[d]); //字符串和数组拼接 会把数组拆包
                        } else {
                            arr.push(d + '=' + JSON.stringify(data[d])); // 如果不是字符串 强转成字符串
                        }
                    }
                }
                arr.sort(); // 数组排序1
                const timestamp = Math.round(new Date().getTime() / 1000).toString();
                arr.push('timestamp=' + timestamp); //加上时间戳

                config.headers = {
                    ...config.headers,
                    Timestamp: timestamp,
                    Sign: md5(arr.join('&')).toUpperCase()
                };
            }
        }

        // request 加密
        let diffTime = session.get('diffTime');
        let t = getBeiJinTimeTamp();
        t = t - diffTime;
        let newJson = JSON.stringify({ ...config.data, t });
        /*console.log(`======================`)
        console.log(`config.url=`, config.url)
        console.log(`newJson=`, newJson)*/
        let params = enCode(newJson);
        config.data = { params };
        return config;
    },
    err => {
        console.log(err);
        showToast('网络异常');
        return Promise.reject(err);
    }
);

request.interceptors.response.use(
    res => {
        const {
            data: { msg, code, data }
        } = res;

        switch (+code) {
            case 200:
                return data;
            case 401:
                showToast(msg);
                window.location.href = window.location.origin;
                return Promise.reject(msg);
            default:
                showToast(msg);
                return Promise.reject(msg);
        }
    },
    err => {
        console.log(err);
        if (String(err.response.data.code).indexOf('-100') > -1) {
            showConfirmDialog({
                // title: err.response.data.msg,
                message: err.response.data.msg
            })
                .then(() => {
                    // on confirm
                    if (session.get('microProps').isApp) {
                        window.location.href = window.location.origin;
                    } else {
                        window.location.href = window.location.origin + '/m';
                    }
                })
                .catch(() => {
                    // on cancel
                });

            throw new Error();
        }
        showToast(err.response.data.msg);
        return Promise.reject(err);
    }
);

export default request;
