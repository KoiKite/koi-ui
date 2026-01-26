<template>
  <!-- 使用方式：<KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleTableData"></KoiToolbar> -->
  <!-- 不显示全屏按钮 :showMaximize="false" -->
  <div class="koi-toolbar">
    <el-row>
      <el-tooltip :content="showSearch ? $t('button.hideSearch') : $t('button.displaySearch') " placement="top">
        <el-button circle icon="search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip :content="$t('button.refresh')" placement="top">
        <el-button circle icon="refresh" @click="handleRefresh()" />
      </el-tooltip>
      <el-button v-if="showMaximize" circle @click="handleMaximize()">
        <el-icon v-if="!isMaximize"><FullScreen /></el-icon>
        <el-icon v-else><Aim /></el-icon>
      </el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from "vue";
import { FullScreen, Aim } from "@element-plus/icons-vue";
import useGlobalStore from "@/stores/modules/global.ts";

interface IToolbarProps {
  showSearch?: boolean;
  showMaximize?: boolean;
}

const props = withDefaults(defineProps<IToolbarProps>(), {
  showSearch: true,
  showMaximize: true
});

const emits = defineEmits(["update:showSearch", "refreshTable"]);

const globalStore = useGlobalStore();

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

/** 全屏切换 */
const handleMaximize = () => {
  globalStore.setGlobalState("maximize", !globalStore.maximize);
  // 触发窗口resize事件，让表格自适应
  nextTick(() => {
    const event = new Event("resize");
    window.dispatchEvent(event);
  });
};

/** 是否全屏状态 */
const isMaximize = computed(() => globalStore.maximize);
</script>

<style lang="scss" scoped>
.koi-toolbar {
  margin-left: auto;
}
</style>
