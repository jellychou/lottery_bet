<template>
        <van-pull-refresh
            :model-value="loading"
            @update:modelValue="$emit('update:loading', $event)"
            @refresh="$emit('refresh')"
        >
            <template v-if="!empty">
                <van-list
                    :loading="loading"
                    :finished="finished"
                    :finished-text="$t('record.finished')"
                    @update:loading="$emit('update:loading', $event)"
                    @load="$emit('load')"
                >
                    <slot />
                </van-list>
                
            </template>
    
            <van-empty description="暂无数据" />
        </van-pull-refresh>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue'
    
    defineProps({
        loading: {
            type: Boolean,
            required: true
        },
        finished: Boolean,
    })
    
    defineEmits([ 'update:loading', 'refresh', 'load' ])
</script>

<style scoped>

</style>
