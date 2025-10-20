<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="searchParams.deptName"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleTreeList"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门状态" prop="deptStatus">
          <el-select
            placeholder="请选择部门状态"
            v-model="searchParams.deptStatus"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleTreeList"
          >
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            placeholder="请输入联系电话"
            v-model="searchParams.phone"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleTreeList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-throttle="handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-debounce="resetSearch">重置</el-button>
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
        <!--  @click="handleExpend()"  -->
        <el-col :span="1.5" v-auth="['system:role:add']">
          <el-button type="info" icon="Sort" plain @click="toggleExpandAll()">展开/折叠</el-button>
        </el-col>
        <KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleTreeList"></KoiToolbar>
      </el-row>

      <div class="h-20px"></div>
      <!-- 数据表格 -->
      <el-table
        v-if="refreshTreeTable"
        v-loading="loading"
        border
        :data="tableList"
        @selection-change="handleSelectionChange"
        :expand-row-keys="expandKey"
        :default-expand-all="isExpandAll"
        row-key="deptId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        empty-text="暂时没有数据哟"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" prop="id" width="80px" align="center" type="index"></el-table-column>
        <el-table-column
          label="部门名称"
          prop="deptName"
          width="150px"
          align="left"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="展开/折叠" prop="isSpread" width="100px" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isSpread"
              active-text="展开"
              inactive-text="折叠"
              active-value="1"
              inactive-value="0"
              :inline-prompt="true"
              @click="handleSpread(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="部门编号" prop="deptId" width="100px" align="center"></el-table-column>
        <el-table-column label="负责人" prop="leader" width="120px" align="center"></el-table-column>
        <el-table-column label="联系电话" prop="phone" width="120px" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="230px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <!-- 注意：如果后端数据返回的是字符串"0" OR "1"，这里的active-value AND inactive-value不需要加冒号，会认为是字符串，否则：后端返回是0 AND 1数字，则需要添加冒号 -->
        <el-table-column label="部门状态" prop="deptStatus" width="100px" align="center">
          <template #default="scope">
            <!-- {{ scope.row.deptStatus }} -->
            <el-switch
              v-model="scope.row.deptStatus"
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
        <el-table-column label="显示顺序" prop="sorted" width="100px" align="center"></el-table-column>
        <el-table-column label="备注" prop="remark" width="180px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180px" align="center"></el-table-column>
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
      <!-- 添加 OR 修改 -->
      <KoiDialog
        ref="koiDialogRef"
        :title="title"
        @koiConfirm="handleConfirm"
        @koiCancel="handleCancel"
        :loading="confirmLoading"
      >
        <template #content>
          <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" status-icon>
            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="部门编码" prop="deptId">
                  <el-input v-model="form.deptId" placeholder="请输入部门编码" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="部门名称" prop="deptName">
                  <el-input v-model="form.deptName" placeholder="请输入部门名称" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <!-- 部门级联选择框 -->
                <el-form-item label="部门上级" prop="parentId">
                  <el-cascader
                    placeholder="请选择部门上级"
                    v-model="form.parentId"
                    :options="cascaderOptions"
                    :props="{
                      expandTrigger: 'hover',
                      emitPath: false,
                      checkStrictly: true
                    }"
                    filterable
                    clearable
                    style="width: 540px"
                  >
                    <template #default="{ node, data }">
                      <span>{{ data.label }}</span>
                      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    </template>
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="部门状态" prop="deptStatus">
                  <el-select v-model="form.deptStatus" placeholder="请选择部门状态" style="width: 260px" clearable>
                    <el-option label="启用" value="1" />
                    <el-option label="停用" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="负责人" prop="leader">
                  <el-input v-model="form.leader" placeholder="请输入部门负责人" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号码" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="邮箱地址" prop="email">
                  <el-input v-model="form.email" placeholder="请输入邮箱地址" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="显示排序" prop="sorted">
                  <el-input-number v-model="form.sorted" style="width: 260px" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入备注" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          {{ form }}
        </template>
      </KoiDialog>
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="deptPage">
import { nextTick, ref, reactive, onMounted } from "vue";
// @ts-ignore
import { koiNoticeSuccess, koiNoticeError, koiMsgError, koiMsgWarning, koiMsgBox, koiMsgInfo } from "@/utils/koi.ts";
import { handleTree } from "@/utils/index.ts";
// @ts-ignore
import {
  list,
  cascaderList,
  getById,
  add,
  update,
  deleteById,
  batchDelete,
  updateStatus,
  updateSpread
} from "@/api/system/dept/index.ts";

// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件
// 表格数据
const tableList = ref<any>([
  {
    id: 1,
    deptId: 1,
    deptName: "YU-ADMIN",
    leader: "YU-ADMIN",
    phone: "18588888888",
    email: "xxxxxx@163.com",
    deptStatus: "1",
    isSpread: "0",
    sorted: 1,
    remark: "我是天才",
    createTime: "2023-08-08 23:00:00",
    children: [
      {
        id: 3,
        deptId: 3,
        deptName: "研发部门",
        leader: "YU-ADMIN",
        phone: "18588888888",
        email: "xxxxxx@163.com",
        deptStatus: "1",
        isSpread: "0",
        sorted: 1,
        remark: "我是天才",
        createTime: "2023-08-08 23:00:00"
      },
      {
        id: 4,
        deptId: 4,
        deptName: "销售部门",
        leader: "虎牙688张大仙",
        phone: "18566666666",
        email: "666666@163.com",
        deptStatus: "1",
        isSpread: "0",
        sorted: 1,
        remark: "我是天才",
        createTime: "2023-08-08 23:00:00"
      }
    ]
  },
  {
    id: 2,
    deptId: 2,
    deptName: "祖安公司",
    leader: "YU-ADMIN",
    phone: "18577777777",
    email: "xxxxxx@163.com",
    deptStatus: "1",
    isSpread: "0",
    sorted: 1,
    remark: "我是天才",
    createTime: "2023-08-08 23:00:00",
    children: [
      {
        id: 5,
        deptId: 5,
        deptName: "运维部门",
        leader: "YU-ADMIN",
        phone: "18577777777",
        email: "xxxxxx@163.com",
        deptStatus: "1",
        isSpread: "0",
        sorted: 1,
        remark: "我是天才",
        createTime: "2023-08-08 23:00:00"
      },
      {
        id: 6,
        deptId: 6,
        deptName: "测试部门",
        leader: "虎牙688张大仙",
        phone: "18577777777",
        email: "666666@163.com",
        deptStatus: "1",
        isSpread: "0",
        sorted: 1,
        remark: "我是天才",
        createTime: "2023-08-08 23:00:00"
      }
    ]
  }
]);

// 查询参数
const searchParams = ref({
  deptName: "",
  phone: "",
  deptStatus: ""
});

/** 重置搜索参数 */
const resetSearchParams = () => {
  searchParams.value = {
    deptName: "",
    phone: "",
    deptStatus: ""
  };
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  handleTreeList();
};

/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  handleTreeList();
};

/** 树形表格查询 */
const handleTreeList = async () => {
  // try {
  //   tableList.value = []; // 重置表格数据
  //   loading.value = true;
  //   const res: any = await list(searchParams.value);
  //   console.log("部门数据表格数据->", res.data);
  //   tableList.value = handleTree(res.data, "deptId");
  //   handleExpandKey(res.data);
  //   loading.value = false;
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试");
  // }
};

/** 数据表格 */
const handleTableData = async () => {
  try {
    const res: any = await list(searchParams.value);
    console.log("部门数据表格数据->", res.data);
    tableList.value = handleTree(res.data, "deptId");
    handleExpandKey(res.data);
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试");
  }
};

// 静态页面防止报错(可直接删除)
// @ts-ignore
const handleStaticPage = () => {
  list(searchParams.value);
  handleExpandKey([]);
};

// 展开数据
const expandKey = ref();

/** 展开节点 */
const handleExpandKey = (data: any) => {
  if (data != null && data.length != 0) {
    expandKey.value = [];
    const resultList: string[] = [];
    data.forEach((obj: any) => {
      if (obj.parentId == "0" && obj.isSpread == "1") {
        resultList.push(obj.deptId);
      }
      if (obj.parentId != "0" && obj.isSpread == "1") {
        resultList.push(obj.deptId);
        resultList.push(obj.parentId);
      }
    });
    // 过滤数据
    const uniqueArray = [...new Set(resultList)];
    console.log("展开节点", uniqueArray);
    // 数组必须转为String类型的才生效
    expandKey.value = uniqueArray.map(String);
  } else {
    expandKey.value = [];
  }
};

onMounted(() => {
  // 获取表格数据
  handleTreeList();
});

const ids = ref([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  // console.log(selection);
  ids.value = selection.map((item: any) => item.id);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

// 级联下拉框
let cascaderOptions = ref<any>([]);

/** 部门级联数据 */
const handleCascader = async () => {
  try {
    cascaderOptions.value = [];
    const res: any = await cascaderList();
    cascaderOptions.value = handleTree(res.data, "value");
    cascaderOptions.value.unshift({
      label: "最顶级部门",
      value: "0",
      parentId: "-1"
    });
  } catch (error) {
    console.log(error);
    koiMsgError("部门级联数据查询失败，请重试");
  }
};

// 重新渲染表格状态
const refreshTreeTable = ref(true);
// 是否展开[默认折叠]
const isExpandAll = ref(false);

/** 展开/折叠 */
const toggleExpandAll = () => {
  refreshTreeTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTreeTable.value = true;
  });
};

