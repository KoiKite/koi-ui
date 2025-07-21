<template>
  <div class="koi-logo flex flex-items-center p-l-5px" v-show="isShow">
    <div class="rounded-full" :style="{ width: logoSize, height: logoSize }" v-if="props.layout !== 'classic' && props.layout !== 'horizontal'">
      <el-image
        :src="logoUrl"
        fit="cover"
        class="w-100% h-100% rounded-full"
      >
        <template #error>
          <el-icon class="w-100% h-100% rounded-full text-[--el-color-primary]" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <div class="m-l--14px rounded-full" :style="{ width: logoSize, height: logoSize }" v-if="props.layout === 'classic'">
      <el-image
        :src="logoUrl"
        fit="cover"
        class="w-100% h-100% rounded-full"
      >
        <template #error>
          <el-icon class="w-100% h-100% rounded-full text-[--el-color-primary]" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <div class="m-l-6px rounded-full" :style="{ width: logoSize, height: logoSize }" v-if="props.layout === 'horizontal'">
      <el-image
        :src="logoUrl"
        fit="cover"
        class="w-100% h-100% rounded-full"
      >
        <template #error>
          <el-icon class="w-100% h-100% rounded-full text-[--el-color-primary]" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <el-tooltip :content="$t('project.title')" :show-after="2000" placement="right" v-if="props.layout !== 'classic' && props.layout !== 'horizontal'">
      <div class="chroma-text flex-1 m-l-10px font-bold truncate tracking-1px" :style="{ 'font-size': titleSize }" :class="titleAnimate" v-text="$t('project.title')" v-show="!props.isCollapse"></div>
    </el-tooltip>
    <el-tooltip :content="$t('project.title')" :show-after="2000" placement="right" v-else>
      <div class="chroma-text w-155px m-x-10px font-bold truncate tracking-1px" :style="{ 'font-size': titleSize }" :class="titleAnimate" v-text="$t('project.title')" v-show="!props.isCollapse"></div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import settings from "@/settings";
import logoUrl from "@/assets/images/logo/logo.webp";

// 接收父组件传递的参数
const props = defineProps({
  isCollapse: {
    require: false, // true显示，false隐藏
    type: Boolean
  },
  layout: {
    require: "vertical", // 布局模式[纵向：vertical | 分栏：columns | 经典：classic | 上左：optimum | 横向：horizontal]
    type: String
  }
});

const titleSize = ref(`${settings.loginTitleSize}px`);
const isShow = ref(settings.logoShow);
const logoSize = ref(settings.logoSize);
const titleAnimate = ref(settings.logoTitleAnimate);
</script>

<style lang="scss" scoped>
.koi-logo {
  height: $aside-header-height;
  line-height: $aside-header-height;
}
</style>
