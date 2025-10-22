<template>
  <div class="main-wrapper">
    <Maximize v-show="globalStore.maximize" />
    <Tabs v-if="showTabs && tabsStyle === 'card'"></Tabs>
    <GoogleTabs v-if="showTabs && tabsStyle === 'google'"></GoogleTabs>
    <!-- <el-main class="overflow-x-hidden flex flex-col flex-1 p-0 m-0 bg-#FAFBFC dark:bg-black"></el-main> -->
    <el-main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="transition" mode="out-in" appear>
          <keep-alive :max="16" :include="keepAliveStore.keepAliveName">
            <component :is="Component" :key="route.fullPath" v-if="isRouterShow" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide, onBeforeUnmount } from "vue";
import Maximize from "@/layouts/components/Main/components/Maximize.vue";
import { useDebounceFn } from "@vueuse/core";
import Tabs from "@/layouts/components/Tabs/index.vue";
import GoogleTabs from "@/layouts/components/Tabs/google.vue";
import { storeToRefs } from "pinia";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();

// 路由动画
const { transition, tabsStyle } = storeToRefs(globalStore);

const keepAliveStore = useKeepAliveStore();

// 刷新当前路由页面缓存方法
const isRouterShow = ref(true);

const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);

provide("refresh", refreshCurrentPage);

/** 监听当前页面是否最大化，动态添加 class */
watch(
  () => globalStore.maximize,
  () => {
    const app = document.getElementById("app") as HTMLElement;
    if (globalStore.maximize) app.classList.add("main-maximize");
    else app.classList.remove("main-maximize");
    // 浏览器没有实际变化的情况下，触发一次浏览器尺寸变化的逻辑。保证全屏切换的时候，表格阔以进行自适应。
    const event = new Event("resize");
    window.dispatchEvent(event);
  },
  { deep: true, immediate: true }
);

const screenWidth = ref(0);
const showTabs = ref(true);

/** 监听窗口大小变化，折叠侧边栏 */
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth;
  if (!globalStore.isCollapse && screenWidth.value < 1200) globalStore.setGlobalState("isCollapse", true);
  if (globalStore.isCollapse && screenWidth.value > 1200) globalStore.setGlobalState("isCollapse", false);
  showTabs.value = screenWidth.value >= 520;
}, 100);

window.addEventListener("resize", listeningWindow, false);

onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});
</script>

<style lang="scss" scoped>
@use "../../../styles/transition.scss";

.main-wrapper {
  // 最小化样式，只设置必要的布局属性
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; // 防止高度溢出
}

.main-content {
  overflow-x: hidden;
  flex: 1;
  padding: 0;
  margin: 0;
  background-color: #FAFBFC;
  min-height: 0;
  
  // 暗色模式
  .dark & {
    background-color: #000000;
  }
}
</style>
