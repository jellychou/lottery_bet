<script setup>
import { computed } from 'vue';
import useCommonStore from '@/store/modules/common';

const commonStore = useCommonStore();
const cartData = computed(() => commonStore.cartData);

const totalAmount = computed(() => {
    return cartData.value.reduce((previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue.amount);
    }, 0);
});
</script>

<template>
    <div class="car">
        <div class="pill px-4 py-1 flex">
            <div class="mr-1">
                <span>{{ cartData.length }}注</span>
            </div>
            <div>
                <span>{{ totalAmount }}元</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.car {
    position: fixed;
    right: 10px;
    bottom: 120px;
    .pill {
        background-color: #00000080;
        color: #fff;
        border-radius: 36px;
    }
}
</style>
