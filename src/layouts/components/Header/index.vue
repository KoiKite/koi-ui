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
  position: relative; /* 为绝对定位的子元素提供参考 */
  display: flex;
  justify-content: space-between;
  height: $aside-header-height;

  .header-left {
    display: flex;
    flex: 1; /* 允许左侧区域伸缩 */
    align-items: center;
    min-width: 0; /* 重要：允许内容溢出 */
    overflow: hidden; /* 保留hidden防止内容溢出 */
    white-space: nowrap;
    z-index: 1; /* 确保在 Toolbar 下方 */
  }

  /* 让 Toolbar 覆盖在 header-left 上方 */
  :deep(.header-right) {
    position: absolute;
    top: 50%;
    right: 0px;
    z-index: 10; /* 确保在 header-left 上方 */
    height: 40px;
    transform: translateY(-50%);
    padding: 2px 12px;
    // background: var(--el-bg-color);
    background-color: var(--el-header-bg-color); /* 添加背景色确保覆盖效果 */
    border: 1px solid var(--el-header-toolbar-border-color); /* 添加边框 */
    border-radius: 20px; /* 圆角卡片效果 */
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%); /* 明亮模式阴影效果 */

    /* 黑夜模式阴影效果 */
    html.dark & {
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1); /* 白色阴影，在黑夜模式下更明显 */
    }
  }
}
</style>
