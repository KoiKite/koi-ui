<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input
            placeholder="请输入公告标题"
            v-model="searchParams.noticeTitle"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select
            placeholder="请选择公告类型"
            v-model="searchParams.noticeType"
            style="width: 220px"
            @keyup.enter.native="handleListPage"
            clearable
          >
            <el-option v-for="item in noticeOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="公告状态" prop="noticeStatus">
          <el-select
            placeholder="请选择公告状态"
            v-model="searchParams.noticeStatus"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleListPage"
          >
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-debounce="handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-throttle="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:role:add']">
          <el-button type="primary" icon="plus" plain @click="handleAdd()">添加</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:update']">
          <el-button type="success" icon="edit" plain @click="handleUpdate()" :disabled="single">修改</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button type="danger" icon="delete" plain @click="handleBatchDelete()" :disabled="multiple">删除</el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:export']">
          <el-button type="warning" icon="download" plain>导出</el-button>
        </el-col>
        <KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleListPage"></KoiToolbar>
      </el-row>

      <div class="h-20px"></div>
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        border
        :data="tableList"
        empty-text="暂时没有数据哟"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" prop="noticeId" width="120px" align="center" type="index"></el-table-column>
        <el-table-column
          label="公告名称"
          prop="noticeTitle"
          width="260px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="公告类型" prop="noticeType" width="100px" align="center">
          <template #default="scope">
            <KoiTag :tagOptions="noticeOptions" :value="scope.row.noticeType"></KoiTag>
          </template>
        </el-table-column>
        <!-- 注意：如果后端数据返回的是字符串"0" OR "1"，这里的active-value AND inactive-value不需要加冒号，会认为是字符串，否则：后端返回是0 AND 1数字，则需要添加冒号 -->
        <el-table-column label="公告状态" prop="noticeStatus" width="100px" align="center">
          <template #default="scope">
            <!-- {{ scope.row.noticeStatus }} -->
            <el-switch
              v-model="scope.row.noticeStatus"
              active-text="启用"
              inactive-text="停用"
              active-value="1"
              inactive-value="0"
              :inline-prompt="true"
              @change="handleSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="公告备注"
          prop="remark"
          width="260px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180px" align="center"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime" width="180px" align="center"></el-table-column>
        <el-table-column label="修改人" prop="updateBy" width="180px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                circle
                plain
                @click="handleUpdate(row)"
                v-auth="['system:role:update']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
                v-auth="['system:role:delete']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="h-20px"></div>
      <!-- {{ searchParams.pageNo }} --- {{ searchParams.pageSize }} -->
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.pageNo"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />

      <!-- 添加 OR 修改 -->
      <KoiDrawer
        ref="koiDrawerRef"
        :title="title"
        @koiConfirm="handleConfirm"
        @koiCancel="handleCancel"
        :loading="confirmLoading"
      >
        <template #content>
          <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" status-icon>
            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="公告名称" prop="noticeTitle">
                  <el-input v-model="form.noticeTitle" placeholder="请输入公告名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="公告类型" prop="noticeType">
                  <el-select placeholder="请选择公告类型" v-model="form.noticeType" clearable>
                    <el-option
                      v-for="item in noticeOptions"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="公告状态" prop="noticeStatus">
                  <el-select v-model="form.noticeStatus" placeholder="请选择公告状态" clearable>
                    <el-option label="启用" value="1" />
                    <el-option label="停用" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="公告内容" prop="noticeContent">
                  <el-input v-model="form.noticeContent" placeholder="请输入公告内容" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="排序" prop="sorted">
                  <el-input-number v-model="form.sorted" :min="0" :step="1" placeholder="请输入数字"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="公告备注" prop="remark">
                  <el-input v-model="form.remark" :rows="5" type="textarea" placeholder="请输入公告备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          {{ form }}
        </template>
      </KoiDrawer>
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="noticePage">
import { nextTick, ref, reactive, onMounted } from "vue";
import {
  koiMsgSuccess,
  koiNoticeSuccess,
  koiNoticeError,
  koiMsgError,
  koiMsgWarning,
  koiMsgBox,
  koiMsgInfo
} from "@/utils/koi.ts";
// @ts-ignore
import { listPage, getById, add, update, deleteById, batchDelete, updateStatus } from "@/api/system/notice/index.ts";
// @ts-ignore
import { listDataByType } from "@/api/system/dict/data/index.ts";

// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件

