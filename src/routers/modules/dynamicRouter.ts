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
    await Promise.all([
      authStore.listRouters(),
      authStore.getLoginUserInfo()
    ]);

    // 2、判断当前用户是否拥有菜单权限
    console.log("authStore.menuList", authStore.menuList);
    // Proxy对象转换为正常的JSON数据
    // const menuRouters = JSON.parse(JSON.stringify(authStore.menuList));
    if (authStore.menuList == null || authStore.menuList?.length == 0) {
      userStore.setToken("");
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

    // 3、添加动态路由[扁平化一级路由数据]，使用Promise.all批量添加路由
    const addRoutePromises = authStore.menuList.map((item: any) => {
      return new Promise<void>((resolve) => {
        router.addRoute("layout", item);
        // 延迟确保注册完成
        setTimeout(resolve, 10);
      });
    }); 

    await Promise.all(addRoutePromises);

  } catch (error) {
    console.log(error);
    // 当菜单请求出错时，重定向到登陆页
    userStore.setToken("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
