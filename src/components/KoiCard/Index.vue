<template>
  <div class="koi-card" :class="props.isFlex ? 'flex-1' : ''">
    <div class="p-b-8px">
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <div class="p-t-12px">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isFlex: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.koi-card {
  @apply m-x-6px m-y-5px overflow-hidden p-x-20px p-t-10px p-b-0 bg-#FFF text-#303133 border-1px border-solid border-#E5E7ED dark:border-#414243 dark:bg-#1D1E1F dark:text-#CFD3DC rounded-6px flex flex-col;
}
</style>
