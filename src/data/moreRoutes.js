

export default [
  { icon: 'jishizhudan', title: 'profile.InstantBet', amount: '0.00', needLogin: 1, state: 0 }, // 即时注单
  { icon: 'jinrishuying', title: 'profile.WinOrLose', amount: '0.00', needLogin: 1, state: 1 }, // 今日输赢
  { icon: 'xuzhi', title: 'profile.BettingInstructions', to: 'notice' }, // 投注须知
  // 投注记录 投注详情
  {
    icon: 'touzhujilu',
    title: 'profile.BettingRecords',
    to: 'betHistory',
    children: [{ title: 'bettingDetail.BettingDetail', to: 'betDetail' }],
    needLogin: 1
  },
  { icon: 'lishikaijiang', title: 'profile.HistoryDraws', to: 'history' }, // 历史开奖
  // { icon: 'haomazoushi', title: '号码走势', to: 'resultTrend' },
  { icon: 'pankouxinxi', title: 'profile.HandicapInformation', to: 'planInfo', needLogin: 1 }, // 盘口信息
  { icon: 'youxiguize', title: 'profile.GameRules', to: 'gameRule' } // 游戏规则


]
