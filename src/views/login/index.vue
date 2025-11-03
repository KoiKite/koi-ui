<template>
  <div class="w-screen h-screen">
    <el-row class="h-100%">
      <!-- 登录工具栏 -->
      <div class="flex flex-items-center pos-absolute top-8px right-8px z-10 h-40px p-y-2px p-x-12px bg-#F4F4F5 dark:bg-#141414 border-1px border-solid border-#E4E7ED dark:border-#4C4D4F rounded-20px shadow-[0_4px_12px_rgb(0_0_0_/_15%)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] transition-all transition-300ms transition-ease">
        <KoiThemeColor></KoiThemeColor>
        <KoiLanguage></KoiLanguage>
        <KoiDark></KoiDark>
      </div>

      <el-col :lg="16" :md="12" :sm="15" :xs="0" class="flex flex-items-center flex-justify-center">
        <div class="login-background w-100% h-100%">
          <!-- 第二层：毛玻璃覆盖层 -->
          <div class="glass-overlay"></div>

          <!-- 第三层：内容层[在毛玻璃层之上] -->
          <div class="pos-absolute text-center select-none transition-all transition-ease transition-500 content-layer">
            <el-image
              class="w-360px max-w-500px h-336px m-b-50px animate-float-picture <md:hidden <lg:h-320px <lg:max-w-400px"
              :src="bg"
            />
            <div class="text-2xl font-400 text-[--el-text-color-primary] m-b-8px text-center <lg:text-xl <md:hidden">
              {{ $t("menu.login.welcome") }} {{ $t("menu.login.title") || "KOI-ADMIN 管理平台" }}
            </div>
            <div class="text-16px text-[--el-text-color-primary] font-400 text-center <md:hidden">
              {{ $t("menu.login.description") }}
            </div>
          </div>
          <!-- 备案号-->
          <div class="bei-an-hao select-none <md:hidden">
            <a class="text-[--el-text-color-primary]" href="https://beian.miit.gov.cn/" target="_blank"
              >{{ $t("menu.login.beiAnHao") }}：豫ICP备2022022094号-1</a
            >
          </div>
        </div>
      </el-col>
      <el-col
        :lg="8"
        :md="12"
        :sm="9"
        :xs="24"
        class="dark:bg-#0C0C0C bg-gray-50 flex flex-items-center flex-justify-center flex-col"
      >
        <div class="flex flex-items-center">
          <el-image class="rounded-full w-36px h-36px" :src="logo" />
          <div class="m-l-6px font-500 text-xl">{{ $t("menu.login.title") || "KOI-ADMIN 管理平台" }}</div>
        </div>
        <div class="flex flex-items-center space-x-12px text-gray-400 m-y-18px">
          <span class="h-1px w-64px bg-gray-300 inline-block"></span>
          <span class="text-center">{{ $t("menu.login.account") }}</span>
          <span class="h-1px w-64px bg-gray-300 inline-block"></span>
        </div>
        <!-- 输入框盒子 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="w-260px">
          <el-form-item prop="loginName">
            <el-input
              type="text"
              :placeholder="$t('menu.login.form.loginName')"
              :suffix-icon="User"
              v-model="loginForm.loginName"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :placeholder="$t('menu.login.form.password')"
              show-password
              :suffix-icon="Lock"
              v-model="loginForm.password"
            />
          </el-form-item>
          <el-form-item prop="securityCode">
            <el-input
              type="text"
              :placeholder="$t('menu.login.form.securityCode')"
              :suffix-icon="Open"
              v-model="loginForm.securityCode"
              @keydown.enter="handleKoiLogin"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-image
              class="w-100px h-30px border-1px border-solid border-[--el-border-color-light] rounded-4px"
              :src="loginForm.captchaPicture"
              @click="handleCaptcha"
            />
            <el-button text size="small" class="m-l-6px" @click="handleCaptcha">
              <div class="text-gray-400 hover:text-[--el-color-primary] select-none">{{ $t("menu.login.picture") }}</div>
            </el-button>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              v-if="!loading"
              class="w-100% bg-[--el-color-primary]"
              round
              v-throttle:3000="handleKoiLogin"
              >{{ $t("menu.login.in") }}</el-button
            >
            <el-button type="primary" v-else class="w-100%" round :loading="loading">{{ $t("menu.login.loading") }}</el-button>
          </el-form-item>
        </el-form>
        <!-- 备案号-->
        <div class="bei-an-hao select-none lg:hidden md:hidden">
          <a class="text-[--el-text-color-primary]" href="https://beian.miit.gov.cn/" target="_blank"
            >{{ $t("menu.login.beiAnHao") }}：豫ICP备2022022094号-1</a
          >
        </div>
      </el-col>
    </el-row>

    <KoiLoading></KoiLoading>
  </div>
