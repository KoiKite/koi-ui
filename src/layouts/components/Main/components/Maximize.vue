<template>
  <div class="maximize" @click="handleExitMaximize">
    <el-icon :size="22" class="exit-icon"><Close /></el-icon>
  </div>
</template>

<script setup lang="ts">
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();

const handleExitMaximize = () => {
  globalStore.setGlobalState("maximize", false);
};
</script>

<style lang="scss" scoped>
.maximize {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    transform: translateY(-2px);
    .exit-icon {
      color: var(--el-color-primary);
      transform: scale(1.1);
    }
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.15);
  }
  .exit-icon {
    color: var(--el-text-color-regular);
    transition: all 0.3s ease;
  }
}
</style>
