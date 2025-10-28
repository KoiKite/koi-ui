<template>
  <!-- 分栏布局 -->
  <el-container class="layout-container">
    <div class="layout-column">
      <el-scrollbar>
        <div
          v-for="(item, index) in topLevelMenus"
          :key="item.meta?.menuId || index"
          class="left-column"
          :class="{
            'is-active': activeTopMenuId == item.meta?.menuId
          }"
          @click="handleTopMenuClick(item)"
        >
          <KoiGlobalIcon v-if="item.meta?.icon" :name="item.meta?.icon" size="18"></KoiGlobalIcon>
          <el-tooltip :content="getMenuLanguage(item.meta?.title)" :show-after="1500" placement="top">
            <span class="title line-clamp-2">{{ getMenuLanguage(item.meta?.title) }}</span>
          </el-tooltip>
        </div>
      </el-scrollbar>
    </div>
    <el-aside
      class="layout-aside transition-all"
      :style="{ width: !globalStore.isCollapse ? globalStore.menuWidth + 'px' : settings.columnMenuCollapseWidth }"
      v-if="currentSubMenuTree.length > 0"
    >
      <Logo :isCollapse="globalStore.isCollapse" :layout="globalStore.layout"></Logo>
      <el-scrollbar class="layout-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="globalStore.isCollapse"
          :collapse-transition="false"
          :uniqueOpened="globalStore.uniqueOpened"
          :router="false"
          :class="menuAnimate"
        >
          <ColumnSubMenu :menuList="currentSubMenuTree"></ColumnSubMenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <Header></Header>
      </el-header>
      <!-- 路由页面 -->
      <Main></Main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import settings from "@/settings.ts";
import Logo from "@/layouts/components/Logo/index.vue";
import Header from "@/layouts/components/Header/index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import { getMenuLanguage } from "@/utils/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import { HOME_URL } from "@/config/index.ts";
import { koiMsgError } from "@/utils/koi";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);

// 获取所有顶级菜单[第一层级]
const topLevelMenus = computed(() => authStore.showMenuList.filter((item: any) => item.meta?.isVisible == "1"));

// 当前激活的顶级菜单ID
const activeTopMenuId = ref<any>();
// 当前显示的子菜单树[包含所有层级]
const currentSubMenuTree = ref<any[]>([]);
// 当前激活的子菜单路径
const activeMenu = computed(() => (route.meta?.activeMenu ? route.meta?.activeMenu : route.path) as string);

