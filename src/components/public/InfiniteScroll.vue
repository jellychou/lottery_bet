<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';

const props = defineProps({
    onVisible: Function,
    rootMargin: {
        type: String,
        default: '0px'
    },
    threshold: {
        type: Number,
        default: 0.1
    }
});

const observerRef = ref(null);

const handleIntersect = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            props.onVisible();
        }
    });
};

const observeVisibility = () => {
    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                props.onVisible();
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: props.rootMargin,
        threshold: props.threshold
    });

    if (observerRef.value) {
        observer.observe(observerRef.value);
    }

    // 清理函数
    onUnmounted(() => {
        if (observerRef.value) {
            observer.unobserve(observerRef.value);
        }
    });
};

onMounted(() => {
    observeVisibility();
});
</script>

<template>
    <div ref="observerRef">
        <slot></slot>
    </div>
</template>
