<template>
  <!-- 刷新 -->
  <div
    class="hover:bg-[--el-header-toolbar-icon-hover-bg-color] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-rotate-i"
    @click="handleRefresh"
  >
    <el-tooltip :content="$t('header.refreshCache')">
      <KoiGlobalIcon name="koi-refresh-arrow" size="18" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { koiSessionStorage } from "@/utils/storage.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
/** 刷新路由 */
const handleRefresh = () => {
  // 清除 sessionStorage
  koiSessionStorage.clear();
  // 清除 global store 数据[重置为初始状态]
  globalStore.$reset();
  window.location.reload();
};
</script>

<style lang="scss" scoped></style>
