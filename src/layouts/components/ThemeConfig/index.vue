<template>
  <!-- 主题配置 -->
  <KoiDrawer
    ref="koiDrawerRef"
    title="主题配置"
    :footerHidden="true"
    :closeOnClickModel="true"
  >
    <template #content>
      <el-row>
        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
          <el-divider class="flex" content-position="center">
            <div class="flex flex-row flex-justify-center flex-items-center">
              <el-icon :size="18"><Connection /></el-icon>
              <div class="text-14px m-l-4px">主题颜色</div>
            </div>
          </el-divider>
        </el-col>
      </el-row>

      <!-- 可使用 column-gap 解决 flex-justify-between 问题 -->
      <div class="w-full flex flex-wrap flex-justify-between">
        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#2992FF')"
            :style="{ 'border-color': globalStore.themeColor === '#2992FF' ? '#2992FF' : '' }">
           <div class="rounded-md w-20px h-20px bg-#2992FF m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">睛蓝色</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#1E71EE')"
            :style="{ 'border-color': globalStore.themeColor === '#1E71EE' ? '#1E71EE' : '' }">
           <div class="rounded-md w-20px h-20px bg-#1E71EE m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">墨蓝色</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#6169FF')"
            :style="{ 'border-color': globalStore.themeColor === '#6169FF' ? '#6169FF' : '' }">
           <div class="rounded-md w-20px h-20px bg-#6169FF m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">紫罗兰</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#8076C3')"
            :style="{ 'border-color': globalStore.themeColor === '#8076C3' ? '#8076C3' : '' }">
           <div class="rounded-md w-20px h-20px bg-#8076C3 m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">槿紫色</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#1BA784')"
            :style="{ 'border-color': globalStore.themeColor === '#1BA784' ? '#1BA784' : '' }">
           <div class="rounded-md w-20px h-20px bg-#1BA784  m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">竹绿色</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#316C72')"
            :style="{ 'border-color': globalStore.themeColor === '#316C72' ? '#316C72' : '' }">
           <div class="rounded-md w-20px h-20px bg-#316C72 m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">蓝绿色</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#BE967F')"
            :style="{ 'border-color': globalStore.themeColor === '#BE967F' ? '#BE967F' : '' }">
           <div class="rounded-md w-20px h-20px bg-#BE967F m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">海鸥棕</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#D85916')"
            :style="{ 'border-color': globalStore.themeColor === '#D85916' ? '#D85916' : '' }">
           <div class="rounded-md w-20px h-20px bg-#d85916 m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">铁棕色</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#CF4813')"
            :style="{ 'border-color': globalStore.themeColor === '#CF4813' ? '#CF4813' : '' }">
           <div class="rounded-md w-20px h-20px bg-#CF4813  m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">落霞红</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#CD6227')"
            :style="{ 'border-color': globalStore.themeColor === '#CD6227' ? '#CD6227' : '' }">
           <div class="rounded-md w-20px h-20px bg-#CD6227  m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">火砖红</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#381924')"
            :style="{ 'border-color': globalStore.themeColor === '#381924' ? '#381924' : '' }">
           <div class="rounded-md w-20px h-20px bg-#381924 m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">檀紫</div>
        </div>

        <div class="flex flex-col">
          <div class="rounded-md border-1px border-dashed border-[--el-border-color-darker] shadow-[--el-box-shadow-lighter]" 
            @click="changeThemeColor('#2E317C')"
            :style="{ 'border-color': globalStore.themeColor === '#2E317C' ? '#2E317C' : '' }">
           <div class="rounded-md w-20px h-20px bg-#2E317C m-x-36px m-y-12px"></div>
          </div>
          <div class="text-12px text-center m-y-8px">满天星紫</div>
        </div>
      </div>

      <el-row>
        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
          <el-divider class="flex" content-position="center">
            <div class="flex flex-row flex-justify-center flex-items-center">
              <el-icon :size="18"><Notification /></el-icon>
              <div class="text-14px m-l-4px">布局样式</div>
            </div>
          </el-divider>
        </el-col>
      </el-row>

      <div class="layout-box">
        <el-tooltip content="纵向" placement="top" :show-after="200">
          <div :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]" @click="setLayout('vertical')">
            <div class="layout-dark"></div>
            <div class="layout-container">
              <div class="layout-light"></div>
              <div class="layout-content"></div>
            </div>
            <el-icon v-if="layout == 'vertical'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="分栏" placement="top" :show-after="200">
          <div :class="['layout-item layout-columns', { 'is-active': layout == 'columns' }]" @click="setLayout('columns')">
            <div class="layout-dark"></div>
            <div class="layout-light"></div>
            <div class="layout-content"></div>
            <el-icon v-if="layout == 'columns'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="经典" placement="top" :show-after="200">
          <div :class="['layout-item layout-classic', { 'is-active': layout == 'classic' }]" @click="setLayout('classic')">
            <div class="layout-dark"></div>
            <div class="layout-container">
              <div class="layout-light"></div>
              <div class="layout-content"></div>
            </div>
            <el-icon v-if="layout == 'classic'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="混合" placement="top" :show-after="200">
          <div
            :class="['layout-item layout-optimum', { 'is-active': layout == 'optimum' }]"
            @click="setLayout('optimum')"
          >
            <div class="layout-dark"></div>
            <div class="layout-container">
              <div class="layout-light"></div>
              <div class="layout-content"></div>
            </div>
            <el-icon v-if="layout == 'optimum'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="横向" placement="top" :show-after="200">
          <div
            :class="['layout-item layout-horizontal', { 'is-active': layout == 'horizontal' }]"
            @click="setLayout('horizontal')"
          >
            <div class="layout-dark"></div>
            <div class="layout-content"></div>
            <el-icon v-if="layout == 'horizontal'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
      </div> 
      
      <el-row>
        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
          <el-divider class="flex" content-position="center">
            <div class="flex flex-row flex-justify-center flex-items-center">
              <el-icon :size="18"><ChatLineRound /></el-icon>
              <div class="text-14px m-l-4px">界面配置</div>
            </div>
          </el-divider>
        </el-col>
      </el-row>
      
      <el-form label-width="auto" label-position="left" class="p-t-8px p-l-3px">
        <el-row>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item>
              <div class="flex flex-items-center">
                <span class="m-r-2px">路由动画</span>
                <el-tooltip placement="bottom" content="路由加载动画模式">
                  <el-icon class="m-r-20px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-select placeholder="请选择路由动画" v-model="transition" clearable style="width: 200px">
                <el-option label="默认" value="fade-default" />
                <el-option label="淡入淡出" value="fade" />
                <el-option label="滑动" value="fade-slide" />
                <el-option label="渐变" value="zoom-fade" />
                <el-option label="底部滑出" value="fade-bottom" />
                <el-option label="缩放消退" value="fade-scale" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="菜单宽度">
              <el-input-number class="w-200px" :min="200" :max="260" :step="2" v-model="menuWidth"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item>
              <div class="flex flex-items-center">
                <span class="m-r-2px">菜单手风琴</span>
                <el-tooltip placement="bottom" content="左侧菜单是否展开单个子菜单[启用-单个/关闭-多个]">
                  <el-icon class="m-r-10px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="uniqueOpened"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="侧边栏反转色">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="asideInverted"
                @change="setAsideTheme"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="头部反转色">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="headerInverted"
                @change="setHeaderTheme"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="灰色模式">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="isGrey"
                @change="changeGreyOrWeak('grey', !!$event)"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="色弱模式">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="isWeak"
                @change="changeGreyOrWeak('weak', !!$event)"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="折叠菜单">
              <el-form-item>
                <el-switch
                  v-model="isCollapse"
                  active-text="展开"
                  inactive-text="折叠"
                  :active-value="true"
                  :inactive-value="false"
                  :inline-prompt="true"
                >
                </el-switch>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </KoiDrawer>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useTheme } from "@/utils/theme.ts";
