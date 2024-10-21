<script>
export default {
    name: 'RecordItem'
};
</script>
<script setup>
import { defineProps, computed } from 'vue';
import moment from 'moment';

const { item, tabIndex, type } = defineProps({
    item: {
        type: Object,
        required: true
    },
    tabIndex: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});
const isChase = computed(() => type === 'chase');

const getYYYYMMDD = dateTime => {
    const date = new Date(dateTime);
    let nowMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    const separator = '-';
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    return date.getFullYear() + separator + nowMonth + separator + strDate;
};
</script>
<template>
    <div class="order-item-top">
        <div class="order-item-top-line one-line">
            <div class="flex items-center">
                <span v-if="item.chaseId" class="chaseIcon mr-1">追</span>
                <h3>{{ item.lotteryName }}</h3>
            </div>
            <div v-if="isChase">
                <span class="tag" v-if="item.status == 0">未派彩</span>
                <span class="none" v-if="item.status === 2">已取消</span>
                <span class="none" v-if="item.status === 0 && item.chaseIndexMax === item.chaseIndexCurrent">未开奖</span>
                <span class="tag" v-if="item.status === 0">共{{ item.chaseIndexMax }}期，已进行{{ item.chaseIndexCurrent }}期</span>
                <span class="tag" v-if="item.status === 1">共{{ item.chaseIndexMax }}期，已結束</span>
            </div>
            <div v-else>
                <span class="tag" v-if="item.status == 0">未派彩</span>
                <span class="none" v-if="item.status === -1">已撤单</span>
                <span class="win" v-if="item.status === 1 && item.netAmount - item.betAmount > 0">赢</span>
                <span class="none" v-if="item.status === 1 && item.netAmount === item.betAmount">和</span>
                <span class="none" v-if="item.status === 1 && item.netAmount - item.betAmount < 0">未中奖</span>
            </div>
        </div>
        <div class="order-item-top-line">
            <strong>{{ item.lotteryNum }}期</strong>
            <span v-if="item.status == 0">
                开奖
                <em v-if="tabIndex === 0">{{ moment(Number(item.updateTime)).format('YYYY-MM-DD HH:mm:ss') }}</em>
                <em v-if="tabIndex === 1">{{ moment(Number(item.nextOpenTime)).format('YYYY-MM-DD HH:mm:ss') }}</em>
            </span>
            <span v-else>{{ item.betOpenTime }}</span>
        </div>
        <div class="order-item-top-line">
            <strong>{{ item.playTypeName }}-{{ item.playName }}</strong>
            <span class="betTime">投注 {{ tabIndex === 0 ? item.createTimeLocal : item.createTime }}</span>
        </div>
    </div>
    <div class="order-item-bottom">
        <div class="item-bottom-item">
            <span>投注额</span>
            <strong v-if="type === 'normal'">{{ item.betAmount }}</strong>
            <strong v-else>{{ item.status === 1 ? Math.round(item.betAmountSum - item.betAmountResidue) : item.betAmountSum }}</strong>
        </div>
        <div v-if="tabIndex === 0" class="item-bottom-item" style="text-align: right">
            <span>{{ item.status == 1 && item.netAmount - item.betAmount >= 0 ? '中奖金额' : '可赢额' }}</span>
            <strong :class="{ amount: item.status == 1 && item.netAmount - item.betAmount > 0 }">
                {{ item.netAmount === item.betAmount ? item.netAmount : (item.odds * item.betAmount).toFixed(2) }}
            </strong>
        </div>
        <button v-else class="detailBtn">详情</button>
    </div>
</template>
<style lang="scss">
.order-item-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    .order-item-top-line {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        h3 {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 15px;
            line-height: 18px;
            color: #464c54;
            margin-top: 2px;
        }
        span.tag {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 13px;
            line-height: 16px;
            color: #5e86c8;
            box-sizing: border-box;
            padding: 2px 7px;
            border-radius: 3px;
            border: 1px solid #d8dfeb;
        }
        span.win {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 13px;
            line-height: 18px;
            color: #41c05d;
            padding: 2px 7px;
            border-radius: 3px;
            border: 1px solid rgba(65, 192, 93, 0.2);
        }
        span.none {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 13px;
            line-height: 18px;
            color: #929aa7;
            padding: 2px 7px;
            border-radius: 3px;
            border: 1px solid rgba(60, 93, 157, 0.2);
        }
        strong {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 18px;
            color: #464c54;
            width: 49%;
        }

        .betTime {
            width: 51%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        span {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 18px;
            color: #929aa7;

            em {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 13px;
                line-height: 18px;
            }
        }
    }
    .one-line {
        margin-bottom: 11px;
    }
}
.order-item-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eceff5;
    box-sizing: border-box;
    padding: 10px 0 0 0;
    position: relative;
    .item-bottom-item {
        display: flex;
        flex-direction: column;
        span {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 18px;
            color: #464c54;
        }
        strong {
            font-family: 'WeChat Sans Std';
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 18px;
            color: #464c54;
        }
        strong.amount {
            color: #ff9d0b;
        }
    }
    &::before {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #eff2f5;
        left: -17px;
        top: -5px;
    }
    &::after {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #eff2f5;
        right: -17px;
        top: -5px;
    }

    .detailBtn {
        width: 58px;
        height: 30px;
        color: #60697a;
        font-size: 14px;
        padding: 6px 12px;
        border: 1px solid var(--2, #d8dfeb);
        border-radius: 8px;
        margin: auto 0;
        line-height: 18px;
    }
}

.chaseIcon {
    height: 16px;
    width: 16px;
    font-size: 10px;
    color: #fff !important;
    background-color: #ff6581;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 2px;
}
</style>
