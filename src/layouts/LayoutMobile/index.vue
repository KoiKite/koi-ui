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
      <Logo layout="mobile"></Logo>
      <el-scrollbar class="mobile-drawer-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse-transition="false"
          :uniqueOpened="globalStore.uniqueOpened"
          :router="false"
          :class="menuAnimate"
        >
          <ColumnSubMenu :menuList="menuList"></ColumnSubMenu>
        </el-menu>
      </el-scrollbar>
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
  background-color: var(--el-menu-bg-color);
}

.mobile-drawer-scrollbar {
  flex: 1;
  min-height: 0;
  width: 100%;
}

/** 去除菜单右侧边框 */
.el-menu {
  border-right: none;
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
  /* 左、右、下 6px，顶贴边（与无标题栏一致） */
  padding: 0 6px 6px !important;
  overflow: hidden;
}
</style>
