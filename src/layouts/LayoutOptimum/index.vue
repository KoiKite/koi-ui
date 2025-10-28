<template>
  <!-- 混合布局 -->
  <el-container class="layout-container">
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
        <div class="koi-header">
          <div class="header-left" :style="{ paddingRight: toolbarWidth + 16 + 'px' }">
            <!-- 左侧菜单展开和折叠图标 -->
            <Collapse></Collapse>
            <div class="layout-row m-l-12px">
              <el-scrollbar class="horizontal-scrollbar" ref="horizontalScrollbarRef">
                <div class="horizontal-menu">
                  <div
                    v-for="item in topLevelMenus"
                    :key="item.meta.menuId"
                    class="left-row line-clamp-1"
                    :class="{
                      'is-active': activeTopMenuId == item.meta?.menuId
                    }"
                    @click="handleTopMenuClick(item)"
                  >
                    <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
                    <el-tooltip :content="getMenuLanguage(item.meta?.title)" :show-after="1500" placement="right">
                      <span class="title" v-text="getMenuLanguage(item.meta?.title)"></span>
                    </el-tooltip>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <!-- 工具栏 -->
          <Toolbar @widthChange="handleToolbarWidthChange"></Toolbar>
        </div>
      </el-header>
      <!-- 路由页面 -->
      <Main></Main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import settings from "@/settings.ts";
import Logo from "@/layouts/components/Logo/index.vue";
import Collapse from "@/layouts/components/Header/components/Collapse.vue";
import Toolbar from "@/layouts/components/Header/components/Toolbar.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
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

// Toolbar 宽度
const toolbarWidth = ref(0);

// 处理 Toolbar 宽度变化
const handleToolbarWidthChange = (width: number) => {
  toolbarWidth.value = width;
};

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
  // 添加滚轮事件监听
  const scrollbarElement = horizontalScrollbarRef.value?.$el;
  if (scrollbarElement) {
    scrollbarElement.addEventListener("wheel", handleWheel);
  }
});

// 监听路由变化
watch(
  () => route,
  () => {
    initMenu();
  },
  { deep: true }
);

// 添加水平滚动条的引用
const horizontalScrollbarRef = ref<any>(null);

// 处理鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  if (!horizontalScrollbarRef.value) return;

  // 获取滚动容器元素
  const scrollbarWrap = horizontalScrollbarRef.value.$el.querySelector(".el-scrollbar__wrap");
  if (!scrollbarWrap) return;

  // 阻止默认的垂直滚动
  e.preventDefault();

  // 应用水平滚动[调整系数0.5控制滚动速度]
  scrollbarWrap.scrollLeft += (e.deltaY + e.deltaX) * 0.5;
};

// 移除事件监听
onBeforeUnmount(() => {
  const scrollbarElement = horizontalScrollbarRef.value?.$el;
  if (scrollbarElement) {
    scrollbarElement.removeEventListener("wheel", handleWheel);
  }
});
</script>

<style lang="scss" scoped>
.koi-header {
  position: relative; /* 为绝对定位的子元素提供参考 */
  display: flex;
  justify-content: space-between;
  height: $aside-header-height;

  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    overflow: hidden; /* 防止内容溢出 */
    white-space: nowrap;
    z-index: 1; /* 确保在 Toolbar 下方 */
    transition: padding-right 0.3s ease;
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
    background-color: var(--el-header-bg-color);
    border: 1px solid var(--el-header-toolbar-border-color); /* 添加边框 */
    border-radius: 20px; /* 圆角卡片效果 */
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%); /* 漂浮阴影效果 */
    transition: all 0.3s ease;
  }
}

.layout-row {
  display: flex;
  height: 100%;
  flex: 1;
  min-width: 0;
  user-select: none;
  background-color: var(--el-header-bg-color);
  padding-left: 10px;
  position: relative;
  overflow: hidden;

  /* 使用伪元素实现右边渐变遮罩效果 */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    z-index: 1;
  }

  /* 右侧遮罩 */
  &::after {
    right: 0;
    background: linear-gradient(270deg, var(--el-header-bg-color) 0%, var(--el-header-optimum-mark-color) 50%, transparent 100%);
  }

  /* 暗黑模式下的遮罩效果 */
  html.dark & {
    &::before {
      background: linear-gradient(90deg, var(--el-header-bg-color) 0%, var(--el-header-optimum-mark-color) 50%, transparent 100%);
    }

    &::after {
      background: linear-gradient(270deg, var(--el-header-bg-color) 0%, var(--el-header-optimum-mark-color) 50%, transparent 100%);
    }
  }
}

.horizontal-scrollbar {
  width: 100%;
  height: calc(100% - 4px);
  overflow: hidden;
  margin-top: 2px;

  :deep(.el-scrollbar__wrap) {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    white-space: nowrap;
    height: 100% !important;
    padding-bottom: 0 !important;

    .el-scrollbar__view {
      height: 100% !important;
    }
  }

  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      height: 8px;
      bottom: 2px;
    }

    &.is-vertical {
      display: none !important;
    }

    .el-scrollbar__thumb {
      background-color: rgba(144, 147, 153, 0.5);
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(144, 147, 153, 0.7);
      }
    }
  }
}

.horizontal-menu {
  display: inline-flex;
  height: 100%;
  min-width: 100%;
  user-select: none;
  box-sizing: border-box;
}

.left-row {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  max-width: 120px;
  height: 100%;
  padding: 6px 4px;
  margin: 0 2px;
  cursor: pointer;
  border: 1px solid transparent;
  color: var(--el-header-optimum-color);
  transition: all 0.3s ease;

  .title {
    margin-top: 8px;
    font-size: 12px;
    font-weight: $aside-menu-font-weight;
    line-height: 12px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    letter-spacing: 1px;
  }

  &:hover {
    color: var(--el-header-optimum-hover-color);
    background: var(--el-header-optimum-hover-bg-color);
    border: 1px dashed var(--el-header-optimum-border-color);
    border-radius: 4px;
  }

  &.is-active {
    color: var(--el-header-optimum-active-color);
    background: var(--el-header-optimum-active-bg-color);
    border: 1px dashed var(--el-header-optimum-border-color);
    border-radius: 4px;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
