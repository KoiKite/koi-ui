<template>
  <div class="tabs-card">
    <div @click="handleRefresh()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><Refresh class="icon-scale" /></el-icon>{{ $t("tabs.refresh") }}
    </div>
    <div @click="handleMaximize()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><FullScreen class="icon-scale" /></el-icon>{{ $t("tabs.maximize") }}
    </div>
    <div @click="handleCloseCurrentTab()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><Close class="icon-scale" /></el-icon>{{ $t("tabs.closeCurrent") }}
    </div>
    <div @click="handleCloseOtherTabs()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><Star class="icon-scale" /></el-icon>{{ $t("tabs.closeOther") }}
    </div>
    <div @click="handleCloseSideTabs('left')" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><DArrowLeft class="icon-scale" /></el-icon>{{ $t("tabs.closeLeft") }}
    </div>
    <div @click="handleCloseSideTabs('right')" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><DArrowRight class="icon-scale" /></el-icon>{{ $t("tabs.closeRight") }}
    </div>
    <div icon="Remove" @click="handleCloseAllTabs()" class="tab-menu-item">
      <el-icon size="16" class="m-r-5px"><Remove class="icon-scale" /></el-icon>{{ $t("tabs.closeAll") }}
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
const handleKoiMenuParent = (e: any) => {
  if(e.srcElement?.id) {
    choosePath.value = e.srcElement.id.split("-")[1];
  } else {
    return;
  }
  const card = document.querySelector(".tabs-card") as HTMLElement | null;

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    // 设置 card 的位置为鼠标点击位置
    card.style.display = "block";
    card.style.left = (e.pageX + "px") as string;
    card.style.top = (e.pageY + "px") as string;

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.style.display = "none";
      }
      window.removeEventListener("click", hideCard); // 移除点击事件监听器，以免影响其他操作
    };

    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick]
  e.stopPropagation();
};

const handleKoiMenuChildren = (path: any, e: any) => {
  choosePath.value = path;
  const card = document.querySelector(".tabs-card") as HTMLElement | null;

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    // 设置 card 的位置为鼠标点击位置
    card.style.display = "block";
    card.style.left = (e.pageX + "px") as string;
    card.style.top = (e.pageY + "px") as string;

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.style.display = "none";
      }
      window.removeEventListener("click", hideCard); // 移除点击事件监听器，以免影响其他操作
    };

    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick]
  e.stopPropagation();
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
  cursor: pointer;
  background-color: #ffffff;
  @apply dark:bg-black dark:text-#E5EAF3;
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  color: #333639;
  padding: 2px;
}

.tab-menu-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 28px;
  padding: 8px 12px;
  margin-top: 1px;
  font-size: var(--el-font-size-base);
  user-select: none;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

}

.tab-menu-item:hover .icon-scale {
  animation: koi-scale 0.6s ease-in-out forwards;
}

@keyframes koi-scale {
  0% {
      transform: scale(1); /* 初始状态为原始大小 */
      -webkit-transform: scale(1);
      transform-origin: center;
      -webkit-transform-origin: center;
  }
  50% {
      transform: scale(1.16); /* 中间放大到1.16倍 */
      -webkit-transform: scale(1.16);
  }
  100% {
      transform: scale(1); /* 最终状态恢复到原始大小 */
      -webkit-transform: scale(1);
  }
}
/** 右键点击选项结束 */
</style>
