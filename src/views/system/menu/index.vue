<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            placeholder="请输入菜单名称"
            v-model="searchParams.menuName"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleTreeList"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuStatus">
          <el-select
            placeholder="请选择菜单状态"
            v-model="searchParams.menuStatus"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleTreeList"
          >
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" prop="auth">
          <el-input
            placeholder="请输入权限标识"
            v-model="searchParams.auth"
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
        <KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleTableData"></KoiToolbar>
      </el-row>

      <div class="h-20px"></div>
      <!-- 数据表格 -->
      <el-table
        v-if="refreshTreeTable"
        v-loading="loading"
        border
        :data="tableList"
        @selection-change="handleSelectionChange"
        :default-expand-all="isExpandAll"
        :expand-row-keys="expandKey"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        empty-text="暂时没有数据哟"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" prop="menuId" width="80px" align="center" type="index"></el-table-column>
        <el-table-column
          label="菜单名称"
          prop="menuName"
          width="160px"
          align="left"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="菜单类型" prop="menuType" width="100px" align="center">
          <template #default="scope">
            <KoiTag :tagOptions="koiDicts.sys_menu_type" :value="scope.row.menuType"></KoiTag>
          </template>
        </el-table-column>
        <el-table-column label="展开/折叠" prop="isSpread" width="100px" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isSpread"
              active-text="展开"
              inactive-text="折叠"
              active-value="1"
              inactive-value="0"
              :inline-prompt="true"
              @click="handleIsSpread(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="图标" prop="icon" width="80px" align="center">
          <template #default="scope">
            <!-- 使用 is 属性绑定组件名称 -->
            <div class="flex flex-justify-center">
              <el-icon v-if="scope.row.icon && scope.row.icon.indexOf('koi-') == '-1'" :size="20">
                <component :is="scope.row.icon"></component>
              </el-icon>
              <el-icon v-if="scope.row.icon && scope.row.icon.indexOf('koi-') == '0'" :size="20">
                <component is="KoiSvgIcon" :name="scope.row.icon"></component>
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="权限标识"
          prop="auth"
          width="220px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="页面路径"
          prop="component"
          width="220px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 注意：如果后端数据返回的是字符串"0" OR "1"，这里的active-value AND inactive-value不需要加冒号，会认为是字符串，否则：后端返回是0 AND 1数字，则需要添加冒号 -->
        <el-table-column label="菜单状态" prop="menuStatus" width="100px" align="center">
          <template #default="scope">
            <!-- {{ scope.row.menuStatus }} -->
            <el-switch
              v-model="scope.row.menuStatus"
              active-text="启用"
              inactive-text="停用"
              active-value="1"
              inactive-value="0"
              :inline-prompt="true"
              @click="handleSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" prop="isVisible" width="100px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag :type="scope.row.isVisible == '0' ? 'danger' : scope.row.isVisible == '1' ? 'primary' : 'warning'">
              {{ scope.row.isVisible == "0" ? "隐藏" : scope.row.isVisible == "1" ? "显示" : "未知状态" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="路由path" prop="path" width="180px" align="center" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="显示顺序" prop="sorted" width="90px" align="center"></el-table-column>
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
        :height="500"
      >
        <template #content>
          <el-form ref="formRef" :rules="rules" :model="form" label-width="auto" status-icon>
            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <!-- 菜单级联选择框 -->
                <el-form-item label="菜单上级" prop="parentId">
                  <el-cascader
                    placeholder="请选择菜单上级"
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

            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <!-- 菜单级联选择框 -->
                <el-form-item label="菜单类型" prop="menuType">
                  <el-radio-group v-model="form.menuType">
                    <el-radio
                      v-for="(item, index) in koiDicts.sys_menu_type"
                      :key="item.dictValue + index"
                      :value="item.dictValue"
                      border
                      >{{ item.dictLabel }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }" v-if="form.menuType < 3">
                <div class="flex flex-items-center m-b-15px m-l-8px">
                  <el-form-item prop="icon"></el-form-item>
                  <div class="w-70px">菜单图标</div>
                  <KoiSelectIcon width="300" v-model="form.icon"></KoiSelectIcon>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="菜单名称" prop="menuName">
                  <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="显示排序" prop="sorted">
                  <el-input-number v-model="form.sorted" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="是否显示" prop="isVisible">
                  <el-radio-group v-model="form.isVisible">
                    <el-radio value="1">是</el-radio>
                    <el-radio value="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="权限字符" prop="auth">
                  <el-input v-model="form.auth" placeholder="权限字符[system:user:list]" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="form.menuType == '2'">
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="页面路径" prop="component">
                  <el-input v-model="form.component" placeholder="请输入页面路径[system/user/index]" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" v-if="form.menuType < 3">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="路由名称" prop="name">
                  <el-input v-model="form.name" placeholder="例如：user[唯一]" clearable />
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }">
                <el-form-item label="路由Path" prop="path">
                  <el-input v-model="form.path" placeholder="例如：/user[唯一]" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }" v-if="form.menuType < 3">
                <el-form-item label="是否折叠" prop="isSpread">
                  <el-radio-group v-model="form.isSpread">
                    <el-radio value="1">是</el-radio>
                    <el-radio value="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :sm="{ span: 12 }" :xs="{ span: 24 }" v-if="form.menuType < 3">
                <el-form-item label="是否固钉" prop="isAffix">
                  <el-radio-group v-model="form.isAffix">
                    <el-radio value="1">是</el-radio>
                    <el-radio value="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                <el-form-item label="外链地址" prop="linkUrl">
                  <el-input v-model="form.linkUrl" placeholder="请输入外链地址[输入值则判断为外链地址]" clearable />
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

