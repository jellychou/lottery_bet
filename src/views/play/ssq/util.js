import { handleRDChange, chooseDataZh } from '@/util/tools';

const handleRedbsm = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code == 'b-s-m-big':
            _.name = '大多';
            break;
        case code == 'b-s-m-small':
            _.name = '小多';
            break;
        case code == 'b-s-m-draw':
            _.name = '和';
            break;
    }
    res.push(_);
};

const handleRedsdm = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code == 's-d-m-single':
            _.name = '单多';
            break;
        case code == 's-d-m-double':
            _.name = '双多';
            break;
        case code == 's-d-m-draw':
            _.name = '和';
            break;
    }
    res.push(_);
};

const handleRedlh = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('dragon'):
            _.name = '龙';
            break;
        case code.includes('tiger'):
            _.name = '虎';
            break;
        case code.includes('draw'):
            _.name = '和';
            break;
    }
    res.push(_);
};

const handleBs = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('big'):
            _.name = '大';
            break;
        case code.includes('small'):
            _.name = '小';
            break;
    }
    res.push(_);
};

const handleSd = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('single'):
            _.name = '单';
            break;
        case code.includes('double'):
            _.name = '双';
            break;
    }
    res.push(_);
};

const handlePc = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('prime'):
            _.name = '质';
            break;
        case code.includes('composite'):
            _.name = '合';
            break;
    }
    res.push(_);
};

const handleWx = (res, _) => {
    const code = _.playCode;
    switch (true) {
        case code.includes('jin'):
            _.name = '金';
            break;
        case code.includes('mu'):
            _.name = '木';
            break;
        case code.includes('shui'):
            _.name = '水';
            break;
        case code.includes('huo'):
            _.name = '火';
            break;
        case code.includes('tu'):
            _.name = '土';
            break;
    }
    res.push(_);
};

const chooseDataTt = (arr, re) => {
    // 拖头投注
    const locks = arr.filter(_ => _.lock);
    arr.filter(_ => !_.lock).forEach(_ => re.push(locks.concat(_)));
};

