// 定义是否折叠小仓库[选择式Api写法]
import { defineStore } from "pinia";
import { CACHE_PREFIX } from "@/config";
// defineStore方法执行会返回一个函数，函数的作用就是让组件可以获取到仓库数据
const userStore = defineStore("user", {
  // 开启数据持久化
  persist: {
    // enabled: true, // true 表示开启持久化保存，默认localStorage
    key: CACHE_PREFIX + "user", // 默认会以 store 的 id 作为 key
    storage: localStorage
  },
  // 可以通过为属性指定选项来配置持久化方式persist
  // persist: {
  //     paths: ['isCollapse'],
  //     storage: sessionStorage
  // },
  // 存储数据state
  state: (): any => {
    return {
      token: "",
      loginName: ""
    };
  },
  // 该函数没有上下文数据，所以获取state中的变量需要使用this
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set Login Name
    setLoginName(loginName: string) {
      this.loginName = loginName;
    }
  },
  // 计算属性，和vuex是使用一样，getters里面不是方法，是计算返回的结果值
  getters: {}
});

// 对外暴露方法
export default userStore;