/** 添加 */
const handleAdd = () => {
  // 打开对话框
  koiDialogRef.value.koiOpen();
  koiNoticeSuccess("添加");
  // 重置表单
  resetForm();
  // 标题
  title.value = "部门添加";
  handleCascader();
  form.value.parentId = "0";
  form.value.deptStatus = "1";
};

/** 回显数据 */
const handleEcho = async (id: any) => {
  if (id == null || id == "") {
    koiMsgWarning("请选择需要修改的数据");
    return;
  }
  try {
    const res: any = await getById(id);
    console.log("部门回显数据", res.data);
    form.value = res.data;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据获取失败，请刷新重试");
  }
};

/** 修改 */
const handleUpdate = async (row?: any) => {
  // 打开对话框
  koiDialogRef.value.koiOpen();
  koiNoticeSuccess("修改");
  // 重置表单
  resetForm();
  // 标题
  title.value = "部门修改";
  const id = row ? row.id : ids.value[0];
  if (id == null || id == "") {
    koiMsgError("请选择需要修改的数据");
  }
  handleCascader();
  // 回显数据
  handleEcho(id);
};

// 添加 OR 修改对话框Ref 
const koiDialogRef = ref();
// 标题
const title = ref("部门管理");
// form表单Ref
const formRef = ref<any>();

// form表单
let form = ref<any>({
  id: "",
  deptId: "",
  deptName: "",
  parentId: "",
  deptStatus: "1",
  leader: "",
  phone: "",
  email: "",
  sorted: 1
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
    id: "",
    deptId: "",
    deptName: "",
    parentId: "",
    deptStatus: "",
    leader: "",
    phone: "",
    email: "",
    sorted: 1
  };
};

/** 表单规则 */
const rules = reactive({
  deptId: [{ required: true, message: "请输入部门编号", trigger: "blur" }],
  deptName: [{ required: true, message: "请输入部门名字", trigger: "blur" }],
  parentId: [{ required: true, message: "请选择上级部门", trigger: "blur" }],
  deptStatus: [{ required: true, message: "请输入选择部门状态", trigger: "blur" }],
  leader: [{ required: true, message: "请输入负责人名字", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  sorted: [{ required: true, message: "请输入排序号", trigger: "blur" }]
});

// 确定按钮是否显示Loading
const confirmLoading = ref(false);

/** 确定  */
const handleConfirm = () => {
  if (!formRef.value) return;
  confirmLoading.value = true;
  (formRef.value as any).validate(async (valid: any) => {
    if (valid) {
      // console.log("表单ID", form.value.deptId);
      if (form.value.id != null && form.value.id != "") {
        try {
          await update(form.value);
          koiNoticeSuccess("修改成功");
          confirmLoading.value = false;
          koiDialogRef.value.koiQuickClose();
          resetForm();
          handleTreeList();
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
          koiDialogRef.value.koiQuickClose();
          resetForm();
          handleTreeList();
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
      //     koiDialogRef.value.koiQuickClose();
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
  koiDialogRef.value.koiClose();
};

/** 状态开关 */
const handleSwitch = (row: any) => {
  let text = row.deptStatus === "1" ? "启用" : "停用";
  koiMsgBox("确认要[" + text + "]-[" + row.deptName + "]部门吗？")
    .then(async () => {
      if (!row.id || !row.deptStatus) {
        koiMsgWarning("请选择需要修改的数据");
        return;
      }
      try {
        await updateStatus(row.id, row.deptStatus);
        koiNoticeSuccess("修改成功");
      } catch (error) {
        handleTableData();
        console.log(error);
        koiNoticeError("修改失败，请刷新重试");
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};

/** 是否展开 */
const handleSpread = async (row: any) => {
  if (!row.id || !row.isSpread) {
    koiMsgWarning("请选择需要展开的数据");
    return;
  }
  try {
    await updateSpread(row.id, row.isSpread);
    handleTableData();
    koiNoticeSuccess("操作成功");
  } catch (error) {
    handleTableData();
    console.log(error);
    koiNoticeError("操作失败，请刷新重试");
  }
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.id;
  if (id == null || id == "") {
    koiMsgWarning("请选择需要删除的数据");
    return;
  }
  koiMsgBox("您确认需要删除部门名称[" + row.deptName + "]么？")
    .then(async () => {
      try {
        await deleteById(id);
        koiNoticeSuccess("删除成功");
        handleTableData();
      } catch (error) {
        console.log(error);
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
  koiMsgBox("您确认需要进行批量删除么？删除后将无法进行恢复？")
    .then(async () => {
      try {
        await batchDelete(ids.value);
        koiNoticeSuccess("批量删除成功");
        handleTableData();
      } catch (error) {
        console.log(error);
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};
</script>

<style lang="scss" scoped></style>