<script setup lang="ts" name="menuPage">
import { nextTick, ref, reactive, onMounted } from "vue";
import { koiNoticeSuccess, koiNoticeError, koiMsgError, koiMsgWarning, koiMsgBox, koiMsgInfo } from "@/utils/koi.ts";
import { handleTree } from "@/utils/index.ts";
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
} from "@/api/system/menu/index.ts";
import { useKoiDict } from "@/hooks/dicts/index.ts";

const { koiDicts } = useKoiDict(["sys_menu_type"]);
// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件

// 表格数据
const tableList = ref([
  {
    menuId: 1,
    menuName: "系统管理",
    menuType: "1",
    icon: "Tools",
    auth: "system:menu:list",
    component: "system/menu/Index",
    isSpread: "0",
    menuStatus: "1",
    isVisible: "1",
    path: "system",
    sorted: 1,
    children: [
      {
        menuId: 3,
        menuName: "用户管理",
        menuType: "2",
        icon: "UserFilled",
        auth: "system:menu:list",
        component: "system/menu/Index",
        isSpread: "0",
        menuStatus: "1",
        isVisible: "1",
        path: "system",
        sorted: 3
      },
      {
        menuId: 4,
        menuName: "角色管理",
        menuType: "2",
        icon: "CameraFilled",
        auth: "system:menu:list",
        component: "system/menu/Index",
        isSpread: "0",
        menuStatus: "1",
        isVisible: "1",
        path: "system",
        sorted: 4
      },
      {
        menuId: 9,
        menuName: "菜单管理",
        menuType: "2",
        icon: "Menu",
        auth: "system:menu:list",
        component: "system/menu/Index",
        isSpread: "0",
        menuStatus: "1",
        isVisible: "1",
        path: "system",
        sorted: 5
      }
    ]
  },
  {
    menuId: 2,
    menuName: "监控管理",
    menuType: "1",
    icon: "Search",
    auth: "system:menu:list",
    component: "system/menu/Index",
    isSpread: "0",
    menuStatus: "1",
    isVisible: "1",
    path: "system",
    sorted: 2,
    children: [
      {
        menuId: 5,
        menuName: "熊出没",
        menuType: "2",
        icon: "CameraFilled",
        auth: "system:menu:list",
        component: "system/menu/Index",
        isSpread: "0",
        menuStatus: "1",
        isVisible: "1",
        path: "system",
        sorted: 6
      },
      {
        menuId: 6,
        menuName: "海绵宝宝",
        menuType: "2",
        icon: "Menu",
        auth: "system:menu:list",
        component: "system/menu/Index",
        isSpread: "0",
        menuStatus: "1",
        isVisible: "1",
        path: "system",
        sorted: 7
      }
    ]
  }
]);

