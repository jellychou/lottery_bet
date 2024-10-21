import { handleRDChange } from '@/util/tools';
const handleYb = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('sumsingle'):
            _.name = 'rules.klsf_sumsingle';
            break; // 合数单
        case code.includes('sumdouble'):
            _.name = 'rules.klsf_sumdouble';
            break; // 合数双
        case code.includes('endbig'):
            _.name = 'rules.klsf_endbig';
            break; // 尾大
        case code.includes('endsmall'):
            _.name = 'rules.klsf_endsmall';
            break; // 尾小
        case code.includes('east'):
            _.name = 'rules.klsf_east';
            break; // 東
        case code.includes('south'):
            _.name = 'rules.klsf_south';
            break; // 南
        case code.includes('west'):
            _.name = 'rules.klsf_west';
            break; // 西
        case code.includes('noth'):
            _.name = 'rules.klsf_noth';
            break; // 北
        case code.includes('center'):
            _.name = 'rules.klsf_center';
            break; // 中
        case code.includes('send'):
            _.name = 'rules.klsf_send';
            break; // 发'
        case code.includes('white'):
            _.name = 'rules.klsf_white';
            break; // 白
        case code.includes('big'):
            _.name = 'rules.c11x5_big';
            break; // 大
        case code.includes('small'):
            _.name = 'rules.c11x5_small';
            break; // 小
        case code.includes('single'):
            _.name = 'rules.c11x5_odd';
            break; // 单
        case code.includes('double'):
            _.name = 'rules.c11x5_even';
            break; // 双
        case code.includes('dragon'):
            _.name = 'rules.c11x5_dragon';
            break; // 龙
        case code.includes('tiger'):
            _.name = 'rules.c11x5_tiger';
            break; // 虎
        default:
            _.name = _.playCode.slice(2, 4);
            break;
    }
    res.push(_);
};

const handleSum = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('endbig'):
            _.name = 'rules.klsf_sumendbig';
            break; // 总和尾大
        case code.includes('endsmall'):
            _.name = 'rules.klsf_sumendsmall';
            break; // 总和尾小
        case code.includes('big'):
            _.name = 'rules.c11x5_zh_big';
            break; // 总和大
        case code.includes('small'):
            _.name = 'rules.c11x5_zh_small';
            break; // 总和小
        case code.includes('single'):
            _.name = 'rules.c11x5_zh_odd';
            break; // 总和单
        case code.includes('double'):
            _.name = 'rules.c11x5_zh_even';
            break; // 总和双
    }
    res.push(_);
};
export const filter = data => {
    // ruleName
    if (!data) return;
    let res = { sum: [], zm: [] };
    const ysArr = ['1', '2', '3', '4', '5', '6', '7', '8'];
    ysArr.forEach(_ => (res[_] = []));
    data.forEach(_ => {
        _.choose = false;
        _.odds = _.odds || '0.00';
        const tcode = _.playTypeCode;
        switch (true) {
            case ysArr.includes(tcode[0]):
                handleYb(res[tcode[0]], _);
                break; // 一八球
            case tcode.includes('sum'):
                handleSum(res.sum, _);
                break; // 总和
            case tcode === 'zm':
                _.name = _.playCode.slice(3, 5);
                res.zm.push(_);
                break; // 正码
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
            result.square = data[1].filter(_ => _.playTypeCode.indexOf('1-') === 0 && _.playTypeCode.indexOf('1-l-h') !== 0);
            result.checkbox = [
                { name: 'rules.c11x5_one_ball', value: 1 },
                { name: 'rules.c11x5_two_ball', value: 2 },
                { name: 'rules.c11x5_three_ball', value: 3 },
                { name: 'rules.c11x5_four_ball', value: 4 },
                { name: 'rules.c11x5_five_ball', value: 5 },
                { name: 'rules.klsf_six_ball', value: 6 },
                { name: 'rules.klsf_seven_ball', value: 7 },
                { name: 'rules.klsf_eight_ball', value: 8 }
            ];
            break;
        case 'lm':
            result.sort = [];
            result.sort.push({ title: 'rules.c11x5_one_ball', square: data[1].filter(_ => _.playTypeCode.indexOf('1-') === 0) }); // 第一球
            result.sort.push({ title: 'rules.c11x5_two_ball', square: data[2].filter(_ => _.playTypeCode.indexOf('2-') === 0) }); // 第二球
            result.sort.push({ title: 'rules.c11x5_three_ball', square: data[3].filter(_ => _.playTypeCode.indexOf('3-') === 0) }); // 第三球
            result.sort.push({ title: 'rules.c11x5_four_ball', square: data[4].filter(_ => _.playTypeCode.indexOf('4-') === 0) }); // 第四球
            result.sort.push({ title: 'rules.c11x5_five_ball', square: data[5].filter(_ => _.playTypeCode.indexOf('5-') === 0) }); // 第五球
            result.sort.push({ title: 'rules.klsf_six_ball', square: data[6].filter(_ => _.playTypeCode.indexOf('6-') === 0) }); // 第六球
            result.sort.push({ title: 'rules.klsf_seven_ball', square: data[7].filter(_ => _.playTypeCode.indexOf('7-') === 0) }); // 第七球
            result.sort.push({ title: 'rules.klsf_eight_ball', square: data[8].filter(_ => _.playTypeCode.indexOf('8-') === 0) }); // 第八球
            result.sort.push({ title: 'rules.c11x5_zh', square: data.sum }); // 总和
            break;
        case 'zm':
            result.sort = [];
            result.sort.push({ title: 'rules.c11x5_zh', square: data.sum }); // 总和
            result.sort.push({ title: 'rules.klsf_zm', square: data.zm }); // 正码
            break;
        default:
            result.ball = data[key] && data[key].filter(_ => _.playTypeCode === key);
            result.square = data[key] && data[key].filter(_ => _.playTypeCode.indexOf(key + '-') === 0);
            break;
    }
    return handleRDChange(storeRD, rodioIndex, result);
};
export const getColor = n => {
    switch (true) {
        case [1, 4, 7, 10, 13, 16, 19].includes(n):
            return 'red_b';
        case [2, 5, 8, 11, 14, 17, 20].includes(n):
            return 'blue_b';
        case [3, 6, 9, 12, 15, 18].includes(n):
            return 'green_b';
    }
};
