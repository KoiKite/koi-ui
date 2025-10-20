// 菜单路由权限[menuType[1-目录 2-菜单页面 3-按钮权限]当等于2时才是页面]
export const listRouters = [
  {
    menuId: 66,
    menuName: "工作台",
    parentId: 0,
    menuType: "2",
    path: "/workbench/index",
    name: "workbenchPage",
    component: "workbench/index",
    icon: "Histogram",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  // 系统管理
  {
    menuId: 1,
    menuName: "系统管理",
    parentId: 0,
    menuType: "1",
    path: "/system",
    name: "systemPage",
    component: "",
    icon: "Tools",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: "/system/user"
  },
  {
    menuId: 2,
    menuName: "用户管理",
    parentId: 1,
    menuType: "2",
    path: "/system/user",
    name: "userPage",
    component: "system/user/index",
    icon: "UserFilled",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  {
    menuId: 11,
    menuName: "角色管理",
    parentId: 1,
    menuType: "2",
    path: "/system/role",
    name: "rolePage",
    component: "system/role/index",
    icon: "CameraFilled",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  {
    menuId: 17,
    menuName: "菜单管理",
    parentId: 1,
    menuType: "2",
    path: "/system/menu",
    name: "menuPage",
    component: "system/menu/index",
    icon: "Menu",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  // 多级菜单
  {
    menuId: 666,
    menuName: "多级菜单",
    parentId: 0,
    menuType: "1",
    path: "/menus",
    name: "menusPage",
    component: "",
    icon: "KnifeFork",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: "/menus/menu1"
  },
  {
    menuId: 667,
    menuName: "菜单一",
    parentId: 666,
    menuType: "2",
    path: "/menus/menu1",
    name: "menu1Page",
    component: "menus/menu1",
    icon: "Coffee",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  {
    menuId: 668,
    menuName: "菜单二",
    parentId: 666,
    menuType: "1",
    path: "/menus/menu2",
    name: "menu2Page",
    component: "",
    icon: "Burger",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: "/menus/menu2"
  },
  {
    menuId: 669,
    menuName: "菜单三",
    parentId: 668,
    menuType: "2",
    path: "/menus/menu3",
    name: "menu3Page",
    component: "menus/menu2",
    icon: "Chicken",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  // 外部链接
  {
    menuId: 7,
    menuName: "外部链接",
    parentId: 0,
    menuType: "1",
    path: "/link",
    name: "linkPage",
    component: "",
    icon: "Link",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: "/link/gitee"
  },
  {
    menuId: 71,
    menuName: "Gitee仓库",
    parentId: 7,
    menuType: "2",
    path: "/link/gitee",
    name: "giteePage",
    component: "link/gitee/index",
    icon: "Soccer",
    isVisible: "1",
    linkUrl: "https://gitee.com/BigCatHome/koi-ui",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  {
    menuId: 72,
    menuName: "Github仓库",
    parentId: 7,
    menuType: "2",
    path: "/link/github",
    name: "githubPage",
    component: "link/github/index",
    icon: "Basketball",
    isVisible: "1",
    linkUrl: "https://gitee.com/BigCatHome/koi-ui",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  {
    menuId: 73,
    menuName: "Iframe页面",
    parentId: 7,
    menuType: "2",
    path: "/link/iframe",
    name: "iframePage",
    component: "link/iframe/index",
    icon: "Baseball",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  // 组件示例
  {
    menuId: 8,
    menuName: "组件示例",
    parentId: 0,
    menuType: "1",
    path: "/module",
    name: "modulePage",
    component: "",
    icon: "CoffeeCup",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: "/module/tabs"
  },
  {
    menuId: 81,
    menuName: "标签页操作",
    parentId: 8,
    menuType: "2",
    path: "/module/tabs",
    name: "tabsPage",
    component: "module/tabs/index",
    icon: "Watermelon",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  },
  {
    menuId: 82,
    menuName: "标签页明细",
    parentId: 8,
    menuType: "2",
    path: "/module/tabs/detail/:id",
    name: "tabsDetailPage",
    component: "module/tabs/detail",
    icon: "Pear",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "1",
    isTag: "0",
    isAffix: "0",
    redirect: ""
  }
];

export const loginUserInfo = {
  user: {
    userId: 1,
    loginName: "YU-ADMIN",
    sex: "1",
    avatar:
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fae90b4c7-98b6-4a47-b1b3-9ee8bc71acf6%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1692146441&t=6fca60f3a0d323869b81d8fb53b5dd1b"
  },
  roles: ["YU-ADMIN", "SUPER-ADMIN"],
  buttons: [
    "system:role:search",
    "system:role:list",
    "system:role:add",
    "system:role:delete",
    "system:role:update",
    "system:role:import",
    "system:role:export"
  ],
  permissions: "*"
};

export default [
  // 获取路由接口
  {
    url: "/mock/auth/listRouters", //请求地址
    method: "get", //请求方式
    response: () => {
      // 获取请求体携带过来用户ID
      return { status: 200, msg: "路由获取成功", data: listRouters };
    }
  },
  // 获取角色数据 AND 按钮数据 AND 用户信息
  {
    url: "/mock/auth/getLoginUserInfo", //请求地址
    method: "get", //请求方式
    response: () => {
      return { status: 200, msg: "用户信息获取成功", data: loginUserInfo };
    }
  }
];
