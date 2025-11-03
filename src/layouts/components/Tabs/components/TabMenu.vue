<template>
  <div class="tabs-card">
    <div @click="handleRefresh()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><Refresh class="icon-bounce" /></el-icon>{{ $t("tabs.refresh") }}
    </div>
    <div @click="handleMaximize()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><FullScreen class="icon-bounce" /></el-icon>{{ $t("tabs.maximize") }}
    </div>
    <div @click="handleCloseCurrentTab()" class="tab-menu-item" v-if="isCurrent || isAlone">
      <el-icon size="16" class="m-r-5px"><Close class="icon-bounce" /></el-icon>{{ $t("tabs.closeCurrent") }}
    </div>
    <div @click="handleCloseOtherTabs()" class="tab-menu-item" v-if="isAlone">
      <el-icon size="16" class="m-r-5px"><Switch class="icon-bounce" /></el-icon>{{ $t("tabs.closeOther") }}
    </div>
    <div @click="handleCloseSideTabs('left')" class="tab-menu-item" v-if="hasLeft">
      <el-icon size="16" class="m-r-5px"><DArrowLeft class="icon-bounce" /></el-icon>{{ $t("tabs.closeLeft") }}
    </div>
    <div @click="handleCloseSideTabs('right')" class="tab-menu-item" v-if="hasRight">
      <el-icon size="16" class="m-r-5px"><DArrowRight class="icon-bounce" /></el-icon>{{ $t("tabs.closeRight") }}
    </div>
    <div icon="Remove" @click="handleCloseAllTabs()" class="tab-menu-item" v-if="isAlone">
      <el-icon size="16" class="m-r-5px"><Remove class="icon-bounce" /></el-icon>{{ $t("tabs.closeAll") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useTabsStore from "@/stores/modules/tabs.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import { HOME_URL } from "@/config/index.ts";

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const tabsStore = useTabsStore();
const globalStore = useGlobalStore();

// 点击鼠标右键点击出现菜单
const choosePath = ref();

const isCurrent = ref();
const isAlone = ref();
const hasLeft = ref();
const hasRight = ref();

/**
 * 计算菜单位置，避免超出视口边界
 * @param card - 菜单元素
 * @param pageX - 鼠标X坐标
 * @param pageY - 鼠标Y坐标
 */
const calculateMenuPosition = (card: HTMLElement, pageX: number, pageY: number) => {
  // 临时禁用 transition，避免位置变化时的动画
  const originalTransition = card.style.transition;
  card.style.transition = "none";
  
  // 移除动画 class，以便下次出现时重新触发
  card.classList.remove("menu-appear");
  
  // 先显示菜单以获取其尺寸
  card.style.display = "block";
  const menuWidth = card.offsetWidth;
  const menuHeight = card.offsetHeight;
  
  // 获取视口尺寸和滚动位置
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // 计算菜单最终位置（考虑滚动）
  let left = pageX;
  let top = pageY;
  
  // 检查右边界：如果菜单会超出右边界，则显示在鼠标左侧
  if (pageX + menuWidth > scrollX + viewportWidth) {
    left = pageX - menuWidth;
  }
  
  // 检查左边界：确保菜单不会超出左边界
  if (left < scrollX) {
    left = scrollX + 5; // 留5px边距
  }
  
  // 检查下边界：如果菜单会超出下边界，则显示在鼠标上方
  if (pageY + menuHeight > scrollY + viewportHeight) {
    top = pageY - menuHeight;
  }
  
  // 检查上边界：确保菜单不会超出上边界
  if (top < scrollY) {
    top = scrollY + 5; // 留5px边距
  }
  
  // 设置位置
  card.style.left = left + "px";
  card.style.top = top + "px";
  
  // 在下一帧恢复 transition 并触发出现动画
  requestAnimationFrame(() => {
    card.style.transition = originalTransition || "";
    // 触发出现动画
    card.classList.add("menu-appear");
  });
  
  return { left, top };
};

const handleKoiMenuParent = (e: any) => {
  const tabList = tabsStore.tabList;

  if (e.srcElement?.id) {
    choosePath.value = e.srcElement.id.split("-")[1];
    const tabsMenu = getMenuPositionAndClosable(tabList, choosePath.value);
    isCurrent.value = tabsMenu?.closable;
    isAlone.value = tabsMenu?.isAlone;
    hasLeft.value = tabsMenu?.hasLeft;
    hasRight.value = tabsMenu?.hasRight;
  } else {
    return;
  }

  const card = document.querySelector(".tabs-card") as HTMLElement | null;

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    // 计算并设置 card 的位置，避免超出视口边界
    calculateMenuPosition(card, e.pageX, e.pageY);

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.classList.remove("menu-appear");
        // 等待动画完成后再隐藏并重置状态
        setTimeout(() => {
          if (card !== null) {
            card.style.display = "none";
            // 重置动画状态，确保下次出现时动画正常
            card.style.opacity = "0";
            card.style.transform = "scale(0.8)";
          }
        }, 200);
      }
      window.removeEventListener("click", hideCard); // 移除点击事件监听器，以免影响其他操作
    };

    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick
  e.stopPropagation();
};

const handleKoiMenuChildren = (path: any, e: any) => {
  const tabList = tabsStore.tabList;
  choosePath.value = path;
  const card = document.querySelector(".tabs-card") as HTMLElement | null;

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    const tabsMenu = getMenuPositionAndClosable(tabList, choosePath.value);
    isCurrent.value = tabsMenu?.closable;
    isAlone.value = tabsMenu?.isAlone;
    hasLeft.value = tabsMenu?.hasLeft;
    hasRight.value = tabsMenu?.hasRight;
    // 计算并设置 card 的位置，避免超出视口边界
    calculateMenuPosition(card, e.pageX, e.pageY);

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.classList.remove("menu-appear");
        // 等待动画完成后再隐藏并重置状态
        setTimeout(() => {
          if (card !== null) {
            card.style.display = "none";
            // 重置动画状态，确保下次出现时动画正常
            card.style.opacity = "0";
            card.style.transform = "scale(0.8)";
          }
        }, 200);
      }
      window.removeEventListener("click", hideCard); // 移除点击事件监听器，以免影响其他操作
    };

    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick
  e.stopPropagation();
};

