<template>
  <!-- 搜索菜单 -->
  <div style="position: relative; display: flex; align-items: center">
    <div
      class="hover:bg-[--el-header-toolbar-icon-hover-bg-color] koi-icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-pulse-i"
      @click="handleMenuOpen"
    >
      <el-tooltip :content="$t('header.searchMenu')">
        <KoiGlobalIcon name="koi-search" size="18" />
      </el-tooltip>
    </div>

    <el-dialog class="search-dialog" v-model="isShowSearch" :width="400" :show-close="false" top="8vh" :append-to-body="true">
      <div style="display: flex; flex-direction: column; height: 500px">
        <!-- 搜索输入框 -->
        <div>
          <el-input
            v-model="searchMenu"
            ref="menuInputRef"
            :placeholder="$t('header.menuSearch')"
            size="large"
            clearable
            prefix-icon="Search"
          ></el-input>
        </div>

        <!-- 搜索结果列表 -->
        <div v-if="searchList.length" style="flex: 1; overflow-y: auto; padding: 10px 20px" ref="menuListRef">
          <div
            v-for="item in searchList"
            :key="item.path"
            :class="['menu-item', { 'menu-active': item.path === activePath }]"
            :style="getMenuItemStyle(item)"
            @mouseenter="handleMouseEnter(item)"
            @mouseleave="handleMouseLeave"
            @click="handleClickMenuItem(item)"
          >
            <div style="display: flex; align-items: center; flex: 1; gap: 12px">
              <KoiGlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18" :style="getIconStyle(item)" />
              <el-icon v-else :style="getIconStyle(item)">
                <Menu />
              </el-icon>
              <span :style="getTitleStyle(item)">
                {{ item.localizedTitle }}
              </span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-else
          style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px"
          :image-size="80"
          :description="$t('msg.null')"
        />

        <!-- 快捷键提示 -->
        <div
          style="
            display: flex;
            justify-content: center;
            gap: 16px;
            padding: 10px 16px;
            border-top: 1px solid var(--el-border-color-lighter);
            background: linear-gradient(135deg, var(--el-fill-color-lighter), var(--el-fill-color-light));
          "
        >
          <el-button size="small" plain>↑↓ 选择</el-button>
          <el-button size="small" plain>↵ 确认</el-button>
          <el-button size="small" plain>ESC 关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { InputInstance } from "element-plus";
import useAuthStore from "@/stores/modules/auth.ts";
import { useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { getMenuLanguage } from "@/utils/index.ts";

const router = useRouter();
const authStore = useAuthStore();
const menuList: any = computed(() => authStore.menuList.filter((item: any) => item.meta.isVisible == "1" && item.meta.parentId != "0"));

// 转换菜单数据，添加国际化标题
const localizedMenuList: any = computed(() => {
  return menuList.value.map((item: any) => ({
    ...item,
    localizedTitle: getMenuLanguage(item.meta.title),
    originalTitle: item.meta.title
  }));
});

const activePath = ref("");
const hoveredItem = ref<string>("");

const handleMouseEnter = (item: any) => {
  hoveredItem.value = item.path;
  // 鼠标悬浮时也更新选中状态
  activePath.value = item.path;
};

const handleMouseLeave = () => {
  hoveredItem.value = "";
};

// 获取菜单项样式
const getMenuItemStyle = (item: any) => {
  const isActive = item.path === activePath.value;
  const isHovered = item.path === hoveredItem.value;

  const baseStyle = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "48px",
    padding: "0 16px",
    margin: "6px 0",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.3s ease"
  };

  if (isActive) {
    return {
      ...baseStyle,
      color: "#FFFFFF",
      background: "linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3))",
      border: "1px solid var(--el-color-primary)",
      transform: "translateY(-1px)",
      boxShadow: "0 6px 20px rgba(64, 158, 255, 0.3)"
    } as any;
  } else if (isHovered) {
    return {
      ...baseStyle,
      color: "var(--el-color-primary)",
      backgroundColor: "var(--el-color-primary-light-9)",
      border: "1px solid var(--el-color-primary-light-7)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    };
  } else {
    return {
      ...baseStyle,
      color: "var(--el-text-color-regular)",
      backgroundColor: "var(--el-fill-color-light)",
      border: "1px solid var(--el-border-color-lighter)",
      transform: "translateY(0)",
      boxShadow: "none"
    };
  }
};

// 获取图标样式
const getIconStyle = (item: any) => {
  const isActive = item.path === activePath.value;
  const isHovered = item.path === hoveredItem.value;

  return {
    fontSize: isActive || isHovered ? "18px" : "16px",
    color: isActive ? "#FFFFFF" : isHovered ? "var(--el-color-primary)" : "var(--el-text-color-secondary)",
    transition: "all 0.3s ease",
    flexShrink: 0,
    transform: isActive || isHovered ? "scale(1.1)" : "scale(1)"
  };
};

// 获取标题样式
const getTitleStyle = (item: any) => {
  const isActive = item.path === activePath.value;
  const isHovered = item.path === hoveredItem.value;

  return {
    fontSize: isActive || isHovered ? "15px" : "14px",
    fontWeight: isActive || isHovered ? "bold" : "normal",
    color: isActive ? "#FFFFFF" : isHovered ? "var(--el-color-primary)" : "var(--el-text-color-primary)",
    transition: "all 0.3s ease",
    lineHeight: "1.4",
    flex: 1
  };
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
    ? localizedMenuList.value.filter((item: any) => {
        const searchText = searchMenu.value.toLowerCase();
        const titleMatch = item.localizedTitle.toLowerCase().includes(searchText);
        const originalTitleMatch = item.originalTitle.toLowerCase().includes(searchText);
        const pathMatch = item.path.toLowerCase().includes(searchText);

        return (titleMatch || originalTitleMatch || pathMatch) && item.meta?.isVisible === "1";
      })
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
  } else if (event.key === "Escape") {
    event.preventDefault();
    isShowSearch.value = false;
    searchMenu.value = "";
  }
};

const handleClickMenuItem = (item: any) => {
  if (!item) return;
  // 更新选中状态
  activePath.value = item.path;
  // 延迟跳转，让用户看到选中效果
  setTimeout(() => {
    if (item.meta?.linkUrl) window.open(item.meta.linkUrl, "_blank");
    else router.push(item.path);
    searchMenu.value = "";
    isShowSearch.value = false;
  }, 150);
};

const handleClickMenu = () => {
  const menu = searchList.value.find((item: any) => item.path === activePath.value);
  if (!menu) return;
  handleClickMenuItem(menu);
};
</script>
