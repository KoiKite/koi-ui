<template>
  <!-- 搜索菜单 -->
  <div class="menu-search-dialog hover:bg-[rgba(0,0,0,0.06)] hover:dark-bg-[rgba(255,255,255,0.1)] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center">
    <el-tooltip content="搜索菜单">
      <el-icon class="koi-icon" :size="20" @click="handleMenuOpen"><Search /></el-icon>
    </el-tooltip>
    <el-dialog v-model="isShowSearch" destroy-on-close :modal="false" :show-close="false" fullscreen @click="handleCloseSearch">
      <el-autocomplete
        ref="koiMenuRef"
        v-model="searchMenu"
        value-key="path"
        placeholder="菜单搜索：支持菜单名称、路径"
        :fetch-suggestions="searchMenuList"
        @select="handleClickMenu"
        @click.stop
      >
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
        <template #default="{ item }">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span> {{ item.meta.title }} </span>
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Search } from "@element-plus/icons-vue";

import { useRouter } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";

const router = useRouter();
const authStore = useAuthStore();
const menuList = computed(() => authStore.menuList.filter((item: any) => item.meta.isHide == "1" && item.meta.parentId != "0"));

// 过滤数据
const searchMenuList = (queryString: string, callBack: Function) => {
  const results = queryString ? menuList.value.filter(filterNodeMethod(queryString)) : menuList.value;
  callBack(results);
};

// 打开搜索框
const isShowSearch = ref(false);
const koiMenuRef = ref();
const searchMenu = ref("");
const handleMenuOpen = () => {
  isShowSearch.value = true;
  nextTick(() => {
    setTimeout(() => {
      koiMenuRef.value.focus();
    });
  });
};

// 搜索窗关闭
const handleCloseSearch = () => {
  isShowSearch.value = false;
};

// 筛选菜单
const filterNodeMethod = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
      restaurant.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1
    );
  };
};

// 点击菜单跳转
const handleClickMenu = (menuItem: any | Record<string, any>) => {
  searchMenu.value = "";
  handleCloseSearch();
  if (menuItem.meta.isLink) {
    window.open(menuItem.meta.isLink, "_blank");
  } else {
    router.push(menuItem.path);
  }
};
</script>

<style scoped lang="scss">
.menu-search-dialog {
  display: flex;
  align-items: center;
  :deep(.el-dialog) {
    background-color: rgb(0 0 0 / 50%);
    border-radius: 0 !important;
    box-shadow: unset !important;
    .el-dialog__header {
      border-bottom: none !important;
    }
  }
  :deep(.el-autocomplete) {
    position: absolute;
    top: 100px;
    left: 50%;
    width: 550px;
    transform: translateX(-50%);
    .el-input__wrapper {
      background-color: var(--el-bg-color);
    }
  }
}
.el-autocomplete__popper {
  .el-icon {
    position: relative;
    top: 2px;
    font-size: 16px;
  }
  span {
    margin: 0 0 0 10px;
    font-size: 14px;
  }
}
</style>
