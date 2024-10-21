<template>
    <div class="bg h-full">
        <Header title="设置" />

        <div class="wrapper mx-2.5 mt-2 pl-2 pr-3">
            <div class="item pl-2">
                <div>中奖弹框提示</div>
                <van-switch v-model="winningDialogs" @change="changeSwitch()" />
            </div>
            <div class="item">
                <div>【冷热】说明在点击时提示</div>
                <van-switch v-model="coldHotDesc" @change="changeSwitch()" />
            </div>
            <div class="item">
                <div>【遗漏】说明在点击时提示</div>
                <van-switch v-model="omitDesc" @change="changeSwitch()" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Settings'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import { setSetings, getLotterySetByMemberId } from '@/api/interface';

const commonStore = useCommonStore();
const memberInfo = computed(() => commonStore.memberSettings);

const winningDialogs = ref(memberInfo.value?.winningDialogs ? true : false);
const coldHotDesc = ref(memberInfo.value?.coldHotDesc ? true : false);
const omitDesc = ref(memberInfo.value?.omitDesc ? true : false);
const changeSwitch = type => {
    const params = {
        winningDialogs: winningDialogs.value ? 1 : 0,
        coldHotDesc: coldHotDesc.value ? 1 : 0,
        omitDesc: omitDesc.value ? 1 : 0
    };
    setSetings(params).then(res => {
        getMemberInfo();
        showToast('操作成功');
    });
};

const getMemberInfo = () => {
    getLotterySetByMemberId({}).then(res => {
        if (res === undefined) {
            return;
        } else {
            commonStore.setMemberSettings(res);
        }
    });
};
</script>
<style lang="scss" scoped>
.bg {
    background: #eff2f5;
    .wrapper {
        background: #fff;
        border-radius: 5px;
        .item {
            height: 45px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            line-height: 45px;
            color: #60697a;
            border-bottom: 1px solid #eceff5;
            &:last-child {
                border-bottom: none;
            }
            :deep(.van-switch) {
                height: 20px;
                width: 37px;
                background: #eceff5;

                border-radius: 4px;
                border-radius: 2px;
                .van-switch__node {
                    top: 1.5px;
                    left: 1.5px;
                    width: 17px;
                    height: 17px;
                    background: #ffffff;
                    box-shadow: 0px 2.41758px 7.25275px rgba(0, 0, 0, 0.1);
                    border-radius: 2px;
                }
            }
            :deep(.van-switch--on) {
                background: #1e8ef5;
                .van-switch__node {
                    transform: translate(calc(var(--van-switch-width) - var(--van-switch-node-size) - 8px));
                }
            }
        }
    }
}
</style>
