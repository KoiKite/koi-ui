import useUserStore from "@/stores/modules/user.ts";
import useAuthStore from "@/stores/modules/auth.ts";

import { LOGIN_URL } from "@/config/index.ts";
// TS OR JS 中不能直接导入 import { useRouter } from "vue-router";
import router from "@/routers/index";

// const modules = import.meta.glob("@/views/**/*.vue");

export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  try {
    // 1、并行获取菜单列表 && 按钮权限列表 && 递归菜单数据
    await authStore.listRouters();
    await authStore.getLoginUserInfo();

    // 2、判断当前用户是否拥有菜单权限
    console.log("authStore.menuList", authStore.menuList);
    // Proxy对象转换为正常的JSON数据
    // const menuRouters = JSON.parse(JSON.stringify(authStore.menuList));
    if (!authStore.menuList?.length) {
      userStore.$reset();
      router.replace(LOGIN_URL);
      return;
    }

    // 3、添加动态路由[扁平化一级路由数据]
    // authStore.menuList.forEach((item: any) => {
    //   // if (item.component && typeof item.component == "string") {
    //   //   // 扁平化路由也需要构造component路由函数
    //   //   item.component = modules["/src/views/" + item.component + ".vue"];
    //   // }
    //   router.addRoute("layout", item);
    //   // if (item.isFull == "0") {
    //   //   // 如果是全屏的话，直接为整个页面
    //   //   router.addRoute(item);
    //   // } else {
    //   //   router.addRoute("layout", item);
    //   // }
    // });

    // 3、添加动态路由[扁平化一级路由数据]
    authStore.menuList.forEach((item: any) => {
      // 检查是否已存在同名路由
      if (!router.hasRoute(item.name)) {
        router.addRoute("layout", item);
      } else {
        console.warn(`路由名称冲突: ${item.name}，跳过添加`);
      }
    });

    // 4、检查所有路由是否都注册成功
    const allRoutes = router.getRoutes();
    const allRegistered = authStore.menuList.every((menu: any) => 
      allRoutes.some(route => route.name === menu.name)
    );

    if (!allRegistered) {
      console.log("路由注册失败，重新登录");
      userStore.$reset();
      router.replace(LOGIN_URL);
    }

  } catch (error) {
    console.log(error);
    // 当菜单请求出错时，重定向到登陆页
    userStore.setToken("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
