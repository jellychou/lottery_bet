<script>
export default {
    name: 'RecordDetails'
};
</script>
<script setup>
import Stamp from './components/img/stamp.svg';
import StampWin from './components/img/stampWin.svg';
import { computed } from 'vue';
import useCommonStore from '@/store/modules/common';
import BlueBall from './components/img/redBall.svg?component';
import RedBall from './components/img/redBall.svg?component';

const statusDisplayMap = {
    '-1': '撤單',
    0: '未派彩',
    1: '已派彩'
};
const commonStore = useCommonStore();
const recordInfo = computed(() => commonStore.recordInfo);
const resultList = computed(() => {
    return commonStore.recordInfo.result ? commonStore.recordInfo.result.split(',') : [];
});
</script>

<template>
    <Header title="注单详情" />
    <div class="details">
        <div class="current">
            <div class="current-lottery">
                <div class="current-lottery-info">
                    <h3>{{ recordInfo.lotteryName }}</h3>
                    <p>{{ recordInfo.lotteryNum }}期</p>
                </div>
                <div class="current-lottery-status">
                    <span v-if="recordInfo.status == 0">未派彩</span>
                </div>
                <div v-if="recordInfo.status !== -1" class="relative stampImg">
                    <component :is="Stamp" width="54px" height="54px" />
                    <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[#1E8EF5] text-sm whitespace-nowrap">{{ statusDisplayMap[recordInfo.status] }}</span>
                </div>
            </div>
            <div class="current-result">
                <div class="current-result-drawn">
                    <span>开奖结果</span>

                    <div v-if="resultList.length > 0" class="flex items-center">
                        <div v-for="(result, index) in resultList" :key="result + index" class="ballBox flex items-center justify-center relative">
                            <div class="text-sm font-semibold text-black absolute inset-0 flex items-center justify-center">{{ result }}</div>
                            <Component v-if="index === resultList.length - 1" class="ball" :is="BlueBall" />
                            <Component v-else class="ball" :is="RedBall" />
                        </div>
                    </div>
                    <div v-else>
                        <span style="color: #e9555e">未开奖</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="record-details-box">
            <div class="record-details-box-line">
                <span class="label">订单号</span>
                <p>{{ recordInfo.id }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">下注玩法</span>
                <p>{{ recordInfo.playTypeName }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">下注内容</span>
                <p>{{ recordInfo.playName }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">赔率</span>
                <p>{{ recordInfo.odds }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">投注金额</span>
                <p>{{ recordInfo.betAmount }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">奖金</span>
                <span class="amount" v-if="recordInfo.status != 0 && recordInfo.netAmount > 0">{{ recordInfo.netAmount }}</span>
                <span v-if="recordInfo.status != 0 && recordInfo.netAmount - recordInfo.betAmount <= 0">未中奖</span>
                <span v-if="recordInfo.status == 0">未派彩</span>
            </div>
        </div>
        <div class="record-details-box">
            <div class="record-details-box-line">
                <span class="label">派彩金额</span>
                <p>{{ recordInfo.netAmount }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">返水金额</span>
                <p>{{ recordInfo.rebateAmount }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">返水比例</span>
                <p>{{ Math.round(recordInfo.rebate * 100) }}%</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">投注时间</span>
                <p>{{ recordInfo.createTimeLocal }}</p>
            </div>
            <div class="record-details-box-line">
                <span class="label">结算时间</span>
                <p>{{ recordInfo.updateTimeLocal }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.details {
    width: 100%;
    height: calc(100% - 44px);
    background: #eff2f5;
    box-sizing: border-box;
    padding: 10px 12px;

    .current {
        width: 100%;
        height: auto;
        background: #ffffff;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 15px;
        .current-lottery {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding-bottom: 15px;

            .current-lottery-info {
                display: flex;
                flex-direction: column;
                h3 {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 20px;
                    line-height: 28px;
                    color: #464c54;
                }
                p {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 19px;
                    color: #60697a;
                }
            }
            .current-lottery-status {
                display: flex;
                align-items: center;
                span {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 14px;
                    color: #5e86c8;
                }
            }
        }
        .current-result {
            width: 100%;
            border-top: 1px solid #eceff5;
            box-sizing: border-box;
            padding-top: 10px;
            .current-result-drawn {
                width: 100%;
                display: flex;
                flex-direction: column;
                span {
                    font-family: 'PingFang SC';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 12px;
                    color: #60697a;
                }
                p {
                    width: 100%;
                    /* height: 30px; */
                    font-size: 20px;
                }
            }
            .ballBox {
                width: 34px;
                height: 34px;

                .ball {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .record-details-box {
        width: 100%;
        height: auto;
        margin-top: 10px;
        background: #ffffff;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 10px 15px;
        .record-details-box-line {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            span.label {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 19px;
                color: #60697a;
            }
            p {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 500;
                font-size: 14px;
                line-height: 19px;
                text-align: right;
                color: #464c54;
            }
            &:nth-of-type(1) {
                margin-top: 0;
            }
        }
    }
}
</style>
