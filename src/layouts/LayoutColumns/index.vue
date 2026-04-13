<template>
  <!-- 分栏布局 -->
  <el-container class="layout-container">
    <div
      class="layout-column"
      :class="{ 'is-collapse': isFirstColumnCollapse }"
      :style="{ width: isFirstColumnCollapse ? '64px' : '80px' }"
    >
      <el-scrollbar class="column-scrollbar">
        <el-tooltip
          v-for="(item, index) in topLevelMenus"
          :key="item.meta?.menuId || index"
          :content="getMenuLanguage(item.meta?.title)"
          :show-after="isFirstColumnCollapse ? 0 : 1500"
          placement="right"
        >
          <div
            class="left-column"
            :class="{
              'is-active': activeTopMenuId == item.meta?.menuId
            }"
            @click="handleTopMenuClick(item)"
          >
            <KoiGlobalIcon v-if="item.meta?.icon" :name="item.meta?.icon" size="18"></KoiGlobalIcon>
            <span v-if="!isFirstColumnCollapse" class="title line-clamp-2">{{ getMenuLanguage(item.meta?.title) }}</span>
          </div>
        </el-tooltip>
      </el-scrollbar>
      <div class="column-footer-dock">
        <div class="column-footer-btn column-switch-btn" @click="toggleFirstColumn">
          <KoiGlobalIcon name="koi-arrow-left-right" size="20"></KoiGlobalIcon>
        </div>
        <el-popover
          placement="right-start"
          :width="240"
          trigger="hover"
          :show-arrow="false"
          :offset="8"
          popper-class="layout-column-user-popover"
          popper-style="border-radius: 10px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);"
        >
          <template #reference>
            <div class="column-footer-btn" role="button" tabindex="0">
              <!-- <el-image
                class="column-user-avatar"
                fit="cover"
                :src="authStore.loginUser?.avatar || 'https://pic4.zhimg.com/v2-702a23ebb518199355099df77a3cfe07_b.webp'"
              /> -->
              <el-image class="column-user-avatar" fit="cover" :src="avatar"></el-image>
            </div>
          </template>
          <div class="user-card-content">
            <div class="user-card-header">
              <!-- <el-image
                class="w-36px h-36px rounded-full select-none"
                :src="authStore.loginUser?.avatar || 'https://pic4.zhimg.com/v2-702a23ebb518199355099df77a3cfe07_b.webp'"
              /> -->
              <el-image class="w-36px h-36px rounded-full select-none" :src="avatar"></el-image>
              <div class="user-info">
                <!-- <div class="user-name">{{ authStore.loginUser?.userName || "无名" }}</div>
                <div class="user-phone">{{ authStore.loginUser?.phone || "暂无电话" }}</div> -->
                <div class="user-name">{{ userName || "无名" }}</div>
                <div class="user-phone">{{ userPhone || "暂无电话" }}</div>
              </div>
            </div>
            <div class="user-card-menu">
              <!-- v-if="authStore.buttonList.includes('system:personage:list') || authStore.buttonList.includes('*')" -->
              <div
                class="user-menu-item"
                @click="handleCommand('koiMine')"
              >
                <el-icon :size="15"><User /></el-icon>
                <span>{{ $t("header.personalCenter") }}</span>
              </div>
            </div>
            <div class="user-card-footer">
              <el-button icon="SwitchButton" plain @click="handleCommand('logout')">
                {{ $t("header.logout") }}
              </el-button>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <el-aside
      class="layout-aside layout-columns-second-aside transition-all"
      :style="{ width: !globalStore.isCollapse ? globalStore.menuWidth + 'px' : settings.columnMenuCollapseWidth }"
      v-if="currentSubMenuTree.length > 0"
    >
      <Logo :isCollapse="globalStore.isCollapse" :layout="globalStore.layout"></Logo>
      <div class="layout-columns-second-menu-scroller">
        <div class="layout-columns-second-menu-pad">
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
        </div>
      </div>
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
import { HOME_URL, LOGIN_URL } from "@/config/index.ts";
import { koiMsgError } from "@/utils/koi";
import { koiSessionStorage } from "@/utils/storage.ts";
import useUserStore from "@/stores/modules/user.ts";
import useTabsStore from "@/stores/modules/tabs.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import { User } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);
const isFirstColumnCollapse = computed(() => globalStore.isColumnFirstCollapse);

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
    
  if (!route?.children?.length) {
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

/** 第一列收缩切换 */
const toggleFirstColumn = () => {
  globalStore.setColumnFirstCollapse(!globalStore.isColumnFirstCollapse);
};

// 用户姓名
const userName = ref("于心");
// 手机号码
const userPhone = ref("18888888888");
// 用户头像
const avatar = ref("https://pic4.zhimg.com/v2-702a23ebb518199355099df77a3cfe07_1440w.webp");

/** 退出登录 */
const handleLayout = () => {
  // 清除 sessionStorage
  koiSessionStorage.clear();
  // 清除用户 token
  userStore.setToken("");
  // 清除 tabs 数据
  tabsStore.$reset();
  // 清除 keepAlive 缓存
  keepAliveStore.$reset();
  // 清除 auth store 数据[重置为初始状态]
  authStore.$reset();
  // 退出登录，必须使用replace把页面缓存刷掉。
  window.location.replace(LOGIN_URL);
};

// 下拉折叠
const handleCommand = (command: string | number) => {
  switch (command) {
    case "koiMine":
      router.push("/system/personage");
      break;
    case "logout":
      handleLayout();
      break;
  }
};

/**
 * 初始化菜单状态
 */
const initMenu = () => {
  if (!topLevelMenus.value.length) return;

  const { menuId, activeMenu } = route.meta || {};

  // 情况一：没有提供 menuId 或 activeMenu，默认选第一个顶级菜单
  if (!menuId && !activeMenu) {
    activeTopMenuId.value = topLevelMenus.value[0]?.meta?.menuId;
    currentSubMenuTree.value = getSubMenuTree(activeTopMenuId.value);
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
  flex-shrink: 0;
  transition: width 0.25s ease;
  user-select: none;
  background-color: var(--el-menu-bg-color);
  border-right: 1px solid var(--el-aside-border-right-color);
  position: relative;
  padding-bottom: 98px;
  box-sizing: border-box;

  .column-footer-dock {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }
  }

  .column-footer-btn {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;

    &:hover {
      color: var(--el-text-color-primary);
      background: var(--el-menu-hover-bg-color);
    }
  }

  .column-user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
  }

  .column-scrollbar {
    flex: 1;
    min-height: 0;
  }

  :deep(.el-scrollbar__bar.is-vertical) {
    width: 4px;
    right: 2px;
  }

  :deep(.el-scrollbar__bar.is-vertical .el-scrollbar__thumb) {
    background: color-mix(in srgb, var(--el-text-color-secondary) 30%, transparent);
    border-radius: 999px;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    min-height: 56px;
    margin: 4px 6px;
    padding: 4px 6px;
    color: var(--el-menu-text-color);
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      color: var(--el-menu-hover-text-color);
      background: var(--el-menu-hover-bg-color);
    }

    &.is-active {
      color: var(--el-menu-active-text-color);
      background: var(--el-menu-active-bg-color);
    }

    .el-icon {
      font-size: 18px;
    }

    .title {
      margin-top: 6px;
      font-size: 12px;
      font-weight: $aside-menu-font-weight;
      line-height: 14px;
      text-align: center;
      letter-spacing: 0.5px;
    }
  }

  &.is-collapse {
    .left-column {
      min-height: 48px;
      padding: 4px 0;
    }
  }
}

