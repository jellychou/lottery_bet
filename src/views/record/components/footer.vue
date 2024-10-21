<script>
export default {
    name: 'Footer'
};
</script>
<script setup>
const { recordTotalData } = defineProps({
    recordTotalData: {
        type: Object,
        required: true
    }
});
</script>
<template>
    <div class="footer">
        <div class="footer-item">
            <span>统计</span>
            <strong>{{ recordTotalData.betCount }}条记录</strong>
        </div>
        <div class="footer-item">
            <span>有效投注金额</span>
            <strong>{{ recordTotalData.validAmount }}</strong>
        </div>
        <div class="footer-item">
            <span>中奖金额</span>
            <strong class="amount">{{ recordTotalData.netAmount }}</strong>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.footer {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    position: fixed;
    bottom: 50px;
    left: 0;
    box-sizing: border-box;
    padding: 0 12px;
    .footer-item {
        span {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            color: #60697a;
        }
        strong {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 13px;
            color: #464c54;
            margin-left: 2px;
        }
        strong.amount {
            color: #ff9d0b;
        }
    }
}
</style>
