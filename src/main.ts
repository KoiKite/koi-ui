import { createApp } from "vue";
import App from "./App.vue";

// 引入路由
import router from "./routers";
// 引入ElementPlus
import ElementPlus from "element-plus";
// 引入ElementPlus的css
import "element-plus/dist/index.css";
// @ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// 引入ElementPlus所有图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入ElementPlus的暗黑模式css
import "element-plus/theme-chalk/dark/css-vars.css";
// 引入I18n语言配置
import I18n from "@/languages/index";
// SVG插件配置
import "virtual:svg-icons-register";
// 引入animate
import "animate.css";
// 引入仓库pinia
import pinia from "./stores/index.ts";
// 引入styles
import "@/styles/index.scss";
// 引入全局组件配置
import KoiComponents from "@/components/index.ts";
// 引入全局自定义指令
import KoiDirectives from "@/directives/index";
// uncoss防止覆盖ElementPlus 的 el-button的css，所有放置最下方
import "uno.css";

// 创建app
const app = createApp(App);
// 注册ElementPlus
app.use(ElementPlus, {
  locale: zhCn
});
// 注册ElementPlus所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 注册路由
app.use(router);
// 注册pinia
app.use(pinia);
// 注册I18n
app.use(I18n);
// 注册自定义组件
app.use(KoiComponents);
// 注册全局自定义指令
app.use(KoiDirectives);
// 挂载
app.mount("#app");
