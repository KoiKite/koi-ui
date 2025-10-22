<template>
  <!-- 有下级，用el-sub-menu，无下级用el-menu-item -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
        <span v-text="getMenuLanguage(item.meta?.title)"></span>
      </template>
      <HorizontalSubMenu :menuList="item.children" />
    </el-sub-menu>
    <!-- 叶子节点[功能节点] -->
    <el-menu-item v-else :index="item.path" @click="handleMenuRouter(item)">
      <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></KoiGlobalIcon>
      <template #title>
        <span v-text="getMenuLanguage(item.meta?.title)"></span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import HorizontalSubMenu from "@/layouts/components/Menu/HorizontalSubMenu.vue";
import { koiMsgWarning } from "@/utils/koi.ts";
import { getMenuLanguage } from "@/utils/index.ts";
import { useRouter } from "vue-router";

const router = useRouter();

// 获取父组件传递过来的数据
defineProps(["menuList"]);

/** 打开标签页 或 外部链接 */
const handleMenuRouter = (value: any) => {
  if (value.meta?.linkUrl) {
    if (/^https?:\/\//.test(value.meta?.linkUrl)) {
      return window.open(value.meta.linkUrl, "_blank");
    } else {
      koiMsgWarning("错误链接地址，禁止跳转");
      return;
    }
  }
  router.push(value.path);
};
</script>

<style lang="scss">
.el-menu--horizontal .el-menu-item {
  user-select: none;
  border: none !important;

  &.is-active {
    color: var(--el-menu-active-text-color) !important;
    background: var(--el-menu-active-bg-color) !important;
  }
}

.el-menu--horizontal .el-sub-menu {
  padding: 0 !important;

  .el-sub-menu__title {
    padding: 0 30px 0 10px !important;

    .el-sub-menu__icon-arrow {
      right: 10px !important;
    }
  }
}

.el-menu--horizontal .el-menu {
  border: none !important;
}
.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title {
  border: none !important;
}
.el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
  border: none !important;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border: none !important;
}
.el-menu--horizontal>.el-menu-item { 
  height: 36px !important;
  border-radius: 6px !important;
}

.el-popper.is-pure {
  border-radius: 8px;
}

// 菜单折叠 hover 弹窗样式
.el-menu--vertical,
.el-menu--popup-container {
  .el-menu--popup {
    border-radius: 8px !important;
    // box-shadow: none !important;
    padding: 6px !important;
    // 这里没有使用scoped，防止覆盖反转颜色
    // background: var(--el-header-bg-color) !important;

    .el-sub-menu__title:hover,
    .el-menu-item:hover {
      border-radius: 6px;
    }

    .el-menu-item {
      height: 40px;
      margin-bottom: 4px;
      border-radius: 6px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .el-sub-menu {
      height: 40px !important;
      margin-bottom: 4px;

      .el-sub-menu__title {
        height: 40px !important;
        border-radius: 6px;
      }

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
// 菜单折叠 hover 弹窗样式
.el-menu--vertical,
.el-menu--popup-container {
  .el-menu--popup {
    background: var(--el-header-bg-color);
    border: none;
  }
}
</style>
