<template>
  <!-- 刷新 -->
  <div
    class="hover:bg-[rgba(0,0,0,0.06)] hover:dark-bg-[rgba(255,255,255,0.1)] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-rotate-i"
    @click="handleRefresh"
  >
    <el-tooltip :content="$t('header.refreshCache')">
      <KoiGlobalIcon name="koi-refresh-arrow" size="18" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { koiMsgSuccess } from "@/utils/koi.ts";
import { LOGIN_URL } from "@/config";
import { koiSessionStorage, koiLocalStorage } from "@/utils/storage.ts";

/** 刷新路由 */
const handleRefresh = () => {
  koiSessionStorage.clear();
  koiLocalStorage.clear();
  koiMsgSuccess("刷新本地缓存成功");
  // 必须使用这个把页面缓存刷掉
  window.location.replace(LOGIN_URL);
};
</script>

<style lang="scss" scoped></style>
