<template>
  <svg :style="{ width: width + 'px', height: height + 'px', color: color || undefined }">
    <use :xlink:href="prefix + name"></use>
  </svg>
</template>

<script setup lang="ts">
// 组件使用，图标需要放置@/assets/icons文件夹下，图标名字需要跟name="图标名称"保持一致。
// <KoiSvgIcon name="koi-mobile-menu" width="30" height="30"></KoiSvgIcon>
defineProps({
  // xlink:href属性值的前缀
  prefix: {
    type: String,
    default: "#icon-"
  },
  // svg矢量图的名字
  name: String,
  // svg图标的颜色
  color: {
    type: String,
    default: ""
  },
  // svg宽度
  width: {
    type: String,
    default: "18"
  },
  // svg高度
  height: {
    type: String,
    default: "18"
  }
});
</script>
<style scoped></style>
