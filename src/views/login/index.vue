<template>
  <div class="h-full">
    <el-row class="h-100%">
      <div class="pos-absolute top-10px right-10px flex flex-items-center">
        <KoiLanguage></KoiLanguage>
        <KoiDark></KoiDark>
      </div>
      <el-col :lg="16" :md="12" :sm="15" :xs="0" class="flex flex-items-center flex-justify-center">
        <div class="login-background w-100% h-100%">
          <!-- 浮动形状背景 -->
          <div class="shapes-box">
            <!-- 主要形状元素 -->
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
            <div class="shape shape-6"></div>
            <div class="shape shape-7"></div>
            <div class="shape shape-8"></div>

            <!-- 几何装饰元素 -->
            <div class="triangle triangle-1"></div>
            <div class="triangle triangle-2"></div>
            <div class="square square-1"></div>
            <div class="square square-2"></div>
            <div class="moon moon-1"></div>
            <div class="moon moon-2"></div>

            <!-- 数据流线条 -->
            <div class="flow-line line-1"></div>
            <div class="flow-line line-2"></div>
            <div class="flow-line line-3"></div>
            <div class="flow-line line-4"></div>
            <div class="flow-line line-5"></div>

            <!-- 网络节点 -->
            <div class="node node-1"></div>
            <div class="node node-2"></div>
            <div class="node node-3"></div>
            <div class="node node-4"></div>
            <div class="node node-5"></div>
            <div class="node node-6"></div>
          </div>
        </div>
        <div class="pos-absolute text-center select-none">
          <el-image class="w-100% h-370px m-b-50px animate-float-picture <md:hidden <lg:h-320px" :src="bg" />
          <div class="font-bold text-3xl chroma-text m-b-6px text-center <lg:text-2xl <md:hidden">
            {{ $t("menu.login.welcome") }} {{ $t("menu.login.title") || "KOI-ADMIN 管理平台" }}
          </div>
          <div class="chroma-text text-lg text-center <md:hidden">{{ $t("menu.login.description") }}</div>
        </div>
        <!-- 备案号-->
        <div class="beiAnHao select-none <md:hidden">
          <a class="chroma-text" href="https://beian.miit.gov.cn/" target="_blank"
            >{{ $t("menu.login.beiAnHao") }}：豫ICP备2022022094号-1</a
          >
        </div>
      </el-col>
      <el-col
        :lg="8"
        :md="12"
        :sm="9"
        :xs="24"
        class="dark:bg-#161616 bg-gray-100 flex flex-items-center flex-justify-center flex-col"
      >
        <div class="flex flex-items-center">
          <el-image class="rounded-full w-36px h-36px" :src="logo" />
          <div class="m-l-6px font-bold text-xl">{{ $t("menu.login.title") || "KOI-ADMIN 管理平台" }}</div>
        </div>
        <div class="flex flex-items-center space-x-3 text-gray-400 m-t-16px m-b-16px">
          <span class="h-1px w-16 bg-gray-300 inline-block"></span>
          <span class="text-center">{{ $t("menu.login.account") }}</span>
          <span class="h-1px w-16 bg-gray-300 inline-block"></span>
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
            <el-image class="w-100px h-30px" :src="loginForm.captchaPicture" @click="handleCaptcha" />
            <el-button text size="small" class="m-l-6px" @click="handleCaptcha">
              <div class="text-gray-400 hover:text-#8B5CF6 select-none">{{ $t("menu.login.picture") }}</div>
            </el-button>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              v-if="!loading"
              class="w-245px bg-[--el-color-primary]"
              round
              v-throttle:3000="handleKoiLogin"
              >{{ $t("menu.login.in") }}</el-button
            >
            <el-button type="primary" v-else class="w-245px bg-[--el-color-primary]" round :loading="loading">{{
              $t("menu.login.loading")
            }}</el-button>
          </el-form-item>
        </el-form>
        <!-- 备案号-->
        <div class="beiAnHao select-none lg:hidden">
          <a class="chroma-text" href="https://beian.miit.gov.cn/" target="_blank"
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
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";

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
import KoiDark from "./components/KoiDark.vue";
import KoiLoading from "./components/KoiLoading.vue";
import KoiLanguage from "./components/KoiLanguage.vue";
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
      loading.value = true;
      try {
        // 1、执行登录接口
        // const res: any = await koiLogin({ loginName, password, codeKey, securityCode });
        // userStore.setToken(res.data.tokenValue);
        userStore.setToken(authLogin.data.tokenValue);

        // 2、添加动态路由 AND 用户按钮 AND 角色信息 AND 用户个人信息
        if (userStore?.token) {
          await initDynamicRouter();
        } else {
          koiMsgWarning(t("msg.logIn"));
          router.replace(LOGIN_URL);
          return;
        }

        // 3、清空 tabs数据、keepAlive缓存数据
        if (userStore.loginName) {
          if (userStore.loginName !== loginName) {
            tabsStore.setTab([]);
            userStore.setLoginName(loginName);
          }
        } else {
          tabsStore.setTab([]);
          userStore.setLoginName(loginName);
        }

        keepAliveStore.setKeepAliveName([]);

        // 4、跳转到首页
        router.replace(HOME_URL);
      } catch (error) {
        // 等待1秒关闭loading
        let loadingTime = 1;
        setInterval(() => {
          loadingTime--;
          if (loadingTime === 0) {
            loading.value = false;
          }
        }, 1000);
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
.beiAnHao {
  position: absolute;
  bottom: 10px;
  left: auto;
  font-size: 12px;
  font-weight: bold;
}

.login-background {
  background:
    linear-gradient(135deg, var(--el-color-primary-light-9)),
    radial-gradient(circle at 20% 20%, rgba(168, 162, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(50px);
}

.shapes-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.4) 0%, rgba(255, 105, 180, 0.3) 50%, rgba(255, 192, 203, 0.2) 100%);
  top: 8%;
  left: 3%;
  animation: shape-1-animation 12s ease-in-out infinite;
  animation-delay: 0s;
  border-radius: 8px;
  box-shadow:
    0 0 8px rgba(255, 182, 193, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(255, 105, 180, 0.3);
}

html.dark .shape-1 {
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.3) 0%, rgba(255, 105, 180, 0.2) 50%, rgba(255, 192, 203, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(255, 182, 193, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 105, 180, 0.2);
}

.shape-2 {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(255, 218, 185, 0.4) 0%, rgba(255, 165, 0, 0.3) 50%, rgba(255, 228, 196, 0.2) 100%);
  top: 65%;
  right: 5%;
  animation: shape-2-animation 8s ease-in-out infinite;
  animation-delay: 3s;
  border-radius: 50%;
  box-shadow:
    0 0 8px rgba(255, 218, 185, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(255, 165, 0, 0.3);
}

html.dark .shape-2 {
  background: linear-gradient(135deg, rgba(255, 218, 185, 0.3) 0%, rgba(255, 165, 0, 0.2) 50%, rgba(255, 228, 196, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(255, 218, 185, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 165, 0, 0.2);
}

.shape-3 {
  width: 40px;
  height: 60px;
  background: linear-gradient(180deg, rgba(144, 238, 144, 0.4) 0%, rgba(50, 205, 50, 0.3) 50%, rgba(152, 251, 152, 0.2) 100%);
  bottom: 10%;
  left: 6%;
  animation: shape-3-animation 10s ease-in-out infinite;
  animation-delay: 6s;
  border-radius: 20px;
  box-shadow:
    0 0 8px rgba(144, 238, 144, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(50, 205, 50, 0.3);
}

html.dark .shape-3 {
  background: linear-gradient(180deg, rgba(144, 238, 144, 0.3) 0%, rgba(50, 205, 50, 0.2) 50%, rgba(152, 251, 152, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(144, 238, 144, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(50, 205, 50, 0.2);
}

.shape-4 {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, rgba(221, 160, 221, 0.4) 0%, rgba(186, 85, 211, 0.3) 50%, rgba(238, 130, 238, 0.2) 100%);
  top: 25%;
  right: 12%;
  animation: shape-4-animation 6s ease-in-out infinite;
  animation-delay: 1.5s;
  border-radius: 8px;
  box-shadow:
    0 0 8px rgba(221, 160, 221, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(186, 85, 211, 0.3);
}

html.dark .shape-4 {
  background: linear-gradient(135deg, rgba(221, 160, 221, 0.3) 0%, rgba(186, 85, 211, 0.2) 50%, rgba(238, 130, 238, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(221, 160, 221, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(186, 85, 211, 0.2);
}

.shape-5 {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, rgba(173, 216, 230, 0.4) 0%, rgba(135, 206, 235, 0.3) 50%, rgba(176, 224, 230, 0.2) 100%);
  top: 50%;
  left: 15%;
  animation: shape-5-animation 9s ease-in-out infinite;
  animation-delay: 4s;
  border-radius: 50%;
  box-shadow:
    0 0 8px rgba(173, 216, 230, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(135, 206, 235, 0.3);
}

html.dark .shape-5 {
  background: linear-gradient(135deg, rgba(173, 216, 230, 0.3) 0%, rgba(135, 206, 235, 0.2) 50%, rgba(176, 224, 230, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(173, 216, 230, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(135, 206, 235, 0.2);
}

.animate-float-picture {
  animation: float-picture 5s linear 0ms infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.triangle {
  position: absolute;
  width: 0;
  height: 0;
  animation: rotate 10s linear infinite;
  pointer-events: none;
  z-index: 1;
}

.triangle-1 {
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 25px solid rgba(255, 193, 7, 0.3);
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.triangle-2 {
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid rgba(220, 53, 69, 0.3);
  top: 70%;
  right: 20%;
  animation-delay: 2s;
}

html.dark .triangle-1 {
  border-bottom: 25px solid rgba(251, 191, 36, 0.4);
}

html.dark .triangle-2 {
  border-bottom: 35px solid rgba(248, 113, 113, 0.4);
}

.square {
  position: absolute;
  background: linear-gradient(45deg, rgba(0, 123, 255, 0.3), rgba(0, 86, 179, 0.1));
  animation: pulse 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

html.dark .square {
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.2));
}

.square-1 {
  width: 30px;
  height: 30px;
  top: 30%;
  left: 80%;
  animation-delay: 1s;
  transform: rotate(45deg);
}

.square-2 {
  width: 25px;
  height: 25px;
  top: 60%;
  left: 5%;
  animation-delay: 3s;
  transform: rotate(45deg);
}

.moon {
  position: absolute;
  width: 50px;
  height: 50px;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(200, 200, 255, 0.6) 0%,
    rgba(180, 180, 255, 0.4) 40%,
    rgba(160, 160, 255, 0.2) 70%,
    transparent 100%
  );
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 0 20px rgba(200, 200, 255, 0.4);
  filter: blur(0.5px);
}

.moon:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 70% 30%, rgba(220, 220, 255, 0.4) 0%, rgba(200, 200, 255, 0.2) 50%, transparent 100%);
  border-radius: 50%;
  transform: rotate(-20deg);
}

html.dark .moon {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(240, 240, 255, 0.5) 40%,
    rgba(220, 220, 255, 0.3) 70%,
    transparent 100%
  );
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
}

html.dark .moon:before {
  background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.5) 0%, rgba(240, 240, 255, 0.3) 50%, transparent 100%);
}

.moon-1 {
  top: 40%;
  right: 10%;
  animation-delay: 1.5s;
  transform: rotate(-15deg);
}

.moon-2 {
  top: 80%;
  left: 40%;
  animation-delay: 4s;
  transform: rotate(20deg);
}

.flow-line {
  position: absolute;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%);
  height: 2px;
  animation: data-flow 3s linear infinite;
  pointer-events: none;
  z-index: 1;
}

html.dark .flow-line {
  background: linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.4) 50%, transparent 100%);
}

.line-1 {
  width: 200px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  transform: rotate(15deg);
}

.line-2 {
  width: 150px;
  top: 40%;
  right: 15%;
  animation-delay: 1s;
  transform: rotate(-20deg);
}

.line-3 {
  width: 180px;
  top: 60%;
  left: 30%;
  animation-delay: 2s;
  transform: rotate(30deg);
}

.line-4 {
  width: 120px;
  top: 80%;
  right: 25%;
  animation-delay: 0.5s;
  transform: rotate(-15deg);
}

.line-5 {
  width: 160px;
  top: 50%;
  left: 60%;
  animation-delay: 1.5s;
  transform: rotate(45deg);
}

.node {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%);
  border-radius: 50%;
  animation: node-pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  pointer-events: none;
  z-index: 1;
}

html.dark .node {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.9) 0%, rgba(96, 165, 250, 0.4) 50%, transparent 100%);
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.6);
}

.node-1 {
  top: 25%;
  left: 20%;
  animation-delay: 0s;
}
.node-2 {
  top: 35%;
  right: 30%;
  animation-delay: 0.3s;
}
.node-3 {
  top: 55%;
  left: 40%;
  animation-delay: 0.6s;
}
.node-4 {
  top: 75%;
  right: 20%;
  animation-delay: 0.9s;
}
.node-5 {
  top: 45%;
  left: 70%;
  animation-delay: 1.2s;
}
.node-6 {
  top: 15%;
  right: 50%;
  animation-delay: 1.5s;
}

.shape-6 {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(135, 206, 250, 0.4) 0%, rgba(30, 144, 255, 0.3) 50%, rgba(173, 216, 230, 0.2) 100%);
  top: 5%;
  right: 3%;
  border-radius: 8px;
  animation: shape-6-animation 8s ease-in-out infinite;
  animation-delay: 0s;
  box-shadow:
    0 0 8px rgba(135, 206, 250, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(30, 144, 255, 0.3);
}

html.dark .shape-6 {
  background: linear-gradient(135deg, rgba(135, 206, 250, 0.3) 0%, rgba(30, 144, 255, 0.2) 50%, rgba(173, 216, 230, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(135, 206, 250, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(30, 144, 255, 0.2);
}

.shape-7 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 192, 203, 0.4) 0%, rgba(255, 20, 147, 0.3) 50%, rgba(255, 182, 193, 0.2) 100%);
  bottom: 5%;
  right: 2%;
  border-radius: 8px;
  animation: shape-7-animation 6s ease-in-out infinite;
  animation-delay: 2s;
  box-shadow:
    0 0 8px rgba(255, 192, 203, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(255, 20, 147, 0.3);
}

html.dark .shape-7 {
  background: linear-gradient(135deg, rgba(255, 192, 203, 0.3) 0%, rgba(255, 20, 147, 0.2) 50%, rgba(255, 182, 193, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(255, 192, 203, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 20, 147, 0.2);
}

.shape-8 {
  width: 35px;
  height: 55px;
  background: linear-gradient(180deg, rgba(255, 218, 185, 0.4) 0%, rgba(255, 140, 0, 0.3) 50%, rgba(255, 228, 196, 0.2) 100%);
  bottom: 5%;
  left: 2%;
  animation: shape-8-animation 12s ease-in-out infinite;
  animation-delay: 2s;
  border-radius: 18px;
  box-shadow:
    0 0 8px rgba(255, 218, 185, 0.3),
    inset 0 0 4px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  border: 1px solid rgba(255, 140, 0, 0.3);
}

html.dark .shape-8 {
  background: linear-gradient(180deg, rgba(255, 218, 185, 0.3) 0%, rgba(255, 140, 0, 0.2) 50%, rgba(255, 228, 196, 0.15) 100%);
  box-shadow:
    0 0 6px rgba(255, 218, 185, 0.25),
    inset 0 0 3px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 140, 0, 0.2);
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-12px) translateX(8px) rotate(90deg) scale(1.03);
  }
  50% {
    transform: translateY(-20px) translateX(0) rotate(180deg) scale(1.06);
  }
  75% {
    transform: translateY(-12px) translateX(-8px) rotate(270deg) scale(1.03);
  }
}

@keyframes shape-1-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    filter: blur(1px);
  }
  25% {
    transform: translateY(-15px) translateX(10px) rotate(90deg) scale(1.05);
    filter: blur(1.5px);
  }
  50% {
    transform: translateY(-25px) translateX(0) rotate(180deg) scale(1.1);
    filter: blur(2px);
  }
  75% {
    transform: translateY(-15px) translateX(-10px) rotate(270deg) scale(1.05);
    filter: blur(1.5px);
  }
}

