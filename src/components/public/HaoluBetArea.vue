<template>
    <div class="betArea" :class="{ open: isShowBetArea, close: !isShowBetArea }" :style="{ height: keyboardShow ? '275px' : '' }">
        <div class="bet_area">
            <div class="flex items-center px-3 py-2.5">
                <div class="num flex items-center">
                    <van-button class="n" @click="betAmount = item" v-for="(item, index) in quickMoney" :key="index">{{ item }}</van-button>
                    <van-button class="edit h-full" @click="editQuickMoneyPopupShow = true"><img src="../../views/play/assets/edit.png" width="15" /></van-button>
                </div>
                <div class="input flex-1 mx-2.5">
                    <van-field class="h-full" v-model="betAmount" readonly :border="false" @click="keyboardShow = true" placeholder="输入金额" />
                </div>
                <van-button class="h-8 w-8 flex justify-center items-center px-0" @click="betAmount = ''"><img src="../../views/play/assets/del.png" width="20" /></van-button>
            </div>

            <div v-show="keyboardShow" class="keyboard grid grid-cols-4 gap-1.5" :class="{ show: keyboardShow }" ref="keyboard">
                <van-button v-for="(item, index) in keylist" :key="index" @click="handleInput(item)" class="key flex justify-center items-center">
                    <img v-if="isNaN(item)" :src="filterImg(item)" width="22" />
                    <p v-else>{{ item }}</p>
                </van-button>
            </div>

            <div class="handle_bet flex items-center px-2.5">
                <van-button class="handle" @click="showChase">
                    <div class="flex flex-col justify-center items-center">
                        <img src="../../views/play/assets/chase.png" width="20" class="mb-0.5" />
                        追号
                    </div>
                </van-button>
                <van-button class="handle mr-2" @click="showBetHistory">
                    <div class="flex flex-col justify-center items-center">
                        <img src="../../views/play/assets/recent.png" width="20" class="mb-0.5" />
                        近期投注
                    </div>
                </van-button>
                <div class="flex-1 flex items-center">
                    <!-- <van-button class="add-cart w-1/2" @click="addCart">添加选号</van-button> -->
                    <van-button class="bet w-full" @click="bet">立即投注</van-button>
                </div>
            </div>

            <!-- 投注确认弹窗 -->
            <van-dialog v-model:show="betComfirmDialogShow" class="betComfirmDialog" title="投注确认" show-cancel-button @cancel="betComfirmDialogCancel" @confirm="betComfirmDialogConfirm">
                <div class="my-2 mx-3">
                    <div class="currentLottery">{{ itemData?.lotteryName }}</div>
                    <div class="period">{{ $t('betting.period', { No: issueDisplay(openInfo.nextLotteryNum) }) }}</div>
                </div>
                <div class="bet_display mx-2.5 overflow-auto">
                    <ul>
                        <li class="headline">
                            <i v-for="(it, i) in headerData" :key="i">{{ it }}</i>
                        </li>
                        <li>
                            <i>{{ isBet[0]?.playTypeName }}</i>
                            <i>{{ isBet[0]?.odds }}</i>
                            <i>{{ betAmount }}</i>
                        </li>
                    </ul>
                </div>
                <div class="info mx-2.5 mt-3 mb-1">
                    <div class="flex justify-between items-center">
                        <div class="length">共投 {{ 1 }} 注</div>
                        <div class="amount flex items-center">
                            投注总金额
                            <p>{{ betAmount }}</p>
                        </div>
                    </div>
                </div>
            </van-dialog>

            <!-- 编辑快捷金额弹窗 -->
            <van-popup v-model:show="editQuickMoneyPopupShow" class="editQuickMoneyPopup" position="bottom" round>
                <div class="title relative text-center">
                    编辑快捷金额
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2" @click="onSaveDefaultQuickMoney">恢复默认</span>
                </div>

                <div class="outLine grid grid-cols-4 gap-2 pt-5 pb-6 px-2.5">
                    <div class="item flex items-center overflow-hidden" v-for="(item, index) in quickMoney" :key="index">
                        <van-field v-model="quickMoney[index]" type="number" maxlength="5" class="h-full flex-1" />
                        <div class="del1 h-full flex items-center justify-center" @click="quickMoney[index] = 0">
                            <img src="./assets/del1.png" width="20" />
                        </div>
                    </div>
                </div>
                <div class="footer flex items-center">
                    <div class="w-1/2" @click="editQuickMoneyPopupShow = false">取消</div>
                    <div class="comfirm w-1/2" @click="onSaveQuickMoney">保存设置</div>
                </div>
            </van-popup>

            <!-- 追号弹窗 -->
            <div class="chase">
                <van-popup v-model:show="chasePopupShow" class="chasePopup" position="bottom" round>
                    <div class="title relative text-center">
                        追号
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2" @click="resetChase">重置</span>
                    </div>

                    <div class="outLine px-3 py-2.5 overflow-auto">
                        <div class="begin-issue flex items-center justify-between px-3">
                            <div class="label">起始期号</div>
                            <div class="flex items-center">
                                <div class="cur-issue px-1" v-if="isOneLottery ? openInfo.nextLotteryNum === lotteryNum : analyzeInfo[0]?.nextLotteryNum === lotteryNum">当前期</div>
                                <div class="issue ml-1 mr-2">{{ issueDisplay(lotteryNum) }}期</div>
                                <van-popover
                                    v-model:show="showPopover"
                                    :style="{ zIndex: 10000 }"
                                    :offset="[12, 18]"
                                    placement="bottom-end"
                                    class="begin-issue-popover"
                                    teleport="#app-lottery"
                                    @open="onSelect"
                                >
                                    <van-grid clickable :border="false" column-num="1">
                                        <van-grid-item v-for="item in issueList" :key="item" :text="item.lotteryNumDisplay" @click="onSelectBeginIssue(item)" />
                                    </van-grid>
                                    <template #reference>
                                        <img src="../../views/play/assets/arrow_down.png" width="9" />
                                    </template>
                                </van-popover>
                            </div>
                        </div>

                        <div class="chaseNumber px-3 pt-2 mt-2.5">
                            <div class="flex items-center justify-between">
                                <div class="label">追号期数</div>
                                <div class="flex items-center">
                                    <van-stepper v-model="chaseNumber" min="2" :max="issueList.length || 999" input-width="44" integer disable-input @change="onChange" />
                                    <span>期</span>
                                </div>
                            </div>
                            <div class="quick-select flex items-center">
                                <div :class="{ active: periodValue === 3 }" @click="inputValue(3)">3期</div>
                                <div :class="{ active: periodValue === 5 }" @click="inputValue(5)">5期</div>
                                <div :class="{ active: periodValue === 10 }" @click="inputValue(10)">10期</div>
                                <div :class="{ active: periodValue === 15 }" @click="inputValue(15)">15期</div>
                                <div :class="{ active: periodValue === 20 }" @click="inputValue(20)">20期</div>
                            </div>
                        </div>

                        <div class="option px-3 py-2 mt-2.5">
                            <div class="flex items-center justify-between">
                                <div class="label">起始倍数</div>
                                <div class="flex items-center">
                                    <van-stepper v-model="startMultiple" min="1" max="999" input-width="44" integer disable-input />
                                    <span>倍</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <div class="label">间隔期数</div>
                                <div class="flex items-center">
                                    <van-stepper v-model="intervalNum" min="1" :max="issueList?.length || 999" input-width="44" integer disable-input />
                                    <span>期</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <div class="label">期数倍投</div>
                                <div class="flex items-center">
                                    <van-stepper v-model="scheduledBet" min="1" input-width="44" integer disable-input />
                                    <span>倍</span>
                                </div>
                            </div>
                            <div class="chaseStop flex items-center justify-between mt-2">
                                <div class="label">停追</div>
                                <div class="flex items-center">
                                    <div class="flex items-center" @click="chaseStop = chaseStop == 1 ? 0 : 1">
                                        <img src="../../views/play/assets/checked.png" v-if="chaseStop == 1" width="15" />
                                        <img src="../../views/play/assets/check.png" v-if="chaseStop !== 1" width="15" />
                                        <span class="">不中即停</span>
                                    </div>
                                    <div class="flex items-center ml-4" @click="chaseStop = chaseStop == 2 ? 0 : 2">
                                        <img src="../../views/play/assets/checked.png" v-if="chaseStop == 2" width="15" />
                                        <img src="../../views/play/assets/check.png" v-if="chaseStop !== 2" width="15" />
                                        <span class="">中奖即停</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chaseDetail mt-2.5">
                            <div class="label px-3">追号详情</div>
                            <ul>
                                <li class="headline">
                                    <i>期数</i>
                                    <i>期号</i>
                                    <i>投注金额</i>
                                    <i>倍数</i>
                                </li>
                                <li v-for="(it, i) in chaseIssueList" :key="i">
                                    <i>{{ i + 1 }}</i>
                                    <i>{{ it.lotteryNumDisplay }}</i>
                                    <i>{{ it.amount }}</i>
                                    <i>{{ it.multiple }}</i>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer flex justify-between items-center px-2.5">
                        <div class="total truncate">
                            共追
                            <span>{{ totalAmount }}</span>
                            元
                        </div>
                        <van-button class="px-5" @click="chasePopupConfirm">
                            <div class="flex flex-col justify-center items-center">确认追号</div>
                        </van-button>
                    </div>
                </van-popup>
            </div>

            <!-- 近期投注弹窗 -->
            <div class="betHistory">
                <van-popup v-model:show="betHistoryPopupShow" class="betHistoryPopup" position="bottom" round>
                    <div class="title flex items-center justify-center text-center">
                        <div class="flex relative flex-col items-center mr-4" :class="{ active: curTab == 1 }" @click="onClickUnsettle">
                            未结注单
                            <div class="border-line absolute bottom-0 left-1/2 transform -translate-x-1/2" v-if="curTab == 1" />
                        </div>
                        <div class="flex relative flex-col items-center ml-4" :class="{ active: curTab == 2 }" @click="onClickSettle">
                            已结注单
                            <div class="border-line absolute bottom-0 left-1/2 transform -translate-x-1/2" v-if="curTab == 2" />
                        </div>
                    </div>
                    <div class="sub-tabs flex items-center py-2.5 px-3">
                        <div class="mr-2" :class="{ active: curSubTab == 1 }" @click="onClickBetTab">普通注单</div>
                        <div :class="{ active: curSubTab == 2 }" @click="onClickChaseTab">追号记录</div>
                    </div>

                    <div class="outLine px-3 overflow-auto">
                        <template v-if="curSubTab == 1">
                            <Loading v-if="isLoading" />
                            <NoData v-if="bethistory.length === 0 && !isLoading" text="暂无内容" />
                            <div v-else class="item px-3 py-2.5 mb-2.5" v-for="item in bethistory" :key="item.id">
                                <div class="flex items-center justify-between">
                                    <div class="lotteryName">{{ item.lotteryName }}</div>
                                    <div v-if="item.status == 0" class="status">未结算</div>
                                    <div v-if="item.status == 1 && item.netAmount > 0" class="win">
                                        <img src="../../views/play/assets/win.png" width="20" />
                                    </div>
                                    <div v-if="item.status == 1 && item.netAmount == 0" class="undraw px-1.5">未中奖</div>
                                </div>
                                <div class="flex items-center justify-between mt-2.5">
                                    <div class="lotteryNum">{{ issueDisplay(item.lotteryNum) }}期</div>
                                    <div v-if="item.status == 0" class="openTime">
                                        距开奖
                                        <span class="count-down">
                                            <Timer v-if="item.openTime > 0" v-model:time="item.openTime" :callback="getBetList" />
                                            <span v-else>{{ item.betOpenTime }}</span>
                                        </span>
                                    </div>
                                    <div v-if="item.status == 1" class="openTime">开奖 {{ item.updateTimeLocal.slice(5) }}</div>
                                </div>
                                <div class="flex items-center justify-between mt-1 pb-2.5">
                                    <div class="lotteryNum">{{ item.playTypeName }} {{ item.playName }}</div>
                                    <div class="openTime">投注 {{ item.createTimeLocal.slice(5) }}</div>
                                </div>
                                <div class="amount relative pt-2.5">
                                    <div class="semicircle-left-top" />
                                    <div class="flex items-center justify-between">
                                        <div class="label">投注额</div>
                                        <div v-if="item.status == 0" class="label">可赢额</div>
                                        <div v-if="item.status == 1 && item.netAmount > 0" class="label">中奖金额</div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="text">{{ item.betAmount }}</div>
                                        <div v-if="item.status == 0" class="text">{{ Math.round(item.betAmount * item.odds * 100) / 100 }}</div>
                                        <div v-if="item.status == 1 && item.netAmount > 0" class="text netAmount">{{ item.netAmount }}</div>
                                    </div>
                                    <div class="semicircle-right-top" />
                                </div>
                            </div>
                        </template>
                        <template v-if="curSubTab == 2">
                            <Loading v-if="isLoading" />
                            <NoData v-if="chasehistory.length === 0 && !isLoading" text="暂无内容" />
                            <div v-else class="item px-3 py-2.5 mb-2.5" v-for="item in chasehistory" :key="item.id">
                                <div class="flex items-center justify-between">
                                    <div class="lotteryName">{{ item.lotteryName }}</div>
                                    <div v-if="item.status == 0" class="status">共{{ item.chaseIndexMax }}期, 已进行{{ item.chaseIndexCurrent }}期</div>
                                    <div v-if="item.status == 1" class="status">共{{ item.chaseIndexMax }}期, 追号结束</div>
                                </div>
                                <div class="flex items-center mt-2.5">
                                    <div class="lotteryNum">{{ issueDisplay(item.lotteryNumStart) }}-{{ issueDisplay(item.lotteryNumEnd) }}期</div>
                                </div>
                                <div class="flex items-center justify-between mt-1 pb-2.5">
                                    <div class="lotteryNum">{{ item.playTypeName }}-{{ item.playName }}</div>
                                    <div class="openTime">投注 {{ item.createTime.slice(5) }}</div>
                                </div>
                                <div class="amount relative pt-2.5">
                                    <div class="semicircle-left-top" />
                                    <div class="flex justify-between items-center justify-between">
                                        <div>
                                            <div class="label">总投注额</div>
                                            <div class="text">{{ item.betAmountSum }}</div>
                                        </div>
                                    </div>

                                    <div class="semicircle-right-top" />
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="footer w-full flex justify-center items-center" @click="goRecord">完整投注记录</div>
                </van-popup>
            </div>

            <!-- 彩种介绍弹窗 -->
            <van-popup :show="lotteryIntroductionPopupShow" class="lotteryIntroductionPopup" round @click-overlay="closeLotteryIntroductionPopup">
                <div class="title">开奖时间</div>
                <div class="outLine">{{ currentLottery.openTimeInfo }}</div>
                <div class="title mt-5">开奖规则</div>
                <div class="outLine">{{ currentLottery.playRuleInfo }}</div>
            </van-popup>
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, watch, onUnmounted, defineAsyncComponent, defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import _TimerAdapter from '@/util/timerAdapter';
import { session } from '@/util/storage';
import { getToken, getSiteCode } from '@/util/cach';
import { issueDisplay } from '@/util/tools';
import { lotteryBet, getUser, setChips, chaseNumberList, chaseNumberChase, betList, pageChase } from '@/api/interface';
import keyboard_del from '../../views/play/assets/keyboard_del.png';
import keyboard_slide from '../../views/play/assets/keyboard_slide.png';
import Timer from '@/views/home/Timer.vue';
import NoData from '@/components/public/NoData.vue';
import Loading from '@/components/public/Loading.vue';
import { defineProps } from 'vue';

