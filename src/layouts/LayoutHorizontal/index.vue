<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="flex flex-items-center header-content">
        <Logo :layout="globalStore.layout"></Logo>
        <div class="menu-container">
          <el-scrollbar class="horizontal-scrollbar">
            <el-menu 
              mode="horizontal" 
              :default-active="activeMenu" 
              :router="false" 
              :class="menuAnimate"
              class="horizontal-menu"
            >
              <HorizontalSubMenu :menuList="menuList" />
            </el-menu>
          </el-scrollbar>
        </div>
      </div>

      <Toolbar></Toolbar>
    </el-header>

    <el-main class="layout-main">
      <Main></Main>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import settings from "@/settings.ts";
import Logo from "@/layouts/components/Logo/index.vue";
import Toolbar from "@/layouts/components/Header/components/Toolbar.vue";
import HorizontalSubMenu from "@/layouts/components/Menu/HorizontalSubMenu.vue";
import Main from "@/layouts/components/Main/index.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

console.log("横向布局左侧动态路由", authStore.showMenuList);

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);
const menuList = computed(() => authStore.showMenuList);

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
    background-color: var(--el-header-bg-color);
    user-select: none;
    
    .header-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .menu-container {
      flex: 1;
      min-width: 0;
      height: 100%;
    }
  }
  
  .layout-main {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 15px 0 0;
    overflow-x: hidden;
    background-color: var(--el-bg-color);
  }
}

/* 横向滚动容器 */
.horizontal-scrollbar {
  width: 100%;
  height: 100%;
  
  :deep(.el-scrollbar__wrap) {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    white-space: nowrap;
    height: 100% !important;
    padding-bottom: 0 !important;
  }
  
  :deep(.el-scrollbar__view) {
    height: 100% !important;
    display: inline-block;
  }
  
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      height: 6px;
      bottom: 2px;
      background: rgba(255, 255, 255, 0.1);
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

/* 水平菜单样式 */
.horizontal-menu {
  display: inline-flex;
  // height: 100%;
  border-bottom: none !important;
  
  :deep(.el-menu-item) {
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &.is-active {
      background-color: var(--el-color-primary);
      color: white !important;
      // border-bottom: 3px solid white;
    }
  }
  
  :deep(.el-sub-menu) {
    display: inline-flex;
    align-items: center;
    height: 100%;
    
    .el-sub-menu__title {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 20px;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    
    &.is-active {
      .el-sub-menu__title {
        background-color: var(--el-color-primary);
        color: white !important;
        // border-bottom: 3px solid var(--el-color-primary);
        
        i {
          color: white !important;
        }
      }
    }
  }
}
</style>