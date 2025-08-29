<template>
  <div>
    <!-- 语言翻译 -->
    <el-tooltip placement="left" :content="$t('header.language')">
      <el-dropdown @command="handleChangeLanguage" style="vertical-align: baseline;">
        <KoiSvgIcon
          name="koi-earth"
          width="32"
          height="32"
          class="rounded-full p-6px bg-[rgba(50,50,50,0.06)] dark:bg-[rgba(255,255,255,0.06)] m-r-10px border-none outline-none"
        ></KoiSvgIcon>
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
    </el-tooltip>
  </div>
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

<style scoped></style>