/**
 * 获取菜单项的位置信息和关闭状态
 * @param {Array} menus - 菜单数组
 * @param {string} targetPath - 目标路径
 * @returns {Object|null} 包含位置信息和关闭状态的对象，未找到时返回null
 * 首页 + 一个可关闭的页面tab情况：
 * 输入path："/home" 输出: { hasClosableLeft: false, hasClosableRight: true, hasLeft: false, hasRight: true, isAlone: false, closable: false }
 */
const getMenuPositionAndClosable = (tabsList: any, targetPath: string) => {
  // 1、查找目标菜单项的索引
  const index = tabsList.findIndex((item: any) => item.path == targetPath);

  // 未找到目标路径
  if (index === -1) return null;

  // 2、获取目标菜单项
  const menuItem = tabsList[index];
  // 3、检查左侧是否存在可关闭的菜单项
  const hasClosableLeft = tabsList.slice(0, index).some((item: any) => item.closable);

  // 4、检查右侧是否存在可关闭的菜单项
  const hasClosableRight = tabsList.slice(index + 1).some((item: any) => item.closable);
  // 5、计算位置信息
  const hasLeft = index > 0 && hasClosableLeft; // 左侧是否有菜单项
  const hasRight = index < tabsList.length - 1 && hasClosableRight; // 右侧是否有菜单项
  // 6、计算 isAlone: 先过滤掉所有可关闭的菜单项，然后判断是否只剩一个
  const unclosableTabsList = tabsList.filter((item: any) => item.closable);
  const isAlone = unclosableTabsList.length <= 1 ? false : true; // 是否只有当前这一个菜单项

  return {
    hasLeft, // 左侧是否有其他菜单项
    hasRight, // 右侧是否有其他菜单项
    isAlone, // 当前是否只剩下这一个菜单项
    closable: menuItem.closable // 关闭状态
  };
};

/** 刷新当前页 */
const refreshCurrentPage: Function = inject("refresh") as Function;
const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name as string);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name as string);
      refreshCurrentPage(true);
    });
  }, 0);
};

/** 当前页全屏 */
const handleMaximize = () => {
  // 切换哪个，先跳转哪个
  router.push(choosePath.value);
  globalStore.setGlobalState("maximize", !globalStore.maximize);
};

/** 关闭左边 OR 右边选项卡 */
const handleCloseSideTabs = (direction: any) => {
  // console.log("关闭左边 OR 右边选项卡", direction);
  if (choosePath.value) {
    tabsStore.closeSideTabs(choosePath.value, direction);
  } else {
    tabsStore.closeSideTabs(route.fullPath, direction);
  }
};

/** 关闭当前选项卡 */
const handleCloseCurrentTab = () => {
  if (choosePath.value) {
    tabsStore.removeTab(choosePath.value, true, route.fullPath);
  } else {
    tabsStore.removeTab(route.fullPath);
  }
};

/** 关闭其他选项卡 */
const handleCloseOtherTabs = () => {
  if (choosePath.value) {
    tabsStore.closeManyTabs(choosePath.value);
    router.push(choosePath.value);
  } else {
    tabsStore.closeManyTabs(route.fullPath);
  }
};

/** 关闭全部选项卡 */
const handleCloseAllTabs = () => {
  tabsStore.closeManyTabs();
  router.push(HOME_URL);
};

/** 组件对外暴露 */
defineExpose({
  handleKoiMenuParent,
  handleKoiMenuChildren
});
</script>

<style lang="scss" scoped>
/** 右键点击选项开始 */
.tabs-card {
  position: absolute;
  z-index: 9999;
  display: none;
  padding: 4px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  backdrop-filter: blur(10px);
  /* 只对背景色、边框、阴影等应用过渡，不包括位置属性 */
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  /* 初始状态：透明且缩放为0 */
  opacity: 0;
  transform: scale(0.8);
  transform-origin: center;
  
  /* 出现动画 */
  &.menu-appear {
    animation: menuFadeIn 0.2s ease-out forwards;
  }
}

@keyframes menuFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.tab-menu-item {
  display: flex;
  align-items: center;
  width: auto;
  height: 32px;
  padding: 8px 12px;
  margin: 2px 0;
  font-size: var(--el-font-size-base);
  user-select: none;
  background-color: transparent;
  border-radius: var(--el-border-radius-base);
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
  
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.tab-menu-item:hover .icon-bounce {
  animation: koi-jelly 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes koi-jelly {
  0% {
    transform: scale(1, 1) rotate(0deg);
    transform-origin: center;
  }
  15% {
    transform: scale(1.25, 0.8) rotate(0deg);
  }
  30% {
    transform: scale(0.85, 1.1) rotate(-2deg);
  }
  45% {
    transform: scale(1.05, 0.95) rotate(1deg);
  }
  60% {
    transform: scale(0.95, 1.02) rotate(-1deg);
  }
  75% {
    transform: scale(1.02, 0.98) rotate(0.5deg);
  }
  90% {
    transform: scale(0.98, 1.01) rotate(-0.3deg);
  }
  100% {
    transform: scale(1, 1) rotate(0deg);
  }
}
/** 右键点击选项结束 */
</style>
