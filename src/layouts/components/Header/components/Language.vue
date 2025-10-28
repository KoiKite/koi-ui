<template>
  <el-tooltip placement="left" :content="$t('header.language')">
    <div class="hover:bg-[--el-header-toolbar-icon-hover-bg-color] w-36px h-36px rounded-md flex flex-justify-center flex-items-center koi-flip-i">
      <el-dropdown @command="handleChangeLanguage">
        <KoiGlobalIcon name="koi-translate" size="18" class="koi-icon" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in languageList"
              :key="item.value"
              :command="item.value"
              :disabled="language === item.value"
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
import { LanguageType } from "@/stores/interface/index.ts";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const languageList = ref<any>([]);

onMounted(() => {
  handleSwitchLanguage();
});

const handleSwitchLanguage = () => {
  // 当 language 变化时，手动触发 languageList 的更新
  languageList.value = [
    { label: t("header.languageList.chinese"), value: "zh" },
    { label: t("header.languageList.english"), value: "en" }
  ];
  document.title = t(String(route?.meta?.title));
};

/** 监听 globalStore.language 的变化 */
watch(
  () => globalStore.language,
  () => {
    handleSwitchLanguage();
  }
);

const handleChangeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
};
</script>

<style lang="scss" scoped></style>
