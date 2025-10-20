<template>
  <div class="p-6px">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="rounded-md" shadow="never">
          <div class="text-13px text-#303133 dark:text-#E5EAF3">
            <div class="flex flex-justify-center">
              <KoiUploadImage v-model:imageUrl="mine.avatar">
                <template #content>
                  <el-icon><Avatar /></el-icon>
                  <span>请上传头像</span>
                </template>
              </KoiUploadImage>
            </div>
            <div class="flex flex-justify-between flex-wrap mt-20px p-y-12px">
              <div class="flex flex-items-center">
                <el-icon size="15"> <UserFilled /> </el-icon>
                <div class="p-l-2px">登录名称</div>
              </div>
              <div v-text="mine.loginName"></div>
            </div>
            <div class="flex flex-justify-between flex-wrap p-y-12px">
              <div class="flex flex-items-center">
                <el-icon size="15"> <User /> </el-icon>
                <div class="p-l-2px">用户名称</div>
              </div>
              <div v-text="mine.userName"></div>
            </div>
            <div class="flex flex-justify-between flex-wrap p-y-12px">
              <div class="flex flex-items-center">
                <el-icon size="15"> <Iphone /> </el-icon>
                <div class="p-l-2px">手机号码</div>
              </div>
              <div v-text="mine.phone"></div>
            </div>
            <div class="flex flex-justify-between flex-wrap p-y-12px">
              <div class="flex flex-items-center">
                <el-icon size="15"> <Message /> </el-icon>
                <div class="p-l-2px">用户邮箱</div>
              </div>
              <div v-text="mine.email"></div>
            </div>
            <div class="flex flex-justify-between flex-wrap p-y-12px">
              <div class="flex flex-items-center">
                <el-icon size="15"> <Postcard /> </el-icon>
                <div class="p-l-2px">所属部门</div>
              </div>
              <div v-text="mine.deptName"></div>
            </div>
            <div class="flex flex-justify-between flex-wrap p-y-12px">
              <div class="flex flex-items-center">
                <el-icon size="15"> <Collection /> </el-icon>
                <div class="p-l-2px">所属角色</div>
              </div>
              <div v-text="mine.roleName"></div>
            </div>
            <div class="flex flex-justify-between flex-wrap p-y-12px">
              <div class="flex items-center">
                <el-icon size="15"> <Calendar /> </el-icon>
                <div class="p-l-2px">创建日期</div>
              </div>
              <div v-text="mine.createTime"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="rounded-md" shadow="never" :body-style="{ 'padding-top': '6px' }">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本资料" name="first">
              <el-form ref="mineFormRef" :rules="mineRules" :model="mineForm" label-width="80px" status-icon>
                <el-row>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="登录名称" prop="loginName">
                      <el-input v-model="mineForm.loginName" placeholder="请输入登录名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="手机号码" prop="phone">
                      <el-input v-model="mineForm.phone" placeholder="请输入手机号码" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="mineForm.email" placeholder="请输入邮箱" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="性别" prop="sex">
                      <el-radio-group v-model="mineForm.sex" placeholder="请选择性别">
                        <el-radio value="1" border>男</el-radio>
                        <el-radio value="2" border>女</el-radio>
                        <el-radio value="0" border>未知</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }" class="mt-6px">
                    <el-form-item>
                      <el-button type="primary" plain @click="handleMineSave">保存</el-button>
                      <el-button type="danger" plain @click="resetMineForm">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              {{ mineForm }}
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form ref="pwdFormRef" :rules="pwdRules" :model="pwdForm" label-width="80px" status-icon>
                <el-row>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="pwdForm.password" placeholder="请输入旧密码" show-password clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input v-model="pwdForm.newPassword" placeholder="请输入新密码" show-password clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
                    <el-form-item label="确认密码" prop="confirmPassword">
                      <el-input v-model="pwdForm.confirmPassword" placeholder="请输入确认密码" show-password clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="{ span: 24 }" :xs="{ span: 24 }" class="mt-6px">
                    <el-form-item>
                      <el-button type="primary" plain @click="handlePwdSave">保存</el-button>
                      <el-button type="danger" plain @click="resetPwdForm">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              {{ pwdForm }}
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="personagePage">
import { nextTick, ref, reactive } from "vue";
import { koiMsgError, koiMsgSuccess } from "@/utils/koi.ts";

// 个人信息
const mine = ref({
  avatar: "https://pic4.zhimg.com/v2-702a23ebb518199355099df77a3cfe07_b.webp",
  loginName: "YU-ADMIN",
  userName: "于金金",
  phone: "18593114301",
  email: "yuxintao6@163.com",
  deptName: "研发部门",
  roleName: "超级管理员",
  createTime: "2023-11-23 18:00:00"
});

// el-card标签选择name
const activeName = ref("first");

/** 基本资料 Begin  */

// form表单Ref
const mineFormRef = ref<any>();
// form表单
let mineForm = ref<any>({
  loginName: "",
  phone: "",
  email: "",
  sex: "0"
});
/** 清空表单数据 */
const resetMineForm = () => {
  // 等待 DOM 更新完成
  nextTick(() => {
    if (mineFormRef.value) {
      // 重置该表单项，将其值重置为初始值，并移除校验结果
      mineFormRef.value.resetFields();
    }
  });     
  mineForm.value = {
    loginName: "",
    phone: "",
    email: "",
    sex: "0"
  };
};
/** 表单规则 */
const mineRules = reactive({
  loginName: [{ required: true, message: "请输入登录名称", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
});

/** 保存 */
const handleMineSave = () => {
  if (!mineFormRef.value) return;
  (mineFormRef.value as any).validate(async (valid: any) => {
    if (valid) {
      koiMsgSuccess("保存成功");
    } else {
      koiMsgError("验证失败，请检查填写内容");
    }
  });
};

/** 基本资料 End  */

/** 修改密码 Begin  */
// form表单Ref
const pwdFormRef = ref<any>();
// form表单
let pwdForm = ref<any>({
  password: "",
  newPassword: "",
  confirmPassword: ""
});

/** 清空表单数据 */
const resetPwdForm = () => {
  // 等待 DOM 更新完成
  nextTick(() => {
    if(pwdFormRef.value) {
      // 重置该表单项，将其值重置为初始值，并移除校验结果
      pwdFormRef.value.resetFields();
    }
  });    
  pwdForm.value = {
    password: "",
    newPassword: "",
    confirmPassword: ""
  };
};

/** 表单规则 */
const pwdRules = reactive({
  password: [{ required: true, message: "请输入旧密码", trigger: "change" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "change" }],
  confirmPassword: [{ required: true, message: "请输入确认密码", trigger: "change" }]
});

/** 保存 */
const handlePwdSave = () => {
  if (!pwdFormRef.value) return;
  (pwdFormRef.value as any).validate(async (valid: any) => {
    if (valid) {
      koiMsgSuccess("保存成功");
    } else {
      koiMsgError("验证失败，请检查填写内容");
    }
  });
};

/** 修改密码 End  */
</script>

<style lang="scss" scoped>

</style>
