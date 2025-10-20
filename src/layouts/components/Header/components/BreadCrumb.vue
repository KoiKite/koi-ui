<template>
  <div class="breadcrumb-container">
    <div :class="['breadcrumb-box', 'mask-image']">
      <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
            <!-- 使用 el-dropdown 包裹内容 -->
            <el-dropdown v-if="item.children && item.children.length > 0" @command="handleDropdownCommand">
              <span class="el-breadcrumb__inner is-link flex flex-items-center outline-none gap-x-4px">
                <KoiGlobalIcon v-if="item.meta?.icon" :name="item.meta?.icon" size="16" />
                {{ getMenuLanguage(item.meta?.title) }}
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </span>

              <!-- 下拉菜单内容 -->
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- 用 template 包裹 v-for + v-if -->
                  <template v-for="child in item.children">
                    <el-dropdown-item
                      v-if="child.meta && child.meta.isVisible === '1'"
                      :key="child.path"
                      :command="{ item: child, index }"
                    >
                      <KoiGlobalIcon v-if="child.meta?.icon" :name="child.meta?.icon" size="16" />
                      {{ getMenuLanguage(child.meta?.title) }}
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 没有子项则正常显示 -->
            <div
              v-else
              class="el-breadcrumb__inner is-link flex flex-items-center outline-none gap-x-4px"
              :class="{ 'item-no-icon': !item.meta.icon }"
              @click="handleBreadcrumb(item, index)"
            >
              <KoiGlobalIcon v-if="item.meta?.icon" :name="item.meta?.icon" size="16" />
              <span>
                {{ getMenuLanguage(item.meta?.title) }}
              </span>
            </div>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <div class="breadcrumb-fade"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
// @ts-ignore
import { HOME_URL, STATIC_URL } from "@/config/index.ts";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import useAuthStore from "@/stores/modules/auth.ts";
import { findRouteChildrenByActiveMenu } from "@/utils/index.ts";
import { getMenuLanguage } from "@/utils/index.ts";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const breadcrumbList = computed(() => {
  let breadcrumbData = authStore.getBreadcrumbList[route.matched[route.matched.length - 1].path] ?? [];
  if (!breadcrumbData) return;
  // activeMenu 存在值的时候，变为层级模式
  // 若只需要静态路由是层级模式 则添加 breadcrumbData[0].path === STATIC_URL &&
  if (breadcrumbData.length > 1 && breadcrumbData[1].meta?.activeMenu) {
    breadcrumbData = findRouteChildrenByActiveMenu(
      authStore.breadcrumbList,
      breadcrumbData[breadcrumbData.length - 1]?.meta?.activeMenu
    ).concat(breadcrumbData[breadcrumbData.length - 1]);
  }
  // 不需要首页面包屑可注释以下判断
  // if (breadcrumbData[0].path !== HOME_URL) {
  //   breadcrumbData = [{ path: HOME_URL, meta: { icon: "koi-home", title: "menu.home.auth" } }, ...breadcrumbData];
  // }
  return breadcrumbData;
});

/** 点击面包屑 */
const handleBreadcrumb = (item: any, index: number) => {
  if (breadcrumbList.value[0]?.path === STATIC_URL || breadcrumbList.value[1]?.path === STATIC_URL) {
    router.push(HOME_URL);
    return;
  }
  if (index !== breadcrumbList.value.length - 1) router.push(item.path);
};

/** 点击下拉菜单项 */
const handleDropdownCommand = ({ item }: any) => {
  if (item.meta?.linkUrl) {
    if (/^https?:\/\//.test(item.meta?.linkUrl)) {
      return window.open(item.meta.linkUrl, "_blank");
    }
  }
  router.push(item.path);
};
</script>

<style scoped lang="scss">
/** breadcrumb-transform 面包屑动画 */
.breadcrumb-enter-active {
  transition: all 0.2s;
}
.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb-box {
  display: flex;
  align-items: center;
  padding-top: 2px;
  margin-left: 10px;
  overflow: hidden;
  user-select: none;
  width: 100%;
  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    font-weight: 500;
  }
  .el-breadcrumb {
    line-height: 15px;
    white-space: nowrap;
    .el-breadcrumb__item {
      position: relative;
      display: inline-block;
      // float: none;
      .item-no-icon {
        transform: translateY(-3px);
      }
      .el-breadcrumb__inner {
        display: inline-flex;
        line-height: 10px;
        &.is-link {
          color: var(--el-header-text-color);
          &:hover {
            color: var(--el-color-primary);
          }
        }
        .breadcrumb-icon {
          margin-right: 6px;
          font-size: 16px;
        }
      }
      &:last-child .el-breadcrumb__inner,
      &:last-child .el-breadcrumb__inner:hover {
        color: var(--el-header-text-regular-color);
      }
      :deep(.el-breadcrumb__separator) {
        transform: translateY(1px);
      }
    }
  }
}
/** 右侧向左侧移动，面包屑模糊 */
// .mask-image {
//   padding-right: 50px;
//   mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
// }
.breadcrumb-container {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0; /* 重要：允许宽度压缩 */
}

/* 遮罩效果 - 右侧渐变 */
.breadcrumb-fade {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--el-header-bg-color) 100%);
  pointer-events: none; /* 允许点击穿透 */
}
</style>
