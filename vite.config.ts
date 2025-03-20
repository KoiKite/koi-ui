import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// keepAlive 组件name
import vueSetupExtend from "vite-plugin-vue-setup-extend";
// 引入svg需要的插件
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Unocss from "unocss/vite";
// 数据mock配置
import { viteMockServe } from "vite-plugin-mock";
// gzip压缩
import viteCompression from "vite-plugin-compression";
// 图片压缩
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from "path";

// https://vitejs.dev/config/
// 配置mock根据官网，这里写法将改成箭头函数
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd()); // 获取配置文件别名配置
  return {
    plugins: [
      vue(),
      Unocss(),
      vueSetupExtend(),
      viteCompression(),
      ViteImageOptimizer(),
      createSvgIconsPlugin({
        // 配置SVG图片
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      // 配置mock
      viteMockServe({
        // 解析根目录下的mock文件夹
        mockPath: "mock",
        enable: command === "serve", // 保证开发阶段可以使用mock接口
        // @ts-ignore
        supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true  // 监视文件更改 更改mock的时候，不需要重新启动编译
        // prodEnabled:true // 设置打包是否启用mock功能
      })
    ],
    resolve: {
      // 配置路径别名
      alias: {
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
        "~": path.resolve("./src")
      }
    },
    css: {
      // css全局变量使用，@/styles/variable.scss文件
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variable.scss" as *;'
        }
      }
    },
    server: {
      host: "0.0.0.0", // 允许本机IP访问 0.0.0.0
      port: 5730, // 端口号
      hmr: true, // 热更新
      open: true, // 自动打开
      proxy: {
        // 代理跨域
        [env.VITE_WEB_BASE_API]: {
          // 配置哪个环境下的
          target: env.VITE_SERVER,
          rewrite: path => path.replace(new RegExp("^" + env.VITE_WEB_BASE_API), ""), // 路径重写，例如：将路径中包含dev-api字段替换为空。注意：只有请求真实后端接口才会有用，使用mock接口还是得带koi
          // 允许跨域
          changeOrigin: true
        }
      }
    },
    esbuild: {
      // 在生产环境全部去除console 和 debugger
      drop: env.VITE_DROP_CONSOLE.length < 5 ? ["console", "debugger"] : []
    },
    // 预编译，增加访问速度，针对node_modules
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "echarts",
        "vue-i18n",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/collapse-item/style/css",
        "element-plus/es/components/collapse/style/css",
        "element-plus/es/components/space/style/css",
        "element-plus/es/components/container/style/css",
        "element-plus/es/components/aside/style/css",
        "element-plus/es/components/main/style/css",
        "element-plus/es/components/header/style/css",
        "element-plus/es/components/button-group/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/transfer/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/tab-pane/style/css"
      ]
    }
  };
});
