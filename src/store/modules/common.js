import { defineStore } from 'pinia';

import { showToast } from 'vant';
import lotteryData from '@/data/lotteryData'; // 本地保存的彩票赔率信息简化版数据
import { getToken, setToken, setSiteCode, getUrl, setLotteryList, getLotteryList, getLotteryData, setLotteryData, setCurrentLottery, getCurrentLottery, getIsApp } from '@/util/cach';
import { getGameList, queryOddsByCode, getChartList, getDewdropList, getLotterySetByMemberId, betAnalysis } from '@/api/interface';

export const lotteryList = getLotteryList() || [];

const useCommonStore = defineStore('common', {
    state: () => ({
        userInfo: {},
        lotteryList,
        currentLottery: getCurrentLottery() || {},
        openInfo: {},
        lotteryData: '',
        betData: [], // 当前选择的投注数据
        cartData: [], // 购彩篮数据
        isReset: 0,
        sealTime: [],
        status: '封盘', // '封盘',
        url: getUrl(),
        isApp: getIsApp(),
        history: {},
        play: '', //当前选中的玩法
        settingPopupShow: false, // 用户设置弹窗
        lotteryIntroductionPopupShow: false, // 彩种介绍弹窗
        memberSettings: {
            coldHotDesc: 0,
            confirmDialogs: 0,
            id: '',
            memberId: '',
            omitDesc: 0,
            warningTone: 0,
            winningDialogs: 0
        }, // 用户设置
        recordInfo: {}, //记录详情
        trackingInfo: {}, //追號详情,
        isActive: '',
        trendTarget: {},
        betLztData: [], //下注區路子圖下注
        tabActive: 0,
        isOpen: false,
        haoluChaseList: {},
        analyzeInfo: {},
        omitShow: false,
        hotColdShow: false,
        isInLottery: false,
        showHistory: false
    }),
    getters: {
        lotterys() {
            // 将后台返回的彩票树扁平化成一维数组
            return this.lotteryList.reduce((ac, _) => ac.concat(_.children), []);
        }
    },
    actions: {
        setIsActive(val) {
            this.isActive = val;
        },
        setLotteryList(val) {
            setLotteryList(val);
            this.lotteryList = val;
        },
        setCurrentLottery(val) {
            if (val.parentCode !== this.currentLottery.parentCode) {
                this.cartData = [];
            }
            setCurrentLottery(val);
            this.currentLottery = val;
        },
        setRecordInfo(val) {
            this.recordInfo = val;
        },
        setTrackingInfo(val) {
            this.trackingInfo = val;
        },
        initLottery(params) {
            // 获取彩种列表
            const { siteCode, token } = params;
            setToken(token);
            setSiteCode(siteCode);
            return getGameList().then(res => {
                if (Array.isArray(res)) {
                    const formate = res.filter(e => e.code !== 'tgc');
                    formate.forEach(_ =>
                        _.children.forEach(i => {
                            i.path = _.code + '/' + i.code; // 储存父级的code 用于后台传参
                            i.fcode = _.code; // 储存父级的code 用于后台传参
                            i.lcode = _.code; // 本地化code 用于添加类名 写样式
                            i.icode = _.code; // 前端处理后生成列表的父级code
                        })
                    );
                    // 下面将 飞艇 从 pk10 系列里面抽取出来
                    // if(i18n.locale === 'zh') {
                    //   const pk10 = formate.find(_ => _.code === 'pk10')
                    //   if (pk10) {
                    //     const ft = { code: 'ft', label: '飞艇', children: pk10.children.filter(_ => _.code.includes('ft')) }
                    //     ft.children.forEach(_ => (_.icode = 'ft'))
                    //     formate.splice(formate.findIndex(_ => _.code === 'pk10') + 1, 0, ft)
                    //     pk10.children = pk10.children.filter(_ => !_.code.includes('ft'))
                    //   }
                    // }
                    setLotteryList(formate);
                    this.lotteryList = formate;
                    return formate;
                } else {
                    showToast('网络异常');
                    return [];
                }
            });
        },
        async getChOmTime() {
            const analysisData = await betAnalysis({ lotteryCode: this.currentLottery.code }).then(res => {
                return res;
            });

            const newMap = new Map(analysisData.map(item => [item.playCode, item]));
            const data = this.lotteryData.map(item => {
                const value = newMap.get(item.playCode);

                return {
                    ...item,
                    chTimes: value === undefined ? 0 : value?.chTimes,
                    omTimes: value === undefined ? 50 : value?.omTimes,
                    chColor: value === undefined ? 2 : value?.chColor,
                    omColor: value === undefined ? 1 : value?.omColor
                };
            });

            const minValue = Math.min(...data.map(item => item.chTimes));
            const filterData = this.lotteryData.filter(item => item.chTimes !== 0);
            const secondMinValue = Math.min(...filterData.map(item => item.chTimes));
            // 0 灰色 1 紅色 2 藍色
            data.forEach(item => {
                if (item.chTimes === minValue) {
                    item.chColor = 2;
                } else if (item.chTimes === secondMinValue) {
                    item.chColor = 0;
                }
            });

            this.lotteryData = data;
        },
        async getLotteryData(code) {
            // 获取并设置赔率
            const data = await queryOddsByCode({ lotteryCode: code }).then(res => {
                if (Array.isArray(res)) {
                    setLotteryData(code, res);
                    return res;
                } else {
                    showToast('网络不给力!');
                }
            });
            const analysisData = await betAnalysis({ lotteryCode: this.currentLottery.code }).then(res => {
                return res;
            });

            const newMap = new Map(analysisData.map(item => [item.playCode, item]));
            data.forEach(item => {
                const value = newMap.get(item.playCode);

                item.chTimes = value === undefined ? 0 : value?.chTimes;
                item.omTimes = value === undefined ? 50 : value?.omTimes;
                item.chColor = value === undefined ? 2 : value?.chColor;
                item.omColor = value === undefined ? 1 : value?.omColor;
            });

            const minValue = Math.min(...data.map(item => item.chTimes));
            const filterData = data.filter(item => item.chTimes !== 0);
            const secondMinValue = Math.min(...filterData.map(item => item.chTimes));
            // 0 灰色 1 紅色 2 藍色
            data.forEach(item => {
                if (item.chTimes === minValue) {
                    item.chColor = 2;
                } else if (item.chTimes === secondMinValue) {
                    item.chColor = 0;
                }
            });

            if (data && this.currentLottery.code === code) {
                this.lotteryData = data;
            }
        },
        getChartLists() {
            // 获取历史开奖信息
            this.history = {};
            const par = { pageNumber: 1, pageSize: 20, lotteryCode: this.currentLottery.code };
            getChartList(par).then(res => {
                this.history = { historyList: res.data, lcode: this.currentLottery.parentCode, dropList: [] };
            });
        },
        resetChartList() {
            this.history = {};
        },
        //获取用户设置
        setMemberSettings(val) {
            this.memberSettings = val;
        },
        setTrendTarget(val) {
            if (Object.keys(val).length !== 0) {
                const parentCode = val.split('/')[2];
                const code = val.split('/')[3];
                this.trendTarget = this.lotteryList.filter(item => item.code === parentCode)[0].children.filter(item => item.code === code);
            } else {
                this.trendTarget = {};
            }

            console.log(this.trendTarget);
        },
        setTabActive(val) {
            this.tabActive = val;
        },
        setNotification(val) {
            this.isOpen = val;
        },
        setHaoluChase(val) {
            this.haoluChaseList = val;
        },
        setShowHistory(val) {
            this.showHistory = val;
        }
    },
    persist: {
        enabled: true, // 开启持久化
        strategies: [
            {
                storage: sessionStorage // 持久化到localStorage/sessionStorage
                // paths: ['name', 'age'] // 要持久化的字段
            }
        ]
    }
});

export default useCommonStore;