export const filter = data => {
    if (!data) return;
    let res = { bsm: [], sdm: [], red1v2: [], red1v3: [], red2v3: [], kd: [], lh: [], bluebs: [], bluesd: [], bluepc: [], bluenum: [], ltsd: [], fwsd: [], ltnum: [], fwnum: [], hqrxy: [] };
    const indexObj = { w: 1, q: 2, b: 3, s: 4, g: 5 };
    data.forEach(_ => {
        _.choose = false;
        _.odds = _.odds || '0.00';
        const code = _.playCode;
        const tcode = _.playTypeCode;
        let key = '';
        switch (true) {
            case tcode === 'red-b-s-m':
                handleRedbsm(res.bsm, _);
                break; //红球双面-大小多
            case tcode === 'red-s-d-m':
                handleRedsdm(res.sdm, _);
                break; //红球双面-单双多
            case tcode === 'red-1v2':
                handleRedlh(res.red1v2, _);
                break; //红球双面-1v2
            case tcode === 'red-1v3':
                handleRedlh(res.red1v3, _);
                break; //红球双面-1v3
            case tcode === 'red-2v3':
                handleRedlh(res.red2v3, _);
                break; //红球双面-2v3
            case tcode === 'red-kd':
                _.name = code.slice(3);
                res.kd.push(_);
                break; //红球-跨度
            case tcode === 'red-lh':
                _.name = code.slice(-1);
                if (_.name == '0') _.name = '无';
                res.lh.push(_);
                break; //红球-连号号码数
            case tcode.includes('red-sqchs-'):
                key = tcode.split('-');
                _.name = code.split('-')[1];
                if (!res[key[1] + key[2]]) res[key[1] + key[2]] = [];
                res[key[1] + key[2]].push(_);
                break; //红球-三区出号数
            case tcode === 'blue-b-s':
                handleBs(res.bluebs, _);
                break; //蓝球双面-大小
            case tcode === 'blue-s-d':
                handleSd(res.bluesd, _);
                break; //蓝球双面-单双
            case tcode === 'blue-p-c':
                handlePc(res.bluepc, _);
                break; //蓝球双面-质合
            case tcode === 'blue-number':
                _.name = code.split('-')[1];
                res.bluenum.push(_);
                break; //蓝球选号
            case tcode === 'ltfw-lt-s-d':
                handleSd(res.ltsd, _);
                break; //龙头凤尾-龙头单双
            case tcode === 'ltfw-fw-s-d':
                handleSd(res.fwsd, _);
                break; //龙头凤尾-凤尾单双
            case tcode === 'ltfw-lt-number':
                _.name = code.slice(5);
                res.ltnum.push(_);
                break; //龙头凤尾-龙头选号
            case tcode === 'ltfw-fw-number':
                _.name = code.slice(5);
                res.fwnum.push(_);
                break; //龙头凤尾-凤尾选号
            case tcode.includes('bz-'):
                key = code.split('-');
                _.name = key[1];
                if (!res[key[0]]) res[key[0]] = [];
                res[key[0]].push(_);
                break; // 不中
            case tcode === 'hqrxy':
                _.name = code.slice(6);
                res.hqrxy.push(_);
                break; //红球任选一
            case tcode.includes('wx-'):
                key = tcode.split('-');
                let tkey = key[0] + key[1];
                if (key.length == 3) tkey += key[2];
                if (!res[tkey]) res[tkey] = [];
                handleWx(res[tkey], _);
                break; //五行
        }
    });
    return res;
};
export const hndleData = (storeData, storeRD, rodioIndex, data, key) => {
    let result = {};
    if (!data) return result;
    storeData.value = data;
    switch (key) {
        case 'hq': //红球
            result.rodio = [{ name: '双面' }, { name: '跨度' }, { name: '连号号码数' }, { name: '三区出号数' }];
            result.sorts = [[], [], [], []];
            result.sorts[0].push({ title: '大小多', square: data.bsm });
            result.sorts[0].push({ title: '单双多', square: data.sdm });
            result.sorts[0].push({ title: '1区v2区', square: data.red1v2 });
            result.sorts[0].push({ title: '1区v3区', square: data.red1v3 });
            result.sorts[0].push({ title: '2区v3区', square: data.red2v3 });
            result.sorts[3].push({ title: '1区', square: data.sqchs1 });
            result.sorts[3].push({ title: '2区', square: data.sqchs2 });
            result.sorts[3].push({ title: '3区', square: data.sqchs3 });
            result.squares = [[], data.kd, data.lh, []];
            break;
        case 'lq': //蓝球
            result.sort = [];
            result.sort.push({ title: '双面', square: [...data.bluebs, ...data.bluesd, ...data.bluepc] });
            result.sort.push({ title: '选号', ball: data.bluenum });
            break;
        case 'ltfw': //龙头凤尾
            result.sort = [];
            result.sort.push({ title: '龙头单双', square: data.ltsd });
            result.sort.push({ title: '龙头选号', ball: data.ltnum });
            result.sort.push({ title: '凤尾单双', square: data.fwsd });
            result.sort.push({ title: '凤尾选号', ball: data.fwnum });
            break;
        case 'hqbz': // 红球不中
            result.odds = 1;
            result.bet = ['复式投注', '拖头投注'];
            result.rodio = [
                { name: '四不中', odds: data.fourbz[0].odds },
                { name: '五不中', odds: data.fivebz[0].odds },
                { name: '六不中', odds: data.sixbz[0].odds },
                { name: '七不中', odds: data.sevenbz[0].odds },
                { name: '八不中', odds: data.eightbz[0].odds },
                { name: '九不中', odds: data.ninebz[0].odds }
            ];
            result.balls = [data.fourbz, data.fivebz, data.sixbz, data.sevenbz, data.eightbz, data.ninebz];
            break;
        case 'hqrxy': // 红球任选一
            result.sort = [];
            result.sort.push({ title: '任选一', ball: data.hqrxy });
            break;
        case 'wx': // 五行
            result.sort = [];
            result.sort.push({ title: '第一位红球', square: data.wxred1 });
            result.sort.push({ title: '第二位红球', square: data.wxred2 });
            result.sort.push({ title: '第三位红球', square: data.wxred3 });
            result.sort.push({ title: '第四位红球', square: data.wxred4 });
            result.sort.push({ title: '第五位红球', square: data.wxred5 });
            result.sort.push({ title: '第六位红球', square: data.wxred6 });
            result.sort.push({ title: '蓝球', square: data.wxblue });
            break;
    }
    return handleRDChange(storeRD, rodioIndex, result);
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
