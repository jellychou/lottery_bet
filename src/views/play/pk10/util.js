import { handleRDChange } from '@/util/tools';
const handleGyj = (res, _) => {
    const code = _.playCode;
    switch (true) {
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
            break; // 双'
        default:
            _.name = _.playCode.slice(8, 10);
            break;
    }
    res.push(_);
};
const handleYs = (res, _, tri) => {
    const code = _.playCode;
    switch (true) {
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
            _.name = tri ? _.playCode.slice(3, 5) : _.playCode.slice(2, 4);
            break;
    }
    res.push(_);
};

const handleGy = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('big'):
            _.name = 'rules.c11x5_gy_big';
            break; // 冠亚大
        case code.includes('small'):
            _.name = 'rules.c11x5_gy_small';
            break; // 冠亚小
        case code.includes('single'):
            _.name = 'rules.c11x5_gy_odd';
            break; // 冠亚单
        case code.includes('double'):
            _.name = 'rules.c11x5_gy_even';
            break; // 冠亚双
        default:
            _.name = _.playCode.slice(4, 6);
            break;
    }
    res.push(_);
};
export const filter = data => {
    // ruleName
    if (!data) return;
    let res = { sum: [], gyj: [], 10: [] };
    const ysArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    ysArr.forEach(_ => (res[_] = []));
    data.forEach(_ => {
        _.choose = false;
        _.odds = _.odds || '0.00';
        const tcode = _.playTypeCode;
        switch (true) {
            case tcode[1] === '0':
                handleYs(res[10], _, 1);
                break; // 十名
            case ysArr.includes(tcode[0]):
                handleYs(res[tcode[0]], _);
                break; // 一九名
            case tcode.includes('gyj'):
                handleGyj(res.gyj, _);
                break; // 冠亚季
            case tcode.includes('sum'):
                handleGy(res.sum, _);
                break; // 冠亚
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
            result.ball = data[1].filter(_ => {
                return _.playTypeCode === '1';
            });
            // ------老板需求 大小单双不要独立显示----- by mark
            result.square = data[1].filter(_ => {
                if (_.playTypeCode.indexOf('1-') === 0 && _.playTypeCode.indexOf('1-l-h') !== 0) {
                    _.isSquareClass = true;
                    return true;
                }
                return false;
            });
            result.ball = result.ball.concat(result.square);
            result.square = [];
            // 冠军 亚军 第三名~第十名
            result.checkbox = [
                { name: 'rules.pk10_champion', value: 1 },
                { name: 'rules.pk10_runner_up', value: 2 },
                { name: 'rules.pk10_third_place', value: 3 },
                { name: 'rules.pk10_fourth_place', value: 4 },
                { name: 'rules.pk10_fifth_place', value: 5 },
                { name: 'rules.pk10_sixth_place', value: 6 },
                { name: 'rules.pk10_seventh_place', value: 7 },
                { name: 'rules.pk10_eight_place', value: 8 },
                { name: 'rules.pk10_ninth_place', value: 9 },
                { name: 'rules.pk10_tenth_place', value: 10 }
            ];
            break;
        case 'lm':
            result.sort = [];
            // 冠军 亚军 第三名~第十名
            result.sort.push({ title: 'rules.pk10_champion', square: data[1].filter(_ => _.playTypeCode.indexOf('1-') === 0) });
            result.sort.push({ title: 'rules.pk10_runner_up', square: data[2].filter(_ => _.playTypeCode.indexOf('2-') === 0) });
            result.sort.push({ title: 'rules.pk10_third_place', square: data[3].filter(_ => _.playTypeCode.indexOf('3-') === 0) });
            result.sort.push({ title: 'rules.pk10_fourth_place', square: data[4].filter(_ => _.playTypeCode.indexOf('4-') === 0) });
            result.sort.push({ title: 'rules.pk10_fifth_place', square: data[5].filter(_ => _.playTypeCode.indexOf('5-') === 0) });
            result.sort.push({ title: 'rules.pk10_sixth_place', square: data[6].filter(_ => _.playTypeCode.indexOf('6-') === 0) });
            result.sort.push({ title: 'rules.pk10_seventh_place', square: data[7].filter(_ => _.playTypeCode.indexOf('7-') === 0) });
            result.sort.push({ title: 'rules.pk10_eight_place', square: data[8].filter(_ => _.playTypeCode.indexOf('8-') === 0) });
            result.sort.push({ title: 'rules.pk10_ninth_place', square: data[9].filter(_ => _.playTypeCode.indexOf('9-') === 0) });
            result.sort.push({ title: 'rules.pk10_tenth_place', square: data[10].filter(_ => _.playTypeCode.indexOf('10-') === 0) });
            result.sort.push({ title: 'rules.c11x5_gy_he', square: data.sum.filter(_ => _.playTypeCode.indexOf('sum-') === 0) });
            break;
        case 'hz':
            result.ball = data.sum.filter(_ => _.playTypeCode === 'sum');
            result.square = data.sum.filter(_ => _.playTypeCode.indexOf('sum-') === 0);
            break;
        case 'gyj':
            result.ball = data.gyj.filter(_ => _.playTypeCode === 'sum-gyj');
            result.square = data.gyj.filter(_ => _.playTypeCode.indexOf('sum-gyj-') === 0);
            break;
        default:
            result.ball = data[key] && data[key].filter(_ => _.playTypeCode === key);
            // ------老板需求 大小单双不要独立显示----- by mark
            // result.square = data[key] && data[key].filter(_ => _.playTypeCode.indexOf(key + '-') === 0)
            result.square =
                data[key] &&
                data[key].filter(_ => {
                    if (_.playTypeCode.indexOf(key + '-') === 0) {
                        _.isSquareClass = true;
                        return true;
                    }
                    return false;
                });
            result.ball = result.ball.concat(result.square);
            result.square = [];
            break;
    }
    return handleRDChange(storeRD, rodioIndex, result);
};
