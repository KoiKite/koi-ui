<template>
  <el-tabs
    v-model="activeTab"
    type="card"
    class="layout-tabs"
    @tab-remove="removeTab"
    @tab-click="handleTabClick"
    @contextmenu.prevent="handleTabsMenuParent($event)"
  >
    <!-- :closable="true" 显示关闭图标 -->
    <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path" :closable="getClosable(item)">
      <!-- 加载图标 -->
      <template #label>
        <div
          class="flex flex-justify-center flex-items-center select-none"
          @contextmenu.prevent="handleTabsMenuChildren(item.path, $event)"
        >
          <div class="line"></div>
          <KoiGlobalIcon class="m-r-6px" v-show="item.icon" :name="item.icon" size="16"></KoiGlobalIcon>
          <div>{{ getMenuLanguage(item?.title) }}</div>
          <KoiSvgIcon v-if="item.isAffix === '1'" name="koi-affixed" width="16" height="16" class="m-l-4px"></KoiSvgIcon>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>

  <div>
    <TabMenu ref="tabMenuRef"></TabMenu>
  </div>
</template>

<script setup lang="ts">
import TabMenu from "@/layouts/components/Tabs/components/TabMenu.vue";
import Sortable from "sortablejs";
import { koiMsgWarning, koiMsgError } from "@/utils/koi.ts";
import { TabsPaneContext } from "element-plus";
import { nextTick, ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { HOME_URL } from "@/config/index.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
import useTabsStore from "@/stores/modules/tabs.ts";
import useAuthStore from "@/stores/modules/auth.ts";
import { getMenuLanguage } from "@/utils/index.ts";

// 获取当前路由
const route = useRoute();
// 路由跳转
const router = useRouter();
// 获取选项卡仓库
const tabsStore = useTabsStore();
// 获取权限仓库
const authStore = useAuthStore();

/** 页面创建后，立即初始化选项卡 AND 拖拽函数 */
onMounted(() => {
  addTab(); // 添加选项卡[进入根页面，立即添加首页]
  setActiveTab(); // 设置激活选项卡[进入根页面，立即激活首页]
  initTabs(); // 进入根页面，初始化需要固定的页面
  // 使用 nextTick 等待 DOM 渲染完成
  nextTick(() => {
    // 初始化拖拽功能
    tabsDrop();
  });
});

/** 监听当前路由，路由path发生变化添加选项卡数据 */
watch(
  () => route.fullPath,
  () => {
    // if (route.meta.isFull == "0") return;
    // 2、激活选择的选项卡
    setActiveTab();
    // 3、添加选项卡
    addTab();
  }
);

/** 1、初始化需要固定的 tabs[isAffix[配置固定tabs项]，在进入系统的时候，获取对应权限菜单数据，如果里面有固定tabs配置项，则进行添加] */
const initTabs = () => {
  authStore.menuList.forEach((item: any) => {
    if (item.meta.isAffix == "1" && item.meta.isVisible == "1") {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        isKeepAlive: item.meta.isKeepAlive,
        isAffix: "1" // 标记为固定
      };
      tabsStore.addTab(tabsParams);
    }
  });
};

/** 获取选项卡数据 */
const tabList = computed(() => {
  return tabsStore.getTabs;
});

/** 根据 isAffix 计算 closable 值 */
const getClosable = (item: any) => {
  // isAffix === "1" 时，closable = false（固定，不可关闭）
  // isAffix === "0" 时，closable = true（未固定，可关闭）
  return item.isAffix === "1" ? false : true;
};

/* 2、添加后激活选项卡 */
const activeTab = ref(route.fullPath);
const setActiveTab = () => {
  activeTab.value = route.fullPath;
};

/** 3、添加选项卡 */
const addTab = () => {
  // 解构路由数据
  const { meta, fullPath } = route;
  
  // 检查是否已存在该标签，如果已存在且已固定，保持固定状态
  const existingTab = tabsStore.tabList.find((item: any) => item.path === fullPath);
  const isAffixed = existingTab && existingTab.isAffix === "1";
  
  // 构造选项卡数据
  const tab = {
    icon: meta.icon,
    title: meta.title as string,
    path: fullPath,
    name: route.name as string,
    isKeepAlive: route.meta.isKeepAlive,
    isAffix: isAffixed ? "1" : (route.meta.isAffix || "0") // 保存固定状态
  };
  if (fullPath == HOME_URL) {
    // 如果是首页的话，就固定不可关闭。
    tab.isAffix = "1";
  }
  // 添加到选项卡仓库里面
  tabsStore.addTab(tab);
};

/** 4、移除选项卡 */
const removeTab = (fullPath: any) => {
  // 最后一个选项卡不被允许关闭
  const tabCount = tabsStore.tabList.filter((item: any) => typeof item === "object").length;
  if (tabCount == 1) {
    koiMsgWarning("到我的底线了，哼");
    return;
  }
  tabsStore.removeTab(fullPath as string, fullPath == route.fullPath, route.fullPath);
};

