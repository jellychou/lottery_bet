import { pcLoadKgGameResult, getStatus } from '../api/interface';
import useCommonStore from '@/store/modules/common';

const correction = 20000; // 校正定时器执行时间间隔
const countdownTime = 1000; // 开奖倒计时定时器执行时间间隔
const drawingTime = 3000; // 开奖拉取结果定时器执行时间间隔

class TimerAdapter {
    constructor() {
        this.timerId = '';
        this.drawingTimerId = '';
        this.waitdrawingTimerId = ''; // 等待开奖倒计时定时器
        this.correctionTimerId = '';
        this.lotteryCode = ''; // 当前开奖彩种code
        this.lotteryNum = 0; // 当前开奖期数
        this.lotterySellingStatus = ''; // 当前彩种销售状态 closed 已停售 noWorking 已关盘 betStop 封盘中 betWaiting 受注中
        this.nextStopTime = 0; // 下次封盘时间
        this.nextOpenTime = 0; // 下次开奖时间
        this.timeGap = 0; // 停止下注和开奖的相差时间
        this.countdownTime = 0; // 倒计时时间
        this.countdownopenTime = 0; // 等待开奖倒计时时间
        this.isFetchResult = false; // 优化:是否在获取彩票result信息中，防止没必要的接口拉取
        this.isDrawing = false; // 是否开奖中
        this.list = {};
    }

    config(lotteryCode) {
        this.cleanTimer();
        if (lotteryCode !== this.lotteryCode) {
            // this.trigger('lotteryDrawingFinished');
        }
        this.isDrawing = false;
        this.countdownTime = 0;
        this.lotteryNum = 0;
        this.trigger('countdownTime', 0);
        this.trigger('setLotteryResult', '');
        this.lotteryCode = lotteryCode;
    }

    setSellingStatus(status) {
        const statusConfig = {
            closed: '已停售',
            noWorking: '已关盘',
            betStop: '已封盘',
            betWaiting: '受注中',
            isDrawing: '正在开奖...',
            waitDrawing: '等待开奖'
        };
        this.lotterySellingStatus = status;
        this.trigger('setStatusText', statusConfig[status]);
    }

    countdown() {
        this.cleanTimer();
        if (this.lotterySellingStatus === 'closed') return this.trigger('countdownTime', 0);
        // if (['closed', 'noWorking', 'betStop'].includes(this.lotterySellingStatus)) return; // 倒计时前提条件
        this.trigger('countdownTime', this.countdownTime);
        this.timerId = setInterval(() => {
            if (this.countdownTime > 0) {
                --this.countdownTime;
                this.trigger('countdownTime', this.countdownTime);
                if (this.countdownTime <= 0) {
                    this.correction();
                }
            } else {
                this.correction();
            }
        }, countdownTime);
        this.correctionTimerId = setInterval(() => {
            this.correction();
        }, correction);
    }

    lotteryDrawing() {
        const _this = this;
        const commonStore = useCommonStore();
        _this.trigger('lotteryDrawing');
        _this.isDrawing = true;

        function drawing() {
            _this.drawingTimerId && clearTimeout(_this.drawingTimerId);
            _this.fetchLotteryResult().then(res => {
                if (res.openTime === '0' && (commonStore.hotColdShow || commonStore.omitShow)) {
                    setTimeout(() => {
                        commonStore.getChOmTime();
                    }, 3000);
                }
                if (!res.result && !['closed', 'noWorking'].includes(_this.lotterySellingStatus)) {
                    _this.drawingTimerId = setTimeout(() => {
                        drawing();
                    }, drawingTime);
                } else {
                    // 极端情况：在当前彩种停留，会出现提前一秒拉取开奖结果，结果仍然是当前期的数据，倒计时会停顿不计时，所以加期数属性辨别
                    if (_this.lotteryNum === res.lotteryNum) return drawing();

                    if (_this.isDrawing) {
                        _this.trigger('lotteryDrawingFinished');
                        _this.isDrawing = false;
                        _this.lotteryNum = res.lotteryNum;
                    }
                    _this.fetchLotteryStatus().then(() => {
                        _this.countdown();
                    });
                }
            });
        }

        drawing();
    }

