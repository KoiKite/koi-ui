<template>
  <el-container class="layout-container">
    <el-header class="layout-header flex flex-items-center flex-justify-between">
      <div class="w-30px flex flex-items-center">
        <KoiSvgIcon name="koi-mobile-menu" width="22" height="22" @click="mobileDrawer = true"></KoiSvgIcon>
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
  <KoiMobileDrawer style="width: 220px" v-model="mobileDrawer" placement="left">
    <div class="transition-all mobile-drawer">
      <Logo layout="mobile"></Logo>
      <el-scrollbar class="layout-scrollbar">
        <!-- :unique-opened="true" 子菜单不能同时展开 -->
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
  </KoiMobileDrawer>
</template>

<script setup lang="ts">
import settings from "@/settings.ts";
import KoiMobileDrawer from "@/components/KoiMobileDrawer/Index.vue";
import User from "@/layouts/components/Header/components/User.vue";
import Dark from "@/layouts/components/Header/components/Dark.vue";
import Logo from "@/layouts/components/Logo/index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);
const menuList = computed(() => authStore.showMenuList);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
const mobileDrawer = ref(false);
</script>

<style lang="scss" scoped>
.mobile-drawer {
  background-color: var(--el-menu-bg-color);
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
.layout-scrollbar {
  width: 100%;
  height: calc(100vh - $aside-header-height);
}
</style>
