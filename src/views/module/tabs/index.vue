<template>
  <div class="p-4px">
    <div>
      <el-input v-model="tabTitle" placeholder="请输入内容" style="width: 500px">
        <template #append>
          <el-button type="primary" @click="handleUpdateTabTitle">设置Tab标题</el-button>
        </template>
      </el-input>
    </div>
    <el-space class="mt-20px">
      <el-button type="info" :icon="Promotion" @click="handleToDetail('1')"> 打开详情页1 </el-button>
      <el-button type="primary" :icon="Promotion" @click="handleToDetail('2')"> 打开详情页2 </el-button>
      <el-button type="warning" :icon="Promotion" @click="handleToDetail('3')"> 打开详情页3 </el-button>
      <el-button type="success" :icon="Promotion" @click="handleToDetail('4')"> 打开详情页4 </el-button>
      <el-button type="danger" :icon="Promotion" @click="handleToDetail('5')"> 打开详情页5 </el-button>
    </el-space>
    <div class="h-20px"></div>
    <el-space class="mt-20px">
      <el-button type="info" :icon="Refresh" @click="handleRefresh">刷新当前页</el-button>
      <el-button type="primary" :icon="FullScreen" @click="handleMaximize">当前页全屏切换</el-button>
      <el-button type="warning" :icon="DArrowLeft" @click="handleCloseSideTabs('left')">关闭左侧标签页</el-button>
      <el-button type="success" :icon="DArrowRight" @click="handleCloseSideTabs('right')"> 关闭右侧标签页 </el-button>
      <el-button type="danger" :icon="Close" @click="handleCloseCurrentTab">关闭当前页</el-button>
      <el-button type="warning" :icon="Star" @click="handleCloseOtherTabs">关闭其他</el-button>
      <el-button type="danger" :icon="Remove" @click="handleCloseAllTabs">全部关闭</el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, ref } from "vue";
import { Refresh, FullScreen, Remove, Close, Star, DArrowLeft, DArrowRight, Promotion } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { koiMsgWarning } from "@/utils/koi.ts";

import useTabsStore from "@/stores/modules/tabs.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import useGlobalStore from "@/stores/modules/global.ts";
import { HOME_URL } from "@/config/index.ts";

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const tabsStore = useTabsStore();
const globalStore = useGlobalStore();

/** 打开详情页 */
const handleToDetail = (id: string) => {
  router.push(`/module/tabs/detail/${id}`);
};

/** 刷新当前页 */
const refreshCurrentPage: Function = inject("refresh") as Function;
const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name as string);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name as string);
      refreshCurrentPage(true);
    });
  }, 0);
};

/** 设置 Tab 标题 */
const tabTitle = ref("");
const handleUpdateTabTitle = () => {
  if (!tabTitle.value) return koiMsgWarning("请输入标题");
  tabsStore.setTabTitle(tabTitle.value);
};

/** 当前页全屏 */
const handleMaximize = () => {
  globalStore.setGlobalState("maximize", !globalStore.maximize);
};

/** 关闭左边 OR 右边选项卡 */
const handleCloseSideTabs = (direction: any) => {
  console.log("关闭左边 OR 右边选项卡", direction);
  tabsStore.closeSideTabs(route.fullPath, direction);
};

/** 关闭当前选项卡 */
const handleCloseCurrentTab = () => {
  console.log("关闭当前选项卡");
  if (route.meta?.isAffix == "0") return;
  tabsStore.removeTab(route.fullPath);
};

/** 关闭其他选项卡 */
const handleCloseOtherTabs = () => {
  console.log("关闭其他选项卡");
  tabsStore.closeManyTabs(route.fullPath);
};

/** 关闭全部选项卡 */
const handleCloseAllTabs = () => {
  console.log("关闭全部选项卡");
  tabsStore.closeManyTabs();
  router.push(HOME_URL);
};
</script>

<style scoped></style>
