import request from './request';
export function getUser() {
    return request({
        // url: '/member/f/memberWallet/queryBalance',
        url: '/lottery/f/siteMember/queryMemberAmount',
        method: 'post',
        data: {}
    });
}

// 获取彩种列表
export function getGameList() {
    return request({
        // url: '/lottery/f/siteLotteryBase/queryLotteryTree',
        url: '/lottery/f/siteLotteryBase/queryList',
        method: 'post',
        data: {}
    });
}
// 获取赔率及页面渲染相关的
export function queryOddsByCode(data) {
    return request({
        url: '/lottery/f/siteLotteryPlayOdds/queryList',
        method: 'post',
        data
    });
}

// 获取走珠 长龙等
export function getDewdropList(data) {
    return request({
        url: '/lottery/f/siteLotteryResult/queryDewDrop',
        method: 'post',
        data
    });
}

// 获取开奖历史
export function getChartList(data) {
    return request({
        url: '/lottery/f/siteLotteryResult/queryPage',
        method: 'post',
        data
    });
}

// 获取开奖信息
export function pcLoadKgGameResult(data) {
    return request({
        url: '/lottery/f/siteLotteryResult/query',
        method: 'post',
        data
    });
}

// 投注接口
export function lotteryBet(data) {
    return request({
        url: '/lottery/f/siteLotteryBet/add',
        method: 'post',
        data
    });
}

// 实时查询停售状态
export function getStatus(data) {
    return request({
        url: '/lottery/f/siteLotteryBase/queryStatus',
        method: 'post',
        data
    });
}

// 即时投注
export function getBetReport(data) {
    return request({
        url: '/web/bet/getBetReport',
        method: 'post',
        data
    });
}

// 今日输赢
export function getWinOrLoseTodayByGameId() {
    return request({
        url: '/lottery/f/siteLotteryBet/queryCount',
        method: 'post',
        data: {}
    });
}
// 盘口信息
export function limitList(data) {
    return request({
        url: '/lottery/f/siteLotteryPlayLimit/queryPage',
        method: 'post',
        data
    });
}
// 投注记录
export function betList(data) {
    return request({
        url: '/lottery/f/siteLotteryBet/queryPage',
        method: 'post',
        data
    });
}

// 投注记录统计
export function betReport(data) {
    return request({
        url: '/lottery/f/siteLotteryBet/queryReport',
        method: 'post',
        data
    });
}

// 投注记录统计
// export function betReport(data) {
//     return request({
//         url: '/lottery/f/siteLotteryBet/queryReport',
//         method: 'post',
//         data
//     });
// }

// 查询收藏
export function querySelfCollect(data) {
    return request({
        url: '/lottery/f/collect/querySelfCollect',
        method: 'post',
        data
    });
}

// 添加收藏
export function gameCollectAdd(data) {
    return request({
        url: '/game-center/f/memberFav/add',
        method: 'post',
        data
    });
}

// 取消收藏
export function gameCollectCancel(data) {
    return request({
        url: '/game-center/f/memberFav/cancel',
        method: 'post',
        data
    });
}

// 冷热遗漏 {type:1,lotteryCode:'jspk10'}  1冷热/2遗漏
export function betAnalysis(data) {
    return request({
        url: '/lottery/f/siteLotteryBet/analysis',
        method: 'post',
        data
    });
}

// 获取会员设置
export function getLotterySetByMemberId(data) {
    return request({
        url: '/lottery/f/siteLotterySet/getLotterySetByMemberId',
        method: 'post',
        data
    });
}

// 设置会员设置
export function setSetings(data) {
    return request({
        url: '/lottery/f/siteLotterySet/setting',
        method: 'post',
        data
    });
}

// 设置快捷金额
export function setChips(data) {
    return request({
        url: '/lottery/f/siteLotterySet/chips',
        method: 'post',
        data
    });
}

// 追号
export function chaseNumberChase(data) {
    return request({
        url: '/lottery/f/chaseNumber/chase',
        method: 'post',
        data
    });
}

// 取消追号
export function cancelChase(data) {
    return request({
        url: '/lottery/f/chaseNumber/cancelChase',
        method: 'post',
        data
    });
}

// 获取可以追号的期号列表
export function chaseNumberList(data) {
    return request({
        url: '/lottery/f/chaseNumber/chaseNumberList',
        method: 'post',
        data
    });
}

// 追号列表详情-传入追号id
export function chaseDetail(data) {
    return request({
        url: '/lottery/f/chaseNumber/chaseDetail',
        method: 'post',
        data
    });
}

// 追号记录
export function pageChase(data) {
    return request({
        url: '/lottery/f/chaseNumber/pageChase',
        method: 'post',
        data
    });
}

// 路子图
export function queryRoadPic(data) {
    return request({
        url: '/lottery/f/chart/queryRoadPic',
        method: 'post',
        data
    });
}

//  好路
export function getPrettyRoad(data) {
    return request({
        url: '/lottery/f/chart/getPrettyRoad',
        method: 'post',
        data
    });
}

//  長龍
export function getTwoDrop(data) {
    return request({
        url: '/lottery/f/siteLotteryResult/queryTwoDrop',
        method: 'post',
        data
    });
}

//  盈利上限
export function memberDailyWinLimt(data) {
    return request({
        url: '/lottery/f/siteLotteryBase/memberDailyWinLimt',
        method: 'post',
        data
    });
}

//  走勢開獎號碼
export function getWinningNumbers(data) {
    return request({
        url: '/lottery/f/chart/getResultLine',
        method: 'post',
        data
    });
}

//  彩種下拉框
export function getQueryLotteryOdds(data) {
    return request({
        url: '/lottery/f/siteLotteryPlayOdds/queryLotteryOdds',
        method: 'post',
        data
    });
}

//  追號注單詳情
export function getQueryChaseDetailBetDetail(data) {
    return request({
        url: '/lottery/f/siteLotteryBet/queryChaseDetailBetDetail',
        method: 'post',
        data
    });
}
