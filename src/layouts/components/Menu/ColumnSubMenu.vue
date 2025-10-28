<template>
  <!-- 有下级，用el-sub-menu，无下级用el-menu-item -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <!-- 图标容器 - 负责偏移 -->
        <div class="icon-container">
          <!-- 图标本身 - 负责动画 -->
          <KoiGlobalIcon 
            v-if="item.meta.icon" 
            :name="item.meta.icon" 
            size="18" 
            class="menu-icon"
          ></KoiGlobalIcon>
        </div>
        <el-tooltip 
          :content="getMenuLanguage(item.meta?.title)" 
          :show-after="1500" 
          placement="right"
        >
          <span 
            class="menu-ellipsis" 
            v-text="getMenuLanguage(item.meta?.title)"
          ></span>
        </el-tooltip>
      </template>
      <ColumnSubMenu :menuList="item.children" />
    </el-sub-menu>
    <!-- 叶子节点[功能节点] -->
    <el-menu-item v-else :index="item.path" @click="handleMenuRouter(item)">
      <!-- 图标容器 - 负责偏移 -->
      <div class="icon-container">
        <!-- 图标本身 - 负责动画 -->
        <KoiGlobalIcon 
          v-if="item.meta.icon" 
          :name="item.meta.icon" 
          size="18" 
          class="menu-icon"
        ></KoiGlobalIcon>
      </div>
      <template #title>
        <el-tooltip 
          :content="getMenuLanguage(item.meta?.title)" 
          :show-after="1500" 
          placement="right"
        >
          <span 
            class="menu-ellipsis" 
            v-text="getMenuLanguage(item.meta?.title)"
          ></span>
        </el-tooltip>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import { koiMsgWarning } from "@/utils/koi.ts";
import { useRouter } from "vue-router";
import { getMenuLanguage } from "@/utils/index.ts";

const router = useRouter();

// 获取父组件传递过来的数据
defineProps(["menuList"]);

/** 打开标签页 或 外部链接 */
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
</script>

<style lang="scss" scoped>
/** 菜单标题过长使用省略号 */
.menu-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  transform: translate($aside-menu-font-icon-translate); // 文字偏移保持不变
}

/** 图标容器 - 只负责偏移 */
.icon-container {
  display: inline-block;
  transform: translate($aside-menu-font-icon-translate); // 图标容器偏移
}

/** 图标本身 - 负责动画 */
.menu-icon {
  display: block;
  transition: transform 0.3s ease;
  will-change: transform;
  transform-origin: center;
}

/** 父节点 */
.el-menu-item {
  height: $aside-menu-height !important;
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  --el-menu-item-height: $aside-menu-height;
  color: var(--el-menu-text-color);
  user-select: none;
  border-radius: $aside-menu-border-left;

  // 设置鼠标悬停时el-menu-item的样式
  &:hover {
    color: var(--el-menu-hover-text-color);
    background: var(--el-menu-hover-bg-color);
    border-radius: $aside-menu-border-left;

    // 实现鼠标悬停时icon变色和动画
    .menu-icon {
      color: var(--el-menu-hover-text-color);
      animation: koi-icon-scale 0.6s ease-in-out forwards;
    }
  }

  // 设置选择el-menu-item时的样式
  &.is-active {
    color: var(--el-menu-active-text-color);
    background: var(--el-menu-active-bg-color);
    
    .menu-icon {
      color: var(--el-menu-active-text-color);
    }
  }
}

/** 子节点 */
:deep(.el-sub-menu__title) {
  height: $aside-menu-height;
  padding-right: 0;
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  color: var(--el-menu-text-color);
  user-select: none;
  border-radius: $aside-menu-border-left;
  
  .icon-container {
    transform: translate($aside-menu-font-icon-translate); // 子菜单图标偏移
  }
  
  &:hover {
    color: var(--el-menu-hover-text-color);
    background: var(--el-menu-hover-bg-color);
    
    .menu-icon {
      animation: koi-icon-scale 0.6s ease-in-out forwards;
      color: var(--el-menu-hover-text-color);
    }
  }
  
  // &:active {
  //   color: var(--el-menu-active-text-color);
  //   background: var(--el-menu-active-bg-color);
  // }
}

/** 纯缩放动画 - 不受偏移影响 */
@keyframes koi-icon-scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.16);
  }
  100% {
    transform: scale(1);
  }
}
</style>

<style lang="scss">
/** 子级菜单字体高亮，父级菜单也高亮 */
.el-sub-menu.is-active > .el-sub-menu__title {
  color: var(--el-menu-parent-active-text-color) !important;
  
  .menu-icon {
    color: var(--el-menu-parent-active-text-color) !important;
  }
}
</style>