// 查询参数
const searchParams = ref({
  menuName: "",
  auth: "",
  menuStatus: ""
});

/** 重置搜索参数 */
const resetSearchParams = () => {
  searchParams.value = {
    menuName: "",
    auth: "",
    menuStatus: ""
  };
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  handleTableData();
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
  //   loading.value = true;
  //   tableList.value = []; // 重置表格数据
  //   const res: any = await list(searchParams.value);
  //   console.log("菜单数据表格数据->", res.data);
  //   handleExpandKey(res.data);
  //   tableList.value = handleTree(res.data, "menuId");
  //   loading.value = false;
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试");
  // }
};

/** 树形表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
  try {
    const res: any = await list(searchParams.value);
    console.log("菜单数据表格数据->", res.data);
    handleExpandKey(res.data);
    tableList.value = handleTree(res.data, "menuId");
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
      if (obj.parentId == "0" && obj.isSpread == "0") {
        resultList.push(obj.menuId);
      }
      if (obj.parentId != "0" && obj.isSpread == "0") {
        resultList.push(obj.menuId);
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
  ids.value = selection.map((item: any) => item.menuId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

// 级联下拉框
let cascaderOptions = ref([]);

/** 菜单级联数据 */
const handleCascader = async () => {
  try {
    cascaderOptions.value = [];
    const res: any = await cascaderList();
    if (res.data != null && res.data != undefined && res.data.length > 0) {
      cascaderOptions.value = handleTree(res.data, "value");
    }
    // @ts-ignore
    cascaderOptions.value.unshift({
      label: "最顶级菜单",
      value: "0",
      parentId: "-1"
    });
  } catch (error) {
    console.log(error);
    koiMsgError("菜单级联数据查询失败，请重试");
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
  // 重置图标
  form.value.icon = "";
  // 标题
  title.value = "菜单添加";
  handleCascader();
  form.value.menuStatus = "1";
};

/** 回显数据 */
const handleEcho = async (id: any) => {
  if (id == null || id == "") {
    koiMsgWarning("请选择需要修改的数据");
    return;
  }
  try {
    const res: any = await getById(id);
    console.log("菜单回显数据", res.data);
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
  title.value = "菜单修改";
  const id = row ? row.menuId : ids.value[0];
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
const title = ref("菜单管理");
// form表单Ref
const formRef = ref();
// form表单
let form = ref();

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
    parentId: "0",
    menuType: "2",
    icon: "",
    menuName: "",
    name: "",
    path: "",
    component: "",
    isVisible: "1",
    linkUrl: "",
    isKeepAlive: "0",
    isSpread: "0",
    auth: "",
    isTag: "0",
    isAffix: "0",
    sorted: 1
  };
};

/** 表单规则 */
const rules = reactive({
  parentId: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
  menuType: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  isVisible: [{ required: true, message: "请选择是否显示", trigger: "blur" }],
  auth: [{ required: true, message: "请输入权限字符", trigger: "blur" }],
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
      // console.log("表单ID", form.value.menuId);
      if (form.value.menuId != null && form.value.menuId != "") {
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
  let text = row.menuStatus === "1" ? "启用" : "停用";
  koiMsgBox("确认要[" + text + "]-[" + row.menuName + "]菜单吗？")
    .then(async () => {
      if (!row.menuId || !row.menuStatus) {
        koiMsgWarning("请选择需要修改的数据");
        return;
      }
      try {
        await updateStatus(row.menuId, row.menuStatus);
        koiNoticeSuccess("修改成功");
      } catch (error) {
        console.log(error);
        koiNoticeError("修改失败，请刷新重试");
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};

/** 是否展开 */
const handleIsSpread = async (row: any) => {
  if (!row.menuId || !row.isSpread) {
    koiMsgWarning("请选择需要展开的数据");
    return;
  }
  try {
    await updateSpread(row.menuId, row.isSpread);
    handleTableData();
    koiNoticeSuccess("操作成功");
  } catch (error) {
    console.log(error);
    koiNoticeError("操作失败，请刷新重试");
  }
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.menuId;
  if (id == null || id == "") {
    koiMsgWarning("请选择需要删除的数据");
    return;
  }
  koiMsgBox("您确认需要删除菜单名称[" + row.menuName + "]么？")
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
