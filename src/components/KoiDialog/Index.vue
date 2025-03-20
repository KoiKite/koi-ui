<template>
  <!-- append-to-body 点击空白处不关闭弹窗 -->
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="width"
    :center="center"
    :close-on-click-modal="false"
    append-to-body
    draggable
    :destroy-on-close="destroyOnClose"
    :before-close="koiClose"
    :fullscreen="fullscreen"
    :loading="loading"
    :footerHidden="footerHidden"
  >
    <slot name="header"></slot>
    <div class="overflow-y-auto overflow-x-initial" :style="fullscreen ? { height: 'auto' } : { height: height + 'px' }">
      <!-- 具名插槽 -->
      <slot name="content"></slot>
    </div>
    <template #footer v-if="!footerHidden">
      <span class="dialog-footer">
        <el-button type="primary" loading-icon="Eleme" :loading="confirmLoading" v-throttle="koiConfirm">{{
          confirmText
        }}</el-button>
        <el-button type="danger" @click="koiCancel">{{ cancelText }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<!-- 此弹窗封装将使用 defineExpose，通过ref进行使用 -->
<script setup lang="ts">
import { ref, toRefs } from "vue";
// @ts-ignore
import { koiMsgWarning, koiMsgBox } from "@/utils/koi.ts";

// 定义参数的类型
interface IDialogProps {
  title?: string;
  visible?: boolean;
  width?: number;
  center?: boolean;
  height?: number;
  confirmText?: string;
  cancelText?: string;
  destroyOnClose?: boolean;
  fullscreen?: boolean;
  loading?: boolean;
  footerHidden?: boolean; // 是否隐藏确认和取消按钮部分
}

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
// @ts-ignore
const props = withDefaults(defineProps<IDialogProps>(), {
  title: "朕很中意你KoiDialog",
  height: 300,
  width: 650,
  center: true,
  visible: false,
  confirmText: "确定",
  cancelText: "取消",
  destroyOnClose: false,
  fullscreen: false,
  loading: false,
  footerHidden: false
});

// 开关变量
const visible = ref(false);

// 确定按钮Loading，此处必须用toRefs，否则将失去响应式
const { loading } = toRefs(props);
const confirmLoading = ref(loading);

/** 打开对话框 */
const koiOpen = () => {
  visible.value = true;
};

/** 取消对话框 */
const koiClose = () => {
  koiMsgBox("您确认进行关闭么？")
    .then(() => {
      visible.value = false;
      koiMsgWarning("已关闭🌻");
    })
    .catch(() => {
      // 用户点击了取消按钮或关闭对话框
      // 执行取消操作或不做任何操作
      koiMsgWarning("已取消🌻");
    });
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
// .dialog-container { 
//   overflow-x: initial;
//   overflow-y: auto; // 超出部分则滚动
// }

// .el-dialog {
//   border-top-left-radius: 8px !important;
//   border-top-right-radius: 8px !important;
//   padding-top: 0px;

//   // 标题头部
//   .el-dialog__header {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     height: 50px !important;
//     padding: 0 0 6px 0;

//     // background: #1e71ee;
//     @apply dark:bg-#141414;
//     .el-dialog__title {
//       font-family: YouYuan;
//       font-size: 18px;
//       font-weight: 500;
//     }
//   }
//   .el-dialog__body {
//     padding: 0px;
//   }
//   .el-dialog__footer {
//     padding: 10px;
//   }
// }
// .el-dialog__body {
//   // 内容区域内边距
//   padding: 10px;
// }
// .el-dialog__headerbtn {
//   padding-bottom: 10px !important;
//   .el-dialog__close {
//     border: 1px solid;
//     border-radius: 10px;
//   }
// }
</style>
