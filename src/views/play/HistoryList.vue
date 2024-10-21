<template>
    <div class="container">
        <Loading v-if="Object.keys(history).length === 0" />
        <component v-else :is="tableArr[history.lcode]" :data="history.historyList" />
    </div>
</template>

<script>
export default {
    name: 'HistoryList'
};
</script>

<script setup>
import { onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { issueDisplay } from '@/util/tools';
import Loading from '../../components/public/Loading.vue';
import SsqTable from '../play/ssq/historyTable.vue';
import XgcTable from '../play/xgc/historyTable.vue';
import SscTable from '../play/ssc/historyTable.vue';
import Pk10Table from '../play/pk10/historyTable.vue';
import FtTable from '../play/ft/historyTable.vue';
import CTable from '../play/c11x5/historyTable.vue';
import KlsfTable from '../play/klsf/historyTable.vue';
import K3Table from '../play/k3/historyTable.vue';
import KlcTable from '../play/klc/historyTable.vue';
import SslTable from '../play/ssl/historyTable.vue';
import dTable from '../play/3d/historyTable.vue';

const { t } = useI18n();

const commonStore = useCommonStore();

const history = computed(() => commonStore.history);

const tableArr = {
    ssq: SsqTable,
    xgc: XgcTable,
    ssc: SscTable,
    pk10: Pk10Table,
    ft: FtTable,
    c11x5: CTable,
    klsf: KlsfTable,
    k3: K3Table,
    klc: KlcTable,
    ssl: SslTable,
    '3d': dTable
};

const headData = computed(() => {
    const name = { k3: t('betting.Sumoddoreven'), xgc: '特码' }[history.value.parentCode];
    // const name = ({ k3: '和值/大小/单双', xgc: '特码' })[this.history.lcode]
    const widts = {
        kl8: ['30%', '70%'],
        k3: ['30%', '35%', '35%'],
        xgc: ['27%', '60%', '13%']
    }[history.value.parentCode] || ['35%', '65%'];
    return [
        { name: t('draw.NumberOfPeriods'), width: widts[0] },
        {
            name: t('draw.LotteryNumbers'),
            width: widts[1]
        },
        { name, width: widts[2] }
    ].filter(_ => _.width);
    // return [{ name: '期数', width: widts[0] }, { name: '开奖号码', width: widts[1] }, { name, width: widts[2] }].filter(_ => _.width)
});

onMounted(() => {
    _TimerAdapter.listen('lotteryDrawingFinished', commonStore.getChartLists);
    commonStore.getChartLists(); // 获取开奖历史
    commonStore.resetChartList();
});

onUnmounted(() => {
    _TimerAdapter.remove('lotteryDrawingFinished', commonStore.getChartLists);
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
}
</style>
