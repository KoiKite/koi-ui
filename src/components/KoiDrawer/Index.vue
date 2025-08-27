<template>
  <div>
    <el-drawer
      v-model="visible"
      :title="title"
      :size="drawerSize"
      :direction="direction"
      :close-on-click-modal="closeOnClickModel"
      :destroy-on-close="destroyOnClose"
      :before-close="koiClose"
      :loading="loading"
      :footerHidden="footerHidden"
    >
      <div class="formDrawer">
        <div class="body">
          <slot name="content"></slot>
        </div>
        <div class="footer" v-if="!footerHidden">
          <el-button type="primary" loading-icon="Eleme" :loading="confirmLoading" v-throttle="koiConfirm">{{
            confirmText || $t("button.confirm")
          }}</el-button>
          <el-button type="danger" @click="koiCancel">{{ cancelText || $t("button.cancel") }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, onMounted, onUnmounted } from "vue";
import { koiMsgWarning } from "@/utils/koi.ts";
import { ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 定义参数的类型
interface IDrawerProps {
  title?: string;
  visible?: boolean;
  size?: string;
  destroyOnClose?: boolean;
  closeOnClickModel?: boolean;
  confirmText?: string;
  cancelText?: string;
  direction?: any;
  loading?: boolean;
  footerHidden?: boolean; // 是否隐藏确认和取消按钮部分
}

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
const props = withDefaults(defineProps<IDrawerProps>(), {
  title: "KoiDrawer",
  visible: false,
  size: "450",
  closeOnClickModel: false,
  destroyOnClose: false,
  confirmText: "",
  cancelText: "",
  direction: "rtl",
  loading: false,
  footerHidden: false
});

// 开关变量
const visible = ref(false);
// 确定按钮Loading，此处必须用toRefs，否则将失去响应式
const { loading } = toRefs(props);
const confirmLoading = ref(loading);

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth);

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// 计算抽屉大小
const drawerSize = computed(() => {
  if (windowWidth.value < 600) {
    return "86%";
  }
  return props.size;
});

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

/** 打开抽屉 */
const koiOpen = () => {
  visible.value = true;
};

/** 关闭抽屉 */
const koiClose = () => {
  if (!props.closeOnClickModel) {
    ElMessageBox.confirm(t("msg.closeTips"), t("msg.remind"), {
      confirmButtonText: t("button.confirm"),
      cancelButtonText: t("button.cancel"),
      type: "warning"
    })
      .then(() => {
        visible.value = false;
        koiMsgWarning(t("msg.closed"));
      })
      .catch(() => {
        koiMsgWarning(t("msg.cancelled"));
      });
  } else {
    visible.value = false;
  }
};

/** 确认提交后关闭抽屉 */
const koiQuickClose = () => {
  visible.value = false;
};

/** 确认 */
const koiConfirm = () => {
  emits("koiConfirm");
};

// 关闭抽屉
const koiCancel = () => {
  emits("koiCancel");
};

// 当前组件获取父组件传递的事件方法，然后点击确认和提交是触发父组件传递过来的事件
const emits = defineEmits(["koiConfirm", "koiCancel"]);

// defineExpose是vue3添加的一个api，放在<script setup>下使用的，
// 目的是把属性和方法暴露出去，可以用于父子组件通信，子组件把属性暴露出去，
// 父组件用ref获取子组件DOM，子组件暴露的方法或属性可以用dom获取。
defineExpose({
  koiOpen,
  koiClose,
  koiQuickClose
});
</script>

<style lang="scss" scoped>
.formDrawer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .body {
    bottom: 50px;
    flex: 1;
    padding-right: 8px; // 为滚动条预留空间
    overflow-y: auto; // 超出部分则滚动
    @apply text-14px text-#303133 dark:text-#E5EAF3;
  }

  .footer {
    display: flex;
    align-items: center;
    height: 50px;
    margin-top: auto;
  }
}

:deep(.el-drawer__title) {
  @apply text-#303133 dark:text-#CFD3DC;
}

:deep(.el-drawer__body) {
  padding-top: 0;
}

:deep(.el-drawer__header) {
  margin-bottom: 18px;
}
</style>
