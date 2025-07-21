<template>
  <!-- 使用方式：<KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleTableData"></KoiToolbar> -->
  <div class="koi-toolbar">
    <el-row>
      <el-tooltip :content="showSearch ? $t('button.hideSearch') : $t('button.displaySearch') " placement="top">
        <el-button circle icon="search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip :content="$t('button.refresh')" placement="top">
        <el-button circle icon="refresh" @click="handleRefresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["showSearch"]);
const emits = defineEmits(["update:showSearch", "refreshTable"]);

/** 点击子组件，调用父组件方法 */
const toggleSearch = () => {
  // 同步修改父子组件的值，但是父组件需要使用v-model:showSearch="showSearch"
  // @ts-ignore
  emits("update:showSearch", !props.showSearch);
};

/** 点击子组件，调用父组件方法 */
const handleRefresh = () => {
  emits("refreshTable");
};
</script>

<style lang="scss" scoped>
.koi-toolbar {
  margin-left: auto;
}
</style>
