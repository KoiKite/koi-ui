<template>
  <div
    class="hover:bg-[rgba(0,0,0,0.06)] hover:dark-bg-[rgba(255,255,255,0.1)] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center"
    @click="handleToggleCollapse"
  >
    <el-icon :size="20">
      <KoiSvgIcon name="koi-left" width="20px" height="20px" v-if="!globalStore.isCollapse"></KoiSvgIcon>
      <KoiSvgIcon name="koi-right" width="20px" height="20px" v-if="globalStore.isCollapse"></KoiSvgIcon>
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();

/** 切换图标 */
const handleToggleCollapse = () => {
  // 定义图标切换变量[true-折叠 false-展开]
  globalStore.isCollapse = !globalStore.isCollapse;
};
</script>

<style lang="scss" scoped></style>
