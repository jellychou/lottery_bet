import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';

export const useResultHook = () => {
    const commonStore = useCommonStore();
    const openInfo = computed(() => commonStore.openInfo);
    const status = computed(() => commonStore.status);
    const currentLottery = computed(() => commonStore.currentLottery);

    const countdownopenTime = ref(0); //等待开奖倒计时
    const isLotteryDrawing = ref(false); // 是否正在开奖
    const lotteryResult = ref('');

    const resultDrawingAnimation = () => {
        isLotteryDrawing.value = true;
    };

    const resultDrawingFinished = () => {
        isLotteryDrawing.value = false;
    };

    const setLotteryResult = result => {
        lotteryResult.value = result;
    };

    const setCountdownopenTime = time => {
        countdownopenTime.value = time;
    };

    onMounted(() => {
        _TimerAdapter.listen('lotteryDrawing', resultDrawingAnimation);
        _TimerAdapter.listen('lotteryDrawingFinished', resultDrawingFinished);
        _TimerAdapter.listen('setLotteryResult', setLotteryResult);
        _TimerAdapter.listen('countdownopenTime', setCountdownopenTime);
        // _TimerAdapter.listen('setChOmTimes', getAnalysis);
        const result = sessionStorage.getItem('result');
        if (result) lotteryResult.value = result;
    });

    onUnmounted(() => {
        _TimerAdapter.remove('lotteryDrawing', resultDrawingAnimation);
        _TimerAdapter.remove('lotteryDrawingFinished', resultDrawingFinished);
        _TimerAdapter.remove('setLotteryResult', setLotteryResult);
        _TimerAdapter.remove('countdownopenTime', setCountdownopenTime);
        // _TimerAdapter.remove('setChOmTimes', getAnalysis);
        sessionStorage.setItem('result', lotteryResult.value);
    });

    return {
        status,
        openInfo,
        isLotteryDrawing,
        lotteryResult,
        countdownopenTime
    };
};

export const usePlayHook = () => {
    const commonStore = useCommonStore();
    const play = computed(() => commonStore.play);
    const lotteryData = computed(() => commonStore.lotteryData);
    const isReset = computed(() => commonStore.isReset);
    const currentLottery = computed(() => commonStore.currentLottery);

    const rodioIndex = ref(0);
    const hleper = ref(1 + Math.random());

    const storeRD = ref(false);
    const storeData = ref(false);

    const hotColdShow = ref(false);
    const omitShow = ref(false);
    const hotColdList = ref([]);
    const omitList = ref([]);

    const onClickhotCold = () => {
        hotColdShow.value = !hotColdShow.value;
        commonStore.hotColdShow = hotColdShow.value;
    };
    const onClickOmit = () => {
        omitShow.value = !omitShow.value;
        commonStore.omitShow = omitShow.value;
    };

    watch(
        () => lotteryData.value,
        newValue => {
            storeRD.value = false;
            storeData.value = false;
            rodioIndex.value = 0;
            commonStore.betData = [];
        },
        { immediate: true }
    );

    watch(
        () => play.value,
        newValue => {
            storeRD.value = false;
            rodioIndex.value = 0;
            commonStore.betData = [];
        },
        { immediate: true }
    );

    watch(
        () => rodioIndex.value,
        newValue => {
            storeRD.value = false;
            commonStore.betData = [];
        },
        { immediate: true }
    );

    watch(
        () => isReset.value,
        newValue => {
            if (newValue) {
                storeRD.value = false;
                hleper.value = Math.random() + 1;
                commonStore.betData = [];
                commonStore.isReset = 0;
            }
        },
        { immediate: true }
    );

    return {
        lotteryData, // 所有彩种信息
        isReset,
        currentLottery, // 当前选中的彩种
        hleper, // 随机数, 控制页面刷新
        storeData, // 所有玩法
        storeRD, // 组合后的玩法
        rodioIndex, // 单选玩法的索引
        play, // 当前选择的玩法 比如'kj'
        hotColdShow, // 是否显示冷热
        omitShow, //是否显示遗漏
        hotColdList, //冷热数据
        omitList, //遗漏数据
        onClickhotCold, // 冷热点击事件
        onClickOmit // 遗漏点击事件
    };
};
