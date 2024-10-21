<template>
    <div class="play-sidebar">
        <van-sidebar v-model="active" @change="onChange">
            <van-sidebar-item v-for="(item, i) in plays" :key="item.code">
                <template #title>
                    <div class="title flex items-center">
                        <div class="line" v-if="active == i" />
                        <div class="ml-1">{{ $t(item.label) }}</div>
                    </div>
                </template>
            </van-sidebar-item>
        </van-sidebar>
    </div>
    <div class="holder"></div>
</template>

<script>
export default {
    name: 'PlaySidebar'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast } from 'vant';
import useCommonStore from '@/store/modules/common';
import allPlays from '@/data/allPlays'; // 所有大彩种玩法数据

const { t } = useI18n();
const route = useRoute();
const commonStore = useCommonStore();
const currentLottery = computed(() => commonStore.currentLottery);
const plays = computed(() => allPlays[currentLottery.value.parentCode] || [{}]);

const active = ref(0);
commonStore.play = plays.value[0].value;
const onChange = i => {
    commonStore.play = plays.value[i].value;
};
</script>
<style lang="scss" scoped>
.holder {
    width: 80px;
    height: calc(100dvh - 336px);
}
.play-sidebar {
    width: 82px;
    height: calc(100dvh - 336px);
    overflow-y: auto;
    background: #eff2f5;
    position: fixed;
    :deep(.van-sidebar) {
        padding: 5px 0px;
        width: 82px;
        .van-sidebar-item {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0px 0px 0px 0px;
            margin-left: 6px;
            background: #eff2f5;
            overflow: unset;
        }
        .van-sidebar-item__text {
            font-size: 13px;
            color: #576170;
        }
        .van-sidebar-item--select {
            position: relative;
            padding: 0px;
            background: linear-gradient(90deg, #ffffff -1.98%, #ffffff 100%);
            border-radius: 10px 0px 0px 10px;
            .van-sidebar-item__text {
                position: relative;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: 600;
                color: #484848;
                .line {
                    position: absolute;
                    left: 0px;
                    top: 16px;
                    width: 3px;
                    height: 18px;
                    background: #1e8ef5;
                    border-radius: 0px 4px 4px 0px;
                }
            }

            .van-sidebar-item__text:before,
            .van-sidebar-item__text:after {
                display: block;
                position: absolute;
                z-index: 99;
                content: '';
                width: 10px;
                height: 10px;
                border-radius: 100%;
                background-color: #eff2f5;
                right: 0px;
                z-index: 3;
            }
            .van-sidebar-item__text:before {
                top: -10px;
            }
            .van-sidebar-item__text:after {
                bottom: -10px;
            }
        }
        // .van-sidebar-item--select:before {
        //     content: unset;
        // }
        .van-sidebar-item--select:before,
        .van-sidebar-item--select:after {
            display: block;
            position: absolute;
            content: '';
            width: 5px;
            height: 5px;
            background-color: #fff;
            right: 0px;
            z-index: 2;
            left: unset;
            transform: unset;
        }

        .van-sidebar-item--select:before {
            top: -5px;
        }

        .van-sidebar-item--select:after {
            bottom: -5px;
        }
    }
}
</style>
