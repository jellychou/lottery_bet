<script>
export default {
    name: 'lotterySelect'
};
</script>
<script setup>
import { ref, computed, onMounted } from 'vue';
import useCommonStore from '@/store/modules/common';
import { getQueryLotteryOdds } from '@/api/interface';
const showMenu = ref(false);
const { selectedTarget } = defineProps({
    selectedTarget: {
        type: Object,
        require: true
    }
});
const emit = defineEmits(['update:selectedTarget', 'update:isDrawerOpen']);

const lotteryPlay = ref([]);

const commonStore = useCommonStore();
const lotteryList = computed(() => {
    return commonStore.lotteryList.filter(lottery => lottery.children.some(element => element.status === 1));
});

const onShowMenu = () => {
    showMenu.value = !showMenu.value;
};
const handleClick = item => {
    emit('update:isDrawerOpen', false);
    emit('update:selectedTarget', item);
};

const getData = () => {
    getQueryLotteryOdds({})
        .then(res => {
            // console.log(res);
        })
        .catch(error => {
            console.log(errors);
        });
};

const filterShow = code => {
    const notShowCodeArr = ['ssl', 'klc', 'klsf', 'hot'];
    const index = notShowCodeArr.findIndex(item => item === code);
    if (index === -1) {
        return true;
    } else {
        return false;
    }
};

onMounted(() => {
    getData();
});
</script>
<template>
    <div class="relative mb-3">
        <div class="px-3">
            <div class="disPlaySelected px-2" :onclick="onShowMenu">
                <span>{{ selectedTarget.label }}</span>
                <img src="./img/arrow.png" width="9" class="ml-1 imgTurn" :class="showMenu ? 'down' : 'up'" />
            </div>
        </div>
        <div v-if="showMenu" :class="{ mask: showMenu }" @click="showMenu && (showMenu = false)">
            <div class="selectedMenu">
                <div v-for="lottery in lotteryList" :key="lottery.code" class="mb-2">
                    <div v-if="filterShow(lottery.code)">
                        <span class="text-[#697281] text-sm">{{ lottery.label }}</span>
                        <div class="flex gap-2 flex-wrap mb-3 w-full">
                            <div class="btn" v-for="item in lottery.children" :key="item.code">
                                <van-button size="small" :class="{ active: selectedTarget.code === item.code, commonBtn: item.code !== selectedTarget }" plain @click="handleClick(item)">
                                    {{ item.label }}
                                </van-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.disPlaySelected {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid rgba(60, 93, 157, 0.2);
    background: #fff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    color: #484848;
    img {
        width: 12px;
        height: 12px;
    }

    .down {
        transition: all 0.3s;
        transform: rotate(-180deg);
    }
    .up {
        transition: all 0.3s;
    }
}
.mask {
    position: fixed;
    width: 100%;
    height: 2000px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10010;
    overflow: hidden;

    .selectedMenu {
        width: 100%;
        height: 470px;
        overflow-y: auto;
        background-color: #ffff;
        border-radius: 0 0 10px 10px;
        padding: 16px;

        .btn {
            width: 30%;
            border-radius: 6px;
        }
        .commonBtn {
            width: 100%;
            border: 1px solid #3c5d9d33;
            background: #fff;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
            color: #484848;
            font-size: 12px;
        }

        .active {
            width: 100%;
            background-color: #1e8ef5;
            color: #fff;
        }
    }
}
</style>