/** 5、点击切换选项卡 */
const handleTabClick = (tab: TabsPaneContext) => {
  const { props } = tab;
  // console.log(props.name); // 打印路由path
  // 将切换的选项卡进行添加路由操作
  router.push({ path: props.name as string });
};

/** 6、tabs 拖拽排序 */
const tabsDrop = () => {
  const el = document.querySelector(".el-tabs__nav");
  if (!el) {
    console.warn("Sortable 元素未找到，可能未渲染完成");
    return;
  }

  Sortable.create(document.querySelector(".el-tabs__nav") as HTMLElement, {
    draggable: ".el-tabs__item",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const tabsList = [...tabsStore.tabList];
      // 获取当前移动的索引的数据
      const currentRow = tabsList.splice(oldIndex as number, 1)[0];
      // 将 currentRow 元素插入到 tabsList 数组的指定位置 newIndex。0 是删除的元素数量，这里不需要删除任何元素
      tabsList.splice(newIndex as number, 0, currentRow);
      // 更新排序后的tabs仓库数据
      tabsStore.setTab(tabsList);
    }
  });
};

/** 7、右键菜单 */
const tabMenuRef = ref();
const handleTabsMenuParent = (value: any) => {
  if (tabMenuRef.value) {
    tabMenuRef.value.handleKoiMenuParent(value);
  } else {
    koiMsgError(t("msg.fail"));
  }
};

const handleTabsMenuChildren = (path: any, value: any) => {
  if (tabMenuRef.value) {
    tabMenuRef.value.handleKoiMenuChildren(path, value);
  } else {
    koiMsgError(t("msg.fail"));
  }
};
</script>

<style lang="scss" scoped>
.layout-tabs {
  border-top: 1px solid var(--el-border-color-lighter);
  // 色弱模式
  background-color: var(--el-bg-color);
}

:deep(.el-tabs__item:first-child) {
  margin-left: 8px;
}

:deep(.el-tabs__item) {
  height: 32px;
  margin-left: 4px;
  margin-top: 6px !important;
  padding: 0px 14px !important;
  font-size: 14px;
  font-weight: 500;
  color: #161718;
  @apply dark:text-#E0E0E0;
  border-radius: 6px;
  border: none !important;
  user-select: none;
  outline: none !important; /* 移除默认 focus 外框 */
  box-shadow: none !important; /* 移除所有阴影效果 */
  
  // 设置鼠标悬停时的样式
  &:hover {
    color: var(--el-color-primary);
    background-color: #F4F4F5;
    @apply dark:bg-#202122;
  }

  // 设置鼠标选择的样式[可用来定制不同配色的主题]
  &.is-active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);

    &::before,
    &::after {
      position: absolute;
      bottom: 0;
      width: 20px;
      height: 20px;
      content: "";
      border-radius: 50%;
      box-shadow: 0 0 0 30px var(--el-color-primary-light-9);
    }

    &::before {
      left: -20px;
      clip-path: inset(50% -10px 0 50%);
    }

    &::after {
      right: -20px;
      clip-path: inset(50% 50% 0 -10px);
    }
  }
}

:deep(.el-tabs__item) {
  position: relative;
  .line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 16px;
    margin: auto;
    background: #D3D6DB !important;
    transition: opacity 0.3s ease;
    opacity: 1 !important; /* 默认显示 */
  }

  // 第一个标签的 左边线 line 隐藏
  &:first-child .line {
    opacity: 0 !important;
  }

  // 激活状态：隐藏自己和前后标签的 line
  &.is-active {
    .line {
      opacity: 0 !important; /* 隐藏自己的左边线 */
    }

    // 让前一个标签的 line 隐藏[即当前标签左边线]
    &:not(:first-child) {
      & + .el-tabs__item .line {
        opacity: 0 !important; /* 这是下一个标签的左边线，已处理 */
      }
    }
  }

  // 悬浮状态的 line 隐藏
  &:hover {
    .line {
      opacity: 0 !important;
    }
  }

  // 强制覆盖所有focus相关样式
  &:focus,
  &:focus-visible,
  &:focus-within {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
  }

  // 当前标签是[前一个]时，它的 .line 是右边线，也要隐藏[当后一个是 active/hover]
  & + .el-tabs__item {
    &.is-active .line,
    &:hover .line {
      opacity: 0 !important;
    }
  }
  // 悬浮或激活的标签，其下一个标签的 line 隐藏
  &:hover + .el-tabs__item .line,
  &.is-active + .el-tabs__item .line {
    opacity: 0 !important;
  }
}

:deep(.el-tabs__header) {
  margin: 0;
  padding-bottom: 0px !important;
  display: flex;
  align-items: center;
}

// 覆盖多余边框
:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__nav-prev),
:deep(.el-tabs__nav-next) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  line-height: normal;
}

// 全局覆盖Element Plus的focus样式
:deep(.el-tabs__item:focus),
:deep(.el-tabs__item:focus-visible),
:deep(.el-tabs__item:focus-within) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

// 确保在右键菜单激活时也不出现focus样式
:deep(.el-tabs__item[aria-selected="true"]:focus),
:deep(.el-tabs__item[aria-selected="false"]:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
</style>