import { storeToRefs } from "pinia";
import mittBus from "@/utils/mittBus.ts";
import useGlobalStore from "@/stores/modules/global.ts";

const globalStore = useGlobalStore();

const { changeThemeColor, changeGreyOrWeak, setAsideTheme, setHeaderTheme } = useTheme();
const { layout, isCollapse, transition, uniqueOpened, menuWidth, isGrey, isWeak, asideInverted, headerInverted } =
  storeToRefs(globalStore);

const koiDrawerRef = ref();
/** 打开主题配置 */
const handleThemeConfig = () => {
  nextTick(() => {
    koiDrawerRef.value.koiOpen();
  });
};

/** 布局切换 */
const setLayout = (value: any) => {
  globalStore.setGlobalState("layout", value);
  setAsideTheme();
};

/** 打开主题配置对话框，on 接收事件 */
mittBus.on("handleThemeConfig", () => {
  handleThemeConfig();
});
</script>

<style lang="scss" scoped>
/** 图标颜色 */
.koi-icon {
  &:hover {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}

/** 布局配置 */
.layout-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  column-gap: 36px;
  padding: 15px 7px 0;
  .layout-item {
    position: relative;
    box-sizing: border-box;
    width: 100px;
    height: 70px;
    padding: 6px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--el-border-color-dark);
    transition: all 0.2s;
    .layout-dark {
      background-color: var(--el-color-primary);
      border-radius: 3px;
    }
    .layout-light {
      background-color: var(--el-color-primary-light-5);
      border-radius: 3px;
    }
    .layout-content {
      background-color: var(--el-color-primary-light-8);
      border: 1px dashed var(--el-color-primary);
      border-radius: 3px;
    }
    .el-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--el-color-primary);
      transition: all 0.2s;
    }
    &:hover {
      box-shadow: 0 0 5px 1px var(--el-text-color-secondary);
    }
  }
  .is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary) !important;
  }
  .layout-vertical {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .layout-dark {
      width: 20%;
    }
    .layout-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 73%;
      .layout-light {
        height: 20%;
      }
      .layout-content {
        height: 69%;
      }
    }
  }
  .layout-columns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      width: 14%;
    }
    .layout-light {
      width: 17%;
    }
    .layout-content {
      width: 55%;
    }
  }
  .layout-classic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;
    .layout-dark {
      height: 22%;
    }
    .layout-container {
      display: flex;
      justify-content: space-between;
      height: 70%;
      .layout-light {
        width: 20%;
      }
      .layout-content {
        width: 70%;
      }
    }
  }
  .layout-optimum {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      width: 20%;
    }
    .layout-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 73%;
      .layout-light {
        height: 16%;
      }
      .layout-content {
        height: 72%;
      }
    }
  }
  .layout-horizontal {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      height: 20%;
    }
    .layout-content {
      height: 67%;
    }
  }
}
</style>
