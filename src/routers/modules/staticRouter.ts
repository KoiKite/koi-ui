import { RouteRecordRaw } from "vue-router";
import { HOME_URL, LOGIN_URL } from "@/config";
import Layout from "@/layouts/index.vue";

export const layoutRouter: RouteRecordRaw[] = [
  // {
  //   // 登录成功以后展示数据的路由[一级路由，可以将子路由放置Main模块中(核心)]
  //   path: "/", // 路由访问路径[唯一]
  //   name: "layout", // 命名路由[唯一]
  //   component: Layout, // 登录进入这个页面，这个页面是整个布局
  //   redirect: HOME_URL, // path路径，<router-link name="/404"> 也是使用path进行跳转
  //   children: [
  //     {
  //       path: HOME_URL, // [唯一]
  //       component: () => import("@/views/home/index.vue"),
  //       meta: {
  //         menuId: "-1", // menuId 和 activeMenu 的值必须有一个存在[唯一]
  //         title: "menu.home.auth", // 标题
  //         icon: "koi-home", // 图标 HomeFilled
  //         isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
  //         isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
  //         isTag: "1", // 是否显示标签[1是，0否]
  //         isAffix: "1" // 是否缓存固定路由[1是，0否]
  //       }
  //     }
  //   ]
  // },
  {
    path: LOGIN_URL,
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "menu.login.auth"
    }
  }
];

/**
 * staticRouter[静态路由]
 */
export const staticRouter: RouteRecordRaw[] = [
  /** 主控台 */
  // {
  //   path: HOME_URL, // [唯一]
  //   name: "homePage", // [唯一]
  //   component: () => import("@/views/home/index.vue"),
  //   meta: {
  //     menuId: "-2", // menuId 和 activeMenu 的值必须有一个存在[唯一]
  //     title: "menu.home.auth", // 标题
  //     icon: "koi-home", // 图标 HomeFilled
  //     isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
  //     linkUrl: "", // 是否外链[有值则是外链]
  //     isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
  //     isTag: "0", // 是否显示标签[1是，0否]
  //     isAffix: "1" // 是否缓存固定路由[1是，0否]
  //   }
  // },
  {
    // 登录成功以后展示数据的路由[一级路由，可以将子路由放置Main模块中(核心)]
    path: "/", // 路由访问路径[唯一]
    name: "layout", // 命名路由[唯一]
    component: Layout, // 登录进入这个页面，这个页面是整个布局
    redirect: HOME_URL, // path路径，<router-link name="/404"> 也是使用path进行跳转
    meta: {
      menuId: "-1", // menuId 和 activeMenu 的值必须有一个存在[唯一]
      title: "menu.home.auth", // 标题
      icon: "koi-home", // 图标 HomeFilled
      isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
      linkUrl: "", // 是否外链[有值则是外链]
      isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
      isTag: "0", // 是否显示标签[1是，0否]
      isAffix: "1" // 是否缓存固定路由[1是，0否]
    },
    children: [
      {
        path: HOME_URL, // [唯一]
        name: "homePage",
        component: () => import("@/views/home/index.vue"),
        meta: {
          menuId: "-2",
          title: "menu.home.work.name", // 标题
          icon: "koi-work", // 图标
          isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
          linkUrl: "", // 是否外链[有值则是外链]
          isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
          isTag: "0", // 是否显示标签[1是，0否]
          isAffix: "1" // 是否缓存固定路由[1是，0否]
        }
      },
      {
        path: "/analysis", // [唯一]
        name: "analysisPage",
        component: () => import("@/views/analysis/index.vue"),
        meta: {
          menuId: "-3",
          title: "menu.home.analysis.name", // 标题
          icon: "koi-analysis", // 图标
          isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
          linkUrl: "", // 是否外链[有值则是外链]
          isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
          isTag: "0", // 是否显示标签[1是，0否]
          isAffix: "0" // 是否缓存固定路由[1是，0否]
        }
      },
      {
        path: "/console", // [唯一]
        name: "consolePage",
        component: () => import("@/views/console/index.vue"),
        meta: {
          menuId: "-5",
          title: "menu.home.console.name", // 标题
          icon: "koi-console", // 图标
          isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
          linkUrl: "", // 是否外链[有值则是外链]
          isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
          isTag: "0", // 是否显示标签[1是，0否]
          isAffix: "0" // 是否缓存固定路由[1是，0否]
        }
      }
    ]
  },
  {
    path: "/system/static", // 路由访问路径[唯一]
    name: "staticPage", // 命名路由[唯一]
    component: Layout, // 一级路由，可以将子路由放置Main模块中
    meta: {
      title: "静态路由", // 标题
      icon: "House", // 图标
      isVisible: "0", // 代表路由在菜单中是否显示[1显示，0隐藏]
      linkUrl: "", // 是否外链[有值则是外链]
      isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
      isTag: "0", // 是否显示标签[1是，0否]
      isAffix: "0", // 是否缓存固定路由[1是，0否]
      activeMenu: HOME_URL // 默认选择哪个路由
    },
    children: [
      {
        path: "/system/dict/data/:dictType", // 路由访问路径[唯一]
        name: "dictDataPage", // 命名路由[唯一]
        component: () => import("@/views/system/dict/data.vue"), // 一级路由，可以将子路由放置Main模块中
        meta: {
          title: "menu.system.dictData.name", // 标题
          icon: "koi-message-favorite", // 图标
          isVisible: "0", // 代表路由在菜单中是否显示[1显示，0隐藏]
          linkUrl: "", // 是否外链[有值则是外链]
          isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
          isTag: "0", // 是否显示标签[1是，0否]
          isAffix: "0", // 是否缓存固定路由[1是，0否]
          activeMenu: "/system/dict/type" // 默认选择哪个路由
        }
      }
    ]
  }  
];

/**
 * errorRouter[错误页面路由]
 */
export const errorRouter = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/error/403.vue"),
    meta: {
      menuId: "-403",
      title: "menu.coding.403.name",
      icon: "QuestionFilled", // 菜单图标
      isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
      linkUrl: "", // 是否外链[有值则是外链]
      isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
      isTag: "0", // 是否显示标签[1是，0否]
      isAffix: "0" // 是否缓存固定路由[1是，0否]
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      menuId: "-404",
      title: "menu.coding.404.name",
      icon: "CircleCloseFilled", // 菜单图标
      isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
      linkUrl: "", // 是否外链[有值则是外链]
      isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
      isTag: "0", // 是否显示标签[1是，0否]
      isAffix: "0" // 是否缓存固定路由[1是，0否]
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/error/500.vue"),
    meta: {
      menuId: "-500",
      title: "menu.coding.500.name",
      icon: "WarningFilled", // 图标
      isVisible: "1", // 代表路由在菜单中是否显示[1显示，0隐藏]
      linkUrl: "", // 是否外链[有值则是外链]
      isKeepAlive: "1", // 是否缓存路由数据[1是，0否]
      isTag: "0", // 是否显示标签[1是，0否]
      isAffix: "0" // 是否缓存固定路由[1是，0否]
    }
  },
  // 找不到path将跳转404页面
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404.vue")
  }
];