/** 递归检查菜单项是否匹配 */
const containsActiveMenu = (menu: any, activeMenu: string): boolean => {
  // 检查当前菜单是否匹配
  if (menu.path == String(activeMenu)) {
    return true;
  }

  // 递归检查子菜单
  if (menu.children && menu.children.length > 0) {
    for (const child of menu.children) {
      if (containsActiveMenu(child, activeMenu)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * @description 查找最顶级菜单对象
 * @param routes 菜单递归数据
 * @param activeMenu 选中路由 或 menuId
 */
const findMenuByActiveMenu = (routes: any[], activeMenu: any) => {
  // 遍历所有顶级菜单
  for (const route of routes) {
    // 检查当前顶级菜单是否匹配
    if (route.path == String(activeMenu)) {
      return route;
    }

    // 检查子菜单是否包含匹配项
    if (route.children && route.children.length > 0) {
      if (containsActiveMenu(route, activeMenu)) {
        return route;
      }
    }
  }

  return null; // 未找到匹配项
};

/**
 * @description 根据 menuId 查找顶级父菜单（排除自身）
 * @param routes 菜单数据[无限层级结构]
 * @param menuId 要查找的菜单 ID
 * @returns 顶级父菜单对象，未找到或目标菜单是顶级菜单时返回 null
 */
const findTopMenuByMenuId = (routes: any[], targetMenuId: any): any => {
  // 转换目标菜单ID为字符串
  const targetId = String(targetMenuId);

  // 创建菜单ID到菜单对象的映射
  const menuMap = new Map();

  // 递归构建菜单映射并添加父菜单关系
  const buildMenuMap = (menuList: any, parentId?: any) => {
    for (const menu of menuList) {
      if (menu.meta?.menuId) {
        const menuId = String(menu.meta.menuId);

        // 添加父菜单关系
        menu.parentId = parentId;
        menuMap.set(menuId, menu);
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        const currentParentId = menu.meta?.menuId ? String(menu.meta.menuId) : parentId;
        buildMenuMap(menu.children, currentParentId);
      }
    }
  };

  // 构建映射
  buildMenuMap(routes);

  // 检查菜单是否存在
  if (!menuMap.has(targetId)) {
    return null;
  }

  // 查找顶层菜单的递归函数
  const findTopMenu: any = (menuId: any) => {
    const menu = menuMap.get(menuId);

    // 如果菜单没有父菜单或自身就是顶级菜单，返回null
    if (!menu.parentId) {
      return null;
    }

    // 递归查找父菜单的顶层菜单
    const parentTopMenu = findTopMenu(menu.parentId);

    return parentTopMenu || menuMap.get(menu.parentId);
  };

  // 查找目标菜单的顶层菜单
  return findTopMenu(targetId);
};

/**
 * 根据顶级菜单ID获取其完整的子菜单树
 * @param {number|string} topMenuId 顶级菜单ID
 * @returns {Array} 完整的子菜单树
 */
const getSubMenuTree = (topMenuId: number | string) => {
  const topMenu = topLevelMenus.value.find((item: any) => item.meta.menuId === topMenuId);
  return topMenu?.children || [];
};

/**
 * 点击顶级菜单处理
 * @param {Object} item 菜单项
 */
const handleTopMenuClick = (route: any) => {
  if (route.meta?.linkUrl) {
    if (/^https?:\/\//.test(route.meta?.linkUrl)) {
      return window.open(route.meta.linkUrl, "_blank");
    } else {
      koiMsgError("错误链接地址，禁止跳转");
      return;
    }
  }
    
  if (!route?.children) {
    // 更新当前激活的顶级菜单
    activeTopMenuId.value = route.meta?.menuId;
    currentSubMenuTree.value = [];
    router.push({
      path: route.path || HOME_URL
    });
    return;
  }

  // 更新当前激活的顶级菜单
  activeTopMenuId.value = route.meta?.menuId;

  // 获取该顶级菜单的子菜单树
  currentSubMenuTree.value = getSubMenuTree(route.meta?.menuId);
};

/**
 * 初始化菜单状态
 */
const initMenu = () => {
  if (!topLevelMenus.value.length) return;

  const { menuId, activeMenu } = route.meta || {};

  // 情况一：没有提供 menuId 或 activeMenu，默认选第一个顶级菜单
  if (!menuId && !activeMenu) {
    activeTopMenuId.value = topLevelMenus.value[0];
    return;
  }

  // 情况二：menuId 存在，activeMenu 不存在
  if (menuId && !activeMenu) {
    const topLevelMenu: any = findTopMenuByMenuId(authStore.showMenuList, String(menuId));

    if (!topLevelMenu) {
      // 未找到父级，说明是顶级菜单，直接赋值
      activeTopMenuId.value = menuId;
      currentSubMenuTree.value = [];
    } else {
      // 找到父级，设置为激活项，并加载子菜单
      activeTopMenuId.value = topLevelMenu.meta?.menuId;
      currentSubMenuTree.value = getSubMenuTree(activeTopMenuId.value);
    }

    router.push(route.path); // 同步路径
    return;
  }

  // 情况三：activeMenu 存在通过 activeMenu 查找父级菜单
  if (activeMenu) {
    const topLevelMenu: any = findMenuByActiveMenu(authStore.showMenuList, activeMenu);

    if (topLevelMenu) {
      activeTopMenuId.value = topLevelMenu.meta?.menuId;
      currentSubMenuTree.value = getSubMenuTree(activeTopMenuId.value);
      router.push(route.path);
    } else {
      koiMsgError("The menu data configuration is error");
    }
  }
};

onMounted(() => {
  initMenu();
});

// 监听路由变化
watch(
  () => route,
  () => {
    initMenu();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
/** 第一列菜单样式 */
.layout-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
  background-color: var(--el-menu-bg-color);
  border-right: 1px solid var(--el-aside-border-right-color);

  .left-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    min-height: 60px;
    margin: 4px;
    color: var(--el-menu-text-color);
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: all 0.3s ease;

    &:hover {
      color: var(--el-menu-hover-text-color);
      background: var(--el-menu-hover-bg-color);
    }

    &.is-active {
      color: var(--el-menu-active-text-color);
      background: var(--el-menu-active-bg-color);
      border: 1px dashed var(--el-menu-border-left-color);
    }

    .el-icon {
      font-size: 18px;
    }

    .title {
      margin-top: 8px;
      font-size: 12px;
      font-weight: $aside-menu-font-weight;
      line-height: 14px;
      text-align: center;
      letter-spacing: 1px;
    }
  }
}

.layout-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .layout-aside {
    padding-right: $column-menu-padding-right;
    padding-left: $column-menu-padding-left;
    background-color: var(--el-menu-bg-color);
    border-right: 1px solid var(--el-aside-border-right-color);
  }

  .layout-header {
    height: $aside-header-height;
    background-color: var(--el-header-bg-color);
  }

  .layout-main {
    box-sizing: border-box;
    padding: 0;
    overflow-x: hidden;
    background-color: var(--el-bg-color);
  }
}

.layout-scrollbar {
  width: 100%;
  height: calc(100vh - $aside-header-height);
}

.el-menu {
  border-right: none;
}
</style>

<style lang="scss">
.el-menu--collapse {
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding)) !important;
}
</style>
