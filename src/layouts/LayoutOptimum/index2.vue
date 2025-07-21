<template>
  <!-- 混合布局 -->
  <el-container class="layout-container">
    <el-aside
      class="layout-aside transition-all"
      :style="{ width: !globalStore.isCollapse ? globalStore.menuWidth + 'px' : settings.columnMenuCollapseWidth }"
      v-if="subMenuList.length != 0"
    >
      <Logo :isCollapse="globalStore.isCollapse" :layout="globalStore.layout"></Logo>
      <el-scrollbar class="layout-scrollbar">
        <!-- :unique-opened="true" 子菜单不能同时展开 -->
        <el-menu
          :default-active="activeMenu"
          :collapse="globalStore.isCollapse"
          :collapse-transition="false"
          :uniqueOpened="globalStore.uniqueOpened"
          :router="false"
          :class="menuAnimate"
        >
          <ColumnSubMenu :menuList="subMenuList"></ColumnSubMenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <div class="koi-header">
          <div class="header-left">
            <!-- 左侧菜单展开和折叠图标 -->
            <Collapse></Collapse>
            <div class="layout-row m-l-12px">
              <el-scrollbar class="horizontal-scrollbar">
                <div class="horizontal-menu">
                  <div
                    v-for="item in menuList"
                    :key="item.path"
                    class="left-row line-clamp-1"
                    :class="{
                      'is-active': columnActive === item.path || `/${columnActive.split('/')[1]}` === item.path
                    }"
                    @click="handleSubMenu(item)"
                  >
                    <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
                    <el-tooltip :content="getMenuLanguage(item.meta?.title)" :show-after="2000" placement="right">
                      <span class="title" v-text="getMenuLanguage(item.meta?.title)"></span>
                    </el-tooltip>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <!-- 工具栏 -->
          <Toolbar></Toolbar>
        </div>
      </el-header>
      <!-- 路由页面 -->
      <Main></Main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
/** 只需要一个首页的情况，使用此页面 */
import settings from "@/settings.ts";
import Logo from "@/layouts/components/Logo/index.vue";
import Collapse from "@/layouts/components/Header/components/Collapse.vue";
import Toolbar from "@/layouts/components/Header/components/Toolbar.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import { getMenuLanguage } from "@/utils/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

console.log("上左布局左侧动态路由", authStore.showMenuList);

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);

/** 隐藏静态路由中isHide == '1'的数据 */
const menuList = computed(() => authStore.showMenuList.filter((item: any) => item.meta.isHide == "1"));

const columnActive = ref("");
const subMenuList = ref([]);

watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;
    columnActive.value = route.path;
    const menuItem = menuList.value.filter((item: any) => {
      // 刷新浏览器，一级路由就会变成点击的二级路由，所以需要加上`/${route.path.split("/")[1]}` 进行获取，否则就没有默认选择的颜色。
      return route.path === item.path || `/${route.path.split("/")[1]}` === item.path;
    });
    // 若获取的路由没有子菜单，则赋值为空。
    if (!menuItem[0].children?.length) return (subMenuList.value = []);
    // 若有子菜单则赋值给子菜单变量。
    subMenuList.value = menuItem[0].children;
  },
  {
    deep: true,
    immediate: true
  }
);

/** 点击加载子菜单数据 */
const handleSubMenu = (item: any) => {
  columnActive.value = item.path;
  if (item.children?.length) {
    // 该一级菜单，若是有子菜单，就会给第二个分栏菜单赋值。
    // router.push(item.path); // 加这个，点击最左侧菜单会重定向第一个子菜单。
    subMenuList.value = item.children;
    return;
  }
  // 若是没有子菜单，则给子菜单变量赋值为空，并且跳转路由。例如：首页。
  subMenuList.value = [];
  router.push(item.path);
};

const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);

/** 添加鼠标滚轮控制横向滚动功能 */
const handleWheelScroll = (event: WheelEvent) => {
  const container = document.querySelector('.horizontal-scrollbar .el-scrollbar__wrap');
  if (container) {
    // 阻止默认的垂直滚动行为
    event.preventDefault();
    
    // 计算滚动距离
    const scrollAmount = event.deltaY > 0 ? 100 : -100;
    
    // 平滑滚动
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  const scrollContainer: any = document.querySelector('.horizontal-scrollbar .el-scrollbar__wrap');
  if (scrollContainer) {
    scrollContainer.addEventListener('wheel', handleWheelScroll, { passive: false });
  }
});
</script>

<style lang="scss" scoped>
.koi-header {
  display: flex;
  justify-content: space-between;
  height: $aside-header-height;
  
  .header-left {
    display: flex;
    align-items: center;
    flex: 1; /* 关键修改：占据剩余空间 */
    min-width: 0; /* 防止溢出 */
  }
}

.layout-row {
  display: flex;
  height: 100%;
  flex: 1; /* 关键修改：占据剩余空间 */
  min-width: 0; /* 防止溢出 */
  user-select: none;
  background-color: var(--el-header-bg-color);
}

.horizontal-scrollbar {
  width: 100%; /* 占据全部可用宽度 */
  height: calc(100% - 4px);
  overflow: hidden;
  margin-top: 2px;

  :deep(.el-scrollbar__wrap) {
    /* 关键修改：强制隐藏垂直滚动 */
    overflow-x: auto !important;
    overflow-y: hidden !important;
    
    /* 关键修改：防止内容换行 */
    white-space: nowrap;
    
    /* 关键修改：禁用垂直滚动 */
    height: 100% !important;
    
    /* 关键修改：隐藏垂直滚动条 */
    .el-scrollbar__view {
      height: 100% !important;
    }
    
    /* 关键修改：移除底部内边距 */
    padding-bottom: 0 !important;
  }
  
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      height: 8px;
      bottom: 2px;
    }
    
    /* 关键修改：隐藏垂直滚动条 */
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

/* 水平菜单容器 */
.horizontal-menu {
  display: inline-flex; /* 关键修改：内联flex */
  height: 100%; /* 关键修改：高度100%填充 */
  min-width: 100%; /* 确保内容足够宽 */
  user-select: none;
  /* 关键修改：确保容器高度不会超出 */
  box-sizing: border-box;
}

/* 菜单项样式 */
.left-row {
  display: inline-flex; /* 关键修改：内联flex */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  max-width: 120px;
  height: 100%;
  padding: 6px 4px;
  margin: 0 4px;
  cursor: pointer;
  border: 1px solid transparent;
  color: var(--el-header-optimum-color);
  transition: all 0.3s ease;
  
  .title {
    margin-top: 8px;
    font-size: 12px;
    font-weight: $aside-menu-font-weight;
    line-height: 14px;
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
    border: 1px solid var(--el-header-optimum-border-color);
    border-radius: 4px;
  }
  
  &.is-active {
    color: var(--el-header-optimum-active-color);
    background: var(--el-header-optimum-active-bg-color);
    border: 1px solid var(--el-header-optimum-border-color);
    border-radius: 4px;
  }
}

.layout-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .layout-aside {
    z-index: $layout-aside-z-index; // 左侧菜单层级
    padding-right: $column-menu-padding-right; // 左侧布局右边距[用于悬浮和选择更明显]
    padding-left: $column-menu-padding-left; // 左侧布局左边距[用于悬浮和选择更明显]
    background-color: var(--el-menu-bg-color);
    border-right: none;
    box-shadow: $aside-menu-box-shadow; // 双栏左侧布局菜单右边框阴影
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

/** 去除菜单右侧边框 */
.el-menu {
  border-right: none;
}
</style>
