import { handleRDChange } from '@/util/tools';
const handleDxdszh = (res, _, troggle) => {
    const code = _.playCode;
    // const pre = troggle ? '总和' : ''
    switch (true) {
        case code.includes('single'):
            _.name = troggle ? 'rules.c11x5_zh_odd' : 'bettingDetail.single';
            break; // 单; break
        case code.includes('double'):
            _.name = troggle ? 'rules.c11x5_zh_even' : 'bettingDetail.double';
            break;
        case code.includes('big'):
            _.name = troggle ? 'rules.c11x5_zh_big' : 'bettingDetail.Big';
            break;
        case code.includes('small'):
            _.name = troggle ? 'rules.c11x5_zh_small' : 'bettingDetail.small';
            break;
        default:
            _.name = +code.slice(2);
            break;
    }
    res.push(_);
};
const handleLs = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('bao'):
            _.name = 'rules.ssc_bao';
            break; // 豹子
        case code.includes('ban'):
            _.name = 'rules.ssc_ban';
            break; // 半顺
        case code.includes('shun'):
            _.name = 'rules.ssc_shun';
            break; // 顺子
        case code.includes('dui'):
            _.name = 'rules.ssc_dui';
            break; // 对子
        case code.includes('za'):
            _.name = 'rules.ssc_za';
            break; // 杂六
    }
    res.push(_);
};
const handleDn = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('none'):
            _.name = 'rules.ssc_mei_niu';
            break; // 没牛
        case code.includes('0'):
            _.name = 'rules.ssc_niu_niu';
            break; // 牛牛
        case code.includes('big'):
            _.name = 'rules.ssc_niu_big';
            break; // 牛大
        case code.includes('small'):
            _.name = 'rules.ssc_niu_small';
            break; // 牛小
        case code.includes('single'):
            _.name = 'rules.ssc_niu_odd';
            break; // 牛单
        case code.includes('double'):
            _.name = 'rules.ssc_niu_even';
            break; // 牛双
        default:
            _.name = `rules.ssc_niu_${code[3]}`;
            break;
    }
    res.push(_);
};
const handleSh = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('wt'):
            _.name = 'rules.ssc_wt';
            break; // 五条
        case code.includes('sit'):
            _.name = 'rules.ssc_sit';
            break; // 四条
        case code.includes('hl'):
            _.name = 'rules.ssc_hl';
            break; // 葫芦
        case code.includes('sant'):
            _.name = 'rules.ssc_sant';
            break; // 三条
        case code.includes('lt'):
            _.name = 'rules.ssc_lt';
            break; // 两对
        case code.includes('yd'):
            _.name = 'rules.ssc_yd';
            break; // 一对
        case code.includes('sz'):
            _.name = 'rules.ssc_sz';
            break; // 顺子
        case code.includes('sh'):
            _.name = 'rules.ssc_san_hao';
            break; // 散号
    }
    res.push(_);
};

export const filter = data => {
    if (!data) return;
    let res = { 1: [], 2: [], 3: [], 4: [], 5: [], sum: [], lhh: [], qsq: [], zsq: [], hsq: [], dn: [], sh: [] };
    const indexObj = { w: 1, q: 2, b: 3, s: 4, g: 5 };
    data.forEach(_ => {
        _.choose = false;
        _.odds = _.odds || '0.00';
        const code = _.playCode;
        const tcode = _.playTypeCode;
        switch (true) {
            case code[1] === '-':
                handleDxdszh(res[indexObj[tcode[0]]], _);
                break; // 一至五球
            case tcode.includes('sum'):
                handleDxdszh(res.sum, _, 1);
                break; // 总和大小单双
            case tcode === 'lhh':
                _.name = code.includes('tiger') ? 'rules.c11x5_tiger' : code.includes('dragon') ? 'rules.c11x5_dragon' : 'rules.ssc_draw';
                res.lhh.push(_);
                break; // 龙虎斗
            case tcode === 'qsq':
                handleLs(res.qsq, _);
                break; // 前三球
            case tcode === 'zsq':
                handleLs(res.zsq, _);
                break; // 中三球
            case tcode === 'hsq':
                handleLs(res.hsq, _);
                break; // 后三球
            case tcode === 'dn':
                handleDn(res.dn, _);
                break; // 斗牛
            case tcode === 'sh':
                handleSh(res.sh, _);
                break; // 梭哈
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
            result.ball = data[1].filter(_ => _.playTypeCode === 'w');
            result.square = data[1].filter(_ => _.playTypeCode.indexOf('w-') === 0);
            result.ball = result.ball.concat(result.square);
            result.square = [];
            result.checkbox = [
                { name: 'rules.c11x5_one_ball', id: 'w', value: 1 },
                { name: 'rules.c11x5_two_ball', id: 'q', value: 2 },
                { name: 'rules.c11x5_three_ball', id: 'b', value: 3 },
                { name: 'rules.c11x5_four_ball', id: 's', value: 4 },
                { name: 'rules.c11x5_five_ball', id: 'g', value: 5 }
            ];
            break;
        case 'lm':
            result.sort = [];
            result.sort.push({ title: 'rules.c11x5_w_first', square: data[1].filter(_ => _.playTypeCode.indexOf('w-') === 0) }); // 万第一球
            result.sort.push({ title: 'rules.c11x5_b_two', square: data[2].filter(_ => _.playTypeCode.indexOf('q-') === 0) }); // 千第二球
            result.sort.push({ title: 'rules.c11x5_q_three', square: data[3].filter(_ => _.playTypeCode.indexOf('b-') === 0) }); // 百第三球
            result.sort.push({ title: 'rules.c11x5_s_four', square: data[4].filter(_ => _.playTypeCode.indexOf('s-') === 0) }); // 十第四球
            result.sort.push({ title: 'rules.c11x5_g_five', square: data[5].filter(_ => _.playTypeCode.indexOf('g-') === 0) }); // 个第五球
            result.sort.push({ title: 'rules.c11x5_zh_lh', square: [...data.sum, ...data.lhh] }); // 总和/龙虎
            break;
        case '1':
            result.ball = data[1].filter(_ => _.playTypeCode === 'w');
            result.square = data[1].filter(_ => _.playTypeCode.indexOf('w-') === 0);
            break;
        case '2':
            result.ball = data[2].filter(_ => _.playTypeCode === 'q');
            result.square = data[2].filter(_ => _.playTypeCode.indexOf('q-') === 0);
            break;
        case '3':
            result.ball = data[3].filter(_ => _.playTypeCode === 'b');
            result.square = data[3].filter(_ => _.playTypeCode.indexOf('b-') === 0);
            break;
        case '4':
            result.ball = data[4].filter(_ => _.playTypeCode === 's');
            result.square = data[4].filter(_ => _.playTypeCode.indexOf('s-') === 0);
            break;
        case '5':
            result.ball = data[5].filter(_ => _.playTypeCode === 'g');
            result.square = data[5].filter(_ => _.playTypeCode.indexOf('g-') === 0);
            break;
        case 'sq':
            result.sort = [];
            result.sort.push({ title: 'rules.ssc_qsq', square: data.qsq }); // 前三球
            result.sort.push({ title: 'rules.ssc_zsq', square: data.zsq }); // 中三球
            result.sort.push({ title: 'rules.ssc_hsq', square: data.hsq }); // 后三球
            break;
        case 'dn':
            result.square = data.dn;
            break;
        case 'sh':
            result.square = data.sh;
            break;
    }
    return handleRDChange(storeRD, rodioIndex, result);
};
