<template>
    <div>
        <img :src="favorite ? collected : collect1 ? collect1 : collect" @click.stop="favorite ? onCancel() : onAdd()" />
    </div>
</template>

<script>
export default {
    name: 'Collect'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive, computed, defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showSuccessToast, showFailToast, showToast } from 'vant';
import { session } from '@/util/storage';
import useCommonStore from '@/store/modules/common';
import collect from './assets/collect.png';
import collect1 from './assets/collect1.png';
import collected from './assets/collected.png';
import { gameCollectAdd, gameCollectCancel } from '@/api/interface';

const props = defineProps({
    parentCode: String, //大类code
    code: String, //小类code
    favorite: Boolean, // 是否收藏判断
    callback: Function, // 回调
    collect1: Boolean // 首页的未收藏图片颜色淡一点
});

const emit = defineEmits(['update:collect']);

const { t } = useI18n();
const router = useRouter();

const commonStore = useCommonStore();
const microProps = session.get('microProps');

const onAdd = () => {
    emit('update:collect', true);
    gameCollectAdd({ gameType: 'L-GAME', channelCode: 'lott', gameCode: `${props.parentCode}/${props.code}` })
        .then(res => {
            showToast('收藏成功');
            commonStore.initLottery(microProps);
            props?.callback?.();
        })
        .catch(() => {
            emit('update:collect', false);
        });
};

const onCancel = () => {
    emit('update:collect', false);
    gameCollectCancel({ gameType: 'L-GAME', channelCode: 'lott', gameCode: `${props.parentCode}/${props.code}` })
        .then(res => {
            showToast('取消收藏成功');
            commonStore.initLottery(microProps);
            props?.callback?.();
        })
        .catch(() => {
            emit('update:collect', true);
        });
};
</script>
<style scoped></style>
