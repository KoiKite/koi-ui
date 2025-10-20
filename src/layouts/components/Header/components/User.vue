<template>
  <div class="user-container">
    <el-popover
      placement="bottom-end"
      :width="240"
      trigger="hover"
      :show-arrow="false"
      :offset="2"
      popper-style="border-radius: 10px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);"
    >
      <template #reference>
        <el-image class="w-32px h-32px rounded-full select-none user-avatar" :src="avatar"></el-image>
      </template>

      <!-- 用户信息卡片内容 -->
      <div class="user-card-content">
        <div class="user-card-header">
          <el-image class="w-36px h-36px rounded-full select-none" :src="avatar"></el-image>
          <div class="user-info">
            <div class="user-name">{{ userName }}</div>
            <div class="user-phone">{{ userPhone }}</div>
          </div>
        </div>
        <div class="user-card-menu">
          <div
            class="user-menu-item"
            @click="handleCommand('koiMine')"
          >
            <el-icon :size="15"><User /></el-icon>
            <span>{{ $t("header.personalCenter") }}</span>
          </div>
        </div>
        <div class="user-card-footer">
          <el-button icon="SwitchButton" plain @click="handleCommand('logout')">
            {{ $t("header.logout") }}
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { koiSessionStorage } from "@/utils/storage.ts";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import useAuthStore from "@/stores/modules/auth.ts";
import useUserStore from "@/stores/modules/user.ts";
import useTabsStore from "@/stores/modules/tabs.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";

const authStore = useAuthStore();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const router = useRouter();

// 用户姓名
const userName = ref("于心");
// 手机号码
const userPhone = ref("18888888888");
// 用户头像
const avatar = ref("https://pic4.zhimg.com/v2-702a23ebb518199355099df77a3cfe07_1440w.webp");

/** 退出登录 */
const handleLayout = () => {
  // 清除 sessionStorage
  koiSessionStorage.clear();
  // 清除用户 token
  userStore.setToken("");
  // 清除 tabs 数据
  tabsStore.$reset();
  // 清除 keepAlive 缓存
  keepAliveStore.$reset();
  // 清除 auth store 数据[重置为初始状态]
  authStore.$reset();
  // 退出登录，必须使用replace把页面缓存刷掉。
  window.location.replace(LOGIN_URL);
};

// 下拉折叠
const handleCommand = (command: string | number) => {
  switch (command) {
    case "koiMine":
      router.push("/system/personage");
      break;
    case "logout":
      handleLayout();
      break;
  }
};
</script>

<style lang="scss" scoped>
// 用户容器
.user-container {
  margin-left: 6px;
  position: relative;
  display: flex;
  align-items: center;
}

// 用户头像悬停效果
.user-avatar {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.05);
  }
}

// 卡片内容容器
.user-card-content {
  padding: 0px;
}

// 卡片头部
.user-card-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 10px;
}

.user-info {
  margin-left: 12px;
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 3px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.user-phone {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

// 卡片菜单
.user-card-menu {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.user-menu-item {
  display: flex;
  align-items: center;
  width: auto;
  height: 36px;
  padding: 8px 10px;
  font-size: 13px;
  user-select: none;
  background-color: transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  line-height: 1;
  font-display: swap;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  .el-icon {
    margin-right: 8px;
    font-size: 14px;
    flex-shrink: 0;
  }

  span {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    line-height: 1;
    font-display: swap;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

.user-menu-item:hover .el-icon {
  animation: koi-jelly 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes koi-jelly {
  0% {
    transform: scale(1, 1) rotate(0deg);
    transform-origin: center;
  }
  15% {
    transform: scale(1.25, 0.8) rotate(0deg);
  }
  30% {
    transform: scale(0.85, 1.1) rotate(-2deg);
  }
  45% {
    transform: scale(1.05, 0.95) rotate(1deg);
  }
  60% {
    transform: scale(0.95, 1.02) rotate(-1deg);
  }
  75% {
    transform: scale(1.02, 0.98) rotate(0.5deg);
  }
  90% {
    transform: scale(0.98, 1.01) rotate(-0.3deg);
  }
  100% {
    transform: scale(1, 1) rotate(0deg);
  }
}

.user-card-footer {
  display: flex;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 10px;
  .el-button {
    width: 100%;
  }
}
</style>