@keyframes shape-2-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-20px) translateX(15px) rotate(120deg) scale(1.08);
  }
  66% {
    transform: translateY(-10px) translateX(-10px) rotate(240deg) scale(1.12);
  }
}

@keyframes shape-3-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    filter: blur(0.8px);
  }
  25% {
    transform: translateY(-15px) translateX(10px) rotate(90deg) scale(1.05);
    filter: blur(1.2px);
  }
  50% {
    transform: translateY(-25px) translateX(15px) rotate(180deg) scale(1.12);
    filter: blur(1.5px);
  }
  75% {
    transform: translateY(-15px) translateX(5px) rotate(270deg) scale(1.08);
    filter: blur(1.2px);
  }
}

@keyframes shape-4-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-8px) translateX(5px) rotate(45deg) scale(1.02);
  }
  75% {
    transform: translateY(-12px) translateX(-8px) rotate(315deg) scale(1.04);
  }
}

@keyframes shape-5-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    filter: blur(0.8px);
  }
  20% {
    transform: translateY(-10px) translateX(8px) rotate(72deg) scale(1.03);
    filter: blur(1.2px);
  }
  40% {
    transform: translateY(-18px) translateX(0) rotate(144deg) scale(1.06);
    filter: blur(1.5px);
  }
  60% {
    transform: translateY(-10px) translateX(-8px) rotate(216deg) scale(1.03);
    filter: blur(1.2px);
  }
  80% {
    transform: translateY(-5px) translateX(4px) rotate(288deg) scale(1.01);
    filter: blur(1px);
  }
}

