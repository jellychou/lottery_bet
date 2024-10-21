<template>
    <div>
        <van-popup :show="allRadioPopupShow" position="right" class="all-radio-popup" overlay-class="all-radio-overlay" @click-overlay="$emit('update:allRadioPopupShow', false)">
            <div class="wrapper grid grid-cols-3 content-start gap-x-1 gap-y-2.5 p-3">
                <div
                    class="item"
                    :class="{ active: i == rodioIndex }"
                    v-for="(it, i) in rD.rodio"
                    :key="i"
                    @click="
                        $emit('update:allRadioPopupShow', false);
                        $emit('update:rodioIndex', i);
                    "
                >
                    {{ t(it.name) }}
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
export default {
    name: 'AllRadioPopup'
};
</script>

<script setup>
import { getCurrentInstance, onMounted, provide, ref, nextTick, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { showSuccessToast, showFailToast } from 'vant';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    allRadioPopupShow: Boolean,
    rodioIndex: [Number, String],
    rD: [Array, Object]
});

const { t } = useI18n();
const emit = defineEmits(['update:allRadioPopupShow', 'update:rodioIndex']);

const a = () => emit('update:allRadioPopupShow', false);

// const allRadioPopupShow = ref(false);

defineExpose({
    // allRadioPopupShow
});
</script>
<style lang="scss" scoped>
:deep(.all-radio-overlay) {
    position: absolute;
}

:deep(.all-radio-popup) {
    position: absolute;
    height: 100%;
    .wrapper {
        height: 100%;
        .item {
            width: 82px;
            height: 33px;
            background: #ffffff;
            border: 0.5px solid rgba(60, 93, 157, 0.2);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
            font-weight: 500;
            font-size: 13px;
            line-height: 33px;
            text-align: center;
            color: #484848;
        }
        .active {
            background: #1e8ef5;
            color: #ffffff;
        }
    }
}
</style>
