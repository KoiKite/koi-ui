<template>
  <el-dialog v-model="dialogVisible" :title="koiParams.title" :destroy-on-close="true" width="580px" draggable>
    <el-form label-width="100px">
      <el-form-item label="模板下载">
        <el-button type="primary" :icon="Download" @click="handleTemplateExcel">点击下载</el-button>
      </el-form-item>
      <el-form-item label="文件上传">
        <el-upload
          action="#"
          class="upload"
          :drag="true"
          :limit="excelLimit"
          :multiple="false"
          :show-file-list="true"
          :http-request="handleHttpUpload"
          :before-upload="beforeExcelUpload"
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :accept="koiParams.fileType"
        >
          <slot name="content">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">请上传 .xls, .xlsx 标准格式文件，文件最大为 {{ koiParams.fileSize }}M</div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts" name="importExcelPage">
import { ref } from "vue";
import { Download } from "@element-plus/icons-vue";
import { ElNotification, UploadRawFile } from "element-plus";
import koi from "@/utils/axios.ts";

export interface IExcelParamsProps {
  title: string; // 标题
  fileType: string; // 类型
  fileSize?: number; // 上传文件的大小
  templeApi?: any; // 下载模板的Api
  importApi?: any; // 批量导入的Api
}

// 最大文件上传数
const excelLimit = ref(1);
// dialog状态
const dialogVisible = ref(false);
//限制.xls文件
const xlsFile = "application/vnd.ms-excel";
//限制.xlsx文件
const xlsxFile = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

// 父组件传过来的参数
const koiParams = ref<IExcelParamsProps>({
  title: "上传Excel",
  fileType: xlsFile + "," + xlsxFile,
  fileSize: 5,
  templeApi: "",
  importApi: ""
});

/** 接收父组件参数 */
const excelParams = (params: IExcelParamsProps) => {
  koiParams.value = { ...koiParams.value, ...params };
  dialogVisible.value = true;
  // alert(params.value.importApi);
};

// 当前组件获取父组件传递的事件方法，然后点击确认和提交是触发父组件传递过来的事件
const emits = defineEmits(["handleTemplateExcel"]);

/** 下载文件 */
const handleTemplateExcel = () => {
  emits("handleTemplateExcel");
};

/** 文件上传 */
const handleHttpUpload = async (param: any) => {
  // alert(koiParams.value.importApi);
  let fileFormData = new FormData();
  fileFormData.append("file", param.file, param.file.name);
  const res: any = await koi.post(koiParams.value.importApi, fileFormData);
  if (res?.status != 200 && res?.code != 200) {
    ElNotification({
      title: "温馨提示",
      message: "上传失败，请重试！",
      type: "error"
    });
  }
  dialogVisible.value = false;
};

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file: UploadRawFile) => {
  const isExcel = koiParams.value.fileType!.includes(file.type);
  const fileSize = file.size / 1024 / 1024 < koiParams.value.fileSize!;
  if (!isExcel)
    ElNotification({
      title: "温馨提示",
      message: "上传文件只能是xls / xlsx格式！",
      type: "warning"
    });
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件大小不能超过 ${koiParams.value.fileSize}MB！`,
        type: "warning"
      });
    }, 0);
  return isExcel && fileSize;
};

/** 文件数超出提示 */
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: "最多只能上传一个文件！",
    type: "warning"
  });
};

/** 上传错误提示 */
const handleUploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: `${koiParams.value.title}上传失败，请您重新上传！`,
    type: "error"
  });
};

/** 上传成功提示 */
const handleUploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    message: `${koiParams.value.title}上传成功！`,
    type: "success"
  });
};

defineExpose({
  excelParams
});
</script>
<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  border: 2px dashed var(--el-color-primary-light-6);
  &:hover {
    border: 2px dashed var(--el-color-primary);
  }
}
.upload {
  width: 80%;
}
</style>
