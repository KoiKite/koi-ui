<template>
  <div class="upload-box">
    <el-upload
      v-model:file-list="_fileList"
      action="#"
      list-type="picture-card"
      :class="['upload', imageDisabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="true"
      :disabled="imageDisabled"
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
      :folderName="folderName"
      :fileParam="fileParam"
    >
      <div class="upload-content">
        <slot name="content">
          <el-icon><Plus /></el-icon>
          <!-- <span>请上传图片</span> -->
        </slot>
      </div>
      <template #file="{ file }">
        <img :src="file.url" class="upload-image" />
        <div class="upload-operator" @click.stop>
          <div class="upload-icon" @click="handlePictureCardPreview(file)">
            <el-icon><ZoomIn /></el-icon>
            <span>查看</span>
          </div>
          <div v-if="!imageDisabled" class="upload-icon" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>
      </template>
    </el-upload>
    <div class="el-upload-tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" :url-list="[viewImageUrl]" @close="imgViewVisible = false" />
  </div>
</template>

<script setup lang="ts" name="KoiUploadImages">
import { ref, computed, inject, watch } from "vue";
import { ElLoading } from "element-plus";
import koi from "@/utils/axios.ts";
import { koiNoticeSuccess, koiNoticeWarning, koiNoticeError } from "@/utils/koi.ts";
import type { UploadProps, UploadFile, UploadUserFile, UploadRequestOptions } from "element-plus";
import { formContextKey, formItemContextKey } from "element-plus";

interface IUploadImagesProps {
  fileList: UploadUserFile[]; // 图片回显，这个名称不能进行修改。
  action?: any; // 上传图片的 action 方法，一般项目上传都是同一个 action 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传[默认为 true]
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传[默认为 false]
  limit?: number; // 最大图片上传数 ==> 非必传[默认为 5张]
  fileSize?: number; // 图片大小限制 ==> 非必传[默认为 3M]
  fileType?: any; // 图片类型限制 ==> 非必传[默认为 ["image/webp", "image/jpg", "image/jpeg", "image/png", "image/gif"]]
  height?: string; // 组件高度 ==> 非必传[默认为 120px]
  width?: string; // 组件宽度 ==> 非必传[默认为 120px]
  borderRadius?: string; // 组件边框圆角 ==> 非必传[默认为 6px]
  folderName?: string; // 文件夹名称
  fileParam?: string; // 文件类型[可向后端传递参数]
}

const props = withDefaults(defineProps<IUploadImagesProps>(), {
  fileList: () => [],
  action: "/koi/upload/file",
  drag: true,
  disabled: false,
  limit: 5,
  fileSize: 3,
  fileType: ["image/webp", "image/jpg", "image/jpeg", "image/png", "image/gif"],
  height: "120px",
  width: "120px",
  borderRadius: "6px",
  folderName: "files",
  fileParam: "-1"
});

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const imageDisabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

const _fileList = ref<UploadUserFile[]>(props.fileList);

// 监听 props.fileList 列表默认值改变
watch(
  () => props.fileList,
  (n: UploadUserFile[]) => {
    console.log("props.fileList", props.fileList);
    _fileList.value = n;
  }
);

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType.includes(rawFile.type);
  if (!imgType) koiNoticeWarning("上传图片不符合所需的格式");
  if (!imgSize)
    setTimeout(() => {
      koiNoticeWarning(`上传图片大小不能超过 ${props.fileSize}M！`);
    }, 0);
  return imgType && imgSize;
};

/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  // 添加其他参数到 FormData
  formData.append("fileSize", props.fileSize.toString());
  formData.append("folderName", props.folderName);
  formData.append("fileParam", props.fileParam === "-1" || props.fileParam === "" ? "-1" : props.fileParam);

  const loadingInstance = ElLoading.service({
    text: "正在上传",
    background: "rgba(0,0,0,.2)"
  });
  
  try {
    const res: any = await koi.upload(props.action, formData);
    options.onSuccess(import.meta.env.VITE_SERVER + res.data?.fileUploadPath);
    loadingInstance.close();
  } catch (error) {
    loadingInstance.close();
    options.onError(error as any);
  }
};

/**
 * @description 图片上传成功
 * @param response 上传响应结果
 * @param uploadFile 上传的文件
 * */
const emit = defineEmits<{
  "update:fileList": [value: UploadUserFile[]];
}>();
const uploadSuccess = (response: string | undefined, uploadFile: UploadFile) => {
  if (!response) return;
  uploadFile.url = response;
  emit("update:fileList", _fileList.value);
  // 调用 el-form 内部的校验方法[可自动校验]
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  koiNoticeSuccess("图片上传成功");
};

/**
 * @description 删除图片
 * @param file 删除的文件
 * */
const handleRemove = (file: UploadFile) => {
  _fileList.value = _fileList.value.filter(item => item.url !== file.url || item?.name !== file.name);
  emit("update:fileList", _fileList.value);
};

/** 图片上传错误 */
const uploadError = () => {
  koiNoticeError("图片上传失败，请您重新上传");
};

/** 文件数超出 */
const handleExceed = () => {
  koiNoticeWarning(`当前最多只能上传 ${props.limit} 张图片，请移除后上传！`);
};

/**
 * @description 图片预览
 * @param file 预览的文件
 * */
const viewImageUrl = ref("");
const imgViewVisible = ref(false);
const handlePictureCardPreview: UploadProps["onPreview"] = file => {
  viewImageUrl.value = file.url!;
  imgViewVisible.value = true;
};
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 2px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-color-primary-light-9) !important;
    border: 2px dashed var(--el-color-primary);
    &:hover {
      border-color: var(--el-color-primary) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 2px dashed var(--el-color-primary);
      border-radius: v-bind(borderRadius);
      &:hover {
        background: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary);
      }
    }
    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }
    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border: 2px dashed var(--el-color-primary);
      border-radius: v-bind(borderRadius);
      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }
    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .upload-operator {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 50%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);
      .upload-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: var(--el-color-primary-light-2);
        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }
        span {
          font-size: 100%;
        }
      }
    }
    .el-upload-list__item {
      border: 2px dashed var(--el-color-primary);
      &:hover {
        .upload-operator {
          opacity: 1;
        }
      }
    }
    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-primary);
      .el-icon {
        font-size: 28px;
        color: var(--el-color-primary);
      }
    }
  }
  .el-upload-tip {
    font-size: 12px;
    line-height: 12px;
    color: var(--el-color-primary);
    text-align: left;
    margin-top: 5px;
  }
}
</style>
