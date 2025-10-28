<template>
  <div class="header-right" ref="toolbarRef">
    <!-- 搜索菜单 -->
    <SearchMenu v-show="isCollapsed"></SearchMenu>
    <!-- ElementPlus 尺寸配置 -->
    <!-- <Dimension v-if="isCollapsed"></Dimension> -->
    <!-- 路由缓存刷新 -->
    <Refresh v-show="isCollapsed"></Refresh>
    <!-- 明亮/暗黑模式图标 -->
    <Dark></Dark>
    <!-- 中英文翻译 -->
    <Language v-if="isCollapsed"></Language>
    <!-- 全屏图标 -->
    <FullScreen></FullScreen>
    <!-- 主题配置 -->
    <ThemeSetting></ThemeSetting>
    <!-- 头像 AND 下拉折叠 -->
    <User></User>

    <!-- 折叠按钮 -->
    <div class="toolbar-toggle" @click="toggleToolbar">
      <el-icon>
        <ArrowLeft v-if="isCollapsed" />
        <ArrowRight v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import User from "@/layouts/components/Header/components/User.vue";
import FullScreen from "@/layouts/components/Header/components/FullScreen.vue";
import Dark from "@/layouts/components/Header/components/Dark.vue";
import ThemeSetting from "@/layouts/components/Header/components/ThemeSetting.vue";
import Refresh from "@/layouts/components/Header/components/Refresh.vue";
// import Dimension from "@/layouts/components/Header/components/Dimension.vue";
import Language from "@/layouts/components/Header/components/Language.vue";
import SearchMenu from "@/layouts/components/Header/components/SearchMenu.vue";

const emit = defineEmits(["widthChange"]);

const isCollapsed = ref(true);
const isSmallScreen = ref(true);
const toolbarRef = ref<HTMLElement>();

// 获取工具栏宽度并发送给父组件
const updateToolbarWidth = () => {
  if (toolbarRef.value) {
    const width = toolbarRef.value.offsetWidth;
    emit("widthChange", width);
  }
};

// 检查屏幕尺寸
const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 1200;
  // 小于1200px时自动折叠，大于等于1200px时自动展开
  if (isSmallScreen.value) {
    isCollapsed.value = false;
  } else {
    isCollapsed.value = true;
  }

  // 更新宽度
  nextTick(() => {
    updateToolbarWidth();
  });
};

// 切换工具栏折叠状态
const toggleToolbar = () => {
  isCollapsed.value = !isCollapsed.value;
  // 切换后更新宽度
  nextTick(() => {
    updateToolbarWidth();
  });
};

// 监听折叠状态变化
watch(isCollapsed, () => {
  nextTick(() => {
    updateToolbarWidth();
  });
});

// 监听窗口大小变化
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  // 初始更新宽度
  nextTick(() => {
    updateToolbarWidth();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  align-items: center;
  height: 100%;
  transition: all 0.3s ease;

  .toolbar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-left: 8px;
    color: var(--el-color-primary);
    cursor: pointer;
    background: var(--el-header-toolbar-collapse-bg-color);
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: var(--el-header-toolbar-collapse-hover-bg-color);
      transform: scale(1.05);
    }

    .el-icon {
      transition: transform 0.3s ease;
    }
  }
}
</style>
