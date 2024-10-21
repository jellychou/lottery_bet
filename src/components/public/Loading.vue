<template>
    <div class="flex flex-col justify-center items-center loader">
        <van-loading class="wrapper" type="spinner" />
        <div class="text-xs mt-2 loadingText">加载中</div>
    </div>
</template>

<script>
export default {
    name: 'Loading'
};
</script>
<style lang="scss" scoped>
.loader {
    height: calc(100dvh - 186px);
    .loadingText {
        color: #929aa7;
    }
}
</style>
