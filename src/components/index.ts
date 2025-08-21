import KoiSvgIcon from "./KoiSvgIcon/Index.vue";
import KoiDialog from "./KoiDialog/Index.vue";
import KoiDrawer from "./KoiDrawer/Index.vue";
import KoiToolbar from "./KoiToolbar/Index.vue";
import KoiTag from "./KoiTag/Index.vue";
import KoiSelectIcon from "./KoiSelectIcon/Index.vue";
import KoiUploadFiles from "./KoiUpload/Files.vue";
import KoiUploadImage from "./KoiUpload/Image.vue";
import KoiUploadImages from "./KoiUpload/Images.vue";
import KoiExcel from "./KoiExcel/Index.vue";
import KoiTagFilter from "./KoiTagFilter/Index.vue";
import KoiCard from "./KoiCard/Index.vue";
import KoiGlobalIcon from "./KoiGlobalIcon/Index.vue";
import KoiSearch from './KoiSearch/Index.vue';

import type { App, Component } from "vue";

/** 对外暴露插件对象，注册全局组件 */
const components: { [name: string]: Component } = {
  KoiSvgIcon,
  KoiDialog,
  KoiDrawer,
  KoiToolbar,
  KoiTag,
  KoiSelectIcon,
  KoiUploadFiles,
  KoiUploadImage,
  KoiUploadImages,
  KoiExcel,
  KoiTagFilter,
  KoiCard,
  KoiGlobalIcon,
  KoiSearch
};

export default {
  // install方法， Object.keys()得到对象所有的key
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key]);
    });
  }
};
