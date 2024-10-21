<script setup>
import { computed, ref, onMounted, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['update:isOpenModal', 'update:confirmModal']);

const props = defineProps({
    title: String,
    content: String,
    confirmBtn: Boolean,
    closeBtn: Boolean,
    isOpenModal: Boolean
});

const closeModal = () => {
    emit('update:isOpenModal', false);
};

const confirmModal = () => {
    emit('update:confirmModal');
};
</script>

<template>
    <van-dialog :show="isOpenModal" class="popupShow" :title="title" @confirm="confirmModal">
        <div class="body">
            <div class="p-3 content" v-html="content"></div>
        </div>
    </van-dialog>
</template>

<style lang="scss" scoped>
.content {
    color: #60697a;
}
</style>
>
