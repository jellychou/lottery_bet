<script>
export default {
    name: 'drawItem'
};
</script>
<script setup>
const { item } = defineProps({
    item: {
        type: Object,
        required: true
    }
});
const statusMap = {
    0: '未投注',
    1: '已投注',
    2: '已取消',
    3: '未中獎',
    4: '贏'
};
</script>
<template>
    <div class="itemTop border-[#ECEFF5] border-b text-sm font-medium">
        <h2>{{ item.lotteryNum }}期</h2>
        <span :class="['tag', { win: item.chaseStatus === 4 }, { none: [0, 1, 2, 3].includes(item.chaseStatus) }]">{{ statusMap[item.chaseStatus] }}</span>
    </div>
    <div class="itemBottom flex justify-between items-center">
        <div class="text">
            <span>投注额</span>
            <strong>{{ item.betAmount }}</strong>
        </div>
        <div class="text items-end">
            <span>{{ item.chaseStatus === 4 ? '中奖金额' : '可赢额' }}</span>
            <strong :class="{ amount: item.chaseStatus === 4 }">{{ item.chaseStatus === 4 ? item.netAmount : item.predictProfit }}</strong>
        </div>
    </div>
</template>
<style lang="scss">
.itemTop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
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
}
.itemBottom {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    .text {
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
        top: -15px;
    }
    &::after {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #eff2f5;
        right: -17px;
        top: -15px;
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
</style>
