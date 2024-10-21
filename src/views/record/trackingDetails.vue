<script>
export default {
    name: 'TrackingDetails'
};
</script>
<script setup>
const { push } = useRouter();
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Stamp from './components/img/stamp.svg';
import DrawItem from './components/drawItem.vue';
import useCommonStore from '@/store/modules/common';
import { chaseDetail, cancelChase, getQueryChaseDetailBetDetail } from '@/api/interface';

const statusDisplayMap = {
    0: '',
    1: '完成',
    2: '取消'
};

const checkedList = ref([]);
const isCheckAll = ref(false);
const checkboxGroup = ref(null);
const listLoading = ref(false);
const listFinished = ref(false);
const list = ref([]);
const detailInfo = ref('');

const commonStore = useCommonStore();
const trackingInfo = computed(() => commonStore.trackingInfo);
// 0:正常 1:取消 2:完成 正常才顯示checkbox
const showCheckBox = computed(() => trackingInfo.value.status === 0);

const checkAll = value => {
    isCheckAll.value = value;
    checkboxGroup.value.toggleAll({
        checked: value,
        skipDisabled: true
    });
    list.value.forEach(element => (element.checked = value));
};

const goDetail = item => {
    if (item.chaseStatus === 2) return;
    push({
        name: 'recordDetails'
    });
    detailInfo.value = item.lotteryNum;
    getChaseDetail();
};

const getChaseDetail = () => {
    getQueryChaseDetailBetDetail({
        chaseId: trackingInfo.value.id,
        lotteryNum: detailInfo.value
    })
        .then(res => {
            commonStore.setRecordInfo(res);
        })
        .catch(error => {});
};

const getData = () => {
    chaseDetail({
        id: trackingInfo.value.id
    }).then(res => {
        list.value = res.map(item => ({ ...item, checked: false }));
    });
};
const isShowCancelConfirm = ref(true);
const doCanceled = () => {
    cancelChase({
        id: checkedList.value
    }).then(res => {
        getData();
        checkedList.value = [];
    });
};

const isShowAllChecked = computed(() => {
    const isShow = list.value.filter(item => item.chaseStatus === 0);
    if (isShow.length) {
        return true;
    }
    return false;
});

const isShowPopup = ref(false);

const openPopup = () => {
    isShowPopup.value = true;
};

const closePopup = () => {
    isShowPopup.value = false;
};

onMounted(() => {
    getData();
});
</script>
<template>
    <Header title="追号注单" />
    <div :class="['chaseDetail', { heightWithCheckbox: showCheckBox }]">
        <div class="w-full bg-white flex justify-between items-center py-3 px-3.5">
            <div>
                <div class="text-black text-2xl mb-1">{{ trackingInfo.lotteryName }}</div>
                <div class="text-[#60697A] text-xs mb-1">{{ trackingInfo.lotteryNumStart }} - {{ trackingInfo.lotteryNumEnd }}期</div>
                <div class="text-[#60697A] text-xs mb-1">{{ trackingInfo.playTypeName }}-{{ trackingInfo.playName }} 赔率: {{ trackingInfo.odds }}</div>
                <div class="text-[#60697A] text-xs mb-1">追号时间: {{ trackingInfo.createTime }}</div>
                <div class="text-[#60697A] text-xs mb-1">
                    <span>{{ trackingInfo.chaseStop === 1 ? '不中奖即停' : '' }}</span>
                    <span>{{ trackingInfo.chaseStop === 2 ? '中奖即停' : '' }}</span>
                </div>
            </div>
            <!-- 狀態為正常 不顯示圖片 -->
            <div v-if="trackingInfo.status !== 0" class="relative stampImg">
                <component :is="Stamp" width="54px" height="54px" />
                <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[#1E8EF5] text-sm whitespace-nowrap">{{ statusDisplayMap[trackingInfo.status] }}</span>
            </div>
        </div>
        <div v-if="list.length > 0" class="listContent">
            <van-checkbox-group v-model="checkedList" ref="checkboxGroup">
                <div :class="[showCheckBox && 'flex']" v-for="item of list" :key="item.id">
                    <div v-if="!item.chaseStatus" class="checkboxCustom">
                        <van-checkbox class="checkboxCustom" v-if="showCheckBox" v-model="item.checked" :key="item.id" :name="item.id" checked-color="#1E8EF5" icon-size="18px" shape="square" />
                    </div>
                    <div :class="['listItem', 'grow', item.status === 1 && 'bgGary']" @click="goDetail(item)">
                        <DrawItem :item="item" type="chase" />
                    </div>
                </div>
            </van-checkbox-group>
            <div v-if="list.length === 0" class="text-center text-sm text-slate-400">没有更多了</div>
        </div>
        <div v-else class="text-center text-sm text-slate-400 mt-2">没有資料</div>
        <div v-if="showCheckBox" class="actionBar px-2">
            <div class="flex align-center" v-if="isShowAllChecked" s>
                <van-checkbox v-model="isCheckAll" @change="checkAll" checked-color="#1E8EF5" icon-size="18px" shape="square">全选</van-checkbox>
            </div>
            <button v-if="isShowAllChecked" :class="['actionBtn', { disable: checkedList.length === 0 }]" @click="openPopup" :disabled="checkedList.length === 0">取消追号</button>
        </div>
    </div>
    <!-- 詢問是否取消彈窗 -->
    <van-dialog v-model:show="isShowPopup" class="confirmCancelPopup" title="确认取消追号" show-cancel-button @cancel="closePopup" @confirm="doCanceled">
        <div class="text-center text-sm">确定撤回 {{ checkedList.length }} 个注单？金额将退回至钱包</div>
    </van-dialog>
</template>
<style lang="scss" scope>
.heightWithCheckbox {
    height: calc(100% - 44px);
}
.chaseDetail {
    .stampImg {
        width: 54px;
        height: 54px;
    }
    .listContent {
        min-height: calc(100% - 217px);
        background-color: #eff2f5;
        overflow-y: auto;
        padding: 12px;
        background-color: #eff2f5;

        .listItem {
            width: 100%;
            height: auto;
            background: #ffffff;
            border-radius: 5px;
            box-sizing: border-box;
            padding: 10px 12px;
            margin-bottom: 10px;
        }

        .disableStyle {
            color: #464c54;
            opacity: 0.5;
        }
    }
    .checkboxCustom {
        min-width: 30px;
        margin-top: 10px;
    }
    .actionBar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 84px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        box-shadow: 0px -12px 15px -3px rgba(0, 0, 0, 0.1);

        .actionBtn {
            width: 90px;
            height: 36px;
            color: #ffffff;
            background-color: #1e8ef5;
            font-size: 14px;
            border-radius: 5px;
        }
        .disable {
            border: 1px solid rgba(60, 93, 157, 0.5);
            color: rgba(60, 93, 157, 0.5);
            background: #fff;
        }
    }
}
.confirmCancelPopup {
    min-width: 320px;
    min-height: 126px;
    padding: 10px;

    .btn {
        width: 100%;
        border-radius: 10px;
    }

    .resetBtn {
        border: 1px solid rgba(60, 93, 157, 0.2);
        color: rgba(60, 93, 157, 0.2);
        background: #fff;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    }

    .saveBtn {
        background-color: #1e8ef5;
        color: #fff;
    }
}
</style>
