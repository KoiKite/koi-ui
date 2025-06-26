<template>
  <!-- 有下级，用el-sub-menu，无下级用el-menu-item -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
        <el-tooltip :content="getLanguage(globalStore.language, item.meta?.title, item.meta?.enName)" :show-after="2000" placement="right">
          <span class="menu-ellipsis" v-text="getLanguage(globalStore.language, item.meta?.title, item.meta?.enName)"></span>
        </el-tooltip>
      </template>
      <AsideSubMenu :menuList="item.children" />
    </el-sub-menu>
    <!-- 叶子节点[功能节点] -->
    <el-menu-item v-else :index="item.path" @click="handleMenuRouter(item)">
      <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
      <template #title>
        <el-tooltip :content="getLanguage(globalStore.language, item.meta?.title, item.meta?.enName)" :show-after="2000" placement="right">
          <span class="menu-ellipsis" v-text="getLanguage(globalStore.language, item.meta?.title, item.meta?.enName)"></span>
        </el-tooltip>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import AsideSubMenu from "@/layouts/components/Menu/AsideSubMenu.vue";
import { koiMsgWarning } from "@/utils/koi.ts";
import { useRouter } from "vue-router";
import { getLanguage } from "@/utils/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
const router = useRouter();

// 获取父组件传递过来的数据
defineProps(["menuList"]);

/** 打开标签页 或 外部链接 */
const handleMenuRouter = (value: any) => {
  if (value.meta?.isLink) {
    if (/^https?:\/\//.test(value.meta?.isLink)) {
      return window.open(value.meta.isLink, "_blank");
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
}
/** 父节点 */
.el-menu-item {
  height: $aside-menu-height !important;
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  --el-menu-item-height: $aside-menu-height;
  // color: #000000;
  user-select: none;
  // border-left: $aside-menu-border-left solid transparent;
  border-radius: $aside-menu-border-left;

  // @apply dark:c-#E5E3FA;
  color: var(--el-menu-text-color);
  i {
    transform: translate($aside-menu-font-icon-translate); // 图标偏移
  }
  span {
    transform: translate($aside-menu-font-icon-translate); // 文字偏移
  }

  // 设置鼠标悬停时el-menu-item的样式
  &:hover {
    // color: var(--el-color-primary);
    color: var(--el-menu-hover-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-hover-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);

    // & 含义 .el-menu-item
    border-radius: $aside-menu-border-left;

    // 实现鼠标悬停时icon变色
    i {
      // color: var(--el-color-primary);
      color: var(--el-menu-hover-text-color);
    }
  }

  // 设置选择el-menu-item时的样式
  &.is-active {
    // color: var(--el-color-primary);
    color: var(--el-menu-active-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-active-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-color-primary);
    // border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
  }

  &.is-active::before {
    border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
    z-index: auto;
    content: "";
    background-color: transparent;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    border-radius: $aside-menu-border-left;
    transition: background-color .3s ease-in-out;
  }
}

/** 子节点 */
:deep(.el-sub-menu__title) {
  height: $aside-menu-height;
  padding-right: 0; // 去除collapse缩小多余的边框
  margin-bottom: $aside-menu-margin-bottom;
  font-weight: $aside-menu-font-weight;
  // color: #000000;
  user-select: none;
  // border-left: $aside-menu-border-left solid transparent;
  border-radius: $aside-menu-border-left;

  // @apply dark:c-#E5E3FA;
  color: var(--el-menu-text-color);
  i {
    transform: translate($aside-menu-font-icon-translate); // 图标偏移
  }
  span {
    transform: translate($aside-menu-font-icon-translate); // 文字偏移
  }
  &:hover {
    // color: var(--el-color-primary);
    color: var(--el-menu-hover-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-hover-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-color-primary);
    // border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
  }
  &:active {
    // color: var(--el-color-primary);
    color: var(--el-menu-active-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-active-bg-color);
    // border-left: $aside-menu-border-left solid var(--el-color-primary);
    // border-left: $aside-menu-border-left solid var(--el-menu-border-left-color);
  }
}
</style>

<style lang="scss">
/** 子级菜单字体高亮，父级菜单也高亮 */
.el-sub-menu.is-active > .el-sub-menu__title {
  // color: var(--el-color-primary) !important;
  color: var(--el-menu-active-text-color) !important;
}

/** icon图标也跟着变 */
.el-sub-menu.is-active > .el-sub-menu__title i {
  // color: var(--el-color-primary) !important;
  color: var(--el-menu-active-text-color) !important;
}
</style>
