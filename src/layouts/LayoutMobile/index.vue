<template>
  <el-container class="layout-container">
    <el-header class="layout-header flex flex-items-center flex-justify-between">
      <div class="w-30px flex flex-items-center">
        <KoiSvgIcon name="koi-mobile-menu" width="22" height="22" @click="handleOpenMobileMenu"></KoiSvgIcon>
      </div>
      <div class="flex flex-items-center h-100%">
        <!-- 明亮/暗黑模式图标 -->
        <Dark></Dark>
        <!-- 头像 AND 下拉折叠 -->
        <User></User>
      </div>
    </el-header>
    <!-- 路由页面 -->
    <Main></Main>
  </el-container>

  <!-- 左侧抽屉菜单 -->
  <el-drawer
    v-model="mobileDrawerVisible"
    class="layout-mobile-drawer"
    direction="ltr"
    size="230"
    :with-header="false"
    :close-on-click-modal="true"
  >
    <div class="mobile-drawer-inner">
      <div class="mobile-drawer-logo">
        <Logo layout="mobile"></Logo>
      </div>
      <div class="mobile-drawer-menu-scroller">
        <div class="mobile-drawer-menu-pad">
          <el-menu
            :default-active="activeMenu"
            :collapse-transition="false"
            :uniqueOpened="globalStore.uniqueOpened"
            :router="false"
            :class="menuAnimate"
          >
            <ColumnSubMenu :menuList="menuList"></ColumnSubMenu>
          </el-menu>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import settings from "@/settings.ts";
import User from "@/layouts/components/Header/components/User.vue";
import Dark from "@/layouts/components/Header/components/Dark.vue";
import Logo from "@/layouts/components/Logo/index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

const mobileDrawerVisible = ref(false);

const handleOpenMobileMenu = () => {
  mobileDrawerVisible.value = true;
};

/** 路由切换后收起抽屉，避免遮挡新页面 */
watch(
  () => route.fullPath,
  () => {
    mobileDrawerVisible.value = false;
  }
);

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);
const menuList = computed(() => authStore.showMenuList);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>

<style lang="scss" scoped>
.mobile-drawer-inner {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-height: 0;
  padding-left: $aside-menu-padding-left;
  background-color: var(--el-menu-bg-color);
}

.mobile-drawer-logo {
  flex-shrink: 0;
  box-sizing: border-box;
}

.mobile-drawer-menu-scroller {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -ms-scroll-chaining: none;
}

.mobile-drawer-menu-pad {
  padding-right: $aside-menu-padding-right;
  box-sizing: border-box;
}

.mobile-drawer-inner :deep(.el-menu) {
  height: auto;
  min-height: 0;
  max-height: none;
  border-right: none;
  box-sizing: border-box;
}

/* 若抽屉菜单日后开启 collapse，与纵向布局一致避免窄宽度裁掉右侧留白 */
.mobile-drawer-inner :deep(.el-menu.el-menu--collapse) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
.layout-container {
  width: 100vw;
  height: 100vh;
  .layout-header {
    height: $aside-header-height;
    overflow: hidden;
    background-color: var(--el-header-bg-color);
  }
}
</style>

<!-- 抽屉 teleport 到 body，scoped 无法命中；且 .layout-mobile-drawer 与 .el-drawer 在同一节点，不能用后代选择器 -->
<style lang="scss">
.layout-mobile-drawer.el-drawer {
  --el-drawer-padding-primary: 0px;
}

.layout-mobile-drawer.el-drawer .el-drawer__body {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  margin: 0 !important;
  /* 顶贴边；底部留 6px。左右间距由内部容器控制，避免与 menu-pad 叠加导致不对称 */
  padding: 0 0 6px !important;
  overflow: hidden;
}
</style>