</template>

<script lang="ts" setup>
import { User, Lock, Open } from "@element-plus/icons-vue";
// @ts-ignore
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";

import type { FormInstance, FormRules } from "element-plus";
import { koiMsgWarning, koiMsgError } from "@/utils/koi.ts";
import { useRouter } from "vue-router";
// import { koiLogin, getCaptcha } from "@/api/system/login/index.ts";
import authLogin from "@/assets/json/authLogin.json";
import useUserStore from "@/stores/modules/user.ts";
import useKeepAliveStore from "@/stores/modules/keepAlive.ts";
import { HOME_URL, LOGIN_URL } from "@/config/index.ts";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter.ts";
import useTabsStore from "@/stores/modules/tabs.ts";
import logo from "@/assets/images/logo/logo.webp";
import bg from "@/assets/images/login/bg.png";
import KoiDark from "@/layouts/components/Header/components/Dark.vue";
import KoiLoading from "./components/KoiLoading.vue";
import KoiLanguage from "@/layouts/components/Header/components/Language.vue";
import KoiThemeColor from "./components/KoiThemeColor.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
const router = useRouter();
const loginFormRef = ref<FormInstance>();
const loading = ref(false);

interface ILoginUser {
  loginName: string;
  password: string | number;
  securityCode: string | number;
  codeKey: string | number;
  captchaPicture: any;
}

const loginForm = reactive<ILoginUser>({
  loginName: "yuadmin",
  password: "yuadmin123",
  securityCode: "1234",
  codeKey: "",
  captchaPicture: ""
});