.layout-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .layout-columns-second-aside {
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 0;
    padding-left: $column-menu-padding-left;
    padding-right: 0;
    background-color: var(--el-menu-bg-color);
    border-right: 1px solid var(--el-aside-border-right-color);
    box-sizing: border-box;
    user-select: none;
  }

  .layout-columns-second-aside :deep(.el-menu) {
    height: auto;
    min-height: 0;
    max-height: none;
    border-right: none;
    box-sizing: border-box;
  }

  .layout-columns-second-aside :deep(.el-menu.el-menu--collapse) {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
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

.layout-columns-second-menu-scroller {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -ms-scroll-chaining: none;
}

.layout-columns-second-menu-pad {
  padding-right: $column-menu-padding-right;
  box-sizing: border-box;
}

/* 第一列头像 Popover 挂载在 body，需非 scoped */
.layout-column-user-popover {
  .user-card-content {
    padding: 0;
  }

  .user-card-header {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    margin-bottom: 10px;
  }

  .user-info {
    margin-left: 12px;
    flex: 1;
  }

  .user-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 3px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  .user-phone {
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  .user-card-menu {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .user-menu-item {
    display: flex;
    align-items: center;
    width: auto;
    height: 36px;
    padding: 8px 10px;
    font-size: 13px;
    user-select: none;
    background-color: transparent;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
    line-height: 1;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }

    .el-icon {
      margin-right: 8px;
      font-size: 14px;
      flex-shrink: 0;
    }

    span {
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      line-height: 1;
    }
  }

  .user-card-footer {
    display: flex;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--el-border-color-lighter);
    margin-top: 10px;

    .el-button {
      width: 100%;
    }
  }
}
</style>
