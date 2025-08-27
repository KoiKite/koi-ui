<template>
  <!-- append-to-body 点击空白处不关闭弹窗 -->
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="dialogWidth"
    :center="center"
    :close-on-click-modal="closeOnClickModel"
    append-to-body
    draggable
    :destroy-on-close="destroyOnClose"
    :before-close="koiClose"
    :fullscreen="fullscreen"
    :loading="loading"
    :footerHidden="footerHidden"
  >
    <slot name="header"></slot>
    <div class="dialog-content-wrapper" :style="fullscreen ? { height: 'auto' } : { height: height + 'px' }">
      <!-- 具名插槽 -->
      <slot name="content"></slot>
    </div>
    <template #footer v-if="!footerHidden">
      <span class="dialog-footer">
        <el-button type="primary" loading-icon="Eleme" :loading="confirmLoading" v-throttle="koiConfirm">{{
          confirmText || $t("button.confirm")
        }}</el-button>
        <el-button type="danger" @click="koiCancel">{{ cancelText || $t("button.cancel") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<!-- 此弹窗封装将使用 defineExpose，通过ref进行使用 -->
<script setup lang="ts">
import { ref, toRefs, computed, onMounted, onUnmounted } from "vue";
import { koiMsgWarning } from "@/utils/koi.ts";
import { ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 定义参数的类型
interface IDialogProps {
  title?: string;
  visible?: boolean;
  width?: number;
  center?: boolean;
  height?: number;
  closeOnClickModel?: boolean;
  confirmText?: string;
  cancelText?: string;
  destroyOnClose?: boolean;
  fullscreen?: boolean;
  loading?: boolean;
  footerHidden?: boolean; // 是否隐藏确认和取消按钮部分
}

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
const props = withDefaults(defineProps<IDialogProps>(), {
  title: "KoiDialog",
  height: 300,
  width: 650,
  center: true,
  visible: false,
  closeOnClickModel: false,
  confirmText: "",
  cancelText: "",
  destroyOnClose: false,
  fullscreen: false,
  loading: false,
  footerHidden: false
});

// 开关变量
const visible = ref(false);

// 确定按钮Loading，此处必须用toRefs，否则将失去响应式
const { loading, width } = toRefs(props);
const confirmLoading = ref(loading);

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth);

// 计算对话框宽度，在页面小于600px时使用90%宽度
const dialogWidth = computed(() => {
  if (windowWidth.value < 600) {
    return "90%";
  }
  return width.value;
});

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

/** 打开对话框 */
const koiOpen = () => {
  visible.value = true;
};

/** 取消对话框 */
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

/** 确认提交后关闭对话框 */
const koiQuickClose = () => {
  visible.value = false;
};

// 当前组件获取父组件传递的事件方法
const emits = defineEmits(["koiConfirm", "koiCancel"]);

/** 对话框确定事件 */
const koiConfirm = () => {
  emits("koiConfirm");
};

/** 对话框的取消事件 */
const koiCancel = () => {
  emits("koiCancel");
};

/** 暴露给父组件方法 */
defineExpose({
  koiOpen,
  koiClose,
  koiQuickClose
});
</script>

<style lang="scss" scoped>
.dialog-content-wrapper {
  box-sizing: border-box;
  padding-right: 6px; // 为滚动条预留空间
  overflow: hidden auto;
  // 确保内容不会被滚动条覆盖
  & > * {
    padding-right: 4px;
  }
}
</style>
