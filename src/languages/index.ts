import { createI18n } from "vue-i18n";

import zh from "./modules/zh";
import en from "./modules/en";

/**
 * @description 安全获取浏览器语言
 */
const getSafeBrowserLang = (): string => {
  try {
    // 1. 检查是否在浏览器环境中
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return 'en'; // 非浏览器环境返回默认
    }
    
    // 2. 获取语言信息
    const browserLang = navigator.language || (navigator as any).browserLanguage;
    
    // 3. 处理可能的空值
    if (!browserLang) return 'en';
    
    // 4. 标准化并匹配语言
    const lang = browserLang.toLowerCase().split('-')[0]; // 取基础语言码
    return ["zh", "cn"].includes(lang) ? "zh" : "en";
  } catch (error) {
    console.error("Error detecting browser language:", error);
    return "en"; // 出错时返回默认
  }
};

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: getSafeBrowserLang(),
  messages: {
    zh,
    en
  }
});

export default i18n;
