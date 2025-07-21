<template>
  <div class="p-4px">
    <KoiSvgIcon name="koi-mobile-menu" width="50px" height="50px"></KoiSvgIcon>
    <div class="h-20px"></div>
    <el-input v-model="copyData" placeholder="请输入内容" style="width: 300px">
      <template #append>
        <el-button @click="handleCopy">复制</el-button>
      </template>
    </el-input>
    <div class="h-20px"></div>
    <div class="h-20px"></div>
    <KoiSelectIcon width="300" v-model="iconValue"></KoiSelectIcon>
    <div class="h-20px"></div>
    <div class="h-20px"></div>
    <el-button type="primary" plain @click="handleEchoIcon">回显图标</el-button>
    <el-button type="danger" plain @click="handleResetIcon">重置图标</el-button>
    <!-- <div class="h-20px"></div>
    <div class="h-20px"></div>
    <KoiTag :tagOptions="koiDicts.sys_notice_type" :value="tagValue"></KoiTag>
    <div class="h-20px"></div>
    <el-select placeholder="请选择公告类型" v-model="noticeType" style="width: 240px" clearable>
      <el-option v-for="item in koiDicts.sys_notice_type" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
    </el-select> -->
  </div>
</template>

<script setup lang="ts" name="svgIconPage">
import { ref } from "vue";
import { koiMsgSuccess, koiMsgWarning, koiMsgError } from "@/utils/koi";

/** 第二种字典获取数据开始[每次进入页面一次获取所需要的数据源] */
// import { useKoiDict } from "@/hooks/dicts/index.ts";
// const { koiDicts } = useKoiDict(["sys_notice_type", "sys_user_sex"]);
// const tagValue = ref("1");
// const noticeType = ref();
/** 第二种字典获取数据结束 */

/** 复制指令开始 */

import { useClipboard } from "@vueuse/core";

const { copy, isSupported } = useClipboard();

const copyData = ref<string>("主人，妲己永远陪在你身边👻");

const handleCopy = () => {
  if (!isSupported) {
    koiMsgError("您的浏览器不支持Clipboard API");
    return;
  }
  if (!copyData.value) {
    koiMsgWarning("请输入要复制的内容");
    return;
  }
  copy(copyData.value);
  koiMsgSuccess(`复制成功：${copyData.value}`);
};

/** 复制指令结束 */

/** 图标选择器开始 */

const iconValue = ref();

const handleResetIcon = () => {
  iconValue.value = "Sunny";
};

const handleEchoIcon = () => {
  koiMsgSuccess(iconValue);
};

/** 图标选择器结束 */
</script>

<style scoped></style>
