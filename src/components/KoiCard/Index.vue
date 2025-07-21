<template>
  <div class="koi-card">
    <div class="p-b-8px">
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <div class="p-t-12px">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.koi-card {
  @apply overflow-hidden p-x-20px p-t-10px p-b-0px bg-#fff text-#303133 border-1px border-solid border-#e4e7ed dark:border-#414243 dark:bg-#1d1e1f dark:text-#cfd3dc rounded-6px flex flex-col flex-1;
}
</style>
