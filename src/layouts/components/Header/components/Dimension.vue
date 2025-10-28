<template>
  <el-tooltip placement="left" :content="$t('header.componentSize')">
    <div class="hover:bg-[--el-header-toolbar-icon-hover-bg-color] w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-flip-i">
      <el-dropdown @command="handleDimension">
        <KoiGlobalIcon name="koi-convert-cube" size="18" class="koi-icon" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in dimensionList"
              :key="item.value"
              :command="item.value"
              :disabled="dimension === item.value"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import useGlobalStore from "@/stores/modules/global.ts";
import { koiMsgSuccess } from "@/utils/koi.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const globalStore = useGlobalStore();
const dimension = computed(() => globalStore.dimension);

const dimensionList = ref<any>([]);

onMounted(() => {
  handleSwitchLanguage();
});

const handleSwitchLanguage = () => {
  dimensionList.value = [
    { label: t("header.dimensionList.default"), value: "default" },
    { label: t("header.dimensionList.large"), value: "large" },
    { label: t("header.dimensionList.small"), value: "small" }
  ];
};

/** 监听 globalStore.language 的变化 */
watch(
  () => globalStore.language,
  () => {
    // 当 language 变化时，手动触发 dimensionList 的更新
    handleSwitchLanguage();
  }
);

const handleDimension = (item: string) => {
  if (dimension.value === item) return;
  globalStore.setDimension(item);
  koiMsgSuccess(t("msg.success"));
};
</script>

<style lang="scss" scoped></style>
