<template>
  <div>
    <!-- 明亮模式 -->
    <el-tooltip :content="$t('header.lightMode')" v-if="!globalStore.isDark">
      <KoiSvgIcon name="koi-menu-sun" width="32" height="32" class="rounded-full p-6px bg-[rgba(50,50,50,0.06)] dark:bg-[rgba(255,255,255,0.06)] m-r-10px border-none outline-none" @click="handleSwitchDark"></KoiSvgIcon>
    </el-tooltip>
    <!-- 暗黑模式 -->
    <el-tooltip :content="$t('header.darkMode')" v-if="globalStore.isDark">
      <KoiSvgIcon name="koi-menu-moon" width="32" height="32" class="rounded-full p-6px bg-[rgba(50,50,50,0.06)] dark:bg-[rgba(255,255,255,0.06)] m-r-10px border-none outline-none" @click="handleSwitchDark"></KoiSvgIcon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from "@/utils/theme.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();
const { switchDark } = useTheme();

defineProps({
  size: {
    type: Number,
    default: 22
  }
});

/** 暗黑主题和明亮主题切换 */
const handleSwitchDark = async (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  // 画圆
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-ignore
  if (document.startViewTransition == undefined) {
    /** 明亮和暗黑模式核心逻辑 */
    // 定义图标切换变量(true-月亮，false-太阳)
    globalStore.setGlobalState("isDark", !globalStore.isDark);
    switchDark();
    /** 明亮和暗黑模式核心逻辑 */
  } else {
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      /** 明亮和暗黑模式核心逻辑 */
      // 定义图标切换变量(true-月亮，false-太阳)
      globalStore.setGlobalState("isDark", !globalStore.isDark);
      switchDark();
      /** 明亮和暗黑模式核心逻辑 */
    });
    await transition.ready;
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: globalStore.isDark ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: globalStore.isDark ? "::view-transition-new(root)" : "::view-transition-old(root)"
      }
    );
  }
};
</script>

<style lang="scss" scoped></style>
<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}
::view-transition-old(root) {
  z-index: 9999;
}
::view-transition-new(root) {
  z-index: 1;
}
.dark::view-transition-old(root) {
  z-index: 1;
}
.dark::view-transition-new(root) {
  z-index: 9999;
}
</style>
