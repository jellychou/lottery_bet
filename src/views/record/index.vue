<script>
export default {
    name: 'Record'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCommonStore from '@/store/modules/common';
import { betReport, betList, pageChase } from '@/api/interface';
import RecordItem from './components/recordItem.vue';
import Footer from './components/footer.vue';
import CTabbar from '@/components/public/CTabbar.vue';
import Loading from '@/components/public/Loading.vue';
import NoData from '@/components/public/NoData.vue';
import InfiniteScroll from '@/components/public/InfiniteScroll.vue';
import moment from 'moment';
import { session } from '@/util/storage';

const { push } = useRouter();
const commonStore = useCommonStore();
const lotteryList = computed(() => commonStore.lotteryList.filter(e => e.children.length));
const tabActive = computed(() => commonStore.tabActive);
const lotteryOption = ref([
    //彩种下拉选择数据
    {
        text: '全部彩种',
        value: ''
    }
]);

lotteryList.value.forEach(e => {
    if (e.children.length && e.code !== 'hot') {
        const childOptions = e.children.map(item => ({ text: item.label, value: item.code }));
        lotteryOption.value = lotteryOption.value.concat(childOptions);
    }
});

const minDate = ref(new Date(2023, 1, 1));
const maxDate = ref(new Date());

const tabList = ref(['我的投注', '追号记录']); //tab数组

const item = ref(null); // 时间筛选ref值
const betValue = ref(''); //  订单状态值
const lotteryValue = ref(''); //彩种code值
const date = ref(''); // 时间
const dateValue = ref([]); //时间范围值
const dateIndex = ref(0); //时间单选选中值
const dateText = ref('全部时间'); //时间选择标题
const show = ref(false); //时间区域显示开关

const recordList = ref([]);
const recordTotal = ref(0);
const trackTotal = ref(0);

const trackingList = ref([]);
const showCalender = ref(false);

const recordTotalData = ref({});

const pageOptions = ref({
    pageNumber: 1,
    pageSize: 30
});

const betOption = [
    { text: '全部状态', value: '' },
    { text: '未派彩', value: 0 },
    { text: '已派彩', value: 1 },
    { text: '已撤单', value: -1 }
];

const chaseOption = [
    { text: '全部状态', value: '' },
    { text: '进行中', value: 0 },
    { text: '已完成', value: 1 }
];

const dateOption = [
    { text: '全部时间', value: 0 },
    { text: '今天', value: 1 },
    { text: '昨天', value: 2 },
    { text: '近7天', value: 3 },
    { text: '近30天', value: 4 }
];

const changeTabs = index => {
    betValue.value = '';
    commonStore.setTabActive(index);
    pageOptions.value.pageNumber = 1;

    if (index === 1) {
        getTracingList();
    } else {
        getBetList();
        getBetReport();
    }
};

const getTracingList = async () => {
    pageChase({
        pageNumber: pageOptions.value.pageNumber,
        pageSize: pageOptions.value.pageSize,
        lotteryCode: lotteryValue.value,
        status: betValue.value,
        startTime: dateValue.value.length > 0 ? dateValue.value[0] : '',
        endTime: dateValue.value.length > 0 ? dateValue.value[1] : ''
    }).then(res => {
        trackingList.value = res.data;
        trackTotal.value = res.total;
    });
};

const loadMoreChaseList = () => {
    pageOptions.value.pageNumber = pageOptions.value.pageNumber + 1;
    pageChase({
        pageNumber: pageOptions.value.pageNumber,
        pageSize: pageOptions.value.pageSize,
        lotteryCode: lotteryValue.value,
        status: betValue.value,
        startTime: dateValue.value.length > 0 ? dateValue.value[0] : '',
        endTime: dateValue.value.length > 0 ? dateValue.value[1] : ''
    }).then(res => {
        trackingList.value = trackingList.value.concat(res.data);
    });
};

const getBetList = () => {
    betList({
        pageNumber: pageOptions.value.pageNumber,
        pageSize: pageOptions.value.pageSize,
        lotteryCode: lotteryValue.value,
        status: betValue.value,
        startDate: dateValue.value.length > 0 ? dateValue.value[0] : '',
        endDate: dateValue.value.length > 0 ? dateValue.value[1] : ''
    }).then(res => {
        recordList.value = res.data;
        recordTotal.value = res.total;
    });
};

const loadMoreList = () => {
    pageOptions.value.pageNumber = pageOptions.value.pageNumber + 1;
    betList({
        pageNumber: pageOptions.value.pageNumber,
        pageSize: pageOptions.value.pageSize,
        lotteryCode: lotteryValue.value,
        status: betValue.value,
        startDate: dateValue.value.length > 0 ? dateValue.value[0] : '',
        endDate: dateValue.value.length > 0 ? dateValue.value[1] : ''
    }).then(res => {
        recordList.value = recordList.value.concat(res.data);
    });
};

const goDetails = item => {
    commonStore.setRecordInfo(item);
    push({
        name: 'recordDetails'
    });
};

const goTracking = item => {
    commonStore.setTrackingInfo(item);
    push({
        name: 'trackingDetails'
    });
};

// 近期投注-普通注单
const getBetReport = () => {
    betReport({
        pageNumber: pageOptions.value.pageNumber,
        pageSize: pageOptions.value.pageSize,
        lotteryCode: lotteryValue.value,
        status: betValue.value,
        startDate: dateValue.value.length > 0 ? dateValue.value[0] : '',
        endDate: dateValue.value.length > 0 ? dateValue.value[1] : ''
    }).then(res => {
        recordTotalData.value = res;
    });
};

const dateInterval = () => {
    show.value = true;
    dateIndex.value = 5;
    dateText.value = '区间';
};
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

const recRecordDate = type => {
    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    switch (type) {
        case 0:
            return [];
        case 1:
            return [moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')];
        case 2:
            return [moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')];
        case 3:
            return [moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().add(7, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')];
        case 4:
            return [moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment().add(30, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')];
        default:
            return [today, today];
    }
};

const changeDate = index => {
    date.value = '';
    dateIndex.value = index;
    dateText.value = dateOption[index].text;
    show.value = false;
    item.value.toggle();
    dateValue.value = recRecordDate(index);
    tabActive.value === 0 ? getData() : getTracingList({ pageNumber: 1 });
    showCalender.value = false;
    session.save({ date: dateValue.value, buttonIndex: index });
};

const changeFilter = () => {
    tabActive.value === 0 ? getData() : getTracingList({ pageNumber: 1 });
    session.save({ betValue: betValue.value });
    session.save({ lotteryValue: lotteryValue.value });
};

const formatDate = date => {
    const today = new Date(date);
    return `${today.getMonth() + 1}/${today.getDate()}`;
};

const showCalendar = () => {
    show.value = true;
};

// 关闭日历
const onClose = () => {
    show.value = false;
};

// 确认选择的日期范围
const onConfirm = event => {
    const [start, end] = event;
    dateValue.value = [moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss')];
    date.value = `${formatDate(start)} - ${formatDate(end)}`;
    session.save({ date: dateValue.value });
    session.save({ dateText: date.value });
    show.value = false;
    show.value = false;
    item.value.toggle();
    if (tabActive.value == 0) {
        getBetList();
        getBetReport();
    } else {
        getTracingList();
    }
};

const onDisplay = () => {
    show.value = true;
    showCalender.value = true;
    dateIndex.value = '';
};

const getData = () => {
    pageOptions.pageNumber = 1;
    if (tabActive.value == 0) {
        getBetList();
        getBetReport();
    } else {
        getTracingList();
    }
};

const resetSelect = () => {
    session.save({ date: [], buttonIndex: 0 });
    session.save({ betValue: '' });
    session.save({ lotteryValue: '' });
    session.save({ dateText: '' });
};

onMounted(() => {
    dateValue.value = session.get('date').length !== 0 ? session.get('date') : recRecordDate(1);
    dateIndex.value = session.get('buttonIndex') ? session.get('buttonIndex') : 1;
    dateText.value = dateOption[dateIndex.value].text;
    date.value = session.get('dateText') ? session.get('dateText') : '';
    betValue.value = session.get('betValue') !== null ? session.get('betValue') : '';
    lotteryValue.value = session.get('lotteryValue') ? session.get('lotteryValue') : '';
    getData();
});
</script>

<template>
    <div class="record">
        <div class="topFixed">
            <div @click="resetSelect">
                <Header title="记录" enTitle="record" />
            </div>
            <div class="tab">
                <div class="tabActive" :class="{ leftActive: tabActive === 0, rightActive: tabActive !== 0 }"></div>
                <div class="tab-item" :class="{ active: tabActive === index }" v-for="(item, index) of tabList" :key="index" @click="changeTabs(index)">{{ item }}</div>
            </div>
            <div class="filter">
                <van-dropdown-menu>
                    <van-dropdown-item v-model="betValue" :options="tabActive === 0 ? betOption : chaseOption" @change="changeFilter" />
                    <van-dropdown-item v-model="lotteryValue" :options="lotteryOption" @change="changeFilter" />
                    <van-dropdown-item :title="date ? date : dateText" ref="item">
                        <div class="date-box">
                            <div class="date-radio gap-2">
                                <div class="date-radio-item" :class="{ active: index == dateIndex }" v-for="(item, index) of dateOption" :key="index" @click="changeDate(index)">
                                    {{ item.text }}
                                </div>
                            </div>
                            <div class="date-interval">
                                <Transition name="fade">
                                    <div class="calendar-box" :style="{ height: showCalender ? '428px' : '36px' }">
                                        <van-cell class="interval-btn" title="区间日期选择" :value="date" @click="onDisplay" />
                                        <van-calendar
                                            v-if="showCalender"
                                            :style="{ height: '400px' }"
                                            :show-title="false"
                                            :min-date="minDate"
                                            :max-date="maxDate"
                                            :poppable="false"
                                            type="range"
                                            position="bottom"
                                            @confirm="onConfirm"
                                            :show-confirm="false"
                                        />
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </div>
        </div>
        <div class="holderTop"></div>
        <div v-if="tabActive === 0" class="order" ref="betListRef">
            <div class="order-list">
                <NoData v-if="recordList.length === 0" text="暂无内容" />
                <div v-else class="order-list-item" v-for="item of recordList" :key="item.id" @click="goDetails(item)">
                    <RecordItem :item="item" :tabIndex="tabActive" type="normal" />
                </div>
                <InfiniteScroll v-if="recordTotal > recordList.length" :onVisible="loadMoreList">
                    <div class="flex flex-col justify-center items-center loader">
                        <van-loading class="wrapper" type="spinner" />
                        <div class="text-xs mt-2 loadingText">加载中</div>
                    </div>
                </InfiniteScroll>
            </div>
        </div>
        <div v-else class="order pb-0" ref="recordListRef">
            <div class="order-list">
                <NoData v-if="trackingList.length === 0" text="暂无内容" />
                <div class="order-list-item" v-for="item of trackingList" :key="item.id" @click="goTracking(item)">
                    <RecordItem :item="item" :tabIndex="tabActive" type="chase" />
                </div>
                <InfiniteScroll v-if="trackTotal > trackingList.length" :onVisible="loadMoreChaseList">
                    <div class="flex flex-col justify-center items-center loader">
                        <van-loading class="wrapper" type="spinner" />
                        <div class="text-xs mt-2 loadingText">加载中</div>
                    </div>
                </InfiniteScroll>
            </div>
        </div>
        <div :class="{ holder: tabActive === 0, holderH: tabActive === 1 }"></div>
        <div class="bottom" :style="{ height: tabActive === 0 ? '95px' : '50px' }">
            <Footer v-if="tabActive === 0" :recordTotalData="recordTotalData"></Footer>
            <CTabbar />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.record {
    width: 100%;
    height: 100dvh;
    background: #eff2f5;
}

.topFixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
}

.holderTop {
    height: 133px;
    width: 100%;
    z-index: 100;
}
.tab {
    width: 100%;
    height: 41px;
    display: flex;
    background: #ffffff;
    justify-content: center;
    .tab-item {
        width: 90px;
        text-align: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 15px;
        line-height: 41px;
        color: #63666f;
        position: relative;
    }
    .active {
        font-weight: 600;
        color: #1e8ef5;
        transition: transform 0.15s ease-in;
    }

    .tabActive::after {
        position: absolute;
        content: '';
        background: #1e8ef5;
        bottom: 0;
        left: 50%;
        width: 18px;
        height: 3px;
        border-radius: 3px 3px 0 0;
    }

    .leftActive {
        transform: translateX(36px);
        transition: transform 0.15s ease-in;
    }

    .rightActive {
        transform: translateX(126px);
        transition: transform 0.15s ease-in;
    }
}
.filter {
    background: #eff2f5;
    :deep(.van-dropdown-menu__bar) {
        background: #eff2f5;
        box-shadow: none;
        display: flex;
        box-sizing: border-box;
        padding: 10px 12px;
        z-index: 1900 !important;
        .van-dropdown-menu__item {
            flex: 1;
            margin-left: 5px;
            background: #ffffff;
            border-bottom: 1px solid rgba(60, 93, 157, 0.2);
            &:nth-of-type(1) {
                margin-left: 0;
            }
        }
    }
    :deep(.van-dropdown-item__content) {
        border-radius: 0 0 5px 5px;
        .van-cell__title {
            color: #60697a;
            text-align: left;
        }
        .van-dropdown-item__option--active {
            .van-cell__title {
                color: #1e8ef5;
            }
        }
    }
    .date-box {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px 12px;
        overflow: hidden;
        .date-radio {
            width: 100%;
            display: flex;
            height: 33px;
            justify-content: space-between;
            .date-radio-item {
                width: 23%;
                height: 33px;
                text-align: center;
                line-height: 33px;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 13px;
                line-height: 31px;
                color: #60697a;
                border: 1px solid rgba(60, 93, 157, 0.2);
                border-radius: 5px;
            }
        }
        .date-interval {
            width: 100%;
            margin-top: 10px;
            .interval-btn {
                border: 1px solid rgba(60, 93, 157, 0.2);
                border-radius: 5px;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 500;
                font-size: 13px;
                text-align: center;
                color: #484848;
                padding: 4px 8px;
            }
        }
        :deep(.van-calendar__header-title) {
            z-index: 0 !important;
            opacity: 0;
            display: none !important;
        }
        .active {
            background: #1e8ef5;
            color: #ffffff !important;
            border: 1px solid #1e8ef5 !important;
        }
    }
    .calendar-box {
        width: 100%;
        height: 400px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: height 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        height: 0;
    }
}
.order {
    .order-list {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 0 12px 10px 12px;
        background: #eff2f5;
        .order-list-item {
            width: 100%;
            height: auto;
            background: #ffffff;
            border-radius: 6px;
            box-sizing: border-box;
            padding: 10px 12px;
            margin-bottom: 12px;
        }
    }
}

.loadingText {
    color: #929aa7;
}

.holder {
    height: 95px;
    width: 100%;
}

.holderH {
    height: 50px;
    width: 100%;
}

.bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
}
</style>
