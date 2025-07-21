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
    content: "舔狗日记",
    timestamp: "2023-11-23 18:00:00",
    type: "primary"
  },
  {
    content: "你好像从来没有对我说过晚安，我在我们的聊天记录里搜索了关键字：“晚安”，你说过一次：我早晚安排人弄死你！",
    timestamp: "2023-11-23 18:00:00",
    type: "success"
  },
  {
    content:
      "今天发工资了，我一个月工资1500，你猜我会给你多少？是不是觉得我会给你1200，自己留300吃饭？哈哈，我1500都给你，因为厂里包吃包住。",
    timestamp: "2023-11-23 18:00:00",
    type: "warning"
  },
  {
    content:
      "听说你想要一套化妆品，我算了算，明天我去公司里面扫一天厕所，就可以拿到200块钱，再加上我上个月攒下来的零花钱，刚好给你买一套迪奥。",
    timestamp: "2023-11-23 18:00:00",
    type: "info"
  },
  {
    content:
      "今天晚上有点冷，本来以为街上没人，结果刚刚偷电瓶的时候被抓了，本来想反抗，结果警察说了一句老实点别动，我立刻就放弃了抵抗，因为我记得你说过你喜欢老实人。",
    timestamp: "2023-11-23 18:00:00",
    type: "danger"
  }
];
</script>

<style scoped></style>
