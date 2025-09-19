<template>
  <div class="overflow-x-hidden m-x-6px m-y-5px">
    <el-card class="rounded-md" shadow="hover">
      <div class="flex flex-items-center" v-waterMarker="{ text: 'KOI-ADMIN', textColor: '#D9D9D9' }">
        <img class="w-60px h-60px rounded-full select-none user-avatar" src="https://pic4.zhimg.com/v2-702a23ebb518199355099df77a3cfe07_1440w.webp" alt="avatar" />
        <div class="p-l-20px">
          <div class="font-bold p-b-8px whitespace-nowrap">
            <span>KOI-ADMIN/</span><span class="c-#6169FF" @click="handleKoiAdminGitee">前后端版本[169块]</span><span>/</span
            ><span class="c-#409EFF" @click="handleKoiUIGitee">纯前端[Gitee]</span><span>/</span
            ><span class="c-orange" @click="handleKoiUIGitHub">纯前端[GitHub]</span>
          </div>
          <div class="font-bold whitespace-nowrap">君可愿白衣饮茶，清风瘦马，再听一曲六月雨下。</div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="10" class="m-t-5px">
      <KoiNumberCard></KoiNumberCard>
      <el-col :span="24" class="m-t-5px">
        <el-card class="rounded-md w-full h-500px" shadow="hover">
          <template #header>
            <el-tag type="primary" effect="plain">日交易趋势</el-tag>
          </template>
          <KoiTradeChart></KoiTradeChart>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" class="m-t-5px">
        <el-card class="rounded-md h-450px" shadow="hover">
          <template #header>
            <el-tag type="primary" effect="plain">地区异常订单排行</el-tag>
          </template>
          <KoiLeftChart></KoiLeftChart>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24" class="m-t-5px">
        <el-card class="rounded-md h-450px" shadow="hover">
          <template #header>
            <el-tag type="primary" effect="plain">近10日订单量</el-tag>
          </template>
          <KoiRightChart></KoiRightChart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="m-t-5px">
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">
        <el-card class="rounded-md" shadow="hover">
          <KoiTimeline1></KoiTimeline1>
        </el-card>
      </el-col>
      <el-col :span="12" :lg="12" :md="12" :sm="24" :xs="24">
        <el-card class="rounded-md" shadow="hover">
          <KoiTimeline2></KoiTimeline2>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="homePage">
import { getDayText } from "@/utils/random.ts";
import { koiMsgSuccess } from "@/utils/koi.ts";
import KoiNumberCard from "./components/KoiCard.vue";
import KoiTradeChart from "./components/KoiTradeChart.vue";
import KoiLeftChart from "./components/KoiLeftChart.vue";
import KoiRightChart from "./components/KoiRightChart.vue";
import KoiTimeline1 from "./components/KoiTimeline1.vue";
import KoiTimeline2 from "./components/KoiTimeline2.vue";
import { onMounted } from "vue";

onMounted(() => {
  // 时间问候语
  koiMsgSuccess(getDayText());
});

// 前后端版本Gitee地址
const handleKoiAdminGitee = () => {
  koiMsgSuccess("前后端版本JAVA[169元]，博客版本 + 管理平台[366元]~");
};

// 纯前端Gitee地址
const handleKoiUIGitee = () => {
  window.open("https://gitee.com/BigCatHome/koi-ui", "_blank");
};

// 纯前端GitHub地址
const handleKoiUIGitHub = () => {
  koiMsgSuccess("前后端版本JAVA[169元]，博客版本 + 管理平台[366元]~");
};
</script>

<style lang="scss" scoped></style>
