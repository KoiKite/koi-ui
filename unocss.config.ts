import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

export default defineConfig({
  shortcuts: [],
  presets: [
    presetWind3(),
    presetAttributify(), // class拆分属性预设
    presetTypography(), // 排版预设
    presetIcons({
      // 图标库预设
      scale: 1.2,
      warn: true
    })
  ],
  transformers: [
    transformerVariantGroup(), // windi CSS的变体组功能
    transformerDirectives() //  @apply @screen theme()转换器
  ]
});
