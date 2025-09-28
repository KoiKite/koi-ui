import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { koiMsgError, koiNoticeWarning, koiNoticeError } from "@/utils/koi.ts";
import { LOGIN_URL } from "@/config/index.ts";
import useUserStore from "@/stores/modules/user.ts";
import { getToken } from "@/utils/storage.ts";
import router from "@/routers/index.ts";
import i18n from "@/languages/index.ts";
import { ElMessageBox } from "element-plus";

// axios配置[不含加密版本]
const config = {
  // 接口请求的地址
  baseURL: import.meta.env.VITE_WEB_BASE_API,
  timeout: 12000
};
// 返回值类型
export interface Result<T = any> {
  code: number;
  msg: string;
  data: T;
  trackId: string;
}

class Yu {
  private instance: AxiosInstance;
  // 初始化
  constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.instance = axios.create(config);
    // 配置拦截器
    this.interceptors();
  }
  // 拦截器
  private interceptors() {
    // 请求发送之前的拦截器：携带token
    // @ts-ignore
    this.instance.interceptors.request.use(
      config => {
        // 获取token
        const token = getToken();
        if (token) {
          config.headers!["Authorization"] = "Bearer " + token;
        } else {
          delete config.headers!["Authorization"];
        }
        return config;
      },
      (error: any) => {
        error.data = {};
        error.data.msg = "服务器异常，请联系管理员";
        return error;
      }
    );
    // 请求返回之后的拦截器：数据或者状态
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // console.log("服务器状态", res.status);
        // 这里的后端可能是code OR status 和 msg OR message需要看后端传递的是什么？
        const status = res.data.status || res.data.code; // 后端返回数据状态
        if (status == 200) {
          return res.data;
        } else if (status == 401) {
          // 获取当前路由路径
          const currentPath = router.currentRoute.value.path;
          // 如果当前是登录页面，不显示提示框
          if (currentPath === "/" || currentPath === LOGIN_URL) {
            // 直接清除token并拒绝请求
            const userStore = useUserStore();
            userStore.setToken("");
            return Promise.reject(res.data);
          }

          // 非登录页面显示提示框
          return new Promise((_, reject) => {
            ElMessageBox.close();
            ElMessageBox.confirm(i18n.global.t("msg.confirmLogin"), i18n.global.t("msg.remind"), {
              confirmButtonText: i18n.global.t("button.confirm"),
              cancelButtonText: i18n.global.t("button.cancel"),
              type: "warning"
            })
              .then(() => {
                const userStore = useUserStore();
                userStore.setToken("");
                koiMsgError(i18n.global.t("msg.confirmLogin"));
                reject(i18n.global.t("button.confirm"));
                setTimeout(() => {
                  router.replace(LOGIN_URL).catch(err => {
                    console.error("路由跳转失败:", err);
                    window.location.href = LOGIN_URL;
                  });
                }, 0);
              })
              .catch(() => {
                koiNoticeWarning(i18n.global.t("msg.cancelled"));
                reject(i18n.global.t("msg.cancelled"));
              });
          });
        } else {
          // console.log("后端返回数据：", res.data.msg)
          koiNoticeError(res.data.msg + "" || "服务器偷偷跑到火星去玩了");
          return Promise.reject(res.data.msg + "" || "服务器偷偷跑到火星去玩了"); // 可以将异常信息延续到页面中处理，使用try{}catch(error){};
        }
      },
      (error: any) => {
        // 处理网络错误，不是服务器响应的数据
        // console.log("进入错误", error);
        error.data = {};
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              error.data.msg = "错误请求";
              koiNoticeError(error.data.msg);
              break;
            case 401:
              error.data.msg = "未授权，请重新登录";
              koiNoticeError(error.data.msg);
              break;
            case 403:
              error.data.msg = "对不起，您没有权限访问";
              koiNoticeError(error.data.msg);
              break;
            case 404:
              error.data.msg = "请求错误,未找到请求路径";
              koiNoticeError(error.data.msg);
              break;
            case 405:
              error.data.msg = "请求方法未允许";
              koiNoticeError(error.data.msg);
              break;
            case 408:
              error.data.msg = "请求超时";
              koiNoticeError(error.data.msg);
              break;
            case 500:
              error.data.msg = "服务器又偷懒了，请重试";
              koiNoticeError(error.data.msg);
              break;
            case 501:
              error.data.msg = "网络未实现";
              koiNoticeError(error.data.msg);
              break;
            case 502:
              error.data.msg = "网络错误";
              koiNoticeError(error.data.msg);
              break;
            case 503:
              error.data.msg = "服务不可用";
              koiNoticeError(error.data.msg);
              break;
            case 504:
              error.data.msg = "网络超时";
              koiNoticeError(error.data.msg);
              break;
            case 505:
              error.data.msg = "http版本不支持该请求";
              koiNoticeError(error.data.msg);
              break;
            default:
              error.data.msg = `连接错误${error.response.status}`;
              koiNoticeError(error.data.msg);
          }
        } else {
          error.data.msg = "连接到服务器失败";
          koiNoticeError(error.data.msg);
        }
        return Promise.reject(error); // 将错误返回给 try{} catch(){} 中进行捕获，就算不进行捕获，上方 res.data.status != 200 也会抛出提示。
      }
    );
  }
  // Get请求
  get<T = Result>(url: string, params?: object): Promise<T> {
    return this.instance.get(url, { params });
  }
  // Post请求
  post<T = Result>(url: string, data?: object): Promise<T> {
    return this.instance.post(url, data);
  }
  // Put请求
  put<T = Result>(url: string, data?: object): Promise<T> {
    return this.instance.put(url, data);
  }
  // Delete请求 /yu/role/1
  delete<T = Result>(url: string): Promise<T> {
    return this.instance.delete(url);
  }
  // 图片上传
  upload<T = Result>(url: string, formData?: object): Promise<T> {
    return this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  // 导出Excel
  exportExcel<T = Result>(url: string, params?: object): Promise<T> {
    return axios.get(import.meta.env.VITE_SERVER + url, {
      params,
      headers: {
        Accept: "application/vnd.ms-excel",
        Authorization: "Bearer " + getToken()
      },
      responseType: "blob"
    });
  }
  // 下载
  download<T = Result>(url: string, data?: object): Promise<T> {
    return axios.post(import.meta.env.VITE_SERVER + url, data, {
      headers: {
        Authorization: "Bearer " + getToken()
      },
      responseType: "blob"
    });
  }
}

export default new Yu(config);