    //等待开奖倒计时
    waitDrawingCountdown() {
        clearTimeout(this.waitdrawingTimerId);
        this.waitdrawingTimerId = setInterval(() => {
            if (this.countdownopenTime > 0) {
                --this.countdownopenTime;
                this.trigger('countdownopenTime', this.countdownopenTime);
                if (this.countdownopenTime <= 0) {
                    //等待开奖倒计时结束 进入正在开奖
                    clearTimeout(this.waitdrawingTimerId);
                    this.lotteryDrawing();
                    this.correction();
                }
            } else {
                this.correction();
            }
        }, countdownTime);
    }

    fetchLotteryResult() {
        if (this.isFetchResult) return Promise.resolve({ result: '' });
        this.isFetchResult = true;
        return new Promise((resolve, reject) => {
            pcLoadKgGameResult({ lotteryCode: this.lotteryCode })
                .then(res => {
                    this.trigger('setChOmTimes');
                    const { nextStopTime, nextOpenTime, openTime } = res;
                    this.nextStopTime = nextStopTime;
                    this.nextOpenTime = nextOpenTime;

                    // 受注时间和封盘时间 区分字段 当只有都大于0 此字段才能发挥作用
                    this.timeGap = nextOpenTime > 0 && nextStopTime > 0 ? nextOpenTime - nextStopTime : 0;
                    // 明确当前使用哪个作为倒计时时间
                    this.countdownTime = nextStopTime > 0 ? nextStopTime : nextOpenTime < 0 ? 0 : nextOpenTime;
                    this.trigger('setLotteryResultInfo', res); // 通知开奖接口信息

                    // 当前接口获取没有开奖结果 视为开奖中
                    if (!this.isDrawing && !res.result && openTime < 0) {
                        this.lotteryDrawing();
                    }
                    // 极端情况 刚好进来的时候 nextOpenTime为0，并且有上期的开奖结果，也直接进入开奖中
                    if (!this.isDrawing && res.result && nextOpenTime === 0) {
                        this.lotteryDrawing();
                    }

                    if (nextOpenTime < 0) {
                        this.setSellingStatus('noWorking');
                        this.trigger('countdownTime', 0);
                    } else {
                        if (openTime > 0) {
                            // 进入等待开奖
                            this.countdownopenTime = openTime;
                            this.setSellingStatus('waitDrawing');
                            this.correction();
                            this.waitDrawingCountdown();
                        } else if (openTime < 0 && !res.result) {
                            // 进入正在开奖
                            this.setSellingStatus('isDrawing');
                            this.lotteryDrawing();
                        }
                    }

                    if (this.lotteryCode === res.lotteryCode) this.trigger('setLotteryResult', res.result); // 不论如何通知开奖结果

                    resolve(res);
                })
                .catch(() => {
                    reject();
                })
                .finally(() => {
                    this.isFetchResult = false;
                });
        });
    }

    fetchLotteryStatus() {
        return new Promise((resolve, reject) => {
            getStatus({ lotteryCode: this.lotteryCode })
                .then(res => {
                    // status 1 0 2 启用 禁用 维护
                    this.trigger('setLotteryStatus', +res.status == 1 ? true : false); // 通知彩种状态
                    if (+res.status == 2) this.setSellingStatus('closed');
                    resolve(res.status);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    cleanTimer() {
        this.timerId && clearInterval(this.timerId);
        this.correctionTimerId && clearInterval(this.correctionTimerId);
    }

    stop(eventName) {
        const timerId = this.timerKeys[eventName];
        if (timerId) {
            clearInterval(timerId);
        }
    }

    correction() {
        this.fetchLotteryResult().then();
    }

    listen(key, fn) {
        if (!this.list[key]) {
            this.list[key] = [];
        }
        this.list[key].push(fn);
    }

    // 触发方法
    trigger() {
        let key = [].shift.call(arguments);
        let fns = this.list[key];
        fns &&
            fns.length &&
            fns.forEach(item => {
                item.apply(this, arguments);
            });
    }

    // 移除订阅事件
    remove(key, fn) {
        // 移除所有事件
        if (!key) {
            this.list = [];
        }

        if (!this.list[key] || !this.list[key].includes(fn)) return;
        const idx = this.list[key].indexOf(fn);
        this.list[key].splice(idx, 1);
    }

    destroy() {
        clearTimeout(this.timerId);
        clearTimeout(this.drawingTimerId);
        clearTimeout(this.waitdrawingTimerId);
        clearTimeout(this.correctionTimerId);
        this.remove();
    }
}

const adapter = (function () {
    let instace;

    function init() {
        return new TimerAdapter();
    }

    return {
        getInstance() {
            if (!instace) {
                instace = init();
            }
            return instace;
        }
    };
})();

export default adapter.getInstance();