// 表格数据
const tableList = ref<any>([
  {
    noticeId: 3,
    noticeTitle: "ElementPlus全新经典UI",
    noticeType: "2",
    noticeContent: "走过路过，千万不要错过",
    noticeStatus: "1",
    sorted: 3,
    createBy: "YU-ADMIN",
    createTime: "2023-08-22 11:27:24",
    updateBy: "",
    updateTime: "2023-08-16 18:36:50",
    remark: "YU-ADMIN"
  },
  {
    noticeId: 2,
    noticeTitle: "维护通知：2023-11-23 YU-ADMIN将持续进行维护",
    noticeType: "2",
    noticeContent: "维护内容",
    noticeStatus: "1",
    sorted: 2,
    createBy: "YU-ADMIN",
    createTime: "2023-08-22 11:27:24",
    updateBy: "",
    updateTime: null,
    remark: "YU-ADMIN"
  },
  {
    noticeId: 1,
    noticeTitle: "温馨提醒：2023-11-23 YU-ADMIN生日",
    noticeType: "1",
    noticeContent: "新版本内容",
    noticeStatus: "1",
    sorted: 1,
    createBy: "YU-ADMIN",
    createTime: "2023-08-22 11:27:24",
    updateBy: "",
    updateTime: null,
    remark: "YU-ADMIN"
  }
]);

// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  noticeTitle: "",
  noticeStatus: "",
  noticeType: ""
});

const total = ref<number>(0);

/** 重置搜索参数 */
const resetSearchParams = () => {
  searchParams.value = {
    pageNo: 1,
    pageSize: 10,
    noticeTitle: "",
    noticeStatus: "",
    noticeType: ""
  };
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.pageNo = 1;
  handleTableData();
};

/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  handleListPage();
};

/** @current-change：点击分页组件页码发生变化：例如：切换第2、3页 OR 上一页 AND 下一页 OR 跳转某一页 */
/** @size-change：点击分页组件下拉选择条数发生变化：例如：选择10条/页、20条/页等 */
// 分页查询，@current-change AND @size-change都会触发分页，调用后端分页接口
/** 数据表格 */
const handleListPage = async () => {
  total.value = 100;
  // try {
  //   tableList.value = []; // 重置表格数据
  //   loading.value = true;
  //   const res: any = await listPage(searchParams.value);
  //   console.log("公告数据表格数据->", res.data);
  //   tableList.value = res.data.records;
  //   total.value = res.data.total;
  //   loading.value = false;
  //   console.log("公告数据表格数据");
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试");
  // }
};

/** 数据表格[不带Loading，删除、批量删除等使用] */
const handleTableData = async () => {
  try {
    const res: any = await listPage(searchParams.value);
    console.log("公告数据表格数据->", res.data);
    tableList.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试");
  }
};

// 静态页面防止报错(可直接删除)
// @ts-ignore
const handleStaticPage = () => {
  listPage(searchParams.value);
};

onMounted(() => {
  // 获取表格数据
  handleListPage();
  handleDict();
});

// 翻译数据
const noticeOptions = ref();
/** 字典翻译tag */
const handleDict = async () => {
  try {
    noticeOptions.value = [
      {
        dictLabel: "通知",
        dictValue: "1",
        dictTag: "primary",
        dictColor: ""
      },
      {
        dictLabel: "公告",
        dictValue: "2",
        dictTag: "warning",
        dictColor: ""
      }
    ];
    // const res: any = await listDataByType("sys_notice_type");
    // console.log("字典数据", res.data);
    // noticeOptions.value = res.data;
  } catch (error) {
    console.log(error);
    koiMsgError("数据字典查询失败，请刷新重试");
  }
};

