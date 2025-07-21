<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="操作名称" prop="operName">
          <el-input
            placeholder="请输入操作名称"
            v-model="searchParams.operName"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="operIp">
          <el-input
            placeholder="请输入IP地址"
            v-model="searchParams.operIp"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作人员" prop="operMan">
          <el-input
            placeholder="请输入操作人员名字"
            v-model="searchParams.operMan"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleListPage"
          ></el-input>
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
        <el-table-column label="序号" prop="operId" width="70px" align="center" type="index"></el-table-column>
        <el-table-column
          label="操作名称"
          prop="operName"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作类型"
          prop="operType"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="系统类型"
          prop="systemType"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="请求方式"
          prop="requestMethod"
          width="100px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作人员[登录名/用户名]"
          prop="operMan"
          width="200px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="请求URL"
          prop="operUrl"
          width="200px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作IP"
          prop="operIp"
          width="200px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作地点"
          prop="operLocation"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作时间"
          prop="operTime"
          width="180px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
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
            <el-tooltip content="查看" placement="top">
              <el-button
                type="primary"
                icon="View"
                circle
                plain
                @click="handleView(row)"
                v-auth="['system:role:list']"
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

      <KoiDialog ref="koiDialogRef" :title="title" top="6vh" :height="660" :width="800" :footerHidden="true">
        <template #content>
          <!-- 描述列表 -->
          <el-descriptions direction="vertical" :column="3" border>
            <el-descriptions-item label="方法名称">{{ form.methodName }}</el-descriptions-item>
            <el-descriptions-item label="消耗时间[毫秒]">{{ form.costTime }}</el-descriptions-item>
            <el-descriptions-item label="操作状态">
              <el-tag :type="form.operStatus == '0' ? '' : form.operStatus == '1' ? 'danger' : 'warning'">
                {{ form.operStatus == "0" ? "操作成功" : form.operStatus == "1" ? "操作失败" : "未知状态" }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="异常信息" v-if="form.operStatus == '1'" :span="3">{{
              form.costTime
            }}</el-descriptions-item>
            <el-descriptions-item label="请求参数" :span="3">{{ form.operParam }}</el-descriptions-item>
            <el-descriptions-item label="返回数据" :span="3">{{ form.jsonResult }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </KoiDialog>
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="operlogPage">
import { ref, onMounted } from "vue";
// @ts-ignore
import { koiNoticeSuccess, koiNoticeError, koiMsgWarning, koiMsgBox, koiMsgInfo, koiMsgError } from "@/utils/koi.ts";
// @ts-ignore
import { koiDatePicker } from "@/utils/index.ts";
// @ts-ignore
import { listPage, getById, deleteById, batchDelete, getDetailById } from "@/api/system/operlog/index.ts";

// 表格加载动画Loading
const loading = ref(false);
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件
// 表格数据
const tableList = ref<any>([
  {
    operId: "1719245754125537281",
    operName: "日志分页查询",
    operType: "EXPORT",
    methodName: "listPage",
    requestMethod: "",
    systemType: "PHONE",
    operMan: "null/超级管理员",
    operUrl: "",
    operIp: "",
    operLocation: "",
    operParam: '{"pageNo":1,"pageSize":10,"loginName":null,"ipAddress":null,"loginStatus":null,"beginTime":null,"endTime":null}',
    jsonResult:
      '{"records":[{"loginId":1631503277759787010,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"99.88","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"loginId":1631504522339807234,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"127.0.0.1","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"loginId":1631521087655362562,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"127.0.0.1","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"loginId":1631545199358406657,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"127.0.0.1","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"lo',
    operStatus: "0",
    errorMsg: "",
    operTime: "2023-10-31 14:51:44",
    costTime: "7/ms"
  },
  {
    operId: "1719266711737237506",
    operName: "日志分页查询",
    operType: "EXPORT",
    methodName: "listPage",
    requestMethod: "GET",
    systemType: "PHONE",
    operMan: "YU-ADMIN/超级管理员",
    operUrl: "/koi/sysLoginLog/listPage",
    operIp: "127.0.0.1",
    operLocation: "内网IP，无法获取位置",
    operParam: '{"pageNo":1,"pageSize":10,"loginName":null,"ipAddress":null,"loginStatus":null,"beginTime":null,"endTime":null}',
    jsonResult:
      '{"records":[{"loginId":1631503277759787010,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"99.88","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"loginId":1631504522339807234,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"127.0.0.1","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"loginId":1631521087655362562,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"127.0.0.1","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"loginId":1631545199358406657,"loginName":"YU-ADMIN","deviceName":"Unknown","ipAddress":"127.0.0.1","loginAddress":"河南省 郑州市","browser":"iOS 11 (iPhone)","os":"Chrome Mobile","loginStatus":"0","message":"登录成功","loginTime":"2023-08-25 19:13:30"},{"lo',
    operStatus: "1",
    errorMsg: "",
    operTime: "2023-10-31 16:15:01",
    costTime: "112/ms"
  },
  {
    operId: "1719266961520615426",
    operName: "日志分页查询",
    operType: "EXPORT",
    methodName: "listPage",
    requestMethod: "GET",
    systemType: "PHONE",
    operMan: "YU-ADMIN/超级管理员",
    operUrl: "/koi/sysLoginLog/listPage",
    operIp: "127.0.0.1",
    operLocation: "内网IP，无法获取位置",
    operParam: '{"pageNo":1,"pageSize":10,"loginName":null,"ipAddress":null,"loginStatus":null,"beginTime":null,"endTime":null}',
    jsonResult: "",
    operStatus: "1",
    errorMsg: "",
    operTime: "2023-10-31 16:16:01",
    costTime: "111/ms"
  }
]);

// 查询参数
const searchParams = ref({
  pageNo: 1, // 第几页
  pageSize: 10, // 每页显示多少条
  operName: "",
  operIp: "",
  operMan: ""
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
    operName: "",
    operIp: "",
    operMan: ""
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
  //   console.log("操作日志数据表格数据->", res.data);
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
    console.log("操作日志数据表格数据->", res.data);
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
  ids.value = selection.map((item: any) => item.operId);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.operId;
  if (id == null || id == "") {
    koiMsgWarning("请选择需要删除的数据");
  }
  koiMsgBox("您确认需要删除操作名称[" + row.operName + "]么？")
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

/** 查看 */
const handleView = async (row: any) => {
  const id = row.operId;
  if (!id) {
    koiMsgError("请传递需要查询的条件");
  }
  // 重置表单
  resetForm();
  // 标题
  title.value = "描述列表";
  try {
    const res: any = await getDetailById(id);
    console.log("操作日志数据表格数据->", res.data);
    form.value = res.data;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试");
  }
  koiDialogRef.value.koiOpen();
};

// 添加 OR 修改对话框Ref 
const koiDialogRef = ref();
/** 打开Dialog操作 */
const title = ref("描述列表");

// form表单
let form = ref<any>({
  methodName: "",
  operParam: "",
  jsonResult: "",
  operStatus: "",
  errorMsg: "",
  costTime: ""
});

/** 清空表单数据 */
const resetForm = () => {
  form.value = {
    methodName: "",
    operParam: "",
    jsonResult: "",
    operStatus: "",
    errorMsg: "",
    costTime: ""
  };
};
</script>

<style lang="scss" scoped></style>
