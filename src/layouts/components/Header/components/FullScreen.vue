<template>
  <!-- 全屏 -->
  <div class="hover:bg-[--el-header-toolbar-icon-hover-bg-color] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-scale-i" @click="toggle">
    <el-tooltip :content="globalStore.isFullScreen === false ? $t('header.fullScreen') : $t('header.exitFullScreen')">
      <KoiGlobalIcon name="koi-maximize" size="18" v-if="!globalStore.isFullScreen" />
      <KoiGlobalIcon name="koi-close-circle" size="18" v-else />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
import { watch } from "vue";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
// @vueuse/core 处理是否全屏
const { isFullscreen, toggle } = useFullscreen();

watch(isFullscreen, () => {
  if (isFullscreen.value) {
    globalStore.setGlobalState("isFullScreen", true);
  } else {
    globalStore.setGlobalState("isFullScreen", false);
  }
});
</script>

<style lang="scss" scoped></style>
