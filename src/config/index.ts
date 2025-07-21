// 全局默认配置项
// 首页地址[默认]
export const HOME_URL: string = "/home";

// 跳转子页面静态路由父级节点
export const STATIC_URL: string = "/system/static";

// 登录页地址[默认]
export const LOGIN_URL: string = "/login";

// pinia仓库前缀
export const CACHE_PREFIX: string = "koi-";

// Svg本地图片使用 koi- 开头才会生效
export const SVG_PREFIX: string = "koi-";

// 默认主题颜色
export const DEFAULT_THEME: string = "#2992FF";

// 路由白名单地址[本地存在的路由 staticRouter.ts 中]
export const ROUTER_WHITE_LIST: string[] = ["/500"];
