<template>
  <div class="header-box">
    <div class="header-left">
      <!-- 左侧菜单展开和折叠图标 -->
      <Collapse></Collapse>
      <!-- 面包屑 -->
      <BreadCrumb class="<md:hidden"></BreadCrumb>
    </div>
    <!-- 工具栏 -->
    <Toolbar></Toolbar>
  </div>
</template>

<script setup lang="ts">
import Collapse from "@/layouts/components/Header/components/Collapse.vue";
import BreadCrumb from "@/layouts/components/Header/components/BreadCrumb.vue";
import Toolbar from "@/layouts/components/Header/components/Toolbar.vue";
</script>

<style lang="scss" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  height: $aside-header-height;
  .header-left {
    display: flex;
    align-items: center;
    overflow: hidden; /* 保留hidden防止内容溢出 */
    white-space: nowrap;
    flex: 1; /* 允许左侧区域伸缩 */
    min-width: 0; /* 重要：允许内容溢出 */
  }
}
</style>