const ids = ref([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  // console.log(selection);
  ids.value = selection.map((item: any) => item.noticeId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

/** 添加 */
const handleAdd = () => {
  // 打开抽屉
  koiDrawerRef.value.koiOpen();
  koiMsgSuccess("添加");
  // 重置表单
  resetForm();
  // 标题
  title.value = "公告添加";
  form.value.noticeStatus = "1";
};

/** 回显数据 */
const handleEcho = async (id: any) => {
  console.log("回显数据ID", id);
  if (id == null || id == "") {
    koiMsgWarning("请选择需要修改的数据");
    return;
  }
  try {
    const res: any = await getById(id);
    console.log(res.data);
    form.value = res.data;
  } catch (error) {
    koiNoticeError("数据获取失败，请刷新重试");
    console.log(error);
  }
};

/** 修改 */
const handleUpdate = async (row?: any) => {
  // 打开抽屉
  koiDrawerRef.value.koiOpen();
  koiMsgSuccess("修改");
  // 重置表单
  resetForm();
  // 标题
  title.value = "公告修改";
  const noticeId = row ? row.noticeId : ids.value[0];
  if (noticeId == null || noticeId == "") {
    koiMsgError("请选择需要修改的数据");
  }
  console.log(noticeId);
  // 回显数据
  handleEcho(noticeId);
};

// 添加 OR 修改抽屉Ref
const koiDrawerRef = ref();
// 标题
const title = ref("公告类型管理");
// form表单Ref
const formRef = ref<any>();

// form表单
let form = ref<any>({
  noticeTitle: "",
  noticeType: "",
  noticeStatus: "",
  noticeContent: "",
  sorted: 1,
  remark: ""
});

/** 清空表单数据 */
const resetForm = () => {
  // 等待 DOM 更新完成
  nextTick(() => {
    if (formRef.value) {
      // 重置该表单项，将其值重置为初始值，并移除校验结果
      formRef.value.resetFields();
    }
  });    
  form.value = {
    noticeTitle: "",
    noticeType: "",
    noticeStatus: "",
    noticeContent: "",
    sorted: 1,
    remark: ""
  };
};

/** 表单规则 */
const rules = reactive({
  noticeTitle: [{ required: true, message: "请输入公告名称", trigger: "blur" }],
  noticeType: [{ required: true, message: "请输入公告类型", trigger: "blur" }],
  noticeStatus: [{ required: true, message: "请输入选择公告状态", trigger: "blur" }]
});

// 确定按钮是否显示Loading
const confirmLoading = ref(false);

/** 确定  */
const handleConfirm = () => {
  if (!formRef.value) return;
  confirmLoading.value = true;
  (formRef.value as any).validate(async (valid: any) => {
    if (valid) {
      console.log("表单ID", form.value.noticeId);
      if (form.value.noticeId != null && form.value.noticeId != "") {
        try {
          await update(form.value);
          koiNoticeSuccess("修改成功");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("修改失败，请刷新重试");
        }
      } else {
        try {
          await add(form.value);
          koiNoticeSuccess("添加成功");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("添加失败，请刷新重试");
        }
      }

      // let loadingTime = 1;
      // setInterval(() => {
      //   loadingTime--;
      //   if (loadingTime === 0) {
      //     koiNoticeSuccess("朕让你提交了么？信不信锤你");
      //     confirmLoading.value = false;
      //     resetForm();
      //     koiDrawerRef.value.koiQuickClose();
      //   }
      // }, 1000);
    } else {
      koiMsgError("验证失败，请检查填写内容");
      confirmLoading.value = false;
    }
  });
};

/** 取消 */
const handleCancel = () => {
  koiDrawerRef.value.koiClose();
};

/** 状态开关 */
const handleSwitch = (row: any) => {
  let text = row.noticeStatus === "1" ? "启用" : "停用";
  koiMsgBox("确认要[" + text + "]-[" + row.noticeTitle + "]吗？")
    .then(async () => {
      if (!row.noticeId || !row.noticeStatus) {
        koiMsgWarning("请选择需要修改的数据");
        return;
      }
      try {
        await updateStatus(row.noticeId, row.noticeStatus);
        koiNoticeSuccess("修改成功");
      } catch (error) {
        console.log(error);
        handleTableData();
        koiNoticeError("修改失败，请刷新重试");
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.noticeId;
  if (id == null || id == "") {
    koiMsgWarning("请选择需要删除的数据");
    return;
  }
  koiMsgBox("您确认需要删除公告名称[" + row.noticeTitle + "]么？")
    .then(async () => {
      try {
        await deleteById(id);
        handleTableData();
        koiNoticeSuccess("删除成功");
      } catch (error) {
        console.log(error);
        handleTableData();
        koiNoticeError("删除失败，请刷新重试");
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};

/** 批量删除 */
const handleBatchDelete = () => {
  if (ids.value.length == 0) {
    koiMsgInfo("请选择需要删除的数据");
    return;
  }
  koiMsgBox("您确认需要进行批量删除么？")
    .then(async () => {
      try {
        console.log("ids", ids.value);
        await batchDelete(ids.value);
        handleTableData();
        koiNoticeSuccess("批量删除成功");
      } catch (error) {
        console.log(error);
        handleTableData();
        koiNoticeError("批量删除失败，请刷新重试");
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};
</script>

<style lang="scss" scoped></style>
