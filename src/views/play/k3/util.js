import { handleRDChange } from '@/util/tools';
import { useI18n } from 'vue-i18n';

const handleSg = (res, _, t) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('big'):
            _.name = t('bettingDetail.Big');
            break;
        case code.includes('small'):
            _.name = t('bettingDetail.small');
            break;
        case code.includes('single'):
            _.name = t('bettingDetail.single');
            break;
        case code.includes('double'):
            _.name = t('bettingDetail.double');
            break;
        default:
            _.name = _.playCode.slice(-1);
            break;
    }
    res.push(_);
};

export const filterValue = (data, t) => {
    if (!data) return;
    let res = { ds: [], sg: [], dp: [], cp: [], ws: [], slh: [], sbth: [] };
    data.forEach(_ => {
        _.choose = false;
        _.odds = _.odds || '0.00';
        const tcode = _.playTypeCode;
        switch (true) {
            case tcode === 'sg':
                handleSg(res.sg, _, t);
                break; // 三军 和值
            case tcode === 'sum-b-s':
                handleSg(res.sg, _, t);
                break; // 三军 和值大小
            case tcode === 'sum-s-d':
                handleSg(res.sg, _, t);
                break; // 三军 和值單雙
            case tcode === 'ws':
                _.name = _.playCode.slice(-3);
                res.ws.push(_);
                break; // 围骰
            case tcode === 'qs':
                _.name = 'all';
                res.ws.push(_);
                break; // 全骰
            case tcode === 'ds':
                _.name = _.playCode.slice(3, 6) + t('betting.Points');
                res.ds.push(_);
                break; // 点数
            case tcode === 'cp':
                _.name = _.playCode.slice(3, 6);
                res.cp.push(_);
                break; // 长牌
            case tcode === 'dp':
                _.name = _.playCode.slice(3, 6);
                res.dp.push(_);
                break; // 短牌
            case tcode === 'slh':
                _.name = _.playCode === 'slh-qb' ? 'all' : _.playCode.slice(4, 7);
                res.slh.push(_);
                break; // 三连号
            case tcode === 'sbth':
                _.name = _.playCode.slice(5, 8);
                res.sbth.push(_);
                break; // 三不同号
        }
    });
    return res;
};
export const handleData = (storeData, storeRD, rodioIndex, data, key) => {
    let result = {};
    if (!data) return result;
    storeData = data;
    switch (key) {
        case 'ds':
            result.square = [...data.sg.filter(_ => _.playCode.length > 4), ...data.ds];
            break; // 和值
        case 'sg':
            result.ball = data.sg.filter(_ => _.playCode.length === 4);
            break; // 单号
        case 'dp':
            result.ball = data.dp;
            break; // 二同号
        case 'cp':
            result.ball = data.cp;
            break; // 二不同号
        case 'ws':
            result.ball = data.ws;
            break; // 三同号
        case 'slh':
            result.ball = data.slh;
            break; // 三连号
        case 'sbth':
            result.ball = data.sbth;
            break; // 三不同号
    }
    return handleRDChange(storeRD, rodioIndex, result);
};
