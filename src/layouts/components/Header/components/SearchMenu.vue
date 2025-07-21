<template>
  <!-- 搜索菜单 -->
  <div class="search-menu hover:bg-[rgba(0,0,0,0.06)] hover:dark-bg-[rgba(255,255,255,0.1)] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-pulse-i" @click="handleMenuOpen">
    <el-tooltip :content="$t('header.searchMenu')">
      <KoiGlobalIcon name="koi-search" size="18" />
    </el-tooltip>
    <el-dialog class="search-dialog" v-model="isShowSearch" :width="600" :show-close="false" top="10vh">
      <el-input
        v-model="searchMenu"
        ref="menuInputRef"
        :placeholder="$t('header.menuSearch')"
        size="large"
        clearable
        :prefix-icon="Search"
      ></el-input>
      <div v-if="searchList.length" class="menu-list" ref="menuListRef">
        <div
          v-for="item in searchList"
          :key="item.path"
          :class="['menu-item', { 'menu-active': item.path === activePath }]"
          @mouseenter="mouseoverMenuItem(item)"
          @click="handleClickMenu()"
        >
          <div class="menu-lf">
            <el-icon class="menu-icon">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="menu-title">{{ item.meta.title }}</span>
          </div>
          <el-icon :size="20" @click="handleMenuOpen"><Search /></el-icon>
        </div>
      </div>
      <el-empty v-else class="m-t-80px m-b-80px" :image-size="100" :description="$t('msg.null')" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { InputInstance } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import useAuthStore from "@/stores/modules/auth.ts";
import { useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";

const router = useRouter();
const authStore = useAuthStore();
const menuList = computed(() => authStore.menuList.filter((item: any) => item.meta.isHide == "1" && item.meta.parentId != "0"));

const activePath = ref("");
const mouseoverMenuItem = (menu: any) => {
  activePath.value = menu.path;
};

const menuInputRef = ref<InputInstance | null>(null);
const isShowSearch = ref<boolean>(false);
const searchMenu = ref<string>("");

watch(isShowSearch, val => {
  if (val) {
    document.addEventListener("keydown", keyboardOperation);
  } else {
    document.removeEventListener("keydown", keyboardOperation);
  }
});

const handleMenuOpen = () => {
  isShowSearch.value = true;
  nextTick(() => {
    setTimeout(() => {
      menuInputRef.value?.focus();
    });
  });
};

const searchList = ref<any>([]);
const updateSearchList = () => {
  searchList.value = searchMenu.value
    ? menuList.value.filter(
        (item: any) =>
          (item.path.toLowerCase().includes(searchMenu.value.toLowerCase()) ||
            item.meta.title.toLowerCase().includes(searchMenu.value.toLowerCase())) &&
          item.meta?.isHide === "1"
      )
    : [];
  activePath.value = searchList.value.length ? searchList.value[0].path : "";
};

const debouncedUpdateSearchList = useDebounceFn(updateSearchList, 300);

watch(searchMenu, debouncedUpdateSearchList);

const menuListRef = ref<Element | null>(null);
const keyPressUpOrDown = (direction: number) => {
  const length = searchList.value.length;
  if (length === 0) return;
  const index = searchList.value.findIndex((item: any) => item.path === activePath.value);
  const newIndex = (index + direction + length) % length;
  activePath.value = searchList.value[newIndex].path;
  nextTick(() => {
    if (!menuListRef.value?.firstElementChild) return;
    const menuItemHeight = menuListRef.value.firstElementChild.clientHeight + 12 || 0;
    menuListRef.value.scrollTop = newIndex * menuItemHeight;
  });
};

const keyboardOperation = (event: KeyboardEvent) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    keyPressUpOrDown(-1);
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    keyPressUpOrDown(1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    handleClickMenu();
  }
};

const handleClickMenu = () => {
  const menu = searchList.value.find((item: any) => item.path === activePath.value);
  if (!menu) return;
  if (menu.meta?.isLink) window.open(menu.meta.isLink, "_blank");
  else router.push(menu.path);
  searchMenu.value = "";
  isShowSearch.value = false;
};
</script>

<style scoped lang="scss">
.search-menu {
  display: flex;
  align-items: center;
  :deep(.el-dialog) {
    border-radius: 4px;
    .el-dialog__header {
      display: none;
    }
  }
  .menu-list {
    max-height: 515px;
    margin-top: 15px;
    overflow: auto;
    .menu-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      padding: 0 20px;
      margin: 10px 0;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      background-color: transparent;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      transition: all 0.2s ease;
      .menu-lf {
        display: flex;
        align-items: center;
      }
      .menu-icon {
        margin-right: 8px;
        font-size: 16px;
      }
      .menu-title {
        font-size: 14px;
      }
    }
    .menu-active {
      color: #ffffff;
      background-color: var(--el-color-primary);
      .menu-icon {
        font-size: 18px;
      }
      .menu-title {
        font-size: 16px;
      }
    }
  }
}
</style>