const props = defineProps({
    isShowBetArea: {
        type: Boolean,
        default: false
    },
    isBet: {
        type: Object,
        default: {}
    },
    itemData: {
        type: Object,
        default: {}
    },
    issueList: {
        type: Array,
        default: []
    },
    isOneLottery: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:reset', 'update:chase']);

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const commonStore = useCommonStore();
const currentLottery = computed(() => commonStore.currentLottery);
const betData = computed(() => commonStore.betData);
const cartData = computed(() => commonStore.cartData);
const userInfo = computed(() => commonStore.userInfo);
const openInfo = computed(() => commonStore.openInfo);
const analyzeInfo = computed(() => commonStore.analyzeInfo);
const lotteryIntroductionPopupShow = computed(() => commonStore.lotteryIntroductionPopupShow);
const chips = computed(() => commonStore.memberSettings?.chips || '1,5,10,50');
const quickMoney = ref(JSON.parse(JSON.stringify(chips.value)).split(','));
const haoluChaseList = computed(() => commonStore.haoluChaseList);

const betComfirmDialogShow = ref(false); //投注确认弹窗
const editQuickMoneyPopupShow = ref(false); // 编辑快捷金额弹窗
const cartPopupShow = ref(false); // 购彩篮弹窗
const chasePopupShow = ref(false); // 追号弹窗
const betHistoryPopupShow = ref(false); // 近期投注记录弹窗

const keyboardShow = ref(false); //键盘显示
const betAmount = ref(''); // 投注金额
const trigger = ref(0); // 是否在下注中
const headerData = ['玩法/内容', t('betting.Odds'), '金额']; // 投注确认弹窗表头
const copyBetData = ref([]); //投注内容的 拷贝
const keylist = [1, 2, 3, 'keyboard_slide', 4, 5, 6, 'keyboard_del', 7, 8, 9, 0];

const chaseNumber = ref(3); // 追号期数
const startMultiple = ref(1); // 起始倍数
const isSelectChaseNumber = ref(false); // 是否选择了追号期数
const chaseStop = ref(0); // 0:表示不受限制 1:表示不中就停止投注 2:表示中奖就停止投注
const intervalNum = ref(1); // 间隔期数
const scheduledBet = ref(1); // 期数倍投
const lotteryNum = ref(props.isOneLottery ? openInfo.value.nextLotteryNum : analyzeInfo[0]?.nextLotteryNum); // 开始追号的期号

const curTab = ref(1); // 1未结注单/2已结注单
const curSubTab = ref(1); // 1普通注单/2追号记录
const bethistory = ref([]); // 普通注单
const chasehistory = ref([]); // 追号记录
const isLoading = ref(false);
const periodValue = ref(3);

let timer = null; // 查余额定时器

//查余额
const getUserInfo = async () => {
    const res = await getUser();
    commonStore.userInfo = {
        memberBal: res.balance,
        memberAcct: ''
    };
};

const betComfirmDialogCancel = () => {
    betComfirmDialogShow.value = false;
    copyBetData.value = [...betData.value.filter(_ => _)];
};

const del = i => {
    copyBetData.value.splice(i, 1);
    if (!copyBetData.value.length) cancel();
};

// 期號快捷
const inputValue = val => {
    periodValue.value = val;
    chaseNumber.value = val;
};

const onChange = () => {
    periodValue.value = chaseNumber.value;
};

//重置
const reset = () => {
    betAmount.value = '';
    betComfirmDialogShow.value = false;
    // this.hideKb();
    commonStore.isReset = 1;
};

const bet = () => {
    if (!getToken()) return showToast(t('tip.BetAfterLoggingIn')); // 请在登陆后下注！
    if (betData.value.err) {
        return showToast(betData.value.err);
    } else if (!betAmount.value) {
        return showToast(t('betting.SelectTheBetAmount')); // 请选择下注金额
    }
    betComfirmDialogShow.value = true;
};

// 立即投注确认提交
const betComfirmDialogConfirm = () => {
    if (userInfo.value.memberBal < copyBetData.value.length * betAmount.value) return showToast(t('tip.BalanceInsufficient')); // 当前余额不足
    const betList = betData.value.map(_ => {
        _.amount = betAmount.value;
        return _;
    });

    if (trigger.value) return;
    trigger.value = 1;
    const data = { betList, lotteryCode: betData.value[0].lotteryCode, lotteryNum: openInfo.value.nextLotteryNum };
    lotteryBet(data)
        .then(res => {
            showToast(t('tip.Successful')); //下注成功
            getUserInfo();
        })
        .finally(() => {
            trigger.value = 0;
            reset();
            emit('update:reset');
            keyboardShow.value = false;
            betComfirmDialogShow.value = false;
            console.log('done');
        });
};

// 购物车提交
const cartPopupConfirm = () => {
    if (userInfo.value.memberBal < totalAmount.value) return showToast(t('tip.BalanceInsufficient')); // 当前余额不足

    if (trigger.value) return;
    trigger.value = 1;
    let data = { betList: isBet, lotteryCode: haoluChaseList.value.lotteryCode, lotteryNum: haoluChaseList.value.nextLotteryNum };
    lotteryBet(data)
        .then(res => {
            showToast(t('tip.Successful')); //下注成功
            reset();
            getUserInfo();
            commonStore.betData = [];
        })
        .finally(() => {
            trigger.value = 0;
            cartPopupShow.value = false;
        });
};

// 键盘输入
const handleInput = item => {
    let betAmount1 = betAmount.value;
    if (item === 'keyboard_slide') {
        keyboardShow.value = false;
    } else if (item === 'keyboard_del') {
        betAmount.value = betAmount.value.slice(0, betAmount.value.length - 1);
    } else {
        betAmount.value = betAmount.value + item;
    }

    if (betAmount.value >= 10000000) {
        showToast(t('tip.ExceededMaximum')); // 超过了最大值
        betAmount.value = betAmount1;
    }
};

const filterImg = val => {
    if (val === 'keyboard_del') {
        return keyboard_del;
    } else if (val === 'keyboard_slide') {
        return keyboard_slide;
    }
};

const getMemberInfo = () => {
    getLotterySetByMemberId({}).then(res => {
        if (res === undefined) {
            return;
        } else {
            commonStore.setMemberSettings(res);
            quickMoney.value = res.chips.split(',');
        }
    });
};

//保存快捷金额
const onSaveQuickMoney = () => {
    setChips({ chips: quickMoney.value.join(',') }).then(res => {
        showToast('设置快捷金额成功');
        getMemberInfo();
        editQuickMoneyPopupShow.value = false;
    });
};

//保存快捷金额
const onSaveDefaultQuickMoney = () => {
    setChips({ chips: '1,5,10,50' }).then(res => {
        getMemberInfo();
        showToast('恢复默认快捷金额成功');
        // editQuickMoneyPopupShow.value = false;
    });
};

// 展示购物车弹窗
const showCart = () => {
    if (!commonStore.cartData.length) {
        showToast('请添加选号');
    } else {
        cartPopupShow.value = true;
    }
};

//展示追号弹窗
const showChase = () => {
    if (!betAmount.value) {
        showToast('请选择或者输入投注金额');
        return;
    }
    chasePopupShow.value = true;
};

// 清空购物车
const clearCartData = () => {
    commonStore.cartData = [];
    showToast('清空购彩篮成功');
    cartPopupShow.value = false;
};

const resetChase = () => {
    lotteryNum.value = props.isOneLottery ? openInfo.value.nextLotteryNum : analyzeInfo[0]?.value.nextLotteryNum;
    startMultiple.value = 1;
    intervalNum.value = 1;
    scheduledBet.value = 1;
    chaseStop.value = 0;
    chaseNumber.value = 3;
};

// 删除购物车某一项
const filterCartData = idx => {
    commonStore.cartData = commonStore.cartData.filter((_, i) => i != idx);
    if (commonStore.cartData.length == 0) {
        cartPopupShow.value = false;
    }
};

//添加选号
const addCart = () => {
    if (!betAmount.value) {
        showToast('请选择或者输入投注金额');
        return;
    }

    commonStore.betData = commonStore.betData.map(_ => {
        return { ..._, amount: betAmount.value };
    });
    commonStore.cartData = [...commonStore.cartData, ...commonStore.betData];
    reset();
    showToast('添加选号成功');
};

// 购物车 总金额
const totalAmount = computed(() => {
    return chaseIssueList.value.reduce((previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue.amount);
    }, 0);
});

// 追号弹窗 追号详情列表
const chaseIssueList = computed(() => {
    let c = props.issueList
        .filter(_ => _.lotteryNum >= lotteryNum.value) // 起始期号
        .filter((_, i) => i % intervalNum.value == 0) //间隔期数
        .slice(0, chaseNumber.value); // 追号期数

    c.forEach((_, i) => {
        if (i == 0) {
            _.multiple = startMultiple.value; // 起始倍数
            _.amount = betAmount.value * startMultiple.value;
        } else {
            _.multiple = scheduledBet.value; // 顺期倍数
            _.amount = c[i - 1].amount * scheduledBet.value;
        }
    });
    return c;
});

const showPopover = ref(false);

// 展示可以追号的列表
const showBeginIssueList = async () => {
    emit('update:chase');
    chasePopupShow.value = true;
};

// 选择起始期号
const onSelectBeginIssue = item => {
    isSelectChaseNumber.value = true;
    lotteryNum.value = item.lotteryNum;
    showPopover.value = false;
};

//追号
const chasePopupConfirm = () => {
    const microProps = session.get('microProps');
    chaseNumberChase({
        lotteryCode: haoluChaseList.value.lotteryCode,
        betAmount: betAmount.value,
        chaseNumber: chaseNumber.value,
        chaseStop: chaseStop.value,
        intervalNum: intervalNum.value,
        lotteryNum: lotteryNum.value,
        scheduledBet: scheduledBet.value,
        startMultiple: startMultiple.value,
        playDetailList: betData.value,
        currency: microProps.currency,
        typeCode: haoluChaseList.value.parentCode
    })
        .then(res => {
            showToast('追号成功');
        })
        .catch(error => {
            showToast(error.response.data.msg);
        })
        .finally(() => {
            chasePopupShow.value = false;
            cartData.value = [];
        });
};

// 近期投注-普通注单
const getBetList = () => {
    isLoading.value = true;
    betList({
        pageNumber: 1,
        pageSize: 10,
        lotteryCode: '',
        status: curTab.value == 1 ? 0 : 1
    }).then(res => {
        bethistory.value = res.data;
        isLoading.value = false;
    });
};

// 近期投注-普通注单
const getChaseList = () => {
    isLoading.value = true;
    pageChase({
        pageNumber: 1,
        pageSize: 10,
        lotteryCode: '',
        status: curTab.value == 1 ? 0 : 1
    }).then(res => {
        chasehistory.value = res.data;
        isLoading.value = false;
    });
};

// 展示近期投注弹窗
const showBetHistory = () => {
    onClickUnsettle();
    betHistoryPopupShow.value = true;
};

// 近期投注-未结注单点击事件
const onClickUnsettle = () => {
    curTab.value = 1;
    curSubTab.value = 1;
    getBetList();
};

// 近期投注-已结注单点击事件
const onClickSettle = () => {
    curTab.value = 2;
    curSubTab.value = 1;
    getBetList();
};

// 近期投注-普通注单点击事件
const onClickBetTab = () => {
    curSubTab.value = 1;
    getBetList();
};

// 近期投注-追号记录点击事件
const onClickChaseTab = () => {
    curSubTab.value = 2;
    getChaseList();
};

const closeLotteryIntroductionPopup = () => {
    commonStore.lotteryIntroductionPopupShow = false;
};

const goRecord = () => {
    router.push('/record');
};

const onSelect = () => {
    getChaseNumberList();
};

watch(
    () => openInfo.value,
    newValue => {
        if (!isSelectChaseNumber.value) {
            lotteryNum.value = newValue.nextLotteryNum;
        }
        if (Object.keys(props.itemData).length !== 0) {
            emit('update:chase');
            lotteryNum.value = newValue.nextLotteryNum;
        }
    },
    { immediate: true, deep: true }
);

watch(
    () => analyzeInfo.value,
    newValue => {
        lotteryNum.value = newValue[0]?.nextLotteryNum;
    },
    { immediate: true, deep: true }
);

onMounted(() => {
    const microProps = session.get('microProps');
    // if (microProps && 'token' in microProps) {
    //     getUserInfo();
    //     timer = setInterval(() => getUserInfo(), 8000);
    // }
    // getBetList();
});

onUnmounted(() => {
    clearInterval(timer);
    timer = null;
});
</script>

<style lang="scss" scoped>
.bet_area {
    background: #ffffff;
    box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.05);
    border-radius: 10px 10px 0px 0px;
    .num {
        height: 33px;
        border: 1px solid #d8dfeb;
        .n {
            height: 100%;
            min-width: 30px;
            font-size: 15px;
            line-height: 30px;
            text-align: center;
            padding: 0px 6px;
            color: #60697a;
            border-right: 0.5px solid #d8dfeb;
        }

        .edit {
            width: 33px;
            padding: 2px;
        }
    }
    :deep(.van-field) {
        // padding: 0px;
        // .van-field__body {
        //     height: 100%;
        // }
    }
    .input {
        height: 33px;
        border: 1px solid rgba(60, 93, 157, 0.2);
        border-radius: 3px;
    }
    .del {
        width: 20px;
    }
    .keyboard {
        // height: 165px;
        transition: height 1s ease-out;
        padding: 8px;
        background: #eff2f5;
        .key {
            height: 45px;
            background: #ffffff;
            border-radius: 5px;
            font-family: 'WeChat Sans Std';
            font-style: normal;
            font-weight: 700;
            font-size: 28px;
            line-height: 31px;
            color: #464c54;
        }
        &.show {
            // height: 200px;
        }
    }
    .handle_bet {
        height: 50px;
        border-top: 0.5px solid #eff2f5;
        .handle {
            width: 48px;
            padding: 2px;
            font-size: 11px;
            line-height: 15px;
            color: #464c54;
        }
        .add-cart {
            height: 36px;
            font-weight: 500;
            font-size: 15px;
            line-height: 36px;
            color: #ffffff;
            text-align: center;
            background: linear-gradient(180deg, #ffae34 0%, #ffbe5b 100%);
            border-radius: 8px 0px 0px 8px;
        }
        .bet {
            height: 36px;
            font-weight: 500;
            font-size: 15px;
            line-height: 36px;
            color: #ffffff;
            text-align: center;
            background: linear-gradient(180deg, #ee2934 0%, #ff6565 100%);
            border-radius: 8px;
        }
    }
}

:deep(.betComfirmDialog) {
    .van-dialog__header {
        border-bottom: 1px solid #d8dfeb;
    }
    .van-dialog__content {
        .currentLottery {
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;
            color: #5e86c8;
        }
        .period {
            font-size: 14px;
            line-height: 18px;
            color: #464c54;
        }
        .bet_display {
            max-height: 240px;
            border: 0.5px solid #d8dfeb;
            li {
                width: 100%;
                height: 38px;
                display: flex;
                align-items: center;
                border-top: 0.5px solid #d8dfeb;
                i {
                    width: 25%;
                    text-align: center;
                    font-style: normal;
                    &:first-of-type {
                        width: 50%;
                        font-size: 14px;
                    }
                    &:nth-of-type(2) {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .odds {
                    color: #5e86c8;
                    font-weight: 500;
                }
            }

            .headline {
                background: #e8eef3;
                border: none;
                font-size: 14px;
                line-height: 19px;
                color: #60697a;
            }
        }
        .info {
            .length {
                font-size: 14px;
                line-height: 19px;
                color: #60697a;
            }
            .amount {
                font-weight: 400;
                font-size: 14px;
                line-height: 19px;
                color: #60697a;
                p {
                    color: #ff7539;
                    margin-left: 4px;
                }
            }
        }
    }
}

:deep(.editQuickMoneyPopup) {
    .title {
        height: 45px;
        line-height: 45px;
        font-weight: 500;
        font-size: 16px;
        color: #565f6c;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: #eff2f5;
        span {
            font-weight: 400;
            font-size: 15px;
            color: #60697a;
        }
    }
    .outLine {
        background: #eff2f5;
        .item {
            height: 36px;
            background: #ffffff;
            border: 1px solid rgba(60, 93, 157, 0.2);
            border-radius: 6px;
            .van-field {
                height: 100%;
                // background: #ffffff;
            }
        }
        .del1 {
            width: 35px;
            border-left: 1px solid rgba(60, 93, 157, 0.2);
        }
    }
    .footer {
        height: 50px;
        font-weight: 500;
        font-size: 16px;
        // line-height: 45px;
        text-align: center;
        color: #565f6c;

        .comfirm {
            height: 25px;
            border-left: 1px solid rgba(0, 0, 0, 0.1);
            color: #1e8ef5;
        }
    }
}

:deep(.cartPopup) {
    .title {
        height: 45px;
        line-height: 45px;
        font-weight: 500;
        font-size: 16px;
        color: #565f6c;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: #eff2f5;
        span {
            font-weight: 400;
            font-size: 15px;
            color: #60697a;
        }
    }
    .outLine {
        max-height: 480px;
        background: #eff2f5;
        .item {
            background: #ffffff;
            margin-bottom: 5px;
            border-radius: 5px;
            &:last-child {
                margin-bottom: 0px;
            }
            .playTypeName {
                font-weight: 500;
                font-size: 15px;
                line-height: 15px;
                color: #484848;
            }
            .name {
                font-weight: 600;
                font-size: 13px;
                line-height: 18px;
                color: #1e8ef5;
            }
            .van-field {
                height: 33px;
                width: 144px;
                input {
                    border-radius: 3px;
                    border: 1px solid rgba(60, 93, 157, 0.2);
                    input:focus {
                        border: 1px solid #1e8ef5;
                        background: red;
                        box-shadow: inset 0 0 0 1000px #ffffff !important;
                    }
                }
            }
            .can-win {
                font-size: 13px;
                line-height: 18px;
                color: #697281;
                span {
                    font-weight: 500;
                    // font-size: 13px;
                    // line-height: 18px;
                    color: #484848;
                }
            }
        }
    }
    .footer {
        height: 50px;
        background: #fff;

        .total {
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;
            color: #484848;
            span {
                color: #ff7539;
            }
        }
        .van-button {
            height: 36px;
            font-weight: 500;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            color: #ffffff;
            background: linear-gradient(180deg, #ee2934 0%, #ff6565 100%);
            border-radius: 5px;
        }
    }
}

:deep(.chasePopup) {
    .title {
        height: 45px;
        line-height: 45px;
        font-weight: 500;
        font-size: 16px;
        color: #565f6c;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: #eff2f5;
        span {
            font-weight: 400;
            font-size: 15px;
            color: #60697a;
        }
    }
    .outLine {
        max-height: 480px;
        background: #eff2f5;
        .label {
            font-size: 14px;
            line-height: 18px;
            color: #464c54;
        }
        .van-stepper {
            // border: 1px solid #eceff5;
            border-radius: 2px;
            font-size: 14px;
            .van-stepper__minus,
            .van-stepper__plus,
            .van-stepper__input {
                height: 30px;
                background: #ffffff;
            }
            .van-stepper__input {
                margin: 0px;
                border-top: 1px solid #eceff5;
                border-bottom: 1px solid #eceff5;
                font-weight: 500;
                font-size: 14px;
                line-height: 19px;
                color: #464c54;
            }
            .van-stepper__minus {
                width: 30px;
                border: 1px solid #eceff5;
            }
            .van-stepper__plus {
                width: 30px;
                border: 1px solid #eceff5;
            }
            .van-stepper__minus:after,
            .van-stepper__plus:after {
                height: 35%;
            }
            .van-stepper__minus:before,
            .van-stepper__plus:before {
                width: 35%;
            }
        }

        .begin-issue {
            height: 45px;
            background: #ffffff;
            border-radius: 5px;
            .cur-issue {
                height: 18px;
                font-weight: 500;
                font-size: 11px;
                line-height: 18px;
                color: #1e8ef5;
                background: #e0f0ff;
            }
            .issue {
                font-weight: 500;
                font-size: 13px;
                line-height: 18px;
                color: #464c54;
            }
        }

        .chaseNumber {
            background: #ffffff;
            border-radius: 5px;
            span {
                margin: 0px 0px 0px 5px;
                font-weight: 500;
                font-size: 14px;
                line-height: 19px;
                color: #464c54;
            }
            .quick-select {
                div {
                    height: 28px;
                    padding: 0px 15px;
                    margin: 8px 4px 10px 0px;
                    border: 1px solid #d8dfeb;
                    border-radius: 2px;
                    font-weight: 500;
                    font-size: 13px;
                    line-height: 28px;
                    text-align: center;

                    color: #697281;
                }
                .active {
                    border-color: #1e8ef5;
                    color: #1e8ef5;
                }
            }
        }

        .option {
            background: #ffffff;
            border-radius: 5px;
            span {
                margin: 0px 0px 0px 5px;
                font-weight: 500;
                font-size: 14px;
                line-height: 19px;
                color: #464c54;
            }
            .chaseStop {
                height: 30px;
                span {
                    margin: 0px 0px 0px 10px;
                    font-size: 13px;
                    line-height: 18px;
                }
            }
        }
        .chaseDetail {
            background: #ffffff;
            border-radius: 5px;
            .label {
                height: 45px;
                line-height: 45px;
                border-bottom: 1px solid #eceff5;
            }
            ul {
                padding: 0px 7px;
                li {
                    width: 100%;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #eceff5;
                    font-size: 14px;
                    line-height: 18px;
                    color: #464c54;
                    i {
                        width: 25%;
                        padding-left: 6px;
                        // text-align: center;
                        font-style: normal;
                        &:first-of-type {
                            width: 20%;
                        }
                        &:nth-of-type(2) {
                            width: 30%;
                            // overflow: hidden;
                            // text-overflow: ellipsis;
                            // white-space: nowrap;
                        }
                    }
                }
                .headline {
                    color: #929aa7;
                }
            }
        }
    }
    .footer {
        height: 50px;
        background: #fff;
        box-shadow: 0px -4px 8px 0px #0000000d;
        .total {
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;
            color: #484848;
            span {
                color: #ff7539;
            }
        }
        .van-button {
            height: 36px;
            font-weight: 500;
            font-size: 15px;
            line-height: 18px;
            text-align: center;
            color: #ffffff;
            background: linear-gradient(180deg, #ee2934 0%, #ff6565 100%);
            border-radius: 5px;
        }
    }
}

:deep(.betHistoryPopup) {
    .title {
        height: 45px;
        line-height: 45px;
        // font-weight: 500;
        font-size: 16px;
        color: #565f6c;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: #eff2f5;
        .active {
            font-weight: 500;
            color: #1e8ef5;
        }
        .border-line {
            height: 3px;
            width: 18px;
            background: #1e8ef5;
            border-radius: 10px 10px 0px 0px;
        }
    }
    .sub-tabs {
        height: 48px;
        font-size: 14px;
        background: #eff2f5;
        color: #697281;
        div {
            height: 26px;
            line-height: 26px;
            padding: 0px 10px;
        }
        .active {
            background: #1e8ef5;
            border-radius: 2px;
            color: #ffffff;
        }
    }
    .outLine {
        height: 480px;
        background: #eff2f5;
        .item {
            background: #ffffff;
            border-radius: 5px;
            .lotteryName {
                font-weight: 500;
                font-size: 15px;
                line-height: 18px;
                color: #464c54;
            }
            .status {
                height: 20px;
                padding: 0px 6px;
                font-weight: 500;
                font-size: 13px;
                line-height: 18px;
                color: #5e86c8;
                border: 1px solid #d8dfeb;
                border-radius: 3px;
            }
            .undraw {
                height: 20px;
                border: 1px solid #d8dfeb;
                border-radius: 3px;
                font-weight: 500;
                font-size: 13px;
                line-height: 18px;
                color: #929aa7;
            }
            .lotteryNum {
                font-size: 13px;
                line-height: 18px;
                color: #464c54;
            }
            .openTime {
                font-size: 13px;
                line-height: 18px;
                color: #929aa7;
                .count-down {
                    color: #ff7a00;
                }
            }
            .label {
                font-size: 12px;
                line-height: 18px;
                color: #464c54;
            }
            .text {
                font-family: 'WeChat Sans Std';
                font-style: normal;
                font-weight: 700;
                font-size: 16px;
                line-height: 18px;
                color: #464c54;
            }
            .netAmount {
                color: #ff9d0b;
            }
            .amount {
                border-top: 1px solid #eceff5;
            }
            .detail {
                height: 30px;
                padding: 0px 15px;
                background: #ffffff;
                border: 1px solid #d8dfeb;
                border-radius: 5px;
                font-weight: 500;
                font-size: 14px;
                line-height: 30px;
                text-align: center;
                color: #60697a;
            }
            .semicircle-left-top {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: #eff2f5;
                left: -17px;
                top: -5px;
                border-radius: 5px;
            }
            .semicircle-right-top {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: #eff2f5;
                right: -17px;
                top: -5px;
                border-radius: 5px;
            }
        }
    }
    .footer {
        height: 50px;
        background: #fff;
        font-size: 15px;
        color: #1e8ef5;
    }
}

:deep(.lotteryIntroductionPopup) {
    width: 80%;
    padding: 15px;
    background: #ffffff;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    .title {
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #2f3944;
    }
    .outLine {
        font-size: 13px;
        line-height: 20px;
        color: #565e6a;
    }
}

.betArea {
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    z-index: 100;
    box-shadow: 0px -4px 8px 0px #0000000d;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    transition: height 0.2s ease-in;
}

.close {
    height: 0;
    bottom: 0;
}

.open {
    height: 108px;
    bottom: 0;
    z-index: 10000;
}

.chase {
    :deep(.van-overlay) {
        height: 80%;
    }
}

.betHistory {
    :deep(.van-overlay) {
        height: 80%;
    }
}

.cart {
    :deep(.van-overlay) {
        height: 80%;
    }
}

:deep(.van-grid-item__content) {
    padding: 2px;
}
</style>