const loginRules: any = reactive<FormRules<ILoginUser>>({
  loginName: [
    { required: true, message: t("menu.login.rules.loginName.required"), trigger: "blur" },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          callback(new Error(t("menu.login.rules.loginName.validator")));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  password: [
    { required: true, message: t("menu.login.rules.password.required"), trigger: "blur" },
    { min: 6, max: 20, message: t("menu.login.rules.password.validator1"), trigger: "blur" },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (!/^(?=.*\d)(?=.*[a-zA-Z]).+$/.test(value)) {
          callback(new Error(t("menu.login.rules.password.validator2")));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  securityCode: [{ required: true, message: t("menu.login.rules.securityCode.required"), trigger: "blur" }]
});

/** 获取验证码 */
const handleCaptcha = async () => {
  userStore.setToken("");
  
  // try {
  //   const res: any = await getCaptcha();
  //   loginForm.codeKey = res.data.codeKey;
  //   loginForm.captchaPicture = res.data.captchaPicture;
  // } catch (error) {
  //   console.log(error);
  //   koiMsgError(t("msg.yzmFail"));
  // }
};

// const koiTimer = ref();
// // 验证码定时器
// const getCaptchaTimer = () => {
//   koiTimer.value = setInterval(() => {
//     // 执行刷新数据的方法
//     handleCaptcha();
//   }, 345 * 1000);
// };

// 进入页面加载管理员信息
onMounted(() => {
  // 获取验证码
  handleCaptcha();
  // 局部刷新定时器
  // getCaptchaTimer();
});

// onUnmounted(() => {
//   // 清除局部刷新定时器
//   clearInterval(koiTimer.value);
//   koiTimer.value = null;
// });

/** 登录 */
const handleKoiLogin = () => {
  if (!loginFormRef.value) return;
  (loginFormRef.value as any).validate(async (valid: any, fields: any) => {
    // @ts-ignore
    const loginName = loginForm.loginName;
    // @ts-ignore
    const password = loginForm.password;
    // @ts-ignore
    const securityCode = loginForm.securityCode;
    // @ts-ignore
    const codeKey = loginForm.codeKey;
    if (valid) {
      try {
        loading.value = true;
        // 1、执行登录接口
        // const res: any = await koiLogin({ loginName, password, codeKey, securityCode });
        // userStore.setToken(res.data.tokenValue);
        userStore.setToken(authLogin.data.tokenValue);

        // 2、添加动态路由 AND 用户按钮 AND 角色信息 AND 用户个人信息
        if (userStore?.token) {
            await initDynamicRouter(); // 等待 initDynamicRouter 完成
        } else {
          koiMsgWarning(t("msg.logIn"));
          router.replace(LOGIN_URL);
          return;
        }

        // 3、清空 tabs数据、keepAlive缓存数据
        if (userStore.loginName) {
          if (userStore.loginName !== loginName) {
            tabsStore.$reset();
            userStore.setLoginName(loginName);
          }
        } else {
          tabsStore.$reset();
          userStore.setLoginName(loginName);
        }

        keepAliveStore.$reset();

        // 4、等待所有响应式更新和路由注册完成
        await nextTick();

        // 5、跳转到首页（所有操作完成后）
        await router.replace(HOME_URL);
      } catch (error) {
        // 等待1秒关闭loading
        let loadingTime = 1;
        setInterval(() => {
          loadingTime--;
          if (loadingTime === 0) {
            loading.value = false;
          }
        }, 1000);
      } finally {
        loading.value = false;
      }
    } else {
      console.log("登录校验失败", fields);
      koiMsgError(t("msg.validFail"));
    }
  });
};
</script>

<style lang="scss" scoped>
/** 备案号 */
.bei-an-hao {
  position: absolute !important;
  bottom: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  font-size: 12px;
  font-weight: normal;
  text-align: center;
  z-index: 10 !important;
  white-space: nowrap;
  padding-bottom: 10px;
  width: 100%;
}

.bei-an-hao a {
  font-size: 12px;
}

.login-background {
  position: relative;
  overflow: hidden;
  /* 使用少量渐变图形创建简洁的背景效果 */
  background:
    /* 大型椭圆渐变 - 右上角 */
    radial-gradient(ellipse 600px 450px at 85% 20%, rgba(var(--el-color-primary-rgb), 0.10), transparent 70%),
    /* 圆形渐变 - 左下角 */
    radial-gradient(500px circle at 25% 80%, rgba(var(--el-color-primary-rgb), 0.09), transparent 65%),
    /* 中型圆形渐变 - 中心 */
    radial-gradient(350px circle at 50% 50%, rgba(var(--el-color-primary-rgb), 0.08), transparent 60%),
    var(--el-bg-color-page, #F8F8F8);
}

html.dark .login-background {
  background:
    /* 大型椭圆渐变 - 右上角 */
    radial-gradient(ellipse 600px 450px at 85% 20%, rgba(255, 255, 255, 0.35), transparent 70%),
    /* 圆形渐变 - 左下角 */
    radial-gradient(500px circle at 25% 80%, rgba(255, 255, 255, 0.32), transparent 65%),
    /* 中型圆形渐变 - 中心 */
    radial-gradient(350px circle at 50% 50%, rgba(255, 255, 255, 0.30), transparent 60%),
    #03020c;
}

/* 第二层：毛玻璃覆盖层[覆盖在图形上方] */
.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(36px);
  -webkit-backdrop-filter: blur(36px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1;
  pointer-events: none;
}

html.dark .glass-overlay {
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

/* 第三层：内容层[在毛玻璃层之上] */
.content-layer {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

.animate-float-picture {
  animation: float-picture 5s linear 0ms infinite;
}

@keyframes float-picture {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>