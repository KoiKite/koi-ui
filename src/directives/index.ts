import { App } from "vue";
import auth from "./modules/auth";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import debounceInput from "./modules/debounceInput";
import throttle from "./modules/throttle";
import throttleInput from "./modules/throttleInput";
import adaptive from "./modules/adaptive";
import copy from "./modules/copy";

const directivesList: any = {
  auth,
  waterMarker,
  draggable,
  debounce,
  debounceInput,
  throttle,
  throttleInput,
  adaptive,
  copy
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      // 注册所有自定义指令
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
