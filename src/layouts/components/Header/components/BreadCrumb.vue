<template>
  <div :class="['breadcrumb-box', 'mask-image']">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
          <!-- 使用 el-dropdown 包裹内容 -->
          <el-dropdown v-if="item.children && item.children.length > 0" @command="handleDropdownCommand">
            <span class="el-breadcrumb__inner is-link flex flex-items-center outline-none gap-x-4px">
              <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="16" />
              {{ getLanguage(globalStore.language, item.meta?.title, item.meta?.enName) }}
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>

            <!-- 下拉菜单内容 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="child in item.children" :key="child.path" :command="{ item: child, index }">
                  {{ getLanguage(globalStore.language, child.meta?.title, child.meta?.enName) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 没有子项则正常显示 -->
          <div v-else class="el-breadcrumb__inner is-link flex flex-items-center outline-none gap-x-4px" :class="{ 'item-no-icon': !item.meta.icon }"
            @click="handleBreadcrumb(item, index)">
            <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="16" />
            <span>
              {{ getLanguage(globalStore.language, item.meta?.title, item.meta?.enName) }}
            </span>
          </div>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HOME_URL, STATIC_URL } from "@/config/index.ts";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import useAuthStore from "@/stores/modules/auth.ts";
import { getLanguage } from "@/utils/index.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import { findRouteChildrenByActiveMenu } from "@/utils/index.ts";

const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const breadcrumbList = computed(() => {
  let breadcrumbData = authStore.getBreadcrumbList[route.matched[route.matched.length - 1].path] ?? [];
  // 子页面放置静态路由里面, activeMenu不存在值的时候，不符合子路由数据，则返回首页
  if (breadcrumbData[0].path === STATIC_URL && !breadcrumbData[1].meta?.activeMenu) {
    if (globalStore.language === "en") {
      // 英文
      return [{ path: HOME_URL, meta: { icon: "HomeFilled", title: "Master Station" } }];
    } else {
      return [{ path: HOME_URL, meta: { icon: "HomeFilled", title: "首页" } }];
    }
  }
  // 子页面放置静态路由里面, activeMenu存在值的时候
  if (breadcrumbData[0].path === STATIC_URL && breadcrumbData.length > 1 && breadcrumbData[1].meta?.activeMenu) {
    breadcrumbData = findRouteChildrenByActiveMenu(authStore.breadcrumbList, breadcrumbData[breadcrumbData.length - 1]?.meta?.activeMenu).concat(breadcrumbData[breadcrumbData.length - 1]);
  }
  // 不需要首页面包屑可注释以下判断
  // if (breadcrumbData[0].path !== HOME_URL) {
  //   breadcrumbData = [{ path: HOME_URL, meta: { icon: "HomeFilled", title: "主控台" } }, ...breadcrumbData];
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
  .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
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
        color: var(--el-header-text-color-regular);
      }
      :deep(.el-breadcrumb__separator) {
        transform: translateY(-1px);
      }
    }
  }
}
/** 右侧向左侧移动，面包屑模糊 */
.mask-image {
  padding-right: 50px;
  mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
}
</style>