<template>
  <transition name="el-zoom-in-bottom">
    <div class="koi-search" v-show="props.showSearch">
      <div
        class="flex flex-items-center p-b-12px transition-500 transition-ease-in-out hover:text-[--el-color-primary]"
        @click="handleFold"
      >
        <el-icon :size="14" class="transition-500 transition-ease-in-out" :class="{ 'rotate-180': showFold }">
          <ArrowDown />
        </el-icon>
        <div class="text-15px m-l-6px select-none">{{ $t("button.search") }}</div>
      </div>

      <el-collapse-transition>
        <slot v-if="showFold"></slot>
      </el-collapse-transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  isFold?: boolean;
  showSearch?: boolean;
}>();

const showFold = ref(false);

/* 折叠搜索表单 */
const handleFold = () => {
  showFold.value = !showFold.value;
};

onMounted(() => {
  if (props.isFold !== undefined) {
    showFold.value = props.isFold;
  }
});
</script>

<style lang="scss" scoped>
.koi-search {
  @apply m-x-6px m-t-5px overflow-hidden p-x-20px p-t-12px p-b-0 bg-#FFF text-#303133 border-1px border-solid border-#E5E7ED dark:border-#414243 dark:bg-#1D1E1F dark:text-#CFD3DC rounded-8px;
}
</style>
