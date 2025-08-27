// 定义是否折叠小仓库[选择式Api写法]
import { defineStore } from "pinia";
import { CACHE_PREFIX, DEFAULT_THEME } from "@/config/index.ts";

// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const globalStore = defineStore("global", {
  // 开启数据持久化
  persist: {
    // enabled: true, // true 表示开启持久化保存
    key: CACHE_PREFIX + "global", // 默认会以 store 的 id 作为 key
    storage: localStorage
  },
  // 存储数据state
  state: () => {
    return {
      // 是否全屏
      isFullScreen: false,
      // 是否折叠菜单
      isCollapse: false,
      // 菜单展开宽度[默认：220px]
      menuWidth: 220,
      // 默认关闭黑暗模式
      isDark: false,
      // ElementPlus 尺寸大小
      dimension: "default",
      // 当前页面是否全屏
      maximize: false,
      // 当前系统语言[默认中文]
      language: "zh",
      // 选择主题[默认兔子坦克形态]
      themeColor: DEFAULT_THEME,
      // 布局模式 (纵向：vertical | 经典：classic | 横向：horizontal | 分栏：column)
      layout: "vertical",
      // 标签页风格
      tabsStyle: "google",
      // 路由动画
      transition: "fade-default",
      // 菜单是否可展开单个[默认：true仅仅一个]
      uniqueOpened: true,
      // 灰色模式
      isGrey: false,
      // 色弱模式
      isWeak: false,
      // 侧边栏反转
      asideInverted: false,
      // 头部反转
      headerInverted: false
    };
  },
  actions: {
    // 设置当前global.ts所有参数值
    setGlobalState(...args: any) {
      this.$patch({ [args[0]]: args[1] });
    },
    // 该函数没有上下文数据，所以获取state中的变量需要使用this
    setCollapse(value: boolean) {
      this.isCollapse = value;
      return this.isCollapse;
    },
    // 设置左侧菜单宽度
    setMenuWidth(value: number) {
      this.menuWidth = value;
      return this.menuWidth;
    },
    // 设置ElementPlus尺寸
    setDimension(value: string) {
      this.dimension = value;
    }
  },
  // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
  getters: {}
});

// 对外暴露方法
export default globalStore;