@keyframes shape-6-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    filter: blur(0.5px);
  }
  25% {
    transform: translateY(-10px) translateX(5px) rotate(90deg) scale(1.05);
  }
  50% {
    transform: translateY(-5px) translateX(-3px) rotate(180deg) scale(1.08);
  }
  75% {
    transform: translateY(-12px) translateX(8px) rotate(270deg) scale(1.03);
  }
}

@keyframes shape-7-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    filter: blur(1px);
  }
  33% {
    transform: translateY(-8px) translateX(6px) rotate(120deg) scale(1.06);
  }
  66% {
    transform: translateY(-15px) translateX(-4px) rotate(240deg) scale(1.04);
  }
}

@keyframes shape-8-animation {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    filter: blur(0.5px);
  }
  20% {
    transform: translateY(-6px) translateX(4px) rotate(72deg) scale(1.03);
  }
  40% {
    transform: translateY(-12px) translateX(-2px) rotate(144deg) scale(1.07);
  }
  60% {
    transform: translateY(-8px) translateX(7px) rotate(216deg) scale(1.05);
  }
  80% {
    transform: translateY(-14px) translateX(-5px) rotate(288deg) scale(1.02);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1) rotate(45deg);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1) rotate(45deg);
    opacity: 1;
  }
}

@keyframes data-flow {
  0% {
    transform: translateX(-100%) rotate(var(--rotation, 0deg));
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%) rotate(var(--rotation, 0deg));
    opacity: 0;
  }
}

@keyframes node-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

@keyframes corner-rotate {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: rotate(180deg) scale(1.1);
    opacity: 0.6;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0.4;
  }
}

@keyframes corner-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
  25% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.5;
  }
  75% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

@keyframes corner-geometric {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    opacity: 0.4;
  }
  25% {
    transform: translateY(-8px) translateX(6px) rotate(90deg) scale(1.08);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-15px) translateX(0) rotate(180deg) scale(1.15);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-8px) translateX(-6px) rotate(270deg) scale(1.08);
    opacity: 0.6;
  }
}

/* 响应式设计：小于1200px时隐藏形状元素 */
@media (max-width: 1199px) {
  .shape-1,
  .shape-2,
  .shape-3,
  .shape-4,
  .shape-5,
  .shape-6,
  .shape-7,
  .shape-8,
  .triangle,
  .triangle-1,
  .triangle-2,
  .square,
  .square-1,
  .square-2,
  .moon,
  .moon-1,
  .moon-2 {
    display: none;
  }
}
</style>
