import { handleRDChange, chooseDataZh, chooseDataPl } from '@/util/tools';
import { useI18n } from 'vue-i18n';
const handleDxdszh = (res, _, troggle) => {
    const code = _.playCode;
    // const pre = troggle ? '总和' : ''
    switch (true) {
        case code.includes('single'):
            _.name = troggle ? 'rules.c11x5_zh_odd' : 'bettingDetail.single';
            break; // 单
        case code.includes('double'):
            _.name = troggle ? 'rules.c11x5_zh_even' : 'bettingDetail.double';
            break; // 双
        case code.includes('big'):
            _.name = troggle ? 'rules.c11x5_zh_big' : 'bettingDetail.Big';
            break; // 大
        case code.includes('small'):
            _.name = troggle ? 'rules.c11x5_zh_small' : 'bettingDetail.small';
            break; // 小
        default:
            _.name = code.slice(2);
            break;
    }
    res.push(_);
};
export const filter = data => {
    if (!data) return;
    let res = { 1: [], 2: [], 3: [], 4: [], 5: [], sum: [], yzy: [], eze: [], szs: [], sizsi: [], wzw: [], lzw: [], qzw: [], bzw: [], zxqe: [], zxqs: [], zuxqe: [], zuxqs: [], lh: [] };
    data.forEach(_ => {
        _.choose = false;
        _.odds = _.odds || '0.00';
        const code = _.playCode;
        const tcode = _.playTypeCode;
        const ysqArr = ['1', '2', '3', '4', '5'];
        switch (true) {
            case ysqArr.includes(tcode[0]):
                handleDxdszh(res[tcode[0]], _);
                break; // 一至五球
            case tcode === 'sum-b-s':
                handleDxdszh(res.sum, _, 1);
                break; // 总和大小
            case tcode === 'sum-s-d':
                handleDxdszh(res.sum, _, 1);
                break; // 总和单双
            case tcode === 'sum-w-b-s':
                _.name = code.includes('endbig') ? 'rules.c11x5_zh_wei_big' : 'rules.c11x5_zh_wei_small';
                res.sum.push(_);
                break; // 和尾数大小 // 总和尾大 总和尾小
            case tcode === 'zw':
                _.name = code.includes('single') ? 'rules.c11x5_odd' : 'rules.c11x5_even';
                res.sum.push(_);
                break; // 和尾数单双 //  总和尾单 总和尾双
            case tcode === 'lh':
                _.name = code.includes('tiger') ? 'rules.c11x5_tiger' : 'rules.c11x5_dragon';
                res.lh.push(_);
                break; // 龙虎斗 // 虎 龙

            case tcode === 'rx-yzy':
                _.name = code.slice(7);
                res.yzy.push(_);
                break; // 一中一
            case tcode === 'rx-eze':
                _.name = code.slice(7);
                res.eze.push(_);
                break; // 二中二
            case tcode === 'rx-szs':
                _.name = code.slice(7);
                res.szs.push(_);
                break; // 3中3
            case tcode === 'rx-sizsi':
                _.name = code.slice(9);
                res.sizsi.push(_);
                break; // 4中4
            case tcode === 'rx-wzw':
                _.name = code.slice(7);
                res.wzw.push(_);
                break; // 5中5
            case tcode === 'rx-lzw':
                _.name = code.slice(7);
                res.lzw.push(_);
                break; // 6中5
            case tcode === 'rx-qzw':
                _.name = code.slice(7);
                res.qzw.push(_);
                break; // 7中5
            case tcode === 'rx-bzw':
                _.name = code.slice(7);
                res.bzw.push(_);
                break; // 8中5
            case tcode === 'zx-zxqe':
                _.name = code.slice(8);
                res.zxqe.push(_);
                break; // 直选前二
            case tcode === 'zx-zxqs':
                _.name = code.slice(8);
                res.zxqs.push(_);
                break; // 直选前3
            case tcode === 'zux-zuxqe':
                _.name = code.slice(10);
                res.zuxqe.push(_);
                break; // 组选前2
            case tcode === 'zux-zuxqs':
                _.name = code.slice(10);
                res.zuxqs.push(_);
                break; // 组选前三
        }
    });
    return res;
};
export const hndleData = (storeData, storeRD, rodioIndex, data, key) => {
    let result = {};
    if (!data) return result;
    storeData.value = data;
    switch (key) {
        case 'kj':
            result.ball = data[1].filter(_ => _.playTypeCode === '1');
            result.square = data[1].filter(_ => _.playTypeCode.indexOf('1-') === 0);
            result.checkbox = [
                { name: 'rules.c11x5_one_ball', value: 1 },
                { name: 'rules.c11x5_two_ball', value: 2 },
                { name: 'rules.c11x5_three_ball', value: 3 },
                { name: 'rules.c11x5_four_ball', value: 4 },
                { name: 'rules.c11x5_five_ball', value: 5 }
            ];
            break;
        case 'lm':
            result.sort = [];
            result.sort.push({ title: 'rules.c11x5_one_ball', square: data[1].filter(_ => _.playTypeCode.indexOf('1-') === 0) }); // 第一球
            result.sort.push({ title: 'rules.c11x5_two_ball', square: data[2].filter(_ => _.playTypeCode.indexOf('2-') === 0) }); // 第二球
            result.sort.push({ title: 'rules.c11x5_three_ball', square: data[3].filter(_ => _.playTypeCode.indexOf('3-') === 0) }); // 第三球
            result.sort.push({ title: 'rules.c11x5_four_ball', square: data[4].filter(_ => _.playTypeCode.indexOf('4-') === 0) }); // 第四球
            result.sort.push({ title: 'rules.c11x5_five_ball', square: data[5].filter(_ => _.playTypeCode.indexOf('5-') === 0) }); // 第五球
            result.sort.push({ title: 'rules.c11x5_lm', square: [...data.sum, ...data.lh] }); // 总和-龙虎和
            break;
        case '1':
            result.ball = data[1].filter(_ => _.playTypeCode === '1');
            result.square = data[1].filter(_ => _.playTypeCode.indexOf('1-') === 0);
            break;
        case '2':
            result.ball = data[2].filter(_ => _.playTypeCode === '2');
            result.square = data[2].filter(_ => _.playTypeCode.indexOf('2-') === 0);
            break;
        case '3':
            result.ball = data[3].filter(_ => _.playTypeCode === '3');
            result.square = data[3].filter(_ => _.playTypeCode.indexOf('3-') === 0);
            break;
        case '4':
            result.ball = data[4].filter(_ => _.playTypeCode === '4');
            result.square = data[4].filter(_ => _.playTypeCode.indexOf('4-') === 0);
            break;
        case '5':
            result.ball = data[5].filter(_ => _.playTypeCode === '5');
            result.square = data[5].filter(_ => _.playTypeCode.indexOf('5-') === 0);
            break;
        case 'zx':
            result.balls = [data.zxqe, data.zxqs];
            result.rodio = [{ name: 'rules.c11x5_first_two_digits' }, { name: 'rules.c11x5_first_three_digits' }]; // 前二 前三
            break;
        case 'zux':
            result.balls = [data.zuxqe, data.zuxqs];
            result.rodio = [{ name: 'rules.c11x5_first_two_digits' }, { name: 'rules.c11x5_first_three_digits' }]; // 前二 前三
            break;
        case 'rx':
            result.balls = [data.yzy, data.eze, data.szs, data.sizsi, data.wzw, data.lzw, data.qzw, data.bzw];
            //  一中一 二中二 三中三 四中四 五中五 六中五 七中五 八中五
            result.rodio = [
                { name: 'rules.c11x5_one_in_one' },
                { name: 'rules.c11x5_two_in_two' },
                { name: 'rules.c11x5_three_in_three' },
                { name: 'rules.c11x5_four_in_four' },
                { name: 'rules.c11x5_five_in_five' },
                { name: 'rules.c11x5_six_in_five' },
                { name: 'rules.c11x5_seven_in_five' },
                { name: 'rules.c11x5_eight_in_five' }
            ];
            break;
    }
    return handleRDChange(storeRD, rodioIndex, result);
};

const chooseDataTt = (arr, re) => {
    // 拖头投注
    const locks = arr.filter(_ => _.lock);
    arr.filter(_ => !_.lock).forEach(_ => re.push(locks.concat(_)));
};
export const handleZx = (data, index, list, type) => {
    if (data.length >= index) {
        const combination = [];
        let { playTypeCode, playTypeName, odds } = data[0];
        type ? chooseDataTt(data, combination) : chooseDataZh(data, index, combination);
        list.push(
            ...combination.map(_ => ({ odds: Math.min(..._.map(i => i.odds)) || odds, playTypeCode, playTypeName, name: _.map(i => i.name).join(), playCode: _.map(i => i.playCode).join('@') }))
        );
    } else {
        list.err = '选择不能少于' + index + '个';
    }
};
export const getColor = n => {
    switch (true) {
        case [2, 5, 8, 11].includes(n):
            return 'blue_b';
        case [1, 3, 4, 6, 7, 9, 10].includes(n):
            return 'green_b';
    }
};
