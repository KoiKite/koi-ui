<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <Logo :layout="globalStore.layout"></Logo>
      <div class="menu-container">
        <div class="horizontal-menu-wrapper">
          <!-- 不能直接使用 HorizontalSubMenu 组件，因为菜单数据过多无法触发 el-menu 隐藏省略功能 -->
          <el-menu mode="horizontal" class="horizontal-menu" :default-active="activeMenu" :router="false">
            <!-- 有下级，用el-sub-menu，无下级用el-menu-item -->
            <template v-for="item in menuList" :key="item.path">
              <!-- 非叶子节点 v-show：true(显示)false(隐藏)，v-if反之。 -->
              <el-sub-menu v-if="item.children?.length" :index="item.path + 'el-sub-menu'" :key="item.path">
                <template #title>
                  <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
                  <span v-text="getMenuLanguage(item.meta.title)"></span>
                </template>
                <HorizontalSubMenu :menuList="item.children" />
              </el-sub-menu>
              <!-- 叶子节点[功能节点] -->
              <el-menu-item v-else :index="item.path" :key="item.path + 'el-menu-item'" @click="handleMenuRouter(item)">
                <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
                <template #title>
                  <span v-text="getMenuLanguage(item.meta.title)"></span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
      <Toolbar></Toolbar>
    </el-header>
    <!-- 路由页面 -->
    <Main></Main>
  </el-container>
</template>

<script setup lang="ts">
import { koiMsgWarning } from "@/utils/koi.ts";
import Logo from "@/layouts/components/Logo/index.vue";
import Toolbar from "@/layouts/components/Header/components/Toolbar.vue";
import HorizontalSubMenu from "@/layouts/components/Menu/HorizontalSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import { getMenuLanguage } from "@/utils/index.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

console.log("横向布局左侧动态路由", authStore.showMenuList);
const menuList = computed(() => authStore.showMenuList);

/* 打开标签页 或 外部链接 */
const handleMenuRouter = (value: any) => {
  if (value.meta?.linkUrl) {
    if (/^https?:\/\//.test(value.meta?.linkUrl)) {
      return window.open(value.meta.linkUrl, "_blank");
    } else {
      koiMsgWarning("非正确链接地址，禁止跳转");
      return;
    }
  }
  router.push(value.path);
};
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;

  .layout-header {
    box-sizing: border-box;
    padding: 0 20px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $aside-header-height;
    overflow: hidden;
    background-color: var(--el-header-bg-color);

    .el-menu {
      flex: 1;
      height: 100%;
      overflow: hidden;
      border-bottom: none;
    }
  }
}

.menu-container {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.horizontal-menu-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.horizontal-menu {
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 100%;
}
</style>