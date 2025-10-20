<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="用户名称" prop="loginName">
          <el-input
            placeholder="请输入用户名称"
            v-model="searchParams.loginName"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input
            placeholder="请输入IP地址"
            v-model="searchParams.ipAddress"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录状态" prop="loginStatus">
          <el-select
            placeholder="请选择日志状态"
            v-model="searchParams.loginStatus"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          >
            <el-option label="登录成功" value="1" />
            <el-option label="登录失败" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="访问时间" prop="loginTime">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" plain v-debounce="handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-throttle="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button type="danger" icon="delete" plain @click="handleBatchDelete()" :disabled="multiple">删除</el-button>
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
        <el-table-column label="序号" prop="loginId" width="80px" align="center" type="index"></el-table-column>
        <el-table-column
          label="登录用户"
          prop="loginName"
          width="130px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="IP地址"
          prop="ipAddress"
          width="160px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="登录地址"
          prop="loginAddress"
          width="260px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="登录状态" prop="loginStatus" width="100px" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag :type="scope.row.loginStatus == '1' ? 'primary' : scope.row.loginStatus == '0' ? 'danger' : 'warning'">
              <!-- :type是用来判断块状的颜色 -->
              <!-- 里面填写内容 -->
              {{ scope.row.loginStatus == "1" ? "登录成功" : scope.row.loginStatus == "0" ? "登录失败" : "未知状态" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="设备名称"
          prop="deviceName"
          width="150px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="浏览器"
          prop="browser"
          width="150px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作系统" prop="os" width="150px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          label="登录信息"
          prop="message"
          width="150px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- 注意：如果后端数据返回的是字符串"0" OR "1"，这里的active-value AND inactive-value不需要加冒号，会认为是字符串，否则：后端返回是0 AND 1数字，则需要添加冒号 -->
        <!-- <el-table-column
          label="是否冻结"
          prop="loginStatus"
          width="100px"
          align="center"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.loginStatus"
              active-text="启用"
              inactive-text="停用"
              active-value="1"
              inactive-value="0"
              :inline-prompt="true"
              @change="handleSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="登录时间" prop="loginTime" width="180px" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
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
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="loginlogPage">
import { ref, onMounted } from "vue";
// @ts-ignore
import { koiNoticeSuccess, koiNoticeError, koiMsgWarning, koiMsgBox, koiMsgInfo, koiMsgError } from "@/utils/koi.ts";
// @ts-ignore
import { koiDatePicker } from "@/utils/index.ts";
// @ts-ignore
import {
  listPage,
  deleteById,
  batchDelete
  // updateStatus,
} from "@/api/system/loginlog/index.ts";

// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件
// 表格数据
const tableList = ref<any>([
  {
    loginId: 1,
    loginName: "YU-ADMIN",
    ipAddress: "127.0.0.1",
    loginAddress: "河南省 郑州市",
    loginStatus: "1",
    deviceName: "PC",
    browser: "Chrome 11",
    os: "Windows 10",
    message: "YU-ADMIN",
    loginTime: "2023-08-08 23:00:00"
  },
  {
    loginId: 2,
    loginName: "张大仙",
    ipAddress: "127.0.0.1",
    loginAddress: "河南省 郑州市",
    loginStatus: "1",
    deviceName: "PC",
    browser: "Chrome 11",
    os: "Windows 10",
    message: "YU-ADMIN",
    loginTime: "2023-08-08 23:00:00"
  },
  {
    loginId: 3,
    loginName: "王将",
    ipAddress: "127.0.0.1",
    loginAddress: "河南省 郑州市",
    loginStatus: "1",
    deviceName: "PC",
    browser: "Chrome 11",
    os: "Windows 10",
    message: "YU-ADMIN",
    loginTime: "2023-08-08 23:00:00"
  }
]);

// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  loginName: "",
  ipAddress: "",
  loginStatus: ""
});

const total = ref<number>(0);
// 时间
const dateRange = ref();

/** 重置搜索参数 */
const resetSearchParams = () => {
  dateRange.value = [];
  searchParams.value = {
    pageNo: 1,
    pageSize: 10,
    loginName: "",
    ipAddress: "",
    loginStatus: ""
  };
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.pageNo = 1;
  handleListPage();
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
  total.value = 200;
  // try {
  //   loading.value = true;
  //   tableList.value = []; // 重置表格数据
  //   const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
  //   console.log("日志数据表格数据->", res.data);
  //   tableList.value = res.data.records;
  //   total.value = res.data.total;
  //   loading.value = false;
  // } catch (error) {
  //   console.log(error);
  //   koiNoticeError("数据查询失败，请刷新重试");
  // }
};

/** 数据表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
  try {
    const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
    console.log("日志数据表格数据->", res.data);
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
});

const ids = ref([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用

/** 是否多选 */
const handleSelectionChange = (selection: any) => {
  // console.log(selection);
  ids.value = selection.map((item: any) => item.loginId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

/** 状态开关 */
// const handleSwitch = (row: any) => {
//   let text = row.loginStatus === "1" ? "启用" : "停用";
//   koiMsgBox("确认要[" + text + "]-[" + row.loginName + "]吗？")
//     .then(async () => {
//       if (!row.loginId || !row.loginStatus) {
//         koiMsgWarning("请选择需要修改的数据");
//         return;
//       }
//       try {
//         await updateStatus(row.loginId, row.loginStatus);
//         koiNoticeSuccess("修改成功");
//       } catch (error) {
//         console.log(error);
//         handleTableData();
//         koiNoticeError("修改失败，请刷新重试");
//       }
//     })
//     .catch(() => {
//       koiMsgError("已取消");
//     });
// };

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.loginId;
  if (id == null || id == "") {
    koiMsgWarning("请选择需要删除的数据");
    return;
  }
  koiMsgBox("您确认需要删除用户名称[" + row.loginName + "]么？")
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
        // console.log("ids", ids.value);
        await batchDelete(ids.value);
        handleTableData();
        koiNoticeSuccess("批量删除成功");
      } catch (error) {
        console.log(error);
        koiNoticeError("批量删除失败，请刷新重试");
        handleTableData();
      }
    })
    .catch(() => {
      koiMsgError("已取消");
    });
};
</script>

<style lang="scss" scoped></style>
