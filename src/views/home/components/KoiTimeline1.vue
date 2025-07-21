<template>
  <el-timeline>
    <el-timeline-item v-for="(activity, index) in activities" :key="index" :type="activity.type" :timestamp="activity.timestamp">
      {{ activity.content }}
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
const activities = [
  {
    content: "KOI-ADMIN 开启了崭新的人生！",
    timestamp: "2023-11-23 18:00:00",
    type: "primary"
  },
  {
    content: "企业级中后台管理平台",
    timestamp: "2023-11-23 18:00:00",
    type: "success"
  },
  {
    content: "四种布局方式，多种主题",
    timestamp: "2023-11-23 18:00:00",
    type: "warning"
  },
  {
    content: "ElementPlus + Vue3 + TypeScript + Pinia",
    timestamp: "2023-11-23 18:00:00",
    type: "info"
  },
  {
    content: "欢迎大家star和fork，喜欢的可以捐献哟",
    timestamp: "2023-11-23 18:00:00",
    type: "danger"
  },
  {
    content: "欢迎大家star和fork，喜欢的可以捐献哟",
    timestamp: "2023-11-23 18:00:00",
    type: "danger"
  }
];
</script>

<style scoped></style>